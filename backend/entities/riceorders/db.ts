import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, In } from 'typeorm';

@Entity()
export class RiceOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    riceRecipientId: number;

    @Column({ nullable: true})
    riceBatchId: number;

    @Column()
    orderDate: Date;

    @Column()
    dropOffLocation: string;

    @Column()
    riceQuantityBags: number;

    @Column({ nullable: true })
    description: string;

    @Column()
    totalCost: number;

    @Column()
    preferredDeliveryDate: Date;

    @Column({ default: 'For Approval'})
    status: string;

    @Column({ default: false })
    isAccepted: boolean;

    @Column({ nullable: true })
    remarks: string;
}

export type RiceOrderCreate = Pick<RiceOrder, 'riceRecipientId' | 'riceBatchId' | 'orderDate' | 'dropOffLocation' | 'riceQuantityBags' | 'description' | 'totalCost' | 'preferredDeliveryDate' | 'status' | 'isAccepted' | 'remarks'>;
export type RiceOrderUpdate = Pick<RiceOrder, 'id'> & Partial<RiceOrderCreate>;

function getCurrentPST(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 8));
}

export async function getRiceOrders(limit: number, offset: number, riceRecipientId?: number, status?: string[]): Promise<RiceOrder[]> {
    let whereClause: any = {};
    
    if (riceRecipientId) {
        whereClause.riceRecipientId = riceRecipientId;
    }

    if (status) {
        whereClause.status = In(status);
    }

    return await RiceOrder.find({
        where: whereClause,
        take: limit,
        skip: offset,
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

    riceOrder.riceRecipientId = riceOrderCreate.riceRecipientId;
    riceOrder.riceBatchId = riceOrderCreate.riceBatchId;
    riceOrder.orderDate = getCurrentPST();
    riceOrder.dropOffLocation = riceOrderCreate.dropOffLocation;
    riceOrder.riceQuantityBags = riceOrderCreate.riceQuantityBags;
    riceOrder.description = riceOrderCreate.description;
    riceOrder.totalCost = riceOrderCreate.totalCost;
    riceOrder.preferredDeliveryDate = riceOrderCreate.preferredDeliveryDate;
    riceOrder.status = riceOrderCreate.status;
    riceOrder.isAccepted = riceOrderCreate.isAccepted;
    riceOrder.remarks = riceOrderCreate.remarks;

    return await riceOrder.save();
}

export async function updateRiceOrder(riceOrderUpdate: RiceOrderUpdate): Promise<RiceOrder> {
    await RiceOrder.update(riceOrderUpdate.id, {
        riceRecipientId: riceOrderUpdate.riceRecipientId,
        riceBatchId: riceOrderUpdate.riceBatchId,
        orderDate: riceOrderUpdate.orderDate,
        dropOffLocation: riceOrderUpdate.dropOffLocation,
        riceQuantityBags: riceOrderUpdate.riceQuantityBags,
        description: riceOrderUpdate.description,
        totalCost: riceOrderUpdate.totalCost,
        preferredDeliveryDate: riceOrderUpdate.preferredDeliveryDate,
        status: riceOrderUpdate.status,
        isAccepted: riceOrderUpdate.isAccepted,
        remarks: riceOrderUpdate.remarks
    });

    const riceOrder = await getRiceOrder(riceOrderUpdate.id);

    if (riceOrder === null) {
        throw new Error(`updateRiceOrder: failed for id ${riceOrderUpdate.id}`);
    }

    return riceOrder;
}
