import { 
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
    BeforeInsert
} from 'typeorm';

import { getHouseOfficeAddress, HouseOfficeAddress } from '../houseofficeaddresses/db';

@Entity()
export class PalaySupplier extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    farmerName?: string;

    @Column()
    houseOfficeAddressId: string;

    @ManyToOne(() => HouseOfficeAddress)
    houseOfficeAddress: HouseOfficeAddress;

    @Column()
    category?: string;

    @Column({ nullable: true })
    numOfFarmer?: number;

    @Column()
    contactNumber?: string;

    @Column()
    email?: string;

    @Column({ nullable: true })
    birthDate?: Date;

    @Column({ nullable: true })
    gender?: string;

    @BeforeInsert()
    async generateId() {
        const prefix = '030412';
        const lastOrder = await PalaySupplier.find({
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

export type PalaySupplierCreate = Pick<PalaySupplier, 'farmerName' | 'houseOfficeAddressId' | 'category' | 'numOfFarmer' | 'contactNumber' | 'email' | 'birthDate' | 'gender'>;
export type PalaySupplierUpdate = Pick<PalaySupplier, 'id'> & Partial<PalaySupplierCreate>;

export async function getPalaySuppliers(limit: number, offset: number): Promise<PalaySupplier[]> {
    return await PalaySupplier.find({
        take: limit,
        skip: offset,
        relations: {
            houseOfficeAddress: true
        }
    });
}

export async function getPalaySupplier(id: string): Promise<PalaySupplier | null> {
    return await PalaySupplier.findOne({
        where: {
            id
        },
        relations: {
            houseOfficeAddress: true
        }
    });
}

export async function countPalaySuppliers(): Promise<number> {
    return await PalaySupplier.count();
}

export async function createPalaySupplier(palaySupplierCreate: PalaySupplierCreate): Promise<PalaySupplier> {
    let palaySupplier = new PalaySupplier();

    palaySupplier.farmerName = palaySupplierCreate.farmerName;
    
    // officeAddress

    const houseOfficeAddress = await getHouseOfficeAddress(palaySupplierCreate.houseOfficeAddressId);

    if (houseOfficeAddress === null) {
        throw new Error(``);
    }

    palaySupplier.houseOfficeAddressId = houseOfficeAddress.id;

    palaySupplier.category = palaySupplierCreate.category;
    palaySupplier.numOfFarmer = palaySupplierCreate.numOfFarmer;
    palaySupplier.contactNumber = palaySupplierCreate.contactNumber;
    palaySupplier.email = palaySupplierCreate.email;
    palaySupplier.birthDate = palaySupplierCreate.birthDate;
    palaySupplier.gender = palaySupplierCreate.gender;

    return await palaySupplier.save();
}

export async function updatePalaySupplier(palaySupplierUpdate: PalaySupplierUpdate): Promise<PalaySupplier> {
    await PalaySupplier.update(palaySupplierUpdate.id, {
        farmerName: palaySupplierUpdate.farmerName,
        category: palaySupplierUpdate.category,
        numOfFarmer: palaySupplierUpdate.numOfFarmer,
        contactNumber: palaySupplierUpdate.contactNumber,
        email: palaySupplierUpdate.email,
        birthDate: palaySupplierUpdate.birthDate,
        gender: palaySupplierUpdate.gender
    });

    const palaySupplier = await getPalaySupplier(palaySupplierUpdate.id);

    if (palaySupplier === null) {
        throw new Error(`updatePalaySupplier: failed for id ${palaySupplierUpdate.id}`);
    }

    return palaySupplier;
}
