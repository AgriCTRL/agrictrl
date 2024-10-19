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
            req: Request<any, any, { riceBatchesId: number; millingBatchesId: number; riceQuantityBags: number, riceGrossWeight: number, riceNetWeight: number }>,
            res
        ) => {
            const { riceBatchesId, millingBatchesId, riceQuantityBags, riceGrossWeight, riceNetWeight } = req.body;

            const riceMillingBatch = await createRiceMillingBatch({
                riceBatchesId,
                millingBatchesId,
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
    req: Request<any, any, { id: number; riceBatchesId?: number; millingBatchesId?: number; riceQuantityBags?: number, riceGrossWeight?: number, riceNetWeight?: number }>,
    res: Response
): Promise<void> {
    const { id, riceBatchesId, millingBatchesId, riceQuantityBags, riceGrossWeight, riceNetWeight } = req.body;

    const riceMillingBatch = await updateRiceMillingBatch({
        id,
        riceBatchesId,
        millingBatchesId,
        riceQuantityBags,
        riceGrossWeight,
        riceNetWeight
    });

    res.json(riceMillingBatch);
}
