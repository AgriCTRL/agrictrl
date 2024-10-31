import { Transaction } from '../transactions/db';
import { PalayBatch } from '../palaybatches/db';
import { DryingBatch } from '../dryingbatches/db';
import { MillingBatch } from '../millingbatches/db';
import { Miller } from '../millers/db';
import { ProcessingType, InventoryFilters, ProcessingBatch, RiceDetails, RiceInventoryFilters, RiceInventoryItem } from './types';
import { EnhancedInventoryItem, InventoryItem } from './types';
import { RiceBatchMillingBatch } from '../riceBatchMillingBatches/db';
import { RiceBatch } from '../ricebatches/db';
import { RiceOrder } from '../riceorders/db';

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

                // Initialize processingBatch object
                const processingBatch: ProcessingBatch = {};

                // Conditionally set drying or milling batch based on batchType
                if (batchType === 'drying') {
                    processingBatch.dryingBatch = await DryingBatch.findOne({ 
                        where: { palayBatchId: transaction.itemId }
                    });
                } else if (batchType === 'milling') {
                    processingBatch.millingBatch = await MillingBatch.findOne({ 
                        where: { palayBatchId: transaction.itemId }
                    });
                } else {
                    // If no specific batchType is provided, fetch both if they exist
                    processingBatch.dryingBatch = await DryingBatch.findOne({ 
                        where: { palayBatchId: transaction.itemId }
                    });
                    processingBatch.millingBatch = await MillingBatch.findOne({ 
                        where: { palayBatchId: transaction.itemId }
                    });
                }

                return {
                    transaction,
                    palayBatch: palayBatch || null,
                    processingBatch: processingBatch,
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