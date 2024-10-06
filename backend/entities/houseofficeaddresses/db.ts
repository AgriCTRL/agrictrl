import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HouseOfficeAddress extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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
}

export type HouseOfficeAddressCreate = Pick<HouseOfficeAddress, 'region' | 'province' | 'cityTown' | 'barangay' | 'street'>;
export type HouseOfficeAddressUpdate = Pick<HouseOfficeAddress, 'id'> & Partial<HouseOfficeAddressCreate>;

export async function getHouseHouseOfficeAddresses(limit: number, offset: number): Promise<HouseOfficeAddress[]> {
    return await HouseOfficeAddress.find({
        take: limit,
        skip: offset
    });
}

export async function getHouseOfficeAddress(id: number): Promise<HouseOfficeAddress | null> {
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
