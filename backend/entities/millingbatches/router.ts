import express, { Request, Response, Router } from 'express';

import {
    countMillingBatches,
    createMillingBatch,
    getMillingBatch,
    getMillingBatches,
    updateMillingBatch
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

            const millingBatches = await getMillingBatches(limit, offset);

            res.json(millingBatches);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countMillingBatches());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const millingBatch = await getMillingBatch(Number(id));

        console.log('millingBatch', millingBatch);

        res.json(millingBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { dryingBatchId: number; palayBatchId: number; millerId: number; millerType: string; startDateTime: Date; endDateTime: Date; milledQuantityBags: number; milledGrossWeight: number; milledNetWeight: number; millingEfficiency: number; status: string }>,
            res
        ) => {
            const { dryingBatchId, palayBatchId, millerId, millerType, startDateTime, endDateTime, milledQuantityBags, milledGrossWeight, milledNetWeight, millingEfficiency, status } = req.body;

            const millingBatch = await createMillingBatch({
                dryingBatchId,
                palayBatchId,
                millerId,
                millerType,
                startDateTime,
                endDateTime,
                milledQuantityBags,
                milledGrossWeight,
                milledNetWeight,
                millingEfficiency,
                status
            });

            res.json(millingBatch);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<
        any,
        any,
        { id: number; dryingBatchId?: number; palayBatchId?: number; millerId?: number; millerType?: string; startDateTime?: Date; endDateTime?: Date; milledQuantityBags?: number; milledGrossWeight?: number; milledNetWeight?: number; millingEfficiency?: number; status?: string }
    >,
    res: Response
): Promise<void> {
    const { id, dryingBatchId, palayBatchId, millerId, millerType, startDateTime, endDateTime, milledQuantityBags, milledGrossWeight, milledNetWeight, millingEfficiency, status } = req.body;

    const millingBatch = await updateMillingBatch({
        id,
        dryingBatchId,
        palayBatchId,
        millerId,
        millerType,
        startDateTime,
        endDateTime,
        milledQuantityBags,
        milledGrossWeight,
        milledNetWeight,
        millingEfficiency,
        status
    });

    res.json(millingBatch);
}
