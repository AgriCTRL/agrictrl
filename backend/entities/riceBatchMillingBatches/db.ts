// riceBatchMillingBatches/db.ts
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { RiceBatch } from '../ricebatches/db';
import { MillingBatch } from '../millingbatches/db';

@Entity()
export class RiceBatchMillingBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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
    riceBatchId: number;

    @ManyToOne(() => MillingBatch, millingBatch => millingBatch.riceBatchMillingBatches, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    millingBatch: MillingBatch;

    @Column()
    millingBatchId: number;
}

export interface RiceBatchMillingBatchCreate {
    riceBatchId: number;
    millingBatchId: number;
    riceQuantityBags: number;
    riceGrossWeight: number;
    riceNetWeight: number;
}

export interface RiceBatchMillingBatchUpdate {
    id: number;
    riceBatchId?: number;
    millingBatchId?: number;
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
    id: number,
    relations: boolean = true
): Promise<RiceBatchMillingBatch | null> {
    return await RiceBatchMillingBatch.findOne({
        where: { id },
        relations: relations ? ['riceBatch', 'millingBatch'] : []
    });
}

export async function getRiceBatchMillingBatchesByRiceBatch(
    riceBatchId: number,
    relations: boolean = true
): Promise<RiceBatchMillingBatch[]> {
    return await RiceBatchMillingBatch.find({
        where: { riceBatchId },
        relations: relations ? ['riceBatch', 'millingBatch'] : []
    });
}

export async function getRiceBatchMillingBatchesByMillingBatch(
    millingBatchId: number,
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
    junction.riceBatchId = data.riceBatchId;
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
    
    if (data.riceBatchId !== undefined) updateData.riceBatchId = data.riceBatchId;
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