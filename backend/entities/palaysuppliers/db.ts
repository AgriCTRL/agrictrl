import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PalaySupplier extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    farmerName: string;

    @Column()
    farmAddress: string;

    @Column()
    category: string;

    @Column()
    contactNumber: string;

    @Column()
    email: string;
}

export type PalaySupplierCreate = Pick<PalaySupplier, 'farmerName' | 'farmAddress' | 'category' | 'contactNumber' | 'email'>;
export type PalaySupplierUpdate = Pick<PalaySupplier, 'id'> & Partial<PalaySupplierCreate>;

export async function getPalaySuppliers(limit: number, offset: number): Promise<PalaySupplier[]> {
    return await PalaySupplier.find({
        take: limit,
        skip: offset
    });
}

export async function getPalaySupplier(id: number): Promise<PalaySupplier | null> {
    return await PalaySupplier.findOne({
        where: {
            id
        }
    });
}

export async function countPalaySuppliers(): Promise<number> {
    return await PalaySupplier.count();
}

export async function createPalaySupplier(palaySupplierCreate: PalaySupplierCreate): Promise<PalaySupplier> {
    let palaySupplier = new PalaySupplier();

    palaySupplier.farmerName = palaySupplierCreate.farmerName;
    palaySupplier.farmAddress = palaySupplierCreate.farmAddress;
    palaySupplier.category = palaySupplierCreate.category;
    palaySupplier.contactNumber = palaySupplierCreate.contactNumber;
    palaySupplier.email = palaySupplierCreate.email;

    return await palaySupplier.save();
}

export async function updatePalaySupplier(palaySupplierUpdate: PalaySupplierUpdate): Promise<PalaySupplier> {
    await PalaySupplier.update(palaySupplierUpdate.id, {
        farmerName: palaySupplierUpdate.farmerName,
        farmAddress: palaySupplierUpdate.farmAddress,
        category: palaySupplierUpdate.category,
        contactNumber: palaySupplierUpdate.contactNumber,
        email: palaySupplierUpdate.email,
    });

    const palaySupplier = await getPalaySupplier(palaySupplierUpdate.id);

    if (palaySupplier === null) {
        throw new Error(`updatePalaySupplier: failed for id ${palaySupplierUpdate.id}`);
    }

    return palaySupplier;
}
