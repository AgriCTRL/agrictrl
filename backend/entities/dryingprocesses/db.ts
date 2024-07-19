import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class DryingProcess extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    palayBatchId: number;

    @Column()
    type: string;

    @Column()
    dryerId: number;

    @Column()
    dateSent: Date;

    @Column()
    dateReturned: Date;

    @Column()
    palayQuantitySent: number;
    
    @Column()
    palayQuantityReturned: number;

    @Column()
    warehouseId: number;
}

export type DryingProcessCreate = Pick<DryingProcess, 'palayBatchId' | 'type' | 'dryerId' | 'dateSent' | 'dateReturned' | 'palayQuantitySent' | 'palayQuantityReturned' | 'warehouseId' >
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

    dryingProcess.palayBatchId = dryingProcessCreate.palayBatchId;
    dryingProcess.type = dryingProcessCreate.type;
    dryingProcess.dryerId = dryingProcessCreate.dryerId;
    dryingProcess.dateSent = dryingProcessCreate.dateSent;
    dryingProcess.dateReturned = dryingProcessCreate.dateReturned;
    dryingProcess.palayQuantitySent = dryingProcessCreate.palayQuantitySent;
    dryingProcess.palayQuantityReturned = dryingProcessCreate.palayQuantityReturned;
    dryingProcess.warehouseId = dryingProcessCreate.warehouseId;

    return await dryingProcess.save();
}

export async function updateDryingProcess(dryingProcessUpdate: DryingProcessUpdate): Promise<DryingProcess> {
    console.log('dryingProcessUpdate', dryingProcessUpdate);

    await DryingProcess.update(dryingProcessUpdate.id, {
        palayBatchId: dryingProcessUpdate.palayBatchId,
        type: dryingProcessUpdate.type,
        dryerId: dryingProcessUpdate.dryerId,
        dateSent: dryingProcessUpdate.dateSent,
        dateReturned: dryingProcessUpdate.dateReturned,
        palayQuantitySent: dryingProcessUpdate.palayQuantitySent,
        palayQuantityReturned: dryingProcessUpdate.palayQuantityReturned,
        warehouseId: dryingProcessUpdate.warehouseId  
    });

    const dryingProcess = await getDryingProcess(dryingProcessUpdate.id);

    if (dryingProcess === null) {
        throw new Error(`updateDryingProcess: failed for id ${dryingProcessUpdate.id}`);
    }

    return dryingProcess;
}

export async function deleteDryingProcess(id: number): Promise<number> {
    const deleteResult = await DryingProcess.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteDryingProcess: could not delete dryingProcess with id ${id}`);
    }

    return id;
}
