import { BaseEntity, Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class OfficeAddress extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

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
        const prefix = '030471';
        const lastOrder = await OfficeAddress.find({
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

export type OfficeAddressCreate = Pick<OfficeAddress, 'region' | 'province' | 'cityTown' | 'barangay' | 'street'>;
export type OfficeAddressUpdate = Pick<OfficeAddress, 'id'> & Partial<OfficeAddressCreate>;

export async function getOfficeAddresses(limit: number, offset: number): Promise<OfficeAddress[]> {
    return await OfficeAddress.find({
        take: limit,
        skip: offset
    });
}

export async function getOfficeAddress(id: string): Promise<OfficeAddress | null> {
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
