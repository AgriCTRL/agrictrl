import initSqlJs, { Database } from 'sql.js/dist/sql-asm.js';
import { DataSource } from 'typeorm';

import { Post } from '../entities/posts/db';
import { User } from '../entities/users/db';
import { NfaPersonnel } from '../entities/nfapersonnels/db';
import { QualitySpec } from '../entities/qualityspecs/db';
import { DeliveryDetail } from '../entities/deliverydetails/db';
import { Supplier } from '../entities/suppliers/db';
import { Warehouse } from '../entities/warehouses/db';
import { Dryer } from '../entities/dryers/db';
import { Miller } from '../entities/millers/db';
import { Recipient } from '../entities/recipients/db';

// TODO figure out migrations
export async function initDb(
    bytes: Uint8Array = Uint8Array.from([])
): Promise<Database> {
    const AppDataSource = new DataSource({
        type: 'sqljs',
        synchronize: true, // TODO we should figure out real migrations for people
        entities: [Post, User, NfaPersonnel, QualitySpec, DeliveryDetail, Supplier, Warehouse, Dryer, Miller, Recipient],
        driver: await initSqlJs({}),
        database: bytes
    });

    const _appDataSource = await AppDataSource.initialize();

    return _appDataSource.driver as unknown as Database;
}
