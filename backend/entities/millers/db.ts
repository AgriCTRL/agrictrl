import { BaseEntity, Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Miller extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    millerName: string;

    @Column()
    userId: string;

    @Column()
    category: string;

    @Column()
    type: string;

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

    @BeforeInsert()
    async generateId() {
        const prefix = '030431';
        const lastOrder = await Miller.find({
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

export type MillerCreate = Pick<Miller, 'millerName' | 'userId' | 'category' | 'type' | 'location' | 'capacity' | 'processing' | 'contactNumber' | 'email' | 'status'>;
export type MillerUpdate = Pick<Miller, 'id'> & Partial<MillerCreate>;

export async function getMillers(limit: number, offset: number): Promise<Miller[]> {
    return await Miller.find({
        take: limit,
        skip: offset
    });
}

export async function getMiller(id: string): Promise<Miller | null> {
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
    miller.type = millerCreate.type;
    miller.location = millerCreate.location;
    miller.capacity = millerCreate.capacity;
    miller.processing = millerCreate.processing;
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
        type: millerUpdate.type,
        location: millerUpdate.location,
        capacity: millerUpdate.capacity,
        processing: millerUpdate.processing,
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
