import { Transaction } from '../transactions/db';
import { In } from 'typeorm';
import { PalayBatch } from '../palaybatches/db';
import { DryingBatch } from '../dryingbatches/db';
import { MillingBatch } from '../millingbatches/db';
import { Miller } from '../millers/db';
import {  InventoryFilters, ProcessingBatch, RiceDetails, DBTransaction, ProcessedTransaction } from './types';
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
            .select([
                'transaction.id',
                'transaction.status',
                'transaction.sendDateTime',
                'transaction.receiveDateTime',
                'transaction.transporterName',
                'transaction.fromLocationType',
                'transaction.toLocationType',
                'transaction.fromLocationId',
                'transaction.toLocationId',
                'transaction.itemId',
                'transaction.item'
            ])
            .where('transaction.toLocationType = :locationType', { locationType: toLocationType })
            .andWhere(status ? 'transaction.status = :status' : '1=1', { status });

        if (toLocationType === 'Miller' && millerType) {
            transactionQuery = transactionQuery
                .leftJoin(Miller, 'miller', 'miller.id = transaction.toLocationId')
                .andWhere('miller.type = :millerType', { millerType })
                .andWhere(userId ? 'miller.userId = :userId' : '1=1', { userId });
        }

        const transactions = await transactionQuery.getMany();

        const inventoryItems: InventoryItem[] = await Promise.all(
            transactions.map(async (transaction: DBTransaction) => {
                let palayBatch = null;
                if (transaction.itemId) {
                    palayBatch = await PalayBatch.createQueryBuilder('palayBatch')
                        .select([
                            'palayBatch.id',
                            'palayBatch.status',
                            'palayBatch.buyingStationLoc',
                            'palayBatch.quantityBags',
                            'palayBatch.grossWeight',
                            'palayBatch.netWeight',
                            'palayBatch.currentlyAt',
                            'palayBatch.qualityType',
                            'qualitySpec.moistureContent'
                        ])
                        .leftJoin('palayBatch.qualitySpec', 'qualitySpec')
                        .where('palayBatch.id = :id', { id: transaction.itemId })
                        .getOne();
                }

                const processingBatch: ProcessingBatch = {};

                if (batchType === 'drying') {
                    const dryingBatch = await DryingBatch.createQueryBuilder('dryingBatch')
                        .select([
                            'dryingBatch.id',
                            'dryingBatch.status',
                            'dryingBatch.startDateTime',
                            'dryingBatch.endDateTime',
                            'dryingBatch.driedQuantityBags',
                            'dryingBatch.driedNetWeight',
                            'dryingBatch.driedGrossWeight',
                            'dryingBatch.dryingMethod',
                            'dryingBatch.palayBatchId'
                        ])
                        .where('dryingBatch.palayBatchId = :palayBatchId', { palayBatchId: transaction.itemId })
                        .getOne();

                    if (dryingBatch) {
                        processingBatch.dryingBatch = {
                            ...dryingBatch,
                            startDateTime: dryingBatch.startDateTime ? dryingBatch.startDateTime.toISOString() : null,
                            endDateTime: dryingBatch.endDateTime ? dryingBatch.endDateTime.toISOString() : null,
                            driedQuantityBags: dryingBatch.driedQuantityBags || null,
                            driedNetWeight: dryingBatch.driedNetWeight || null,
                            driedGrossWeight: dryingBatch.driedGrossWeight || null,
                            dryingMethod: dryingBatch.dryingMethod || ''
                        };
                    }
                } else if (batchType === 'milling') {
                    const millingBatch = await MillingBatch.createQueryBuilder('millingBatch')
                        .select([
                            'millingBatch.id',
                            'millingBatch.status',
                            'millingBatch.startDateTime',
                            'millingBatch.endDateTime',
                            'millingBatch.milledQuantityBags',
                            'millingBatch.milledNetWeight',
                            'millingBatch.milledGrossWeight',
                            'millingBatch.palayBatchId'
                        ])
                        .where('millingBatch.palayBatchId = :palayBatchId', { palayBatchId: transaction.itemId })
                        .getOne();

                    if (millingBatch) {
                        processingBatch.millingBatch = {
                            ...millingBatch,
                            startDateTime: millingBatch.startDateTime ? millingBatch.startDateTime.toISOString() : null,
                            endDateTime: millingBatch.endDateTime ? millingBatch.endDateTime.toISOString() : null,
                            milledQuantityBags: millingBatch.milledQuantityBags || null,
                            milledNetWeight: millingBatch.milledNetWeight || null,
                            milledGrossWeight: millingBatch.milledGrossWeight || null
                        };
                    }
                } else {
                    // If no specific batchType is provided, try to fetch both
                    const dryingBatch = await DryingBatch.createQueryBuilder('dryingBatch')
                        .select([
                            'dryingBatch.id',
                            'dryingBatch.status',
                            'dryingBatch.startDateTime',
                            'dryingBatch.endDateTime',
                            'dryingBatch.driedQuantityBags',
                            'dryingBatch.driedNetWeight',
                            'dryingBatch.driedGrossWeight',
                            'dryingBatch.dryingMethod',
                            'dryingBatch.palayBatchId'
                        ])
                        .where('dryingBatch.palayBatchId = :palayBatchId', { palayBatchId: transaction.itemId })
                        .getOne();

                    const millingBatch = await MillingBatch.createQueryBuilder('millingBatch')
                        .select([
                            'millingBatch.id',
                            'millingBatch.status',
                            'millingBatch.startDateTime',
                            'millingBatch.endDateTime',
                            'millingBatch.milledQuantityBags',
                            'millingBatch.milledNetWeight',
                            'millingBatch.milledGrossWeight',
                            'millingBatch.palayBatchId'
                        ])
                        .where('millingBatch.palayBatchId = :palayBatchId', { palayBatchId: transaction.itemId })
                        .getOne();

                    if (dryingBatch) {
                        processingBatch.dryingBatch = {
                            ...dryingBatch,
                            startDateTime: dryingBatch.startDateTime ? dryingBatch.startDateTime.toISOString() : null,
                            endDateTime: dryingBatch.endDateTime ? dryingBatch.endDateTime.toISOString() : null,
                            driedQuantityBags: dryingBatch.driedQuantityBags || null,
                            driedNetWeight: dryingBatch.driedNetWeight || null,
                            driedGrossWeight: dryingBatch.driedGrossWeight || null,
                            dryingMethod: dryingBatch.dryingMethod || ''
                        };
                    }

                    if (millingBatch) {
                        processingBatch.millingBatch = {
                            ...millingBatch,
                            startDateTime: millingBatch.startDateTime ? millingBatch.startDateTime.toISOString() : null,
                            endDateTime: millingBatch.endDateTime ? millingBatch.endDateTime.toISOString() : null,
                            milledQuantityBags: millingBatch.milledQuantityBags || null,
                            milledNetWeight: millingBatch.milledNetWeight || null,
                            milledGrossWeight: millingBatch.milledGrossWeight || null
                        };
                    }
                }

                const processedTransaction: ProcessedTransaction = {
                    ...transaction,
                    sendDateTime: transaction.sendDateTime.toISOString(),
                    receiveDateTime: transaction.receiveDateTime.toISOString()
                };

                return {
                    transaction: processedTransaction,
                    palayBatch,
                    processingBatch,
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
            .leftJoinAndSelect('palayBatch.qualitySpec', 'qualitySpec');

        if (filters.palayBatchStatus) {
            palayBatchQuery = palayBatchQuery
                .andWhere('palayBatch.status = :status', { status: filters.palayBatchStatus });
        }

        const palayBatches = await palayBatchQuery.getMany();

        // Map through palay batches to get related data
        const inventoryItems: EnhancedInventoryItem[] = await Promise.all(
            palayBatches.map(async (palayBatch) => {
                // Get all related transactions
                let transactionQuery = Transaction.createQueryBuilder('transaction')
                    .where('transaction.itemId = :palayBatchId', { palayBatchId: palayBatch.id });

                if (filters.transactionStatus) {
                    transactionQuery = transactionQuery
                        .andWhere('transaction.status = :status', { status: filters.transactionStatus });
                }

                const transactions = await transactionQuery.getMany();

                // Initialize processing batch object
                const processingBatch: ProcessingBatch = {};

                // Get drying batch if requested
                if (!filters.processingTypes || filters.processingTypes.includes('drying')) {
                    const dryingBatch = await DryingBatch.createQueryBuilder('dryingBatch')
                        .where('dryingBatch.palayBatchId = :palayBatchId', { palayBatchId: palayBatch.id })
                        .getOne();

                    if (dryingBatch) {
                        processingBatch.dryingBatch = {
                            ...dryingBatch,
                            startDateTime: dryingBatch.startDateTime.toISOString(),
                            endDateTime: dryingBatch.endDateTime.toISOString()
                        };
                    }
                }

                // Get milling batch if requested
                if (!filters.processingTypes || filters.processingTypes.includes('milling')) {
                    const millingBatch = await MillingBatch.createQueryBuilder('millingBatch')
                        .where('millingBatch.palayBatchId = :palayBatchId', { palayBatchId: palayBatch.id })
                        .getOne();

                    if (millingBatch) {
                        processingBatch.millingBatch = {
                            ...millingBatch,
                            startDateTime: millingBatch.startDateTime.toISOString(),
                            endDateTime: millingBatch.endDateTime.toISOString()
                        };
                    }
                }

                // Get rice details if milling batch ID is provided
                let riceDetails: RiceDetails | undefined;
                
                if (filters.millingBatchId) {
                    // Get all RiceBatchMillingBatch records for this milling batch
                    const riceBatchMillingBatches = await RiceBatchMillingBatch.find({
                        where: { millingBatchId: filters.millingBatchId }
                    });

                    if (riceBatchMillingBatches.length > 0) {
                        // Get all rice batch IDs
                        const riceBatchIds = riceBatchMillingBatches.map(rb => rb.riceBatchId);

                        // Fetch all related rice batches
                        const riceBatches = await RiceBatch.find({
                            where: { id: In(riceBatchIds) }
                        });

                        // Fetch all related rice orders
                        const riceOrders = await RiceOrder.find({
                            where: { riceBatchId: In(riceBatchIds) }
                        });

                        riceDetails = {
                            allRiceBatchMillingBatches: riceBatchMillingBatches,
                            allRiceBatches: riceBatches,
                            allRiceOrders: riceOrders,
                            // Maintain backward compatibility with single record references
                            riceBatchMillingBatch: riceBatchMillingBatches[0],
                            riceBatch: riceBatches[0],
                            riceOrder: riceOrders[0]
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