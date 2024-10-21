import express, { Request, Response, Router } from 'express';

import {
    countRiceBatches,
    createRiceBatch,
    getRiceBatch,
    getRiceBatches,
    updateRiceBatch
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

            const riceBatches = await getRiceBatches(limit, offset);

            res.json(riceBatches);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countRiceBatches());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const riceBatch = await getRiceBatch(Number(id));

        res.json(riceBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { name: string; dateReceived: Date; riceType: string; warehouseId: number; price: number }>,
            res
        ) => {
            const { name, dateReceived, riceType, warehouseId, price } = req.body;

            const riceBatch = await createRiceBatch({
                name,
                dateReceived,
                riceType,
                warehouseId,
                price
            });

            res.json(riceBatch);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; name?: string; dateReceived?: Date; riceType?: string; warehouseId?: number; price?: number }>,
    res: Response
): Promise<void> {
    const { id, name, dateReceived, riceType, warehouseId, price } = req.body;

    const riceBatch = await updateRiceBatch({
        id,
        name,
        dateReceived,
        riceType,
        warehouseId,
        price 
    });

    res.json(riceBatch);
}
