import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';

import { PalayBatch } from '../palaybatches/db';

@Entity()
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    item: string;

    @Column()
    itemId: number;

    @Column()
    senderId: number;

    @Column()
    sendDateTime: Date;

    @Column()
    fromLocationType: string;

    @Column()
    fromLocationId: number;

    @Column()
    transporterName: string;

    @Column()
    transporterDesc: string;

    @Column({ nullable: true })
    receiverId: number;

    @Column({ nullable: true })
    receiveDateTime: Date;

    @Column()
    toLocationType: string;
    
    @Column()
    toLocationId: number;

    @Column({ default: 'pending' })
    status: string;

    @Column({ nullable: true })
    remarks: string;

    @ManyToOne(() => PalayBatch)
    @JoinColumn({ name: 'itemId' })
    palayBatch: PalayBatch;
}

export type TransactionCreate = Pick<Transaction, 'item' | 'itemId' | 'senderId' | 'sendDateTime' | 'fromLocationType' | 'fromLocationId' | 'transporterName' | 'transporterDesc' | 'receiverId' | 'receiveDateTime' | 'toLocationType' | 'toLocationId' | 'status' | 'remarks'>;
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

export async function getTransactions(limit: number, offset: number, toLocationId?: number, toLocationType?: string, status?: string): Promise<Transaction[]> {
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


export async function getTransactionByToLocationId(toLocationId: number, toLocationType?: string): Promise<Transaction | null> {
    const whereClause: any = { toLocationId };

    if (toLocationType) {
        whereClause.toLocationType = toLocationType;
    }

    return await Transaction.findOne({
        where: whereClause
    });
}

export async function getTransaction(id: number): Promise<Transaction | null> {
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
    let transaction = new Transaction();

    transaction.item = transactionCreate.item;
    transaction.itemId = transactionCreate.itemId;
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
