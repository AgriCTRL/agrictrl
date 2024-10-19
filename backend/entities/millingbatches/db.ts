import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MillingBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dryingBatchId: number;

    @Column()
    palayBatchId: number;

    @Column()
    millerId: number;

    @Column()
    millerType: string;

    @Column()
    startDateTime: Date;

    @Column()
    endDateTime: Date;

    @Column()
    milledQuantityBags: number;

    @Column()
    milledGrossWeight: number;

    @Column()
    milledNetWeight: number;

    @Column()
    millingEfficiency: number;

    @Column()
    status: string;
}

export type MillingBatchCreate = Pick<MillingBatch, 'dryingBatchId' | 'palayBatchId' | 'millerId' | 'millerType' | 'startDateTime' | 'endDateTime' | 'milledQuantityBags' | 'milledGrossWeight' | 'milledNetWeight' | 'millingEfficiency' | 'status' >;
export type MillingBatchUpdate = Pick<MillingBatch, 'id'> & Partial<MillingBatchCreate>;

export async function getMillingBatches(limit: number, offset: number): Promise<MillingBatch[]> {
    return await MillingBatch.find({
        take: limit,
        skip: offset
    });
}

export async function getMillingBatch(id: number): Promise<MillingBatch | null> {
    return await MillingBatch.findOne({
        where: {
            id
        }
    });
}

export async function countMillingBatches(): Promise<number> {
    return await MillingBatch.count();
}

export async function createMillingBatch(millingBatchCreate: MillingBatchCreate): Promise<MillingBatch> {
    let millingBatch = new MillingBatch();

    millingBatch.dryingBatchId = millingBatchCreate.dryingBatchId;
    millingBatch.palayBatchId = millingBatchCreate.palayBatchId;
    millingBatch.millerId = millingBatchCreate.millerId;
    millingBatch.millerType = millingBatchCreate.millerType;
    millingBatch.startDateTime = millingBatchCreate.startDateTime;
    millingBatch.endDateTime = millingBatchCreate.endDateTime;
    millingBatch.milledQuantityBags = millingBatchCreate.milledQuantityBags;
    millingBatch.milledGrossWeight = millingBatchCreate.milledGrossWeight;
    millingBatch.milledNetWeight = millingBatchCreate.milledNetWeight;
    millingBatch.millingEfficiency = millingBatchCreate.millingEfficiency;
    millingBatch.status = millingBatchCreate.status;

    return await millingBatch.save();
}

export async function updateMillingBatch(millingBatchUpdate: MillingBatchUpdate): Promise<MillingBatch> {
    console.log('millingBatchUpdate', millingBatchUpdate);

    await MillingBatch.update(millingBatchUpdate.id, {
        dryingBatchId: millingBatchUpdate.dryingBatchId,
        palayBatchId: millingBatchUpdate.palayBatchId,
        millerId: millingBatchUpdate.millerId,
        millerType: millingBatchUpdate.millerType,
        startDateTime: millingBatchUpdate.startDateTime,
        endDateTime: millingBatchUpdate.endDateTime,
        milledQuantityBags: millingBatchUpdate.milledQuantityBags,
        milledGrossWeight: millingBatchUpdate.milledGrossWeight,
        milledNetWeight: millingBatchUpdate.milledNetWeight,
        millingEfficiency: millingBatchUpdate.millingEfficiency,
        status: millingBatchUpdate.status
    });

    const millingBatch = await getMillingBatch(millingBatchUpdate.id);

    if (millingBatch === null) {
        throw new Error(`updateMillingBatch: failed for id ${millingBatchUpdate.id}`);
    }

    return millingBatch;
}
