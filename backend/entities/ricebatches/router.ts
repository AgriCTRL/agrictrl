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
            req: Request<any, any, any, { limit?: string; offset?: string; currentCapacity_lt?: string; isFull?: string }>,
            res: Response
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);
            const currentCapacity_lt = req.query.currentCapacity_lt ? Number(req.query.currentCapacity_lt) : undefined;
            const isFull = req.query.isFull === 'true' ? true : (req.query.isFull === 'false' ? false : undefined);
    
            const riceBatches = await getRiceBatches(limit, offset, currentCapacity_lt, isFull);
    
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
            req: Request<any, any, { name: string; dateReceived: Date; riceType: string; warehouseId: number; price: number; currentCapacity: number; maxCapacity: number; isFull: boolean; }>,
            res
        ) => {
            const { name, dateReceived, riceType, warehouseId, price, currentCapacity, maxCapacity, isFull } = req.body;

            const riceBatch = await createRiceBatch({
                name,
                dateReceived,
                riceType,
                warehouseId,
                price,
                currentCapacity,
                maxCapacity,
                isFull
            });

            res.json(riceBatch);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id?: number; name?: string; dateReceived?: Date; riceType?: string; warehouseId?: number; price?: number; currentCapacity?: number; maxCapacity?: number; isFull?: boolean; }>,
    res: Response
): Promise<void> {
    // Extract id from query or body
    const id = Number(req.query.id) || req.body.id;

    if (!id) {
        res.status(400).json({ error: 'Missing id parameter.' });
        return; // Ensure we return void here
    }

    const { name, dateReceived, riceType, warehouseId, price, currentCapacity, maxCapacity, isFull } = req.body;

    const riceBatch = await updateRiceBatch({
        id,
        name,
        dateReceived,
        riceType,
        warehouseId,
        price,
        currentCapacity,
        maxCapacity,
        isFull 
    });

    res.json(riceBatch);
}


