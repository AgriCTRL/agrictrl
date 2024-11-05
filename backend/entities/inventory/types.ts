import { Transaction } from "../transactions/db";
import { PalayBatch } from "../palaybatches/db";
import { DryingBatch } from "../dryingbatches/db";
import { MillingBatch } from "../millingbatches/db";
import { RiceBatch } from "../ricebatches/db";
import { RiceOrder } from "../riceorders/db";
import { RiceBatchMillingBatch } from "../riceBatchMillingBatches/db";

export type ProcessingType = 'drying' | 'milling';

export interface DBTransaction {
    id: string;  
    status: string;
    sendDateTime: Date;
    receiveDateTime: Date;
    transporterName: string;
    fromLocationType: string;
    toLocationType: string;
    fromLocationId: string;  
    toLocationId: string;    
    itemId: string;         
    item: string;
}

export interface ProcessedTransaction {
    id: string;
    status: string;
    sendDateTime: string;
    receiveDateTime: string;
    transporterName: string;
    fromLocationType: string;
    toLocationType: string;
    fromLocationId: string;
    toLocationId: string;
    itemId: string;
    item: string;
}

export interface DBDryingBatch {
    id: string;
    status: string;
    startDateTime: Date | null;
    endDateTime: Date | null;
    driedQuantityBags: number | null;
    driedNetWeight: number | null;
    driedGrossWeight: number | null;
    dryingMethod: string;
}

export interface DBMillingBatch {
    id: string;
    status: string;
    startDateTime: Date | null;
    endDateTime: Date | null;
    milledQuantityBags: number | null;
    milledNetWeight: number | null;
    milledGrossWeight: number | null;
}

export interface DBPalayBatch {
    id: string;
    status: string;
    buyingStationLoc: string;
    quantityBags: number;
    grossWeight: number;
    netWeight: number;
    currentlyAt: string;
    qualityType: string;
    qualitySpec?: {
        moistureContent: number;
    } | null;
}

export interface ProcessingBatch {
    dryingBatch?: {
        id: string;
        status: string;
        startDateTime: string | null;
        endDateTime: string | null;
        driedQuantityBags: number | null;
        driedNetWeight: number | null;
        driedGrossWeight: number | null;
        dryingMethod: string;
    } | null;
    millingBatch?: {
        id: string;
        status: string;
        startDateTime: string | null;
        endDateTime: string | null;
        milledQuantityBags: number | null;
        milledNetWeight: number | null;
        milledGrossWeight: number | null;
    } | null;
}

export interface InventoryItem {
    transaction: ProcessedTransaction;
    palayBatch: DBPalayBatch | null;
    processingBatch: ProcessingBatch;
}

export interface RiceDetails {
    riceBatchMillingBatch?: RiceBatchMillingBatch;
    riceBatch?: RiceBatch;
    riceOrder?: RiceOrder;
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
    millingBatchId?: string;  
}