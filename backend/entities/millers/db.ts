import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Miller extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    millerName: string;

    @Column()
    userId: number;

    @Column()
    category: string;

    @Column()
    location: string;

    @Column()
    capacity: number;

    @Column()
    contactNumber: string;

    @Column()
    email: string;

    @Column()
    status: string;
}

export type MillerCreate = Pick<Miller, 'millerName' | 'userId' | 'category' | 'location' | 'capacity' | 'contactNumber' | 'email' | 'status'>;
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

    miller.millerName = millerCreate.millerName;
    miller.userId = millerCreate.userId;
    miller.category = millerCreate.category;
    miller.location = millerCreate.location;
    miller.capacity = millerCreate.capacity;
    miller.contactNumber = millerCreate.contactNumber;
    miller.email = millerCreate.email;
    miller.status = millerCreate.status;

    return await miller.save();
}

export async function updateMiller(millerUpdate: MillerUpdate): Promise<Miller> {
    await Miller.update(millerUpdate.id, {
        millerName: millerUpdate.millerName,
        userId: millerUpdate.userId,
        category: millerUpdate.category,
        location: millerUpdate.location,
        capacity: millerUpdate.capacity,
        contactNumber: millerUpdate.contactNumber,
        email: millerUpdate.email,
        status: millerUpdate.status
    });

    const miller = await getMiller(millerUpdate.id);

    if (miller === null) {
        throw new Error(`updateMiller: failed for id ${millerUpdate.id}`);
    }

    return miller;
}
