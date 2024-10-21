import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RiceMillingBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    riceBatchId: number;

    @Column()
    millingBatchId: number;

    @Column()
    riceQuantityBags: number;

    @Column({ nullable: true })
    riceGrossWeight: number;

    @Column({ nullable: true})
    riceNetWeight: number;
}

export type RiceMillingBatchCreate = Pick<RiceMillingBatch, 'riceBatchId' | 'millingBatchId' | 'riceQuantityBags' | 'riceGrossWeight' | 'riceNetWeight'>;
export type RiceMillingBatchUpdate = Pick<RiceMillingBatch, 'id'> & Partial<RiceMillingBatchCreate>;

export async function getRiceMillingBatches(limit: number, offset: number): Promise<RiceMillingBatch[]> {
    return await RiceMillingBatch.find({
        take: limit,
        skip: offset
    });
}

export async function getRiceMillingBatch(id: number): Promise<RiceMillingBatch | null> {
    return await RiceMillingBatch.findOne({
        where: {
            id
        }
    });
}

export async function countRiceMillingBatches(): Promise<number> {
    return await RiceMillingBatch.count();
}

export async function createRiceMillingBatch(riceMillingBatchCreate: RiceMillingBatchCreate): Promise<RiceMillingBatch> {
    let riceMillingBatch = new RiceMillingBatch();

    riceMillingBatch.riceBatchId = riceMillingBatchCreate.riceBatchId;
    riceMillingBatch.millingBatchId = riceMillingBatchCreate.millingBatchId;
    riceMillingBatch.riceQuantityBags = riceMillingBatchCreate.riceQuantityBags;
    riceMillingBatch.riceGrossWeight = riceMillingBatchCreate.riceGrossWeight;
    riceMillingBatch.riceNetWeight = riceMillingBatchCreate.riceNetWeight;

    return await riceMillingBatch.save();
}

export async function updateRiceMillingBatch(riceMillingBatchUpdate: RiceMillingBatchUpdate): Promise<RiceMillingBatch> {
    await RiceMillingBatch.update(riceMillingBatchUpdate.id, {
        riceBatchId: riceMillingBatchUpdate.riceBatchId,
        millingBatchId: riceMillingBatchUpdate.millingBatchId,
        riceQuantityBags: riceMillingBatchUpdate.riceQuantityBags,
        riceGrossWeight: riceMillingBatchUpdate.riceGrossWeight,
        riceNetWeight: riceMillingBatchUpdate.riceNetWeight
    });

    const riceMillingBatch = await getRiceMillingBatch(riceMillingBatchUpdate.id);

    if (riceMillingBatch === null) {
        throw new Error(`updateRiceMillingBatch: failed for id ${riceMillingBatchUpdate.id}`);
    }

    return riceMillingBatch;
}
