import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Supplier extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    contactNo: number;

    @Column()
    email: string;

    @Column()
    location: string;
}

export type SupplierCreate = Pick<Supplier, 'name' | 'type' | 'contactNo' | 'email' | 'location'>;
export type SupplierUpdate = Pick<Supplier, 'id'> & Partial<SupplierCreate>;

export async function getSuppliers(limit: number, offset: number): Promise<Supplier[]> {
    return await Supplier.find({
        take: limit,
        skip: offset
    });
}

export async function getSupplier(id: number): Promise<Supplier | null> {
    return await Supplier.findOne({
        where: {
            id
        }
    });
}

export async function countSuppliers(): Promise<number> {
    return await Supplier.count();
}

export async function createSupplier(supplierCreate: SupplierCreate): Promise<Supplier> {
    let supplier = new Supplier();

    supplier.name = supplierCreate.name;
    supplier.type = supplierCreate.type;
    supplier.contactNo = supplierCreate.contactNo;
    supplier.email = supplierCreate.email;
    supplier.location = supplierCreate.location;

    return await supplier.save();
}

export async function updateSupplier(supplierUpdate: SupplierUpdate): Promise<Supplier> {
    await Supplier.update(supplierUpdate.id, {
        name: supplierUpdate.name,
        type: supplierUpdate.type,
        contactNo: supplierUpdate.contactNo,
        email: supplierUpdate.email,
        location: supplierUpdate.location
    });

    const supplier = await getSupplier(supplierUpdate.id);

    if (supplier === null) {
        throw new Error(`updateSupplier: failed for id ${supplierUpdate.id}`);
    }

    return supplier;
}

export async function deleteSupplier(id: number): Promise<number> {
    const deleteResult = await Supplier.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteSupplier: could not delete supplier with id ${id}`);
    }

    return id;
}
