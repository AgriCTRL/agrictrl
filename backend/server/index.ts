import express from 'express';
import cors from 'cors';

import { getRouter as getRouterUsers } from '../entities/users/router';
import { getRouter as getRouterQualitySpecs } from '../entities/qualityspecs/router';
import { getRouter as getRouterWarehouses } from '../entities/warehouses/router';
import { getRouter as getRouterDryers } from '../entities/dryers/router';
import { getRouter as getRouterMillers } from '../entities/millers/router';
import { getRouter as getRouterPalayBatches } from '../entities/palaybatches/router';
import { getRouter as getRouterRiceBatches } from '../entities/ricebatches/router';
import { getRouter as getRouterDryingProcess } from '../entities/dryingprocesses/router';
import { getRouter as getRouterMillingProcess } from '../entities/millingprocesses/router';
import { getRouter as getRouterOfficeAddress } from '../entities/officeaddresses/router';
import { getRouter as getRouterPalaySupplier} from '../entities/palaysuppliers/router';
import { getRouter as getRouterRiceOrder} from '../entities/riceorders/router';
import { getRouter as getRouterBuyingStation} from '../entities/buyingstations/router';
import { getRouter as getRouterTransaction} from '../entities/transactions/router';
import { getRouter as getRouterFarm } from '../entities/farms/router';
import { getRouter as getRouterHouseOfficeAddress } from '../entities/houseofficeaddresses/router';
import { getRouter as getRouterTransporters } from '../entities/transporters/router';


// TODO make this function's return type explicit https://github.com/demergent-labs/azle/issues/1860
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function initServer() {
    let app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/users', getRouterUsers());
    app.use('/qualityspecs', getRouterQualitySpecs());
    app.use('/warehouses', getRouterWarehouses());
    app.use('/dryers', getRouterDryers());
    app.use('/millers', getRouterMillers());
    app.use('/palaybatches', getRouterPalayBatches());
    app.use('/ricebatches', getRouterRiceBatches());
    app.use('/dryingprocesses', getRouterDryingProcess());
    app.use('/millingprocesses', getRouterMillingProcess());
    app.use('/officeaddresses', getRouterOfficeAddress());
    app.use('/palaysuppliers', getRouterPalaySupplier());
    app.use('/riceorders', getRouterRiceOrder());
    app.use('/buyingstations', getRouterBuyingStation());
    app.use('/transactions', getRouterTransaction());
    app.use('/farms', getRouterFarm());
    app.use('/houseofficeaddresses', getRouterHouseOfficeAddress());
    app.use('/transporters', getRouterTransporters());


    app.get('/init-called', (_req, res) => {
        res.json(globalThis._azleInitCalled);
    });

    app.get('/post-upgrade-called', (_req, res) => {
        res.json(globalThis._azlePostUpgradeCalled);
    });

    return app.listen();
}
