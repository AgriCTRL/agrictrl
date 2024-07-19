import initSqlJs, { Database } from 'sql.js/dist/sql-asm.js';
import { DataSource } from 'typeorm';

import { Post } from '../entities/posts/db';
import { User } from '../entities/users/db';
import { NfaPersonnel } from '../entities/nfapersonnels/db';
import { QualitySpec } from '../entities/qualityspecs/db';
import { PalayDelivery } from '../entities/palaydeliveries/db';
import { RiceDelivery } from '../entities/ricedeliveries/db';
import { Supplier } from '../entities/suppliers/db';
import { Warehouse } from '../entities/warehouses/db';
import { Dryer } from '../entities/dryers/db';
import { Miller } from '../entities/millers/db';
import { Recipient } from '../entities/recipients/db';
import { PalayBatch } from '../entities/palaybatches/db';
import { RiceBatch } from '../entities/ricebatches/db';
import { DryingProcess } from '../entities/dryingprocesses/db';
import { MillingProcess } from '../entities/millingprocesses/db';

// TODO figure out migrations
export async function initDb(
    bytes: Uint8Array = Uint8Array.from([])
): Promise<Database> {
    const AppDataSource = new DataSource({
        type: 'sqljs',
        synchronize: true, // TODO we should figure out real migrations for people
        entities: [Post, User, NfaPersonnel, QualitySpec, PalayDelivery, RiceDelivery, Supplier, Warehouse, Dryer, Miller, Recipient, PalayBatch, RiceBatch, DryingProcess, MillingProcess ],
        driver: await initSqlJs({}),
        database: bytes
    });

    const _appDataSource = await AppDataSource.initialize();

    return _appDataSource.driver as unknown as Database;
}
