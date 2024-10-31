import { Transaction } from '../transactions/db';
import { PalayBatch } from '../palaybatches/db';
import { DryingBatch } from '../dryingbatches/db';
import { MillingBatch } from '../millingbatches/db';
import { Miller } from '../millers/db';
import { RiceBatchMillingBatch } from '../riceBatchMillingBatches/db';
import { RiceBatch } from '../ricebatches/db';
import { RiceOrder } from '../riceorders/db';

import { EnhancedInventoryItem, InventoryFilters, ProcessingBatch, RiceDetails, RiceInventoryFilters, RiceInventoryItem } from './types';
import { FindOptionsWhere } from 'typeorm';

export interface InventoryItem {
    transaction: Transaction;
    palayBatch: PalayBatch | null;
    processingBatch?: DryingBatch | MillingBatch | null;
}

export async function getInventory(
    toLocationType: string,
    status?: string,
    batchType?: 'drying' | 'milling',
    millerType?: 'In House' | 'Private',
    userId?: string
): Promise<InventoryItem[]> {
    try {
        let transactionQuery = Transaction.createQueryBuilder('transaction')
            .where('transaction.toLocationType = :locationType', { locationType: toLocationType })
            .andWhere(status ? 'transaction.status = :status' : '1=1', { status });

        // Filter by miller type and userId if toLocationType is Miller
        if (toLocationType === 'Miller' && millerType) {
            transactionQuery = transactionQuery
                .leftJoin(Miller, 'miller', 'miller.id = transaction.toLocationId')
                .andWhere('miller.type = :millerType', { millerType })
                .andWhere(userId ? 'miller.userId = :userId' : '1=1', { userId });
        }

        const transactions = await transactionQuery.getMany();

        const inventoryItems: InventoryItem[] = await Promise.all(
            transactions.map(async (transaction) => {
                const palayBatch = await PalayBatch.findOne({
                    where: { id: transaction.itemId },
                    relations: { qualitySpec: true, palaySupplier: true, farm: true },
                });

                let processingBatch = null;
                if (batchType === 'drying') {
                    processingBatch = await DryingBatch.findOne({ 
                        where: { palayBatchId: transaction.itemId }
                    });
                } else if (batchType === 'milling') {
                    processingBatch = await MillingBatch.findOne({ 
                        where: { palayBatchId: transaction.itemId }
                    });
                }

                return {
                    transaction,
                    palayBatch: palayBatch || null,
                    processingBatch: processingBatch || null,
                };
            })
        );

        return inventoryItems;
    } catch (error) {
        console.error('Error in getInventory:', error);
        throw error;
    }
}

export async function getEnhancedInventory(
    filters: InventoryFilters
): Promise<EnhancedInventoryItem[]> {
    try {
        // Start with palay batches query
        let palayBatchQuery = PalayBatch.createQueryBuilder('palayBatch')
            .leftJoinAndSelect('palayBatch.qualitySpec', 'qualitySpec')
            .leftJoinAndSelect('palayBatch.palaySupplier', 'palaySupplier')
            .leftJoinAndSelect('palayBatch.farm', 'farm');

        if (filters.palayBatchStatus) {
            palayBatchQuery = palayBatchQuery
                .where('palayBatch.status = :status', { status: filters.palayBatchStatus });
        }

        const palayBatches = await palayBatchQuery.getMany();

        // Map through palay batches to get related data
        const inventoryItems: EnhancedInventoryItem[] = await Promise.all(
            palayBatches.map(async (palayBatch) => {
                // Get related transactions
                const transactions = await Transaction.createQueryBuilder('transaction')
                    .where('transaction.itemId = :palayBatchId', { palayBatchId: palayBatch.id })
                    .andWhere(filters.transactionStatus 
                        ? 'transaction.status = :status' 
                        : '1=1', 
                        { status: filters.transactionStatus }
                    )
                    .getMany();

                // Initialize processing batch object
                const processingBatch: ProcessingBatch = {};

                // Get drying batch if requested
                if (filters.processingTypes?.includes('drying')) {
                    processingBatch.dryingBatch = await DryingBatch.findOne({
                        where: { palayBatchId: palayBatch.id }
                    });
                }

                // Get milling batch if requested
                if (filters.processingTypes?.includes('milling')) {
                    processingBatch.millingBatch = await MillingBatch.findOne({
                        where: { palayBatchId: palayBatch.id }
                    });
                }

                // Get rice details if milling batch ID is provided
                let riceDetails: RiceDetails | undefined;
                
                if (filters.millingBatchId) {
                    // First, find all junction records for this milling batch
                    const junctions = await RiceBatchMillingBatch.find({
                        where: {
                            millingBatchId: filters.millingBatchId
                        }
                    });

                    if (junctions && junctions.length > 0) {
                        // Get rice batches for all found junctions
                        const riceBatchPromises = junctions.map(junction =>
                            RiceBatch.findOne({
                                where: { id: junction.riceBatchId }
                            })
                        );
                        const riceBatches = await Promise.all(riceBatchPromises);

                        // Get rice orders for all found rice batches
                        const riceOrderPromises = riceBatches
                            .filter((batch): batch is RiceBatch => batch !== null)
                            .map(riceBatch =>
                                RiceOrder.find({
                                    where: { riceBatchId: riceBatch.id }
                                })
                            );
                        const riceOrders = await Promise.all(riceOrderPromises);

                        // Combine all the data
                        riceDetails = {
                            riceBatchMillingBatch: junctions[0], // Using first junction for backwards compatibility
                            riceBatch: riceBatches[0] || undefined, // Using first rice batch for backwards compatibility
                            riceOrder: riceOrders[0]?.[0] || undefined, // Using first order for backwards compatibility
                            // Add arrays of all related data
                            allRiceBatchMillingBatches: junctions,
                            allRiceBatches: riceBatches.filter((batch): batch is RiceBatch => batch !== null),
                            allRiceOrders: riceOrders.flat()
                        };
                    }
                }

                return {
                    palayBatch,
                    transactions,
                    processingBatch,
                    ...(riceDetails && { riceDetails })
                };
            })
        );

        return inventoryItems;
    } catch (error) {
        console.error('Error in getEnhancedInventory:', error);
        throw error;
    }
}

export async function getRiceInventory(
    filters: RiceInventoryFilters
): Promise<RiceInventoryItem[]> {
    try {
        // Start with rice batches query
        let riceBatchQuery = RiceBatch.createQueryBuilder('riceBatch')
            .leftJoinAndSelect('riceBatch.warehouse', 'warehouse');

        if (filters.riceBatchStatus) {
            riceBatchQuery = riceBatchQuery
                .where('riceBatch.status = :status', { status: filters.riceBatchStatus });
        }

        const riceBatches = await riceBatchQuery.getMany();

        // Map through rice batches to get related data
        const inventoryItems: RiceInventoryItem[] = await Promise.all(
            riceBatches.map(async (riceBatch) => {
                // Get rice orders for this rice batch
                const riceOrders = await RiceOrder.find({
                    where: {
                        riceBatchId: riceBatch.id,
                        ...(filters.riceOrderStatus && { status: filters.riceOrderStatus })
                    }
                });

                // Get milling batch details through junction table
                const riceBatchMillingBatch = await RiceBatchMillingBatch.findOne({
                    where: {
                        riceBatchId: riceBatch.id,
                        ...(filters.millingBatchId && { millingBatchId: filters.millingBatchId })
                    }
                });

                if (!riceBatchMillingBatch) {
                    throw new Error(`No milling batch found for rice batch ${riceBatch.id}`);
                }

                // Get the milling batch
                const millingBatch = await MillingBatch.findOne({
                    where: { id: riceBatchMillingBatch.millingBatchId }
                });

                if (!millingBatch) {
                    throw new Error(`Milling batch ${riceBatchMillingBatch.millingBatchId} not found`);
                }

                // Get palay batch associated with the milling batch
                const palayBatch = await PalayBatch.findOne({
                    where: { id: millingBatch.palayBatchId },
                    relations: ['qualitySpec', 'palaySupplier', 'farm']
                });

                if (!palayBatch) {
                    throw new Error(`Palay batch ${millingBatch.palayBatchId} not found`);
                }

                // Get all transactions where palayBatch.id is included in the item_ids array
                const transactions = await Transaction.createQueryBuilder('transaction')
                    .where(':palayBatchId = ANY(transaction.item_ids)', { palayBatchId: palayBatch.id.toString() })
                    .getMany();

                return {
                    riceBatch,
                    riceOrders,
                    millingDetails: {
                        riceBatchMillingBatch,
                        millingBatch
                    },
                    palayDetails: {
                        palayBatch,
                        transactions
                    }
                };
            })
        );

        return inventoryItems;
    } catch (error) {
        console.error('Error in getRiceInventory:', error);
        throw error;
    }
}