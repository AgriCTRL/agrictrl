import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PalayDelivery extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    driverName: string;

    @Column()
    typeOfTranspo: string;

    @Column()
    plateNumber: string
}

export type PalayDeliveryCreate = Pick<PalayDelivery, 'driverName' | 'typeOfTranspo' | 'plateNumber'>;
export type PalayDeliveryUpdate = Pick<PalayDelivery, 'id'> & Partial<PalayDeliveryCreate>;

export async function getPalayDeliveries(limit: number, offset: number): Promise<PalayDelivery[]> {
    return await PalayDelivery.find({
        take: limit,
        skip: offset
    });
}

export async function getPalayDelivery(id: number): Promise<PalayDelivery | null> {
    return await PalayDelivery.findOne({
        where: {
            id
        }
    });
}

export async function countPalayDeliveries(): Promise<number> {
    return await PalayDelivery.count();
}

export async function createPalayDelivery(palayDeliveryCreate: PalayDeliveryCreate): Promise<PalayDelivery> {
    let palayDelivery = new PalayDelivery();

    palayDelivery.driverName = palayDeliveryCreate.driverName;
    palayDelivery.typeOfTranspo = palayDeliveryCreate.typeOfTranspo;
    palayDelivery.plateNumber = palayDeliveryCreate.plateNumber

    return await palayDelivery.save();
}

export async function updatePalayDelivery(palayDeliveryUpdate: PalayDeliveryUpdate): Promise<PalayDelivery> {
    await PalayDelivery.update(palayDeliveryUpdate.id, {
        driverName: palayDeliveryUpdate.driverName,
        typeOfTranspo: palayDeliveryUpdate.typeOfTranspo,
        plateNumber: palayDeliveryUpdate.plateNumber

    });

    const palayDelivery = await getPalayDelivery(palayDeliveryUpdate.id);

    if (palayDelivery === null) {
        throw new Error(`updatePalayDelivery: failed for id ${palayDeliveryUpdate.id}`);
    }

    return palayDelivery;
}

export async function deletePalayDelivery(id: number): Promise<number> {
    const deleteResult = await PalayDelivery.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deletePalayDelivery: could not delete palayDelivery with id ${id}`);
    }

    return id;
}
