import express from 'express';
import cors from 'cors';
import { apiKeyAuth, requireAuth } from '../middleware/auth';

import { getRouter as getRouterUsers } from '../entities/users/router';
import { getRouter as getRouterQualitySpecs } from '../entities/qualityspecs/router';
import { getRouter as getRouterWarehouses } from '../entities/warehouses/router';
import { getRouter as getRouterDryers } from '../entities/dryers/router';
import { getRouter as getRouterMillers } from '../entities/millers/router';
import { getRouter as getRouterPalayBatches } from '../entities/palaybatches/router';
import { getRouter as getRouterRiceBatches } from '../entities/ricebatches/router';
import { getRouter as getRouterDryingBatches } from '../entities/dryingbatches/router';
import { getRouter as getRouterMillingBatches } from '../entities/millingbatches/router';
import { getRouter as getRouterOfficeAddress } from '../entities/officeaddresses/router';
import { getRouter as getRouterPalaySupplier} from '../entities/palaysuppliers/router';
import { getRouter as getRouterRiceOrder} from '../entities/riceorders/router';
import { getRouter as getRouterTransaction} from '../entities/transactions/router';
import { getRouter as getRouterFarm } from '../entities/farms/router';
import { getRouter as getRouterHouseOfficeAddress } from '../entities/houseofficeaddresses/router';
import { getRouter as getRouterRiceMillingBatches } from '../entities/ricemillingbatches/router';
import { getRouter as getRouterInventory } from '../entities/inventory/router';



// TODO make this function's return type explicit https://github.com/demergent-labs/azle/issues/1860
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function initServer() {
    let app = express();

    app.use(cors());
    app.use(express.json());

    app.use(apiKeyAuth);

    app.use('/users', requireAuth, getRouterUsers());
    app.use('/qualityspecs', requireAuth, getRouterQualitySpecs());
    app.use('/warehouses', requireAuth, getRouterWarehouses());
    app.use('/dryers', requireAuth, getRouterDryers());
    app.use('/millers', requireAuth, getRouterMillers());
    app.use('/palaybatches', requireAuth, getRouterPalayBatches());
    app.use('/ricebatches', requireAuth, getRouterRiceBatches());
    app.use('/dryingbatches', requireAuth, getRouterDryingBatches());
    app.use('/millingbatches', requireAuth, getRouterMillingBatches());
    app.use('/officeaddresses', requireAuth, getRouterOfficeAddress());
    app.use('/palaysuppliers', requireAuth, getRouterPalaySupplier());
    app.use('/riceorders', requireAuth, getRouterRiceOrder());
    app.use('/transactions', requireAuth, getRouterTransaction());
    app.use('/farms', requireAuth, getRouterFarm());
    app.use('/houseofficeaddresses', requireAuth, getRouterHouseOfficeAddress());
    app.use('/ricemillingbatches', requireAuth, getRouterRiceMillingBatches());
    app.use('/inventory', requireAuth, getRouterInventory());


    app.get('/init-called', (_req, res) => {
        res.json(globalThis._azleInitCalled);
    });

    app.get('/post-upgrade-called', (_req, res) => {
        res.json(globalThis._azlePostUpgradeCalled);
    });

    return app.listen();
}
