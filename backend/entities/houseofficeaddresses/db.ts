import { BaseEntity, Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class HouseOfficeAddress extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    region?: string;

    @Column()
    province?: string;

    @Column()
    cityTown?: string;

    @Column()
    barangay?: string;

    @Column()
    street?: string;

    @BeforeInsert()
    async generateId() {
        const prefix = '030413';
        const lastOrder = await HouseOfficeAddress.find({
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

export type HouseOfficeAddressCreate = Pick<HouseOfficeAddress, 'region' | 'province' | 'cityTown' | 'barangay' | 'street'>;
export type HouseOfficeAddressUpdate = Pick<HouseOfficeAddress, 'id'> & Partial<HouseOfficeAddressCreate>;

export async function getHouseHouseOfficeAddresses(limit: number, offset: number): Promise<HouseOfficeAddress[]> {
    return await HouseOfficeAddress.find({
        take: limit,
        skip: offset
    });
}

export async function getHouseOfficeAddress(id: string): Promise<HouseOfficeAddress | null> {
    return await HouseOfficeAddress.findOne({
        where: {
            id
        }
    });
}

export async function countHouseHouseOfficeAddresses(): Promise<number> {
    return await HouseOfficeAddress.count();
}

export async function createHouseOfficeAddress(houseOfficeAddressCreate: HouseOfficeAddressCreate): Promise<HouseOfficeAddress> {
    let houseOfficeAddress = new HouseOfficeAddress();

    houseOfficeAddress.region = houseOfficeAddressCreate.region;
    houseOfficeAddress.province = houseOfficeAddressCreate.province;
    houseOfficeAddress.cityTown = houseOfficeAddressCreate.cityTown;
    houseOfficeAddress.barangay = houseOfficeAddressCreate.barangay;
    houseOfficeAddress.street = houseOfficeAddressCreate.street;

    return await houseOfficeAddress.save();
}

export async function updateHouseOfficeAddress(houseOfficeAddressUpdate: HouseOfficeAddressUpdate): Promise<HouseOfficeAddress> {
    await HouseOfficeAddress.update(houseOfficeAddressUpdate.id, {
        region: houseOfficeAddressUpdate.region,
        province: houseOfficeAddressUpdate.province,
        cityTown: houseOfficeAddressUpdate.cityTown,
        barangay: houseOfficeAddressUpdate.barangay,
        street: houseOfficeAddressUpdate.street,
    });

    const houseOfficeAddress = await getHouseOfficeAddress(houseOfficeAddressUpdate.id);

    if (houseOfficeAddress === null) {
        throw new Error(`updateHouseOfficeAddress: failed for id ${houseOfficeAddressUpdate.id}`);
    }

    return houseOfficeAddress;
}
