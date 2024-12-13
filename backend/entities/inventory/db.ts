import { In } from 'typeorm';

import { Transaction } from '../transactions/db';
import { PalayBatch } from '../palaybatches/db';
import { DryingBatch } from '../dryingbatches/db';
import { MillingBatch } from '../millingbatches/db';
import { Miller } from '../millers/db';
import { Warehouse } from '../warehouses/db';
import { Pile } from '../piles/db';
import { InventoryFilters, ProcessingBatch, RiceDetails, PaginatedResponse } from './types';
import { EnhancedInventoryItem, InventoryItem } from './types';
import { RiceBatchMillingBatch } from '../riceBatchMillingBatches/db';
import { RiceBatch } from '../ricebatches/db';
import { RiceOrder } from '../riceorders/db';
import { User } from '../users/db';
import { Dryer } from '../dryers/db';

export async function getInventory(
    filters: InventoryFilters
): Promise<PaginatedResponse<InventoryItem>> {
    try {
        let transactionQuery = Transaction.createQueryBuilder('transaction');

        // Base filters
        if (filters.toLocationType) {
            const locationTypes = Array.isArray(filters.toLocationType)
                ? filters.toLocationType
                : [filters.toLocationType];

            // Create a more complex WHERE condition to handle multiple location types
            transactionQuery = transactionQuery
                .where(
                    locationTypes.map((_, index) => 
                        `transaction.toLocationType = :locationType${index}`
                    ).join(' OR '),
                    Object.fromEntries(
                        locationTypes.map((locationType, index) => 
                            [`locationType${index}`, locationType]
                        )
                    )
                );

            // Handle Miller type filtering
            if (locationTypes.includes('Miller') && filters.millerType) {
                transactionQuery = transactionQuery
                    .leftJoin(Miller, 'miller', 'miller.id = transaction.toLocationId')
                    .andWhere('miller.type = :millerType', { millerType: filters.millerType })
                    .andWhere(filters.userId ? 'miller.userId = :userId' : '1=1', 
                        { userId: filters.userId });
            }

            // Add warehouse user filtering
            if (locationTypes.includes('Warehouse') && filters.userId) {
                transactionQuery = transactionQuery
                    .leftJoin(Warehouse, 'warehouse', 'warehouse.id = transaction.toLocationId')
                    .andWhere('warehouse.userId = :userId', { userId: filters.userId });
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

                if (filters.wsr) {
                    palayBatchQuery = palayBatchQuery
                        .andWhere('palayBatch.wsr = :wsr', { wsr: filters.wsr });
                }

                if (filters.wsi) {
                    palayBatchQuery = palayBatchQuery
                        .andWhere('palayBatch.wsi = :wsi', { wsi: filters.wsi });
                }

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

                const inventoryItem = {
                    transaction,
                    palayBatch: palayBatch || null,
                    processingBatch,
                };

                await populateInventoryDetails(inventoryItem);
                return inventoryItem;
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

        if (filters.palaybatchId) {
            palayBatchQuery = palayBatchQuery
                .andWhere('palayBatch.id = :palaybatchId', { palaybatchId: filters.palaybatchId });
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

                // Populate location details for each transaction
                await Promise.all(transactions.map(transaction => 
                    populateTransactionDetails(transaction)
                ));

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
                                    where: { id: junction.pileId }
                                })
                            )
                        );

                        const riceOrders = await Promise.all(
                            riceBatches
                                .filter((batch): batch is RiceBatch => batch !== null)
                                .map(riceBatch =>
                                    RiceOrder.find({
                                        where: { pileId: riceBatch.id }
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

export async function getInventoryByPileId(
    pileId: string,
    filters: InventoryFilters
): Promise<PaginatedResponse<InventoryItem>> {
    try {
        // Limit the palayBatches upfront to reduce initial dataset
        const palayBatchesInPile = await PalayBatch.createQueryBuilder('palayBatch')
            .where('palayBatch.pileId = :pileId', { pileId })
            .limit(10) // Hard limit to prevent excessive queries
            .getMany();

        if (!palayBatchesInPile.length) {
            return {
                items: [],
                total: 0
            };
        }

        // Get the IDs of all palayBatches in the pile
        const palayBatchIds = palayBatchesInPile.map(pb => pb.id);

        // Optimize transaction query with early filtering
        let transactionQuery = Transaction.createQueryBuilder('transaction')
            .where('transaction.itemId IN (:...palayBatchIds)', { palayBatchIds })
            .andWhere('transaction.toLocationType = :defaultLocationType', { 
                defaultLocationType: filters.toLocationType || 'Warehouse' 
            });

        // Apply filters early to reduce dataset
        if (filters.transactionStatus) {
            transactionQuery = transactionQuery
                .andWhere('transaction.status = :status', 
                    { status: filters.transactionStatus });
        }

        // Limit transactions early
        const transactions = await transactionQuery
            .limit(10) // Hard limit to prevent excessive processing
            .getMany();

        // Batch processing of inventory items
        const inventoryItems = await Promise.all(
            transactions.map(async (transaction) => {
                const palayBatch = await PalayBatch.createQueryBuilder('palayBatch')
                    .where('palayBatch.id = :id', { id: transaction.itemId })
                    .leftJoinAndSelect('palayBatch.qualitySpec', 'qualitySpec')
                    .getOne();

                // Simplified processing batch retrieval
                const processingBatch: ProcessingBatch = {};
                
                // Simplified processing batch logic
                if (!filters.processingTypes || filters.processingTypes.includes('drying')) {
                    processingBatch.dryingBatch = await DryingBatch.findOne({ 
                        where: { 
                            palayBatchId: transaction.itemId,
                            ...(filters.processingStatus && { status: filters.processingStatus })
                        }
                    });
                }

                const inventoryItem = {
                    transaction,
                    palayBatch: palayBatch || null,
                    processingBatch,
                };

                return inventoryItem;
            })
        );

        // Simple filtering and pagination
        const validInventoryItems = inventoryItems
            .filter(item => item.palayBatch !== null)
            .slice(0, filters.limit || 10); // Limit results

        return {
            items: validInventoryItems,
            total: validInventoryItems.length
        };
    } catch (error) {
        console.error('Optimized Error in getInventoryByPileId:', error);
        throw error;
    }
}

async function populateInventoryDetails(inventoryItem: InventoryItem | EnhancedInventoryItem): Promise<void> {
    // Populate location details from transaction if available
    if ('transaction' in inventoryItem) {
        const transaction = inventoryItem.transaction;
        switch (transaction.toLocationType.toLowerCase()) {
            case 'warehouse': {
                const warehouse = await Warehouse.findOne({
                    where: { id: transaction.toLocationId }
                });
                if (warehouse) {
                    inventoryItem.locationName = warehouse.facilityName;
                }
                break;
            }
            case 'miller': {
                const miller = await Miller.findOne({
                    where: { id: transaction.toLocationId }
                });
                if (miller) {
                    inventoryItem.locationName = miller.millerName;
                }
                break;
            }
            case 'distribution': {
                const user = await User.findOne({
                    where: { id: transaction.toLocationId }
                });
                if (user) {
                    inventoryItem.userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
                    inventoryItem.organization = user.organizationName || '';
                }
                break;
            }
        }
    }
}

async function populateTransactionDetails(transaction: Transaction): Promise<void> {
    switch (transaction.toLocationType.toLowerCase()) {
        case 'warehouse': {
            const warehouse = await Warehouse.findOne({
                where: { id: transaction.toLocationId }
            });
            if (warehouse) {
                transaction.locationName = warehouse.facilityName;
            }
            break;
        }
        case 'dryer': {
            const dryer = await Dryer.findOne({
                where: { id: transaction.toLocationId }
            });
            if (dryer) {
                transaction.locationName = dryer.dryerName;
            }
            break;
        }
        case 'miller': {
            const miller = await Miller.findOne({
                where: { id: transaction.toLocationId }
            });
            if (miller) {
                transaction.locationName = miller.millerName;
            }
            break;
        }
        case 'distribution': {
            const user = await User.findOne({
                where: { id: transaction.toLocationId }
            });
            if (user) {
                transaction.userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
                transaction.organization = user.organizationName || '';
            }
            break;
        }
    }
}