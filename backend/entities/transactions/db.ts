import {
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    BeforeInsert
} from 'typeorm';

import { PalayBatch } from '../palaybatches/db';
import { RiceBatch } from '../ricebatches/db';

@Entity()
export class Transaction extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    item: string;

    @Column({ nullable: true })
    itemId: string;

    @Column({ nullable: true })
    riceBatchId: string;

    @Column()
    senderId: string;

    @Column()
    sendDateTime: Date;

    @Column()
    fromLocationType: string;

    @Column()
    fromLocationId: string;

    @Column()
    transporterName: string;

    @Column()
    transporterDesc: string;

    @Column({ nullable: true })
    receiverId: string;

    @Column({ nullable: true })
    receiveDateTime: Date;

    @Column()
    toLocationType: string;
    
    @Column()
    toLocationId: string;

    @Column({ default: 'pending' })
    status: string;

    @Column({ nullable: true })
    remarks: string;

    @ManyToOne(() => PalayBatch, { nullable: true })
    @JoinColumn({ name: 'itemId' })
    palayBatch?: PalayBatch;

    @ManyToOne(() => RiceBatch, { nullable: true })
    @JoinColumn({ name: 'riceBatchId' })
    riceBatch?: RiceBatch;

    @BeforeInsert()
    async generateId() {
        const prefix = '030406';
        const lastOrder = await Transaction.find({
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

export type TransactionCreate = Pick<Transaction, 'item' | 'itemId' | 'riceBatchId' | 'senderId' | 'sendDateTime' | 'fromLocationType' | 'fromLocationId' | 'transporterName' | 'transporterDesc' | 'receiverId' | 'receiveDateTime' | 'toLocationType' | 'toLocationId' | 'status' | 'remarks'>;
export type TransactionUpdate = Pick<Transaction, 'id'> & Partial<TransactionCreate>;

function getCurrentPST(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 8));
}

// export async function getTransactions(limit: number, offset: number): Promise<Transaction[]> {
//     return await Transaction.find({
//         take: limit,
//         skip: offset
//     });
// }

export async function getTransactions(limit: number, offset: number, toLocationId?: string, toLocationType?: string, status?: string): Promise<Transaction[]> {
    let whereClause: any = {};

    if (toLocationId !== undefined) {
        whereClause.toLocationId = toLocationId;
    }

    if (toLocationType) {
        whereClause.toLocationType = toLocationType;
    }

    if (status) {
        whereClause.status = status;
    }

    return await Transaction.find({
        where: whereClause,
        take: limit,
        skip: offset
    });
}


export async function getTransactionByToLocationId(toLocationId: string, toLocationType?: string): Promise<Transaction | null> {
    const whereClause: any = { toLocationId };

    if (toLocationType) {
        whereClause.toLocationType = toLocationType;
    }

    return await Transaction.findOne({
        where: whereClause
    });
}

export async function getTransaction(id: string): Promise<Transaction | null> {
    return await Transaction.findOne({
        where: {
            id
        }
    });
}

export async function countTransactions(): Promise<number> {
    return await Transaction.count();
}

export async function createTransaction(transactionCreate: TransactionCreate): Promise<Transaction> {
    const transaction = new Transaction();

    transaction.item = transactionCreate.item;
    transaction.itemId = transactionCreate.itemId ?? null; // Set to null if not provided
    transaction.riceBatchId = transactionCreate.riceBatchId ?? null; // Set riceBatchId to null if not provided
    transaction.senderId = transactionCreate.senderId;
    transaction.sendDateTime = getCurrentPST();
    transaction.fromLocationType = transactionCreate.fromLocationType;
    transaction.fromLocationId = transactionCreate.fromLocationId;
    transaction.transporterName = transactionCreate.transporterName;
    transaction.transporterDesc = transactionCreate.transporterDesc;
    transaction.receiverId = transactionCreate.receiverId;
    transaction.receiveDateTime = transactionCreate.receiveDateTime;
    transaction.toLocationType = transactionCreate.toLocationType;
    transaction.toLocationId = transactionCreate.toLocationId;
    transaction.status = transactionCreate.status;
    transaction.remarks = transactionCreate.remarks;

    return await transaction.save();
}


export async function updateTransaction(transactionUpdate: TransactionUpdate): Promise<Transaction> {
    await Transaction.update(transactionUpdate.id, {
        item: transactionUpdate.item,
        itemId: transactionUpdate.itemId,
        riceBatchId: transactionUpdate.riceBatchId,
        senderId: transactionUpdate.senderId,
        sendDateTime: transactionUpdate.sendDateTime,
        fromLocationType: transactionUpdate.fromLocationType,
        fromLocationId: transactionUpdate.fromLocationId,
        transporterName: transactionUpdate.transporterName,
        transporterDesc: transactionUpdate.transporterDesc,
        receiverId: transactionUpdate.receiverId,
        receiveDateTime: transactionUpdate.receiveDateTime,
        toLocationType: transactionUpdate.toLocationType,
        toLocationId: transactionUpdate.toLocationId,
        status: transactionUpdate.status,
        remarks: transactionUpdate.remarks,
    });

    const transaction = await getTransaction(transactionUpdate.id);

    if (transaction === null) {
        throw new Error(`updateTransaction: failed for id ${transactionUpdate.id}`);
    }

    return transaction;
}
