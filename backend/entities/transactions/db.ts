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
    userId: number;

    @Column()
    fromLocationType: string;

    @Column()
    fromLocationId: number;

    @Column()
    transporterId: number;

    @ManyToOne(() => Transporter)
    transporter: Transporter;

    @Column()
    toLocationType: string;
    
    @Column()
    toLocationId: number;

    @Column()
    transactionTimeDate: Date;
}

export type TransactionCreate = Pick<Transaction, 'item' | 'itemIds' | 'userId' | 'fromLocationType' | 'fromLocationId' | 'transporterId' | 'toLocationType' | 'toLocationId' | 'transactionTimeDate'>;
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
    transaction.userId = transactionCreate.userId;
    transaction.fromLocationType = transactionCreate.fromLocationType;
    transaction.fromLocationId = transactionCreate.fromLocationId;

    // transporters

    const transporter = await getTransporter(transactionCreate.transporterId);

    if (transporter === null) {
        throw new Error(``);
    }

    transaction.transporterId = transporter.id;

    transaction.toLocationType = transactionCreate.toLocationType;
    transaction.toLocationId = transactionCreate.toLocationId;
    transaction.transactionTimeDate = transactionCreate.transactionTimeDate;

    return await transaction.save();
}

export async function updateTransaction(transactionUpdate: TransactionUpdate): Promise<Transaction> {
    await Transaction.update(transactionUpdate.id, {
        item: transactionUpdate.item,
        itemIds: transactionUpdate.itemIds,
        userId: transactionUpdate.userId,
        fromLocationType: transactionUpdate.fromLocationType,
        fromLocationId: transactionUpdate.fromLocationId,
        toLocationType: transactionUpdate.toLocationType,
        toLocationId: transactionUpdate.toLocationId,
        transactionTimeDate: transactionUpdate.transactionTimeDate,
    });

    const transaction = await getTransaction(transactionUpdate.id);

    if (transaction === null) {
        throw new Error(`updateTransaction: failed for id ${transactionUpdate.id}`);
    }

    return transaction;
}
