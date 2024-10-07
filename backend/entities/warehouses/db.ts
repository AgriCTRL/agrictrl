import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Warehouse extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    facilityName: string;

    @Column()
    nfaBranch: string;

    @Column()
    location: string;

    @Column()
    totalCapacity: number;

    @Column()
    currentStock: number;

    @Column()
    contactNumber: string;

    @Column()
    email: string;

    @Column()
    status: string;
}

export type WarehouseCreate = Pick<Warehouse, 'facilityName' | 'nfaBranch' | 'location' | 'totalCapacity' | 'currentStock' | 'contactNumber' | 'email' | 'status'>;
export type WarehouseUpdate = Pick<Warehouse, 'id'> & Partial<WarehouseCreate>;

export async function getWarehouses(limit: number, offset: number): Promise<Warehouse[]> {
    return await Warehouse.find({
        take: limit,
        skip: offset
    });
}

export async function getWarehouse(id: number): Promise<Warehouse | null> {
    return await Warehouse.findOne({
        where: {
            id
        }
    });
}

export async function countWarehouses(): Promise<number> {
    return await Warehouse.count();
}

export async function createWarehouse(warehouseCreate: WarehouseCreate): Promise<Warehouse> {
    let warehouse = new Warehouse();

    warehouse.facilityName = warehouseCreate.facilityName;
    warehouse.nfaBranch = warehouseCreate.nfaBranch;
    warehouse.location = warehouseCreate.location;
    warehouse.totalCapacity = warehouseCreate.totalCapacity;
    warehouse.currentStock = warehouseCreate.currentStock;
    warehouse.contactNumber = warehouseCreate.contactNumber;
    warehouse.email = warehouseCreate.email;
    warehouse.status = warehouseCreate.status;

    return await warehouse.save();
}

export async function updateWarehouse(warehouseUpdate: WarehouseUpdate): Promise<Warehouse> {
    await Warehouse.update(warehouseUpdate.id, {
        facilityName: warehouseUpdate.facilityName,
        nfaBranch: warehouseUpdate.nfaBranch,
        location: warehouseUpdate.location,
        totalCapacity: warehouseUpdate.totalCapacity,
        currentStock: warehouseUpdate.currentStock,
        contactNumber: warehouseUpdate.contactNumber,
        email: warehouseUpdate.email,
        status: warehouseUpdate.status
    });

    const warehouse = await getWarehouse(warehouseUpdate.id);

    if (warehouse === null) {
        throw new Error(`updateWarehouse: failed for id ${warehouseUpdate.id}`);
    }

    return warehouse;
}
