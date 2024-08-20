import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countDryers,
    createDryer,
    deleteDryer,
    getDryer,
    getDryers,
    updateDryer
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

            const dryers = await getDryers(limit, offset);

            res.json(dryers);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countDryers());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const dryer = await getDryer(Number(id));

        res.json(dryer);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { name: string; capacity: number; location: string;  contactInfo: string; status: string }>,
            res
        ) => {
            const { name, capacity, location, contactInfo, status } = req.body;

            const dryer = await createDryer({
                name,
                capacity, 
                location, 
                contactInfo,
                status
            });

            res.json(dryer);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         await createDryer({
    //             name: `lastmjs${v4()}`,
    //             age: i
    //         });
    //     }

    //     res.json({
    //         Success: `${num} dryers created`
    //     });
    // });

    router.post('/update', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteDryer(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; name?: string; capacity?: number; location?: string; contactInfo?: string; status?: string }>,
    res: Response
): Promise<void> {
    const { id, name, capacity, location, contactInfo, status } = req.body;

    const dryer = await updateDryer({
        id,
        name,
        capacity,
        location,
        contactInfo,
        status
    });

    res.json(dryer);
}
