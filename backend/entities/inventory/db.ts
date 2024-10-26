import { Transaction } from '../transactions/db';
import { PalayBatch } from '../palaybatches/db';
import { DryingBatch } from '../dryingbatches/db';
import { MillingBatch } from '../millingbatches/db';

export interface InventoryItem {
    transaction: Transaction;
    palayBatch: PalayBatch | null;
}

export async function getInventory(toLocationType: string, status?: string, batchType?: 'drying' | 'milling'): Promise<InventoryItem[]> {
    try {
        const transactions = await Transaction.createQueryBuilder('transaction')
            .where('transaction.toLocationType = :locationType', { locationType: toLocationType })
            .andWhere(status ? 'transaction.status = :status' : '1=1', { status })
            .getMany();

        const inventoryItems: InventoryItem[] = await Promise.all(
            transactions.map(async (transaction) => {
                const palayBatch = await PalayBatch.findOne({
                    where: { id: transaction.itemId },
                    relations: { qualitySpec: true, palaySupplier: true, farm: true },
                });

                let processingBatch;
                if (batchType === 'drying') {
                    processingBatch = await DryingBatch.findOne({ where: { palayBatchId: transaction.itemId } });
                } else if (batchType === 'milling') {
                    processingBatch = await MillingBatch.findOne({ where: { palayBatchId: transaction.itemId } });
                }

                return {
                    transaction,
                    palayBatch: palayBatch || null,
                    processingBatch: processingBatch || null,
                };
            })
        );

        return inventoryItems.filter(item => item.palayBatch !== null);
    } catch (error) {
        console.error('Error in getInventory:', error);
        throw error;
    }
}