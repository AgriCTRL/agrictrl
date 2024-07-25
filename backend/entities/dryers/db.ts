import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dryer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    capacity: number;

    @Column()
    location: string;

    @Column()
    contactInfo: string;

    @Column()
    status: string;
}

export type DryerCreate = Pick<Dryer, 'name' | 'capacity' | 'location' | 'contactInfo' | 'status'>;
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

    dryer.name = dryerCreate.name;
    dryer.capacity = dryerCreate.capacity;
    dryer.location = dryerCreate.location;
    dryer.contactInfo = dryerCreate.contactInfo;
    dryer.status = dryerCreate.status;

    return await dryer.save();
}

export async function updateDryer(dryerUpdate: DryerUpdate): Promise<Dryer> {
    await Dryer.update(dryerUpdate.id, {
        name: dryerUpdate.name,
        capacity: dryerUpdate.capacity,
        location: dryerUpdate.location,
        contactInfo: dryerUpdate.contactInfo,
        status: dryerUpdate.status
    });

    const dryer = await getDryer(dryerUpdate.id);

    if (dryer === null) {
        throw new Error(`updateDryer: failed for id ${dryerUpdate.id}`);
    }

    return dryer;
}

export async function deleteDryer(id: number): Promise<number> {
    const deleteResult = await Dryer.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteDryer: could not delete dryer with id ${id}`);
    }

    return id;
}
