import { BaseEntity, Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class DryingBatch extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    palayBatchId: string;

    @Column({ nullable: true})
    dryingMethod: string;

    @Column()
    dryerId: string;

    @Column()
    startDateTime: Date;

    @Column({ nullable: true })
    endDateTime: Date;

    @Column({ nullable: true })
    driedQuantityBags: number;

    @Column({ nullable: true })
    driedGrossWeight: number;

    @Column()
    driedNetWeight: number;

    @Column({ nullable: true })
    moistureContent: number;

    @Column({ default: 'in progress' })
    status: string;

    @BeforeInsert()
    async generateId() {
        const prefix = '030402';
        const lastOrder = await DryingBatch.find({
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

export type DryingBatchCreate = Pick<DryingBatch, 'palayBatchId' | 'dryingMethod' | 'dryerId' | 'startDateTime' | 'endDateTime' | 'driedQuantityBags' | 'driedGrossWeight' | 'driedNetWeight' | 'moistureContent' | 'status' >;
export type DryingBatchUpdate = Pick<DryingBatch, 'id'> & Partial<DryingBatchCreate>;

function getCurrentPST(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 8));
}

export async function getDryingBatches(limit: number, offset: number): Promise<DryingBatch[]> {
    return await DryingBatch.find({
        take: limit,
        skip: offset
    });
}

export async function getDryingBatch(id: string): Promise<DryingBatch | null> {
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
    dryingBatch.dryerId = dryingBatchCreate.dryerId;
    dryingBatch.startDateTime = getCurrentPST();
    dryingBatch.endDateTime = dryingBatchCreate.endDateTime;
    dryingBatch.driedQuantityBags = dryingBatchCreate.driedQuantityBags;
    dryingBatch.driedGrossWeight = dryingBatchCreate.driedGrossWeight;
    dryingBatch.driedNetWeight = dryingBatchCreate.driedNetWeight;
    dryingBatch.moistureContent = dryingBatchCreate.moistureContent;
    dryingBatch.status = dryingBatchCreate.status;

    return await dryingBatch.save();
}

export async function updateDryingBatch(dryingBatchUpdate: DryingBatchUpdate): Promise<DryingBatch> {

    await DryingBatch.update(dryingBatchUpdate.id, {
        palayBatchId: dryingBatchUpdate.palayBatchId,
        dryingMethod: dryingBatchUpdate.dryingMethod,
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

export async function getTotalQuantityBags(): Promise<number> {
    const result = await DryingBatch
        .createQueryBuilder('dryingBatch')
        .select('SUM(dryingBatch.driedQuantityBags)', 'total')
        .getRawOne();
    
    return result?.total || 0;
}