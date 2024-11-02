import { BaseEntity, Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Farm extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    palaySupplierId: string;

    @Column()
    farmSize: number;

    @Column()
    region: string;

    @Column()
    province: string;

    @Column()
    cityTown: string;

    @Column()
    barangay: string;

    @Column()
    street: string;

    @BeforeInsert()
    async generateId() {
        const prefix = '030414';
        const lastOrder = await Farm.find({
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

export type FarmCreate = Pick<Farm, 'palaySupplierId' | 'farmSize' | 'region' | 'province' | 'cityTown' | 'barangay' | 'street'>;
export type FarmUpdate = Pick<Farm, 'id'> & Partial<FarmCreate>;

export async function getFarms(limit: number, offset: number): Promise<Farm[]> {
    return await Farm.find({
        take: limit,
        skip: offset
    });
}

export async function getFarm(id: string): Promise<Farm | null> {
    return await Farm.findOne({
        where: {
            id
        }
    });
}

export async function countFarms(): Promise<number> {
    return await Farm.count();
}

export async function createFarm(farmCreate: FarmCreate): Promise<Farm> {
    let farm = new Farm();

    farm.palaySupplierId = farmCreate.palaySupplierId;
    farm.farmSize = farmCreate.farmSize;
    farm.region = farmCreate.region;
    farm.province = farmCreate.province;
    farm.cityTown = farmCreate.cityTown;
    farm.barangay = farmCreate.barangay;
    farm.street = farmCreate.street;

    return await farm.save();
}

export async function updateFarm(farmUpdate: FarmUpdate): Promise<Farm> {
    await Farm.update(farmUpdate.id, {
        palaySupplierId: farmUpdate.palaySupplierId,
        farmSize: farmUpdate.farmSize,
        region: farmUpdate.region,
        province: farmUpdate.province,
        cityTown: farmUpdate.cityTown,
        barangay: farmUpdate.barangay,
        street: farmUpdate.street
    });

    const farm = await getFarm(farmUpdate.id);

    if (farm === null) {
        throw new Error(`updateFarm: failed for id ${farmUpdate.id}`);
    }

    return farm;
}
