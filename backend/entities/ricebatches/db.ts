import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RiceBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    transactionId: number;

    @Column()
    dateReceived: Date;

    @Column()
    quantityKg: number;

    @Column()
    riceType: string;

    @Column()
    warehouseId: number;
}

export type RiceBatchCreate = Pick<RiceBatch, 'transactionId' | 'dateReceived' | 'quantityKg' | 'riceType' | 'warehouseId'>;
export type RiceBatchUpdate = Pick<RiceBatch, 'id'> & Partial<RiceBatchCreate>;

export async function getRiceBatches(limit: number, offset: number): Promise<RiceBatch[]> {
    return await RiceBatch.find({
        take: limit,
        skip: offset
    });
}

export async function getRiceBatch(id: number): Promise<RiceBatch | null> {
    return await RiceBatch.findOne({
        where: {
            id
        }
    });
}

export async function countRiceBatches(): Promise<number> {
    return await RiceBatch.count();
}

export async function createRiceBatch(riceBatchCreate: RiceBatchCreate): Promise<RiceBatch> {
    let riceBatch = new RiceBatch();

    riceBatch.transactionId = riceBatchCreate.transactionId;
    riceBatch.dateReceived = riceBatchCreate.dateReceived;
    riceBatch.quantityKg = riceBatchCreate.quantityKg;
    riceBatch.riceType = riceBatchCreate.riceType;
    riceBatch.warehouseId = riceBatchCreate.warehouseId;

    return await riceBatch.save();
}

export async function updateRiceBatch(riceBatchUpdate: RiceBatchUpdate): Promise<RiceBatch> {
    await RiceBatch.update(riceBatchUpdate.id, {
        transactionId: riceBatchUpdate.transactionId,
        dateReceived: riceBatchUpdate.dateReceived,
        quantityKg: riceBatchUpdate.quantityKg,
        riceType: riceBatchUpdate.riceType,
        warehouseId: riceBatchUpdate.warehouseId,
    });

    const riceBatch = await getRiceBatch(riceBatchUpdate.id);

    if (riceBatch === null) {
        throw new Error(`updateRiceBatch: failed for id ${riceBatchUpdate.id}`);
    }

    return riceBatch;
}
