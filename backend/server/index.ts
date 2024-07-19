import express from 'express';
import cors from 'cors';

import { getRouter as getRouterPosts } from '../entities/posts/router';
import { getRouter as getRouterUsers } from '../entities/users/router';
import { getRouter as getRouterNfaPersonnels } from '../entities/nfapersonnels/router';
import { getRouter as getRouterQualitySpecs } from '../entities/qualityspecs/router';
import { getRouter as getRouterDeliveryDetails } from '../entities/deliverydetails/router';
import { getRouter as getRouterSuppliers } from '../entities/suppliers/router';
import { getRouter as getRouterWarehouses } from '../entities/warehouses/router';
import { getRouter as getRouterDryers } from '../entities/dryers/router';
import { getRouter as getRouterMillers } from '../entities/millers/router';
import { getRouter as getRouterRecipients } from '../entities/recipients/router';
import { getRouter as getRouterPalayBatches } from '../entities/palaybatches/router';


// TODO make this function's return type explicit https://github.com/demergent-labs/azle/issues/1860
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function initServer() {
    let app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/users', getRouterUsers());
    app.use('/posts', getRouterPosts());
    app.use('/nfapersonnels', getRouterNfaPersonnels());
    app.use('/qualityspecs', getRouterQualitySpecs());
    app.use('/deliverydetails', getRouterDeliveryDetails());
    app.use('/suppliers', getRouterSuppliers());
    app.use('/warehouses', getRouterWarehouses());
    app.use('/dryers', getRouterDryers());
    app.use('/millers', getRouterMillers());
    app.use('/recipients', getRouterRecipients());
    app.use('/palaybatches', getRouterPalayBatches());



    app.get('/init-called', (_req, res) => {
        res.json(globalThis._azleInitCalled);
    });

    app.get('/post-upgrade-called', (_req, res) => {
        res.json(globalThis._azlePostUpgradeCalled);
    });

    return app.listen();
}
