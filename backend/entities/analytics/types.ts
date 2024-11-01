import { PalayBatch } from "../palaybatches/db";
import { Transaction } from "../transactions/db";

export interface AnalyticsSummary {
    totalQuantity: number;
    startDate: Date;
    endDate: Date;
    palayBatches?: number;
}

export interface AnalyticsParams {
    startDate: Date;
    endDate: Date;
}
