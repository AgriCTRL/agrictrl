import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { getRiceDelivery, RiceDelivery } from '../ricedeliveries/db';

@Entity()
export class RiceBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    palayBatchId: number;

    @Column()
    dateReceived: Date;

    @Column()
    quantity: number;

    @Column()
    qualityType: string;

    @Column()
    riceDeliveryId: number;

    @ManyToOne(() => RiceDelivery)
    riceDelivery: RiceDelivery;

    @Column()
    warehouseId: number;

    @Column()
    recipientId: number;
}

export type RiceBatchCreate = Pick<RiceBatch, 'palayBatchId' | 'dateReceived' | 'quantity' | 'qualityType' | 'warehouseId' | 'recipientId'> &
{ riceDeliveryId: RiceDelivery['id'] }
export type RiceBatchUpdate = Pick<RiceBatch, 'id'> & Partial<RiceBatchCreate>;

export async function getRiceBatches(limit: number, offset: number): Promise<RiceBatch[]> {
    return await RiceBatch.find({
        take: limit,
        skip: offset,
        relations: {
            riceDelivery: true
        }
    });
}

export async function getRiceBatch(id: number): Promise<RiceBatch | null> {
    return await RiceBatch.findOne({
        where: {
            id
        },
        relations: {
            riceDelivery: true
        }
    });
}

export async function countRiceBatches(): Promise<number> {
    return await RiceBatch.count();
}

export async function createRiceBatch(riceBatchCreate: RiceBatchCreate): Promise<RiceBatch> {
    let riceBatch = new RiceBatch();

    riceBatch.palayBatchId = riceBatchCreate.palayBatchId;
    riceBatch.dateReceived = riceBatchCreate.dateReceived;
    riceBatch.quantity = riceBatchCreate.quantity;
    riceBatch.qualityType = riceBatchCreate.qualityType;
    riceBatch.warehouseId = riceBatchCreate.warehouseId;
    riceBatch.recipientId = riceBatchCreate.recipientId;

    // riceDelivery

    const riceDelivery = await getRiceDelivery(riceBatchCreate.riceDeliveryId);

    if (riceDelivery === null) {
        throw new Error(``);
    }

    riceBatch.riceDeliveryId = riceDelivery.id;
    riceBatch.riceDelivery = riceDelivery;

    return await riceBatch.save();
}

export async function updateRiceBatch(riceBatchUpdate: RiceBatchUpdate): Promise<RiceBatch> {
    console.log('riceBatchUpdate', riceBatchUpdate);

    await RiceBatch.update(riceBatchUpdate.id, {
        palayBatchId: riceBatchUpdate.palayBatchId,
        dateReceived: riceBatchUpdate.dateReceived,
        quantity: riceBatchUpdate.quantity,
        qualityType: riceBatchUpdate.qualityType,
        warehouseId: riceBatchUpdate.warehouseId,
        recipientId: riceBatchUpdate.recipientId, 
    });

    const riceBatch = await getRiceBatch(riceBatchUpdate.id);

    if (riceBatch === null) {
        throw new Error(`updateRiceBatch: failed for id ${riceBatchUpdate.id}`);
    }

    return riceBatch;
}

export async function deleteRiceBatch(id: number): Promise<number> {
    const deleteResult = await RiceBatch.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteRiceBatch: could not delete riceBatch with id ${id}`);
    }

    return id;
}
