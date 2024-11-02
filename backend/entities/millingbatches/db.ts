import { BaseEntity, Column, Entity, PrimaryColumn, OneToMany, BeforeInsert } from 'typeorm';
import { RiceBatchMillingBatch } from '../riceBatchMillingBatches/db';

@Entity()
export class MillingBatch extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    dryingBatchId: string;

    @Column()
    palayBatchId: string;

    @Column()
    millerId: string;

    @Column()
    millerType: string;

    @Column()
    startDateTime: Date;

    @Column({ nullable: true })
    endDateTime: Date;

    @Column({ nullable: true })
    milledQuantityBags: number;

    @Column({ nullable: true })
    milledGrossWeight: number;

    @Column({ nullable: true })
    milledNetWeight: number;

    @Column({ nullable: true })
    millingEfficiency: number;

    @Column({ default: 'in progress'})
    status: string;

    @OneToMany(() => RiceBatchMillingBatch, riceBatchMillingBatch => riceBatchMillingBatch.millingBatch)
    riceBatchMillingBatches: RiceBatchMillingBatch[];

    @BeforeInsert()
    async generateId() {
        const prefix = '030403';
        const lastOrder = await MillingBatch.find({
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

export type MillingBatchCreate = Pick<MillingBatch, 'dryingBatchId' | 'palayBatchId' | 'millerId' | 'millerType' | 'startDateTime' | 'endDateTime' | 'milledQuantityBags' | 'milledGrossWeight' | 'milledNetWeight' | 'millingEfficiency' | 'status' >;
export type MillingBatchUpdate = Pick<MillingBatch, 'id'> & Partial<MillingBatchCreate>;

function getCurrentPST(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 8));
}

export async function getMillingBatches(limit: number, offset: number): Promise<MillingBatch[]> {
    return await MillingBatch.find({
        take: limit,
        skip: offset
    });
}

export async function getMillingBatch(id: string): Promise<MillingBatch | null> {
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
    millingBatch.startDateTime = getCurrentPST();
    millingBatch.endDateTime = millingBatchCreate.endDateTime;
    millingBatch.milledQuantityBags = millingBatchCreate.milledQuantityBags;
    millingBatch.milledGrossWeight = millingBatchCreate.milledGrossWeight;
    millingBatch.milledNetWeight = millingBatchCreate.milledNetWeight;
    millingBatch.millingEfficiency = millingBatchCreate.millingEfficiency;
    millingBatch.status = millingBatchCreate.status;

    return await millingBatch.save();
}

export async function updateMillingBatch(millingBatchUpdate: MillingBatchUpdate): Promise<MillingBatch> {

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
