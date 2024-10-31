import { Transaction } from "../transactions/db";
import { PalayBatch } from "../palaybatches/db";
import { DryingBatch } from "../dryingbatches/db";
import { MillingBatch } from "../millingbatches/db";
import { RiceBatch } from "../ricebatches/db";
import { RiceOrder } from "../riceorders/db";
import { RiceBatchMillingBatch } from "../riceBatchMillingBatches/db";

export type ProcessingType = 'drying' | 'milling';

export interface ProcessingBatch {
    dryingBatch?: DryingBatch | null;
    millingBatch?: MillingBatch | null;
}

export interface RiceDetails {
    // Keep existing fields for backward compatibility
    riceBatchMillingBatch?: RiceBatchMillingBatch;
    riceBatch?: RiceBatch;
    riceOrder?: RiceOrder;
    // Add new arrays for all related data
    allRiceBatchMillingBatches: RiceBatchMillingBatch[];
    allRiceBatches: RiceBatch[];
    allRiceOrders: RiceOrder[];
}

export interface EnhancedInventoryItem {
    palayBatch: PalayBatch;
    transactions: Transaction[];
    processingBatch: ProcessingBatch;
    riceDetails?: RiceDetails;
}

export interface InventoryFilters {
    palayBatchStatus?: string;
    transactionStatus?: string;
    processingTypes?: ProcessingType[];
    millingBatchId?: number;
}

export interface RiceInventoryFilters {
    riceBatchStatus?: string;
    riceOrderStatus?: string;
    millingBatchId?: number;
}

export interface RiceInventoryItem {
    riceBatch: RiceBatch;
    riceOrders: RiceOrder[];
    millingDetails: {
        riceBatchMillingBatch: RiceBatchMillingBatch;
        millingBatch: MillingBatch;
    };
    palayDetails: {
        palayBatch: PalayBatch;
        transactions: Transaction[];
    };
}