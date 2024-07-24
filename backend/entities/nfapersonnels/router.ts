import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countNfaPersonnels,
    createNfaPersonnel,
    deleteNfaPersonnel,
    getNfaPersonnel,
    getNfaPersonnels,
    getPrincipal,
    updateNfaPersonnel
} from './db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/',
        async (
            req: Request<any, any, any, { limit?: string; offset?: string }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);

            const nfaPersonnels = await getNfaPersonnels(limit, offset);

            res.json(nfaPersonnels);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countNfaPersonnels());
    });

    router.get('/id/:id', async (req, res) => {
        const { id } = req.params;

        const nfaPersonnel = await getNfaPersonnel(Number(id));

        res.json(nfaPersonnel);
    });

    router.get('/principal/:principal', async (req, res) => {
        const { principal } = req.params;

        const nfaPersonnel = await getPrincipal(principal);

        res.json(nfaPersonnel);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { principal: string; firstName: string; lastName: string; position: string; region: string }>,
            res
        ) => {
            const { principal, firstName, lastName, position, region } = req.body;

            const nfaPersonnel = await createNfaPersonnel({
                principal,
                firstName,
                lastName,
                position,
                region
            });

            res.json(nfaPersonnel);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         await createNfaPersonnel({
    //             name: `lastmjs${v4()}`,
    //             position: i
    //         });
    //     }

    //     res.json({
    //         Success: `${num} nfaPersonnel created`
    //     });
    // });

    router.put('/', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteNfaPersonnel(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; firstName?: string; lastName?: string; position?: string; region?: string }>,
    res: Response
): Promise<void> {
    const { id, firstName, lastName, position, region } = req.body;

    const nfaPersonnel = await updateNfaPersonnel({
        id,
        firstName,
        lastName,
        position,
        region
    });

    res.json(nfaPersonnel);
}
