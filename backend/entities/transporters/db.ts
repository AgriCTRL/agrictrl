import { BaseEntity, Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Transporter extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    transporterType: string;

    @Column()
    transporterName: string;

    @Column()
    plateNumber: string;

    @Column()
    description: string;

    @Column()
    status: string;

    @Column()
    userId: string;

    @BeforeInsert()
    async generateId() {
        const prefix = '030432';
        const lastOrder = await Transporter.find({
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

export type TransporterCreate = Pick<Transporter, 'transporterType' | 'transporterName' | 'plateNumber' | 'description' | 'status' | 'userId'>;
export type TransporterUpdate = Pick<Transporter, 'id'> & Partial<TransporterCreate>;

export async function getTransporters(limit: number, offset: number): Promise<Transporter[]> {
    return await Transporter.find({
        take: limit,
        skip: offset
    });
}

export async function getTransportersByUserId(userId: string): Promise<Transporter[]> {
    return await Transporter.find({
        where: { userId }
    });
}

export async function getTransportersByType(transporterType: string): Promise<Transporter[]> {
    return await Transporter.find({
        where: { transporterType }
    });
}

export async function getTransporter(id: string): Promise<Transporter | null> {
    return await Transporter.findOne({
        where: {
            id
        }
    });
}

export async function countTransporters(): Promise<number> {
    return await Transporter.count();
}

export async function createTransporter(transporterCreate: TransporterCreate): Promise<Transporter> {
    let transporter = new Transporter();

    transporter.transporterType = transporterCreate.transporterType;
    transporter.transporterName = transporterCreate.transporterName;
    transporter.plateNumber = transporterCreate.plateNumber;
    transporter.description = transporterCreate.description;
    transporter.status = transporterCreate.status;
    transporter.userId = transporterCreate.userId;

    return await transporter.save();
}

export async function updateTransporter(transporterUpdate: TransporterUpdate): Promise<Transporter> {
    await Transporter.update(transporterUpdate.id, {
        transporterType: transporterUpdate.transporterType,
        transporterName: transporterUpdate.transporterName,
        plateNumber: transporterUpdate.plateNumber,
        description: transporterUpdate.description,
        status: transporterUpdate.status,
        userId: transporterUpdate.userId
    });

    const transporter = await getTransporter(transporterUpdate.id);

    if (transporter === null) {
        throw new Error(`updateTransporter: failed for id ${transporterUpdate.id}`);
    }

    return transporter;
}