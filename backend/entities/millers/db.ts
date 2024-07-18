import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Miller extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column()
    capacity: number;

    @Column()
    contactNo: number;

    @Column()
    email: string;
}

export type MillerCreate = Pick<Miller, 'name' | 'location' | 'capacity' | 'contactNo' | 'email'>;
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
    miller.location = millerCreate.location;
    miller.capacity = millerCreate.capacity;
    miller.contactNo = millerCreate.contactNo;
    miller.email = millerCreate.email;

    return await miller.save();
}

export async function updateMiller(millerUpdate: MillerUpdate): Promise<Miller> {
    await Miller.update(millerUpdate.id, {
        name: millerUpdate.name,
        location: millerUpdate.location,
        capacity: millerUpdate.capacity,
        contactNo: millerUpdate.contactNo,
        email: millerUpdate.email
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
