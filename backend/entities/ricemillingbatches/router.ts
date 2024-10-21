import express, { Request, Response, Router } from 'express';

import {
    countRiceMillingBatches,
    createRiceMillingBatch,
    getRiceMillingBatch,
    getRiceMillingBatches,
    updateRiceMillingBatch
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

            const riceMillingBatches = await getRiceMillingBatches(limit, offset);

            res.json(riceMillingBatches);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countRiceMillingBatches());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const riceMillingBatch = await getRiceMillingBatch(Number(id));

        res.json(riceMillingBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { riceBatchId: number; millingBatchId: number; riceQuantityBags: number, riceGrossWeight: number, riceNetWeight: number }>,
            res
        ) => {
            const { riceBatchId, millingBatchId, riceQuantityBags, riceGrossWeight, riceNetWeight } = req.body;

            const riceMillingBatch = await createRiceMillingBatch({
                riceBatchId,
                millingBatchId,
                riceQuantityBags,
                riceGrossWeight,
                riceNetWeight
            });

            res.json(riceMillingBatch);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; riceBatchId?: number; millingBatchId?: number; riceQuantityBags?: number, riceGrossWeight?: number, riceNetWeight?: number }>,
    res: Response
): Promise<void> {
    const { id, riceBatchId, millingBatchId, riceQuantityBags, riceGrossWeight, riceNetWeight } = req.body;

    const riceMillingBatch = await updateRiceMillingBatch({
        id,
        riceBatchId,
        millingBatchId,
        riceQuantityBags,
        riceGrossWeight,
        riceNetWeight
    });

    res.json(riceMillingBatch);
}
