import { In } from 'typeorm';

import { Transaction } from '../transactions/db';
import { PalayBatch } from '../palaybatches/db';
import { DryingBatch } from '../dryingbatches/db';
import { MillingBatch } from '../millingbatches/db';
import { Miller } from '../millers/db';
import { InventoryFilters, ProcessingBatch, RiceDetails, PaginatedResponse } from './types';
import { EnhancedInventoryItem, InventoryItem } from './types';
import { RiceBatchMillingBatch } from '../riceBatchMillingBatches/db';
import { RiceBatch } from '../ricebatches/db';
import { RiceOrder } from '../riceorders/db';

export async function getInventory(
    filters: InventoryFilters
): Promise<PaginatedResponse<InventoryItem>> {
    try {
        let transactionQuery = Transaction.createQueryBuilder('transaction');

        // Base filters
        if (filters.toLocationType) {
            transactionQuery = transactionQuery
                .where('transaction.toLocationType = :locationType', 
                    { locationType: filters.toLocationType });

            if (filters.toLocationType === 'Miller' && filters.millerType) {
                transactionQuery = transactionQuery
                    .leftJoin(Miller, 'miller', 'miller.id = transaction.toLocationId')
                    .andWhere('miller.type = :millerType', { millerType: filters.millerType })
                    .andWhere(filters.userId ? 'miller.userId = :userId' : '1=1', 
                        { userId: filters.userId });
            }
        }

        if (filters.transactionStatus) {
            transactionQuery = transactionQuery
                .andWhere('transaction.status = :status', 
                    { status: filters.transactionStatus });
        }

        if (filters.item) {
            transactionQuery = transactionQuery
                .andWhere('transaction.item = :item', 
                    { item: filters.item });
        }

        const transactions = await transactionQuery.getMany();

        const inventoryItems = await Promise.all(
            transactions.map(async (transaction) => {
                let palayBatchQuery = PalayBatch.createQueryBuilder('palayBatch')
                    .where('palayBatch.id = :id', { id: transaction.itemId })
                    .leftJoinAndSelect('palayBatch.qualitySpec', 'qualitySpec')
                    .leftJoinAndSelect('palayBatch.palaySupplier', 'palaySupplier')
                    .leftJoinAndSelect('palayBatch.farm', 'farm');

                // Handle palayStatus filter
                if (filters.palayStatus) {
                    const statuses = Array.isArray(filters.palayStatus) 
                        ? filters.palayStatus 
                        : [filters.palayStatus];
                    palayBatchQuery = palayBatchQuery
                        .andWhere('palayBatch.status IN (:...statuses)', 
                            { statuses });
                }

                const palayBatch = await palayBatchQuery.getOne();

                const processingBatch: ProcessingBatch = {};

                // Handle processing batch filters
                if (!filters.processingTypes || filters.processingTypes.includes('drying')) {
                    const dryingBatch = await DryingBatch.findOne({ 
                        where: { 
                            palayBatchId: transaction.itemId,
                            ...(filters.processingStatus && { status: filters.processingStatus })
                        }
                    });
                    processingBatch.dryingBatch = dryingBatch;
                }

                if (!filters.processingTypes || filters.processingTypes.includes('milling')) {
                    const millingBatch = await MillingBatch.findOne({ 
                        where: { 
                            palayBatchId: transaction.itemId,
                            ...(filters.processingStatus && { status: filters.processingStatus })
                        }
                    });
                    processingBatch.millingBatch = millingBatch;
                }

                return {
                    transaction,
                    palayBatch: palayBatch || null,
                    processingBatch,
                };
            })
        );

        // Filter items based on processing status if applicable
        const filteredInventoryItems = filters.processingStatus
            ? inventoryItems.filter(item => 
                item.processingBatch.dryingBatch?.status === filters.processingStatus ||
                item.processingBatch.millingBatch?.status === filters.processingStatus
            )
            : inventoryItems;

        // Filter out items with null palayBatch
        const validInventoryItems = filteredInventoryItems.filter(item => item.palayBatch !== null);
        
        // Calculate total before pagination
        const total = validInventoryItems.length;

        // Apply pagination
        const paginatedItems = filters.limit !== undefined && filters.offset !== undefined
            ? validInventoryItems.slice(filters.offset, filters.offset + filters.limit)
            : validInventoryItems;

        return {
            items: paginatedItems,
            total
        };
    } catch (error) {
        console.error('Error in getInventory:', error);
        throw error;
    }
}

export async function getEnhancedInventory(
    filters: InventoryFilters
): Promise<PaginatedResponse<EnhancedInventoryItem>> {
    try {
        let palayBatchQuery = PalayBatch.createQueryBuilder('palayBatch')
            .leftJoinAndSelect('palayBatch.qualitySpec', 'qualitySpec')
            .leftJoinAndSelect('palayBatch.palaySupplier', 'palaySupplier')
            .leftJoinAndSelect('palayBatch.farm', 'farm');

        if (filters.palayStatus) {
            palayBatchQuery = palayBatchQuery
                .where('palayBatch.status = :status', { status: filters.palayStatus });
        }

        const palayBatches = await palayBatchQuery.getMany();

        const inventoryItems = await Promise.all(
            palayBatches.map(async (palayBatch) => {
                let transactions = await Transaction.createQueryBuilder('transaction')
                    .where('transaction.itemId = :palayBatchId', { palayBatchId: palayBatch.id })
                    .andWhere(filters.transactionStatus 
                        ? 'transaction.status = :status' 
                        : '1=1', 
                        { status: filters.transactionStatus }
                    )
                    .getMany();

                const processingBatch: ProcessingBatch = {};

                if (!filters.processingTypes || filters.processingTypes.includes('drying')) {
                    processingBatch.dryingBatch = await DryingBatch.findOne({
                        where: { 
                            palayBatchId: palayBatch.id,
                            ...(filters.processingStatus && { status: filters.processingStatus })
                        }
                    });
                }

                if (!filters.processingTypes || filters.processingTypes.includes('milling')) {
                    processingBatch.millingBatch = await MillingBatch.findOne({
                        where: { 
                            palayBatchId: palayBatch.id,
                            ...(filters.processingStatus && { status: filters.processingStatus })
                        }
                    });
                }

                let riceDetails: RiceDetails | undefined;
                
                if (filters.millingBatchId) {
                    const junctions = await RiceBatchMillingBatch.find({
                        where: { millingBatchId: filters.millingBatchId }
                    });

                    if (junctions.length > 0) {
                        const riceBatches = await Promise.all(
                            junctions.map(junction =>
                                RiceBatch.findOne({
                                    where: { id: junction.riceBatchId }
                                })
                            )
                        );

                        const riceOrders = await Promise.all(
                            riceBatches
                                .filter((batch): batch is RiceBatch => batch !== null)
                                .map(riceBatch =>
                                    RiceOrder.find({
                                        where: { riceBatchId: riceBatch.id }
                                    })
                                )
                        );

                        riceDetails = {
                            riceBatchMillingBatch: junctions[0],
                            riceBatch: riceBatches[0] || undefined,
                            riceOrder: riceOrders[0]?.[0] || undefined,
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

        // Filter items based on processing status if applicable
        const filteredInventoryItems = filters.processingStatus
            ? inventoryItems.filter(item => 
                item.processingBatch.dryingBatch?.status === filters.processingStatus ||
                item.processingBatch.millingBatch?.status === filters.processingStatus
            )
            : inventoryItems;

        // Calculate total before pagination
        const total = filteredInventoryItems.length;

        // Apply pagination
        const paginatedItems = filters.limit !== undefined && filters.offset !== undefined
            ? filteredInventoryItems.slice(filters.offset, filters.offset + filters.limit)
            : filteredInventoryItems;

        return {
            items: paginatedItems,
            total
        };
    } catch (error) {
        console.error('Error in getEnhancedInventory:', error);
        throw error;
    }
}