import initSqlJs, { Database } from 'sql.js/dist/sql-asm.js';
import { DataSource } from 'typeorm';

import { User } from '../entities/users/db';
import { QualitySpec } from '../entities/qualityspecs/db';
import { Warehouse } from '../entities/warehouses/db';
import { Dryer } from '../entities/dryers/db';
import { Miller } from '../entities/millers/db';
import { PalayBatch } from '../entities/palaybatches/db';
import { RiceBatch } from '../entities/ricebatches/db';
import { DryingProcess } from '../entities/dryingprocesses/db';
import { MillingProcess } from '../entities/millingprocesses/db';
import { OfficeAddress } from '../entities/officeaddresses/db';
import { PalaySupplier } from '../entities/palaysuppliers/db';
import { RiceOrder } from '../entities/riceorders/db';
import { BuyingStation } from '../entities/buyingstations/db';
import { Transaction } from '../entities/transactions/db';
import { Farm } from '../entities/farms/db';
import { HouseOfficeAddress } from '../entities/houseofficeaddresses/db';
import { Transporter } from '../entities/transporters/db';

// TODO figure out migrations
export async function initDb(
    bytes: Uint8Array = Uint8Array.from([])
): Promise<Database> {
    const AppDataSource = new DataSource({
        type: 'sqljs',
        synchronize: true, // TODO we should figure out real migrations for people
        entities: [ User, QualitySpec, Warehouse, Dryer, Miller, PalayBatch, RiceBatch, DryingProcess, MillingProcess, OfficeAddress, PalaySupplier, RiceOrder, BuyingStation, Transaction, Farm, HouseOfficeAddress, Transporter ],
        driver: await initSqlJs({}),
        database: bytes
    });

    const _appDataSource = await AppDataSource.initialize();

    return _appDataSource.driver as unknown as Database;
}
