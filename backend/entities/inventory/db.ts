import { Transaction } from '../transactions/db';
import { PalayBatch } from '../palaybatches/db';
import { DryingBatch } from '../dryingbatches/db';
import { MillingBatch } from '../millingbatches/db';
import { Miller } from '../millers/db';

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