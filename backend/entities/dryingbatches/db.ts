import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DryingBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    palayBatchId: number;

    @Column()
    dryingMethod: string;

    @Column()
    dryerType: string;

    @Column()
    dryerId: number;

    @Column()
    startDateTime: Date;

    @Column()
    endDateTime: Date;

    @Column()
    driedQuantityBags: number;

    @Column()
    driedGrossWeight: number;

    @Column()
    driedNetWeight: number;

    @Column()
    moistureContent: number;

    @Column()
    status: string;
}

export type DryingBatchCreate = Pick<DryingBatch, 'palayBatchId' | 'dryingMethod' | 'dryerType' | 'dryerId' | 'startDateTime' | 'endDateTime' | 'driedQuantityBags' | 'driedGrossWeight' | 'driedNetWeight' | 'moistureContent' | 'status' >;
export type DryingBatchUpdate = Pick<DryingBatch, 'id'> & Partial<DryingBatchCreate>;

export async function getDryingBatches(limit: number, offset: number): Promise<DryingBatch[]> {
    return await DryingBatch.find({
        take: limit,
        skip: offset
    });
}

export async function getDryingBatch(id: number): Promise<DryingBatch | null> {
    return await DryingBatch.findOne({
        where: {
            id
        }
    });
}

export async function countDryingBatches(): Promise<number> {
    return await DryingBatch.count();
}

export async function createDryingBatch(dryingBatchCreate: DryingBatchCreate): Promise<DryingBatch> {
    let dryingBatch = new DryingBatch();

    dryingBatch.palayBatchId = dryingBatchCreate.palayBatchId;
    dryingBatch.dryingMethod = dryingBatchCreate.dryingMethod;
    dryingBatch.dryerType = dryingBatchCreate.dryerType;
    dryingBatch.dryerId = dryingBatchCreate.dryerId;
    dryingBatch.startDateTime = dryingBatchCreate.startDateTime;
    dryingBatch.endDateTime = dryingBatchCreate.endDateTime;
    dryingBatch.driedQuantityBags = dryingBatchCreate.driedQuantityBags;
    dryingBatch.driedGrossWeight = dryingBatchCreate.driedGrossWeight;
    dryingBatch.driedNetWeight = dryingBatchCreate.driedNetWeight;
    dryingBatch.moistureContent = dryingBatchCreate.moistureContent;
    dryingBatch.status = dryingBatchCreate.status;

    return await dryingBatch.save();
}

export async function updateDryingBatch(dryingBatchUpdate: DryingBatchUpdate): Promise<DryingBatch> {
    console.log('dryingBatchUpdate', dryingBatchUpdate);

    await DryingBatch.update(dryingBatchUpdate.id, {
        palayBatchId: dryingBatchUpdate.palayBatchId,
        dryingMethod: dryingBatchUpdate.dryingMethod,
        dryerType: dryingBatchUpdate.dryerType,
        dryerId: dryingBatchUpdate.dryerId,
        startDateTime: dryingBatchUpdate.startDateTime,
        endDateTime: dryingBatchUpdate.endDateTime,
        driedQuantityBags: dryingBatchUpdate.driedQuantityBags,
        driedGrossWeight: dryingBatchUpdate.driedGrossWeight,
        driedNetWeight: dryingBatchUpdate.driedNetWeight,
        moistureContent: dryingBatchUpdate.moistureContent,
        status: dryingBatchUpdate.status
    });

    const dryingBatch = await getDryingBatch(dryingBatchUpdate.id);

    if (dryingBatch === null) {
        throw new Error(`updateDryingBatch: failed for id ${dryingBatchUpdate.id}`);
    }

    return dryingBatch;
}
