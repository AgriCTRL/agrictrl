import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RiceDelivery extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    driverName: string;

    @Column()
    typeOfTranspo: string;

    @Column()
    plateNumber: string
}

export type RiceDeliveryCreate = Pick<RiceDelivery, 'driverName' | 'typeOfTranspo' | 'plateNumber'>;
export type RiceDeliveryUpdate = Pick<RiceDelivery, 'id'> & Partial<RiceDeliveryCreate>;

export async function getRiceDeliveries(limit: number, offset: number): Promise<RiceDelivery[]> {
    return await RiceDelivery.find({
        take: limit,
        skip: offset
    });
}

export async function getRiceDelivery(id: number): Promise<RiceDelivery | null> {
    return await RiceDelivery.findOne({
        where: {
            id
        }
    });
}

export async function countRiceDeliveries(): Promise<number> {
    return await RiceDelivery.count();
}

export async function createRiceDelivery(riceDeliveryCreate: RiceDeliveryCreate): Promise<RiceDelivery> {
    let riceDelivery = new RiceDelivery();

    riceDelivery.driverName = riceDeliveryCreate.driverName;
    riceDelivery.typeOfTranspo = riceDeliveryCreate.typeOfTranspo;
    riceDelivery.plateNumber = riceDeliveryCreate.plateNumber

    return await riceDelivery.save();
}

export async function updateRiceDelivery(riceDeliveryUpdate: RiceDeliveryUpdate): Promise<RiceDelivery> {
    await RiceDelivery.update(riceDeliveryUpdate.id, {
        driverName: riceDeliveryUpdate.driverName,
        typeOfTranspo: riceDeliveryUpdate.typeOfTranspo,
        plateNumber: riceDeliveryUpdate.plateNumber

    });

    const riceDelivery = await getRiceDelivery(riceDeliveryUpdate.id);

    if (riceDelivery === null) {
        throw new Error(`updateRiceDelivery: failed for id ${riceDeliveryUpdate.id}`);
    }

    return riceDelivery;
}

export async function deleteRiceDelivery(id: number): Promise<number> {
    const deleteResult = await RiceDelivery.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteRiceDelivery: could not delete riceDelivery with id ${id}`);
    }

    return id;
}
