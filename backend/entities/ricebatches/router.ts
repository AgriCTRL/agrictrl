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
            req: Request<any, any, { transactionId: number; dateReceived: Date; quantityKg: number; riceType: string; warehouseId: number }>,
            res
        ) => {
            const { transactionId, dateReceived, quantityKg, riceType, warehouseId } = req.body;

            const riceBatch = await createRiceBatch({
                transactionId,
                dateReceived,
                quantityKg,
                riceType,
                warehouseId
            });

            res.json(riceBatch);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; transactionId?: number; dateReceived?: Date; quantityKg?: number; riceType?: string; warehouseId?: number }>,
    res: Response
): Promise<void> {
    const { id, transactionId, dateReceived, quantityKg, riceType, warehouseId } = req.body;

    const riceBatch = await updateRiceBatch({
        id,
        transactionId,
        dateReceived,
        quantityKg,
        riceType,
        warehouseId
    });

    res.json(riceBatch);
}
