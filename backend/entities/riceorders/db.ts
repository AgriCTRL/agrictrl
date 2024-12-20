import { BaseEntity, Column, Entity, PrimaryColumn, BeforeInsert, In } from 'typeorm';

@Entity()
export class RiceOrder extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    riceRecipientId: string;

    @Column({ nullable: true})
    pileId: string;

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

    @BeforeInsert()
    async generateId() {
        const prefix = '030442';
        const lastOrder = await RiceOrder.find({
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

export type RiceOrderCreate = Pick<RiceOrder, 'riceRecipientId' | 'pileId' | 'orderDate' | 'dropOffLocation' | 'riceQuantityBags' | 'description' | 'totalCost' | 'preferredDeliveryDate' | 'status' | 'isAccepted' | 'remarks'>;
export type RiceOrderUpdate = Pick<RiceOrder, 'id'> & Partial<RiceOrderCreate>;

function getCurrentPST(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 8));
}

export async function getRiceOrders(limit: number, offset: number, id?: string, riceRecipientId?: number, status?: string[]): Promise<RiceOrder[]> {
    let whereClause: any = {};
    
    if (riceRecipientId) {
        whereClause.riceRecipientId = riceRecipientId;
    }

    if (id) {
        whereClause.id = id;
    }

    if (status) {
        whereClause.status = In(status);
    }

    return await RiceOrder.find({
        where: whereClause,
        take: limit,
        skip: offset
    });
}

export async function getRiceOrder(id: string): Promise<RiceOrder | null> {
    return await RiceOrder.findOne({
        where: {
            id
        }
    });
}

export async function countRiceOrders(): Promise<number> {
    return await RiceOrder.count();
}

export async function countReceivedRiceOrders(): Promise<number> {
    return await RiceOrder.count({
        where: {
            status: 'Received'
        }
    });
}

export async function createRiceOrder(riceOrderCreate: RiceOrderCreate): Promise<RiceOrder> {
    let riceOrder = new RiceOrder();

    riceOrder.riceRecipientId = riceOrderCreate.riceRecipientId;
    riceOrder.pileId = riceOrderCreate.pileId;
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
        pileId: riceOrderUpdate.pileId,
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

export async function getTotalQuantityBags(): Promise<number> {
    const result = await RiceOrder
        .createQueryBuilder('riceOrder')
        .select('SUM(riceOrder.riceQuantityBags)', 'total')
        .where('riceOrder.status = :status', { status: 'Received' })
        .getRawOne();
    
    return result?.total || 0;
}