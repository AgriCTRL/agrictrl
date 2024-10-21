import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dryer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dryerName: string;

    @Column()
    userId: number;

    @Column()
    location: string;

    @Column()
    capacity: number;

    @Column()
    processing: number;

    @Column()
    contactNumber: string;

    @Column()
    email: string;

    @Column()
    status: string;
}

export type DryerCreate = Pick<Dryer, 'dryerName' | 'userId' | 'location' | 'capacity' | 'processing' | 'contactNumber' | 'email' | 'status'>;
export type DryerUpdate = Pick<Dryer, 'id'> & Partial<DryerCreate>;

export async function getDryers(limit: number, offset: number): Promise<Dryer[]> {
    return await Dryer.find({
        take: limit,
        skip: offset
    });
}

export async function getDryer(id: number): Promise<Dryer | null> {
    return await Dryer.findOne({
        where: {
            id
        }
    });
}

export async function countDryers(): Promise<number> {
    return await Dryer.count();
}

export async function createDryer(dryerCreate: DryerCreate): Promise<Dryer> {
    let dryer = new Dryer();

    dryer.dryerName = dryerCreate.dryerName;
    dryer.userId = dryerCreate.userId;
    dryer.location = dryerCreate.location;
    dryer.capacity = dryerCreate.capacity;
    dryer.processing = dryerCreate.processing;
    dryer.contactNumber = dryerCreate.contactNumber;
    dryer.email = dryerCreate.email;
    dryer.status = dryerCreate.status;

    return await dryer.save();
}

export async function updateDryer(dryerUpdate: DryerUpdate): Promise<Dryer> {
    await Dryer.update(dryerUpdate.id, {
        dryerName: dryerUpdate.dryerName,
        userId: dryerUpdate.userId,
        location: dryerUpdate.location,
        capacity: dryerUpdate.capacity,
        processing: dryerUpdate.processing,
        contactNumber: dryerUpdate.contactNumber,
        email: dryerUpdate.email,
        status: dryerUpdate.status
    });

    const dryer = await getDryer(dryerUpdate.id);

    if (dryer === null) {
        throw new Error(`updateDryer: failed for id ${dryerUpdate.id}`);
    }

    return dryer;
}
