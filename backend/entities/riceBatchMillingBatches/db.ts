// riceBatchMillingBatches/db.ts
import { BaseEntity, Entity, PrimaryColumn, ManyToOne, JoinColumn, Column, BeforeInsert } from 'typeorm';
import { RiceBatch } from '../ricebatches/db';
import { MillingBatch } from '../millingbatches/db';

@Entity()
export class RiceBatchMillingBatch extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    riceQuantityBags: number;

    @Column()
    riceGrossWeight: number;

    @Column()
    riceNetWeight: number;

    @ManyToOne(() => RiceBatch, riceBatch => riceBatch.riceBatchMillingBatches, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    riceBatch: RiceBatch;

    @Column()
    pileId: string;

    @ManyToOne(() => MillingBatch, millingBatch => millingBatch.riceBatchMillingBatches, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    millingBatch: MillingBatch;

    @Column()
    millingBatchId: string;

    @BeforeInsert()
    async generateId() {
        const prefix = '030441';
        const lastOrder = await RiceBatchMillingBatch.find({
            order: { id: 'DESC' },
            take: 1
        });

        let nextNumber = 1;
        if (lastOrder.length > 0) {
            const lastId = lastOrder[0].id;
            const lastNumber = parseInt(lastId.slice(-4));
            nextNumber = lastNumber + 1;
        }

        this.id = `${prefix}${nextNumber.toString().padStart(4, '0')}`;
    }
}

export interface RiceBatchMillingBatchCreate {
    pileId: string;
    millingBatchId: string;
    riceQuantityBags: number;
    riceGrossWeight: number;
    riceNetWeight: number;
}

export interface RiceBatchMillingBatchUpdate {
    id: string;
    pileId?: string;
    millingBatchId?: string;
    riceQuantityBags?: number;
    riceGrossWeight?: number;
    riceNetWeight?: number;
}

export async function getRiceBatchMillingBatches(
    limit: number, 
    offset: number,
    relations: boolean = true
): Promise<RiceBatchMillingBatch[]> {
    return await RiceBatchMillingBatch.find({
        take: limit > 0 ? limit : undefined,
        skip: offset,
        relations: relations ? ['riceBatch', 'millingBatch'] : []
    });
}

export async function getRiceBatchMillingBatch(
    id: string,
    relations: boolean = true
): Promise<RiceBatchMillingBatch | null> {
    return await RiceBatchMillingBatch.findOne({
        where: { id },
        relations: relations ? ['riceBatch', 'millingBatch'] : []
    });
}

export async function getRiceBatchMillingBatchesByRiceBatch(
    pileId: string,
    relations: boolean = true
): Promise<RiceBatchMillingBatch[]> {
    return await RiceBatchMillingBatch.find({
        where: { pileId },
        relations: relations ? ['riceBatch', 'millingBatch'] : []
    });
}

export async function getRiceBatchMillingBatchesByMillingBatch(
    millingBatchId: string,
    relations: boolean = true
): Promise<RiceBatchMillingBatch[]> {
    return await RiceBatchMillingBatch.find({
        where: { millingBatchId },
        relations: relations ? ['riceBatch', 'millingBatch'] : []
    });
}

export async function createRiceBatchMillingBatch(
    data: RiceBatchMillingBatchCreate
): Promise<RiceBatchMillingBatch> {
    const junction = new RiceBatchMillingBatch();
    junction.pileId = data.pileId;
    junction.millingBatchId = data.millingBatchId;
    junction.riceQuantityBags = data.riceQuantityBags;
    junction.riceGrossWeight = data.riceGrossWeight;
    junction.riceNetWeight = data.riceNetWeight;
    
    return await junction.save();
}

export async function updateRiceBatchMillingBatch(
    data: RiceBatchMillingBatchUpdate
): Promise<RiceBatchMillingBatch> {
    const updateData: Partial<RiceBatchMillingBatch> = {};
    
    if (data.pileId !== undefined) updateData.pileId = data.pileId;
    if (data.millingBatchId !== undefined) updateData.millingBatchId = data.millingBatchId;
    if (data.riceQuantityBags !== undefined) updateData.riceQuantityBags = data.riceQuantityBags;
    if (data.riceGrossWeight !== undefined) updateData.riceGrossWeight = data.riceGrossWeight;
    if (data.riceNetWeight !== undefined) updateData.riceNetWeight = data.riceNetWeight;

    await RiceBatchMillingBatch.update(data.id, updateData);

    const junction = await getRiceBatchMillingBatch(data.id);
    if (!junction) {
        throw new Error(`updateRiceBatchMillingBatch: failed for id ${data.id}`);
    }

    return junction;
}