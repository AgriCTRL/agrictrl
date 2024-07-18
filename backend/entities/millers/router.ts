import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countMillers,
    createMiller,
    deleteMiller,
    getMiller,
    getMillers,
    updateMiller
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

            const millers = await getMillers(limit, offset);

            res.json(millers);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countMillers());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const miller = await getMiller(Number(id));

        res.json(miller);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { name: string; location: string; capacity: number; contactNo: number; email: string }>,
            res
        ) => {
            const { name, location, capacity, contactNo, email } = req.body;

            const miller = await createMiller({
                name,
                location,
                capacity,
                contactNo,
                email
            });

            res.json(miller);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         await createMiller({
    //             name: `lastmjs${v4()}`,
    //             age: i
    //         });
    //     }

    //     res.json({
    //         Success: `${num} millers created`
    //     });
    // });

    router.put('/', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteMiller(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; name?: string; location?: string; capacity?: number; contactNo?: number; email?: string }>,
    res: Response
): Promise<void> {
    const { id, name, location, capacity, contactNo, email } = req.body;

    const miller = await updateMiller({
        id,
        name,
        location,
        capacity,
        contactNo,
        email
    });

    res.json(miller);
}
