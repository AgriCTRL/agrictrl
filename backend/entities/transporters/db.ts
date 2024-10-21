import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transporter extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    transporterName: string;

    @Column({ nullable: true })
    description: string;
}

export type TransporterCreate = Pick<Transporter, 'transporterName' | 'description' >;
export type TransporterUpdate = Pick<Transporter, 'id'> & Partial<TransporterCreate>;

export async function getTransporters(limit: number, offset: number): Promise<Transporter[]> {
    return await Transporter.find({
        take: limit,
        skip: offset
    });
}

export async function getTransporter(id: number): Promise<Transporter | null> {
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

    transporter.transporterName = transporterCreate.transporterName;
    transporter.description = transporterCreate.description;

    return await transporter.save();
}

export async function updateTransporter(transporterUpdate: TransporterUpdate): Promise<Transporter> {
    await Transporter.update(transporterUpdate.id, {
        transporterName: transporterUpdate.transporterName,
        description: transporterUpdate.description
    });

    const transporter = await getTransporter(transporterUpdate.id);

    if (transporter === null) {
        throw new Error(`updateTransporter: failed for id ${transporterUpdate.id}`);
    }

    return transporter;
}
