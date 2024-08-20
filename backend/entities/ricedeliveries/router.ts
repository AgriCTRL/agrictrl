import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countRiceDeliveries,
    createRiceDelivery,
    deleteRiceDelivery,
    getRiceDelivery,
    getRiceDeliveries,
    updateRiceDelivery
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

            const riceDeliveries = await getRiceDeliveries(limit, offset);

            res.json(riceDeliveries);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countRiceDeliveries());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const riceDelivery = await getRiceDelivery(Number(id));

        res.json(riceDelivery);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { driverName: string; typeOfTranspo: string; plateNumber: string }>,
            res
        ) => {
            const { driverName, typeOfTranspo, plateNumber } = req.body;

            const riceDelivery = await createRiceDelivery({
                driverName,
                typeOfTranspo,
                plateNumber
            });

            res.json(riceDelivery);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         await createRiceDelivery({
    //             driverName: `lastmjs${v4()}`,
    //             age: i
    //         });
    //     }

    //     res.json({
    //         Success: `${num} riceDeliveries created`
    //     });
    // });

    router.post('/update', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteRiceDelivery(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; driverName?: string; typeOfTranspo?: string; plateNumber?: string }>,
    res: Response
): Promise<void> {
    const { id, driverName, typeOfTranspo, plateNumber } = req.body;

    const riceDelivery = await updateRiceDelivery({
        id,
        driverName,
        typeOfTranspo,
        plateNumber
    });

    res.json(riceDelivery);
}
