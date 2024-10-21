import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RiceBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    dateReceived: Date;

    @Column()
    riceType: string;

    @Column()
    warehouseId: number;

    @Column()
    price: number;
}

export type RiceBatchCreate = Pick<RiceBatch, 'name' | 'dateReceived' | 'riceType' | 'warehouseId' | 'price'>;
export type RiceBatchUpdate = Pick<RiceBatch, 'id'> & Partial<RiceBatchCreate>;

function getCurrentPST(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 8));
}

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

    riceBatch.name = riceBatchCreate.name;
    riceBatch.dateReceived = getCurrentPST();
    riceBatch.riceType = riceBatchCreate.riceType;
    riceBatch.warehouseId = riceBatchCreate.warehouseId;
    riceBatch.price = riceBatchCreate.price;

    return await riceBatch.save();
}

export async function updateRiceBatch(riceBatchUpdate: RiceBatchUpdate): Promise<RiceBatch> {
    await RiceBatch.update(riceBatchUpdate.id, {
        name: riceBatchUpdate.name,
        dateReceived: riceBatchUpdate.dateReceived,
        riceType: riceBatchUpdate.riceType,
        warehouseId: riceBatchUpdate.warehouseId,
        price: riceBatchUpdate.price,
    });

    const riceBatch = await getRiceBatch(riceBatchUpdate.id);

    if (riceBatch === null) {
        throw new Error(`updateRiceBatch: failed for id ${riceBatchUpdate.id}`);
    }

    return riceBatch;
}
