import { Transaction } from '../transactions/db';
import { PalayBatch } from '../palaybatches/db';
import { DryingBatch } from '../dryingbatches/db';
import { MillingBatch } from '../millingbatches/db';
import { RiceBatchMillingBatch } from '../riceBatchMillingBatches/db';
import { RiceBatch } from '../ricebatches/db';
import { RiceOrder } from '../riceorders/db';

export type ProcessingType = 'drying' | 'milling';

export interface ProcessingBatch {
    dryingBatch?: DryingBatch | null;
    millingBatch?: MillingBatch | null;
}

export interface RiceDetails {
    riceBatchMillingBatch?: RiceBatchMillingBatch;
    riceBatch?: RiceBatch;
    riceOrder?: RiceOrder;
    allRiceBatchMillingBatches: RiceBatchMillingBatch[];
    allRiceBatches: RiceBatch[];
    allRiceOrders: RiceOrder[];
}

export interface InventoryItem {
    transaction: Transaction;
    palayBatch: PalayBatch | null;
    processingBatch: ProcessingBatch;

    locationName?: string;
    userName?: string;
    organization?: string;
    supplierName?: string;
}

export interface EnhancedInventoryItem {
    palayBatch: PalayBatch;
    transactions: Transaction[];
    processingBatch: ProcessingBatch;
    riceDetails?: RiceDetails;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}

export interface InventoryFilters {
    palaybatchId?: string;
    toLocationType?: string | string[];
    transactionStatus?: string;
    palayStatus?: string | string[];
    processingStatus?: string;
    item?: string;
    millerType?: 'In House' | 'Private';
    userId?: string;
    warehouseUserId?: string;
    limit?: number;
    offset?: number;
    processingTypes?: ProcessingType[];
    millingBatchId?: string;
    wsr?: string;
    wsi?: string;
}