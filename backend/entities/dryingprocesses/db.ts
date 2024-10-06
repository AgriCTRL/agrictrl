import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DryingProcess extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    transactionId: number;

    @Column()
    dryingMethod: string;

    @Column()
    dryerType: string;

    @Column()
    dryerId: number;

    @Column()
    dateSent: Date;

    @Column()
    dateReturned: Date;

    @Column()
    palayQuantitySentKg: number;
    
    @Column()
    palayQuantityReturnedKg: number;
}

export type DryingProcessCreate = Pick<DryingProcess, 'transactionId' | 'dryingMethod' | 'dryerType' | 'dryerId' | 'dateSent' | 'dateReturned' | 'palayQuantitySentKg' | 'palayQuantityReturnedKg' >;
export type DryingProcessUpdate = Pick<DryingProcess, 'id'> & Partial<DryingProcessCreate>;

export async function getDryingProcesses(limit: number, offset: number): Promise<DryingProcess[]> {
    return await DryingProcess.find({
        take: limit,
        skip: offset
    });
}

export async function getDryingProcess(id: number): Promise<DryingProcess | null> {
    return await DryingProcess.findOne({
        where: {
            id
        }
    });
}

export async function countDryingProcesses(): Promise<number> {
    return await DryingProcess.count();
}

export async function createDryingProcess(dryingProcessCreate: DryingProcessCreate): Promise<DryingProcess> {
    let dryingProcess = new DryingProcess();

    dryingProcess.transactionId = dryingProcessCreate.transactionId;
    dryingProcess.dryingMethod = dryingProcessCreate.dryingMethod;
    dryingProcess.dryerType = dryingProcessCreate.dryerType;
    dryingProcess.dryerId = dryingProcessCreate.dryerId;
    dryingProcess.dateSent = dryingProcessCreate.dateSent;
    dryingProcess.dateReturned = dryingProcessCreate.dateReturned;
    dryingProcess.palayQuantitySentKg = dryingProcessCreate.palayQuantitySentKg;
    dryingProcess.palayQuantityReturnedKg = dryingProcessCreate.palayQuantityReturnedKg;

    return await dryingProcess.save();
}

export async function updateDryingProcess(dryingProcessUpdate: DryingProcessUpdate): Promise<DryingProcess> {
    console.log('dryingProcessUpdate', dryingProcessUpdate);

    await DryingProcess.update(dryingProcessUpdate.id, {
        transactionId: dryingProcessUpdate.transactionId,
        dryingMethod: dryingProcessUpdate.dryingMethod,
        dryerType: dryingProcessUpdate.dryerType,
        dryerId: dryingProcessUpdate.dryerId,
        dateSent: dryingProcessUpdate.dateSent,
        dateReturned: dryingProcessUpdate.dateReturned,
        palayQuantitySentKg: dryingProcessUpdate.palayQuantitySentKg,
        palayQuantityReturnedKg: dryingProcessUpdate.palayQuantityReturnedKg
    });

    const dryingProcess = await getDryingProcess(dryingProcessUpdate.id);

    if (dryingProcess === null) {
        throw new Error(`updateDryingProcess: failed for id ${dryingProcessUpdate.id}`);
    }

    return dryingProcess;
}
