import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OfficeAddress extends BaseEntity {
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

export type OfficeAddressCreate = Pick<OfficeAddress, 'region' | 'province' | 'cityTown' | 'barangay' | 'street'>;
export type OfficeAddressUpdate = Pick<OfficeAddress, 'id'> & Partial<OfficeAddressCreate>;

export async function getOfficeAddresses(limit: number, offset: number): Promise<OfficeAddress[]> {
    return await OfficeAddress.find({
        take: limit,
        skip: offset
    });
}

export async function getOfficeAddress(id: number): Promise<OfficeAddress | null> {
    return await OfficeAddress.findOne({
        where: {
            id
        }
    });
}

export async function countOfficeAddresses(): Promise<number> {
    return await OfficeAddress.count();
}

export async function createOfficeAddress(officeAddressCreate: OfficeAddressCreate): Promise<OfficeAddress> {
    let officeAddress = new OfficeAddress();

    officeAddress.region = officeAddressCreate.region;
    officeAddress.province = officeAddressCreate.province;
    officeAddress.cityTown = officeAddressCreate.cityTown;
    officeAddress.barangay = officeAddressCreate.barangay;
    officeAddress.street = officeAddressCreate.street;

    return await officeAddress.save();
}

export async function updateOfficeAddress(officeAddressUpdate: OfficeAddressUpdate): Promise<OfficeAddress> {
    await OfficeAddress.update(officeAddressUpdate.id, {
        region: officeAddressUpdate.region,
        province: officeAddressUpdate.province,
        cityTown: officeAddressUpdate.cityTown,
        barangay: officeAddressUpdate.barangay,
        street: officeAddressUpdate.street,
    });

    const officeAddress = await getOfficeAddress(officeAddressUpdate.id);

    if (officeAddress === null) {
        throw new Error(`updateOfficeAddress: failed for id ${officeAddressUpdate.id}`);
    }

    return officeAddress;
}
