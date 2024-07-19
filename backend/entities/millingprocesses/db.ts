import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class MillingProcess extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    palayBatchId: number;

    @Column()
    type: string;

    @Column()
    millerId: number;

    @Column()
    dateSent: Date;

    @Column()
    dateReturned: Date;

    @Column()
    palayQuantitySent: number;
    
    @Column()
    palayQuantityReturned: number;

    @Column()
    efficiency: number;

    @Column()
    warehouseId: number;
}

export type MillingProcessCreate = Pick<MillingProcess, 'palayBatchId' | 'type' | 'millerId' | 'dateSent' | 'dateReturned' | 'palayQuantitySent' | 'palayQuantityReturned' | 'efficiency' | 'warehouseId' >
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

    millingProcess.palayBatchId = millingProcessCreate.palayBatchId;
    millingProcess.type = millingProcessCreate.type;
    millingProcess.millerId = millingProcessCreate.millerId;
    millingProcess.dateSent = millingProcessCreate.dateSent;
    millingProcess.dateReturned = millingProcessCreate.dateReturned;
    millingProcess.palayQuantitySent = millingProcessCreate.palayQuantitySent;
    millingProcess.palayQuantityReturned = millingProcessCreate.palayQuantityReturned;
    millingProcess.efficiency = millingProcessCreate.efficiency;
    millingProcess.warehouseId = millingProcessCreate.warehouseId;

    return await millingProcess.save();
}

export async function updateMillingProcess(millingProcessUpdate: MillingProcessUpdate): Promise<MillingProcess> {
    console.log('millingProcessUpdate', millingProcessUpdate);

    await MillingProcess.update(millingProcessUpdate.id, {
        palayBatchId: millingProcessUpdate.palayBatchId,
        type: millingProcessUpdate.type,
        millerId: millingProcessUpdate.millerId,
        dateSent: millingProcessUpdate.dateSent,
        dateReturned: millingProcessUpdate.dateReturned,
        palayQuantitySent: millingProcessUpdate.palayQuantitySent,
        palayQuantityReturned: millingProcessUpdate.palayQuantityReturned,
        efficiency: millingProcessUpdate.efficiency,
        warehouseId: millingProcessUpdate.warehouseId
    });

    const millingProcess = await getMillingProcess(millingProcessUpdate.id);

    if (millingProcess === null) {
        throw new Error(`updateMillingProcess: failed for id ${millingProcessUpdate.id}`);
    }

    return millingProcess;
}

export async function deleteMillingProcess(id: number): Promise<number> {
    const deleteResult = await MillingProcess.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteMillingProcess: could not delete millingProcess with id ${id}`);
    }

    return id;
}
