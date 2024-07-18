import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeliveryDetail extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    driverName: string;

    @Column()
    typeOfTranspo: string;

    @Column()
    plateNumber: string
}

export type DeliveryDetailCreate = Pick<DeliveryDetail, 'driverName' | 'typeOfTranspo' | 'plateNumber'>;
export type DeliveryDetailUpdate = Pick<DeliveryDetail, 'id'> & Partial<DeliveryDetailCreate>;

export async function getDeliveryDetails(limit: number, offset: number): Promise<DeliveryDetail[]> {
    return await DeliveryDetail.find({
        take: limit,
        skip: offset
    });
}

export async function getDeliveryDetail(id: number): Promise<DeliveryDetail | null> {
    return await DeliveryDetail.findOne({
        where: {
            id
        }
    });
}

export async function countDeliveryDetails(): Promise<number> {
    return await DeliveryDetail.count();
}

export async function createDeliveryDetail(deliveryDetailCreate: DeliveryDetailCreate): Promise<DeliveryDetail> {
    let deliveryDetail = new DeliveryDetail();

    deliveryDetail.driverName = deliveryDetailCreate.driverName;
    deliveryDetail.typeOfTranspo = deliveryDetailCreate.typeOfTranspo;
    deliveryDetail.plateNumber = deliveryDetailCreate.plateNumber

    return await deliveryDetail.save();
}

export async function updateDeliveryDetail(deliveryDetailUpdate: DeliveryDetailUpdate): Promise<DeliveryDetail> {
    await DeliveryDetail.update(deliveryDetailUpdate.id, {
        driverName: deliveryDetailUpdate.driverName,
        typeOfTranspo: deliveryDetailUpdate.typeOfTranspo,
        plateNumber: deliveryDetailUpdate.plateNumber

    });

    const deliveryDetail = await getDeliveryDetail(deliveryDetailUpdate.id);

    if (deliveryDetail === null) {
        throw new Error(`updateDeliveryDetail: failed for id ${deliveryDetailUpdate.id}`);
    }

    return deliveryDetail;
}

export async function deleteDeliveryDetail(id: number): Promise<number> {
    const deleteResult = await DeliveryDetail.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteDeliveryDetail: could not delete deliveryDetail with id ${id}`);
    }

    return id;
}
