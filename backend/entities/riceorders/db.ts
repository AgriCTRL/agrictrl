import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RiceOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    riceRecipient: string;

    @Column()
    riceBatchId: number;

    @Column()
    orderDate: Date;

    @Column()
    riceQuantity: number;

    @Column()
    cost: number;

    @Column()
    orderStatus: string;
}

export type RiceOrderCreate = Pick<RiceOrder, 'riceRecipient' | 'riceBatchId' | 'orderDate' | 'riceQuantity' | 'cost' | 'orderStatus'>;
export type RiceOrderUpdate = Pick<RiceOrder, 'id'> & Partial<RiceOrderCreate>;

export async function getRiceOrders(limit: number, offset: number): Promise<RiceOrder[]> {
    return await RiceOrder.find({
        take: limit,
        skip: offset
    });
}

export async function getRiceOrder(id: number): Promise<RiceOrder | null> {
    return await RiceOrder.findOne({
        where: {
            id
        }
    });
}

export async function countRiceOrders(): Promise<number> {
    return await RiceOrder.count();
}

export async function createRiceOrder(riceOrderCreate: RiceOrderCreate): Promise<RiceOrder> {
    let riceOrder = new RiceOrder();

    riceOrder.riceRecipient = riceOrderCreate.riceRecipient;
    riceOrder.riceBatchId = riceOrderCreate.riceBatchId;
    riceOrder.orderDate = riceOrderCreate.orderDate;
    riceOrder.riceQuantity = riceOrderCreate.riceQuantity;
    riceOrder.cost = riceOrderCreate.cost;
    riceOrder.orderStatus = riceOrderCreate.orderStatus;

    return await riceOrder.save();
}

export async function updateRiceOrder(riceOrderUpdate: RiceOrderUpdate): Promise<RiceOrder> {
    await RiceOrder.update(riceOrderUpdate.id, {
        riceRecipient: riceOrderUpdate.riceRecipient,
        riceBatchId: riceOrderUpdate.riceBatchId,
        orderDate: riceOrderUpdate.orderDate,
        riceQuantity: riceOrderUpdate.riceQuantity,
        cost: riceOrderUpdate.cost,
        orderStatus: riceOrderUpdate.orderStatus
    });

    const riceOrder = await getRiceOrder(riceOrderUpdate.id);

    if (riceOrder === null) {
        throw new Error(`updateRiceOrder: failed for id ${riceOrderUpdate.id}`);
    }

    return riceOrder;
}
