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

export async function getTransporters(
    limit: number, 
    offset: number, 
    options?: {
        status?: string;
        transporterType?: string;
        userId?: string;
    }
): Promise<Transporter[]> {
    const queryOptions: any = {
        take: limit,
        skip: offset
    };

    if (options) {
        queryOptions.where = {};

        if (options.status) {
            queryOptions.where.status = options.status;
        }

        if (options.transporterType) {
            queryOptions.where.transporterType = options.transporterType;
        }

        if (options.userId) {
            queryOptions.where.userId = options.userId;
        }
    }

    return await Transporter.find(queryOptions);
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

export async function countTransporters(options?: {
    status?: string;
    transporterType?: string;
    userId?: string;
}): Promise<number> {
    const queryOptions: any = {};

    if (options) {
        queryOptions.where = {};

        if (options.status) {
            queryOptions.where.status = options.status;
        }

        if (options.transporterType) {
            queryOptions.where.transporterType = options.transporterType;
        }

        if (options.userId) {
            queryOptions.where.userId = options.userId;
        }
    }

    return await Transporter.count(queryOptions);
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

