import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, LessThan, OneToMany } from 'typeorm';
import { RiceBatchMillingBatch } from '../riceBatchMillingBatches/db';

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

    @Column()
    currentCapacity: number;

    @Column()
    maxCapacity: number;

    @Column({ default: false })
    isFull: boolean; 

    @Column({ default: false })
    forSale: boolean;

    @OneToMany(() => RiceBatchMillingBatch, riceBatchMillingBatch => riceBatchMillingBatch.riceBatch)
    riceBatchMillingBatches: RiceBatchMillingBatch[];
}

export type RiceBatchCreate = Pick<RiceBatch, 'name' | 'dateReceived' | 'riceType' | 'warehouseId' | 'price' | 'currentCapacity' | 'maxCapacity' | 'isFull' | 'forSale' >;
export type RiceBatchUpdate = Pick<RiceBatch, 'id'> & Partial<RiceBatchCreate>;

function getCurrentPST(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 8));
}

export async function getRiceBatches(limit: number, offset: number, currentCapacity_lt?: number, isFull?: boolean): Promise<RiceBatch[]> {
    const where: { currentCapacity?: any; isFull?: boolean } = {};

    if (typeof currentCapacity_lt === 'number') {
        where.currentCapacity = LessThan(currentCapacity_lt);
    }

    if (typeof isFull === 'boolean') {
        where.isFull = isFull;
    }

    return await RiceBatch.find({
        where,
        take: limit > 0 ? limit : undefined,
        skip: offset,
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
    riceBatch.currentCapacity = riceBatchCreate.currentCapacity;
    riceBatch.maxCapacity = riceBatchCreate.maxCapacity;
    riceBatch.isFull = riceBatchCreate.isFull;
    riceBatch.forSale = riceBatchCreate.forSale; // Set forSale field

    return await riceBatch.save();
}

export async function updateRiceBatch(riceBatchUpdate: RiceBatchUpdate): Promise<RiceBatch> {
    if (!riceBatchUpdate.id) {
        throw new Error(`updateRiceBatch: Missing id parameter.`);
    }

    await RiceBatch.update(riceBatchUpdate.id, {
        name: riceBatchUpdate.name,
        dateReceived: riceBatchUpdate.dateReceived,
        riceType: riceBatchUpdate.riceType,
        warehouseId: riceBatchUpdate.warehouseId,
        price: riceBatchUpdate.price,
        currentCapacity: riceBatchUpdate.currentCapacity,
        maxCapacity: riceBatchUpdate.maxCapacity,
        isFull: riceBatchUpdate.isFull,
        forSale: riceBatchUpdate.forSale // Update forSale field
    });

    const riceBatch = await getRiceBatch(riceBatchUpdate.id);

    if (riceBatch === null) {
        throw new Error(`updateRiceBatch: failed for id ${riceBatchUpdate.id}`);
    }

    return riceBatch;
}