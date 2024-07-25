import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Warehouse extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    facilityName: string;

    @Column()
    capacity: number;

    @Column()
    location: string;

    @Column()
    contactInfo: string;

    @Column()
    status: string;
}

export type WarehouseCreate = Pick<Warehouse, 'facilityName' | 'capacity' | 'location' | 'contactInfo' | 'status'>;
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
    warehouse.capacity = warehouseCreate.capacity;
    warehouse.location = warehouseCreate.location;
    warehouse.contactInfo = warehouseCreate.contactInfo;
    warehouse.status = warehouseCreate.status;

    return await warehouse.save();
}

export async function updateWarehouse(warehouseUpdate: WarehouseUpdate): Promise<Warehouse> {
    await Warehouse.update(warehouseUpdate.id, {
        facilityName: warehouseUpdate.facilityName,
        capacity: warehouseUpdate.capacity,
        location: warehouseUpdate.location,
        contactInfo: warehouseUpdate.contactInfo,
        status: warehouseUpdate.status
    });

    const warehouse = await getWarehouse(warehouseUpdate.id);

    if (warehouse === null) {
        throw new Error(`updateWarehouse: failed for id ${warehouseUpdate.id}`);
    }

    return warehouse;
}

export async function deleteWarehouse(id: number): Promise<number> {
    const deleteResult = await Warehouse.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteWarehouse: could not delete warehouse with id ${id}`);
    }

    return id;
}
