import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { getTransporter, Transporter } from '../transporters/db';

@Entity()
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    item: string;

    @Column('simple-array')
    itemIds: number[];

    @Column()
    senderId: number;

    @Column()
    sendDateTime: Date;

    @Column()
    fromLocationType: string;

    @Column()
    fromLocationId: number;

    @Column()
    transporterId: number;

    @ManyToOne(() => Transporter)
    transporter: Transporter;

    @Column()
    receiverId: number;

    @Column()
    receiveDateTime: Date;

    @Column()
    toLocationType: string;
    
    @Column()
    toLocationId: number;

    @Column()
    status: string;

    @Column()
    remarks: string;
}

export type TransactionCreate = Pick<Transaction, 'item' | 'itemIds' | 'senderId' | 'sendDateTime' | 'fromLocationType' | 'fromLocationId' | 'transporterId' | 'receiverId' | 'receiveDateTime' | 'toLocationType' | 'toLocationId' | 'status' | 'remarks'>;
export type TransactionUpdate = Pick<Transaction, 'id'> & Partial<TransactionCreate>;

export async function getTransactions(limit: number, offset: number): Promise<Transaction[]> {
    return await Transaction.find({
        take: limit,
        skip: offset,
        relations: {
            transporter: true
        }
    });
}

export async function getTransaction(id: number): Promise<Transaction | null> {
    return await Transaction.findOne({
        where: {
            id
        },
        relations: {
            transporter: true
        }
    });
}

export async function countTransactions(): Promise<number> {
    return await Transaction.count();
}

export async function createTransaction(transactionCreate: TransactionCreate): Promise<Transaction> {
    let transaction = new Transaction();

    transaction.item = transactionCreate.item;
    transaction.itemIds = transactionCreate.itemIds;
    transaction.senderId = transactionCreate.senderId;
    transaction.sendDateTime = transactionCreate.sendDateTime;
    transaction.fromLocationType = transactionCreate.fromLocationType;
    transaction.fromLocationId = transactionCreate.fromLocationId;

    // transporters

    const transporter = await getTransporter(transactionCreate.transporterId);

    if (transporter === null) {
        throw new Error(``);
    }

    transaction.transporterId = transporter.id;

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
        itemIds: transactionUpdate.itemIds,
        senderId: transactionUpdate.senderId,
        sendDateTime: transactionUpdate.sendDateTime,
        fromLocationType: transactionUpdate.fromLocationType,
        fromLocationId: transactionUpdate.fromLocationId,
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
