import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Miller extends BaseEntity {
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

export type MillerCreate = Pick<Miller, 'name' | 'capacity' | 'location' | 'contactInfo' | 'status'>;
export type MillerUpdate = Pick<Miller, 'id'> & Partial<MillerCreate>;

export async function getMillers(limit: number, offset: number): Promise<Miller[]> {
    return await Miller.find({
        take: limit,
        skip: offset
    });
}

export async function getMiller(id: number): Promise<Miller | null> {
    return await Miller.findOne({
        where: {
            id
        }
    });
}

export async function countMillers(): Promise<number> {
    return await Miller.count();
}

export async function createMiller(millerCreate: MillerCreate): Promise<Miller> {
    let miller = new Miller();

    miller.name = millerCreate.name;
    miller.capacity = millerCreate.capacity;
    miller.location = millerCreate.location;
    miller.contactInfo = millerCreate.contactInfo;
    miller.status = millerCreate.status;

    return await miller.save();
}

export async function updateMiller(millerUpdate: MillerUpdate): Promise<Miller> {
    await Miller.update(millerUpdate.id, {
        name: millerUpdate.name,
        capacity: millerUpdate.capacity,
        location: millerUpdate.location,
        contactInfo: millerUpdate.contactInfo,
        status: millerUpdate.status
    });

    const miller = await getMiller(millerUpdate.id);

    if (miller === null) {
        throw new Error(`updateMiller: failed for id ${millerUpdate.id}`);
    }

    return miller;
}

export async function deleteMiller(id: number): Promise<number> {
    const deleteResult = await Miller.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteMiller: could not delete miller with id ${id}`);
    }

    return id;
}
