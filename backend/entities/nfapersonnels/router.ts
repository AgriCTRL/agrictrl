import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countNfaPersonnels,
    createNfaPersonnel,
    deleteNfaPersonnel,
    getNfaPersonnel,
    getNfaPersonnels,
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

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const nfaPersonnel = await getNfaPersonnel(Number(id));

        res.json(nfaPersonnel);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { name: string; position: string; region: string }>,
            res
        ) => {
            const { name, position, region } = req.body;

            const nfaPersonnel = await createNfaPersonnel({
                name,
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
    req: Request<any, any, { id: number; name?: string; position?: string; region?: string }>,
    res: Response
): Promise<void> {
    const { id, name, position, region } = req.body;

    const nfaPersonnel = await updateNfaPersonnel({
        id,
        name,
        position,
        region
    });

    res.json(nfaPersonnel);
}
