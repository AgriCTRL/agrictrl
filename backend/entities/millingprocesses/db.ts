import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MillingProcess extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    transactionId: number;

    @Column()
    millerId: number;

    @Column()
    millerType: string;

    @Column()
    dateSent: Date;

    @Column()
    dateReturned: Date;

    @Column()
    palayQuantitySentKg: number;
    
    @Column()
    riceQuantityReturnedKg: number;

    @Column()
    millingEfficiency: number;
}

export type MillingProcessCreate = Pick<MillingProcess, 'transactionId' | 'millerId' | 'millerType' | 'dateSent' | 'dateReturned' | 'palayQuantitySentKg' | 'riceQuantityReturnedKg' | 'millingEfficiency' >;
export type MillingProcessUpdate = Pick<MillingProcess, 'id'> & Partial<MillingProcessCreate>;

export async function getMillingProcesses(limit: number, offset: number): Promise<MillingProcess[]> {
    return await MillingProcess.find({
        take: limit,
        skip: offset
    });
}

export async function getMillingProcess(id: number): Promise<MillingProcess | null> {
    return await MillingProcess.findOne({
        where: {
            id
        }
    });
}

export async function countMillingProcesses(): Promise<number> {
    return await MillingProcess.count();
}

export async function createMillingProcess(millingProcessCreate: MillingProcessCreate): Promise<MillingProcess> {
    let millingProcess = new MillingProcess();

    millingProcess.transactionId = millingProcessCreate.transactionId;
    millingProcess.millerId = millingProcessCreate.millerId;
    millingProcess.millerType = millingProcessCreate.millerType;
    millingProcess.dateSent = millingProcessCreate.dateSent;
    millingProcess.dateReturned = millingProcessCreate.dateReturned;
    millingProcess.palayQuantitySentKg = millingProcessCreate.palayQuantitySentKg;
    millingProcess.riceQuantityReturnedKg = millingProcessCreate.riceQuantityReturnedKg;
    millingProcess.millingEfficiency = millingProcessCreate.millingEfficiency;

    return await millingProcess.save();
}

export async function updateMillingProcess(millingProcessUpdate: MillingProcessUpdate): Promise<MillingProcess> {
    console.log('millingProcessUpdate', millingProcessUpdate);

    await MillingProcess.update(millingProcessUpdate.id, {
        transactionId: millingProcessUpdate.transactionId,
        millerId: millingProcessUpdate.millerId,
        millerType: millingProcessUpdate.millerType,
        dateSent: millingProcessUpdate.dateSent,
        dateReturned: millingProcessUpdate.dateReturned,
        palayQuantitySentKg: millingProcessUpdate.palayQuantitySentKg,
        riceQuantityReturnedKg: millingProcessUpdate.riceQuantityReturnedKg,
        millingEfficiency: millingProcessUpdate.millingEfficiency
    });

    const millingProcess = await getMillingProcess(millingProcessUpdate.id);

    if (millingProcess === null) {
        throw new Error(`updateMillingProcess: failed for id ${millingProcessUpdate.id}`);
    }

    return millingProcess;
}
