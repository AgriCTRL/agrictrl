import express, { Request, Response, Router } from 'express';

import {
    countRiceBatches,
    createRiceBatch,
    getRiceBatch,
    getRiceBatches,
    updateRiceBatch,
    getTotalCurrentCapacity
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

    router.get('/totals/current-capacity', async (_req, res) => {
        const total = await getTotalCurrentCapacity();
        res.json({ total });
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const riceBatch = await getRiceBatch(String(id));

        res.json(riceBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { name: string; dateReceived: Date; riceType: string; warehouseId: string; price: number; currentCapacity: number; maxCapacity: number; isFull: boolean; forSale: boolean; }>,
            res
        ) => {
            const { name, dateReceived, riceType, warehouseId, price, currentCapacity, maxCapacity, isFull, forSale } = req.body;
    
            const riceBatch = await createRiceBatch({
                name,
                dateReceived,
                riceType,
                warehouseId,
                price,
                currentCapacity,
                maxCapacity,
                isFull,
                forSale
            });
    
            res.json(riceBatch);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id?: string; name?: string; dateReceived?: Date; riceType?: string; warehouseId?: string; price?: number; currentCapacity?: number; maxCapacity?: number; isFull?: boolean; forSale?: boolean; }>,
    res: Response
): Promise<void> {
    const id = String(req.query.id) || req.body.id;

    if (!id) {
        res.status(400).json({ error: 'Missing id parameter.' });
        return;
    }

    const { name, dateReceived, riceType, warehouseId, price, currentCapacity, maxCapacity, isFull, forSale } = req.body;

    const riceBatch = await updateRiceBatch({
        id,
        name,
        dateReceived,
        riceType,
        warehouseId,
        price,
        currentCapacity,
        maxCapacity,
        isFull,
        forSale // Include forSale field in the update
    });

    res.json(riceBatch);
}


