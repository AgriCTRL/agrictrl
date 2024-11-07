import express, { Request, Response, Router } from 'express';

import {
    countMillingBatches,
    createMillingBatch,
    getMillingBatch,
    getMillingBatches,
    updateMillingBatch,
    getTotalQuantityBags,
    getMillingBatchesByMillerAndStatus
} from './db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/',
        async (
            req: Request<any, any, any, { 
                limit?: string; 
                offset?: string;
                millerId?: string;
                status?: string;
            }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);
            const { millerId, status } = req.query;
    
            if (millerId && status) {
                const millingBatches = await getMillingBatchesByMillerAndStatus(
                    millerId,
                    status,
                    limit,
                    offset
                );
                return res.json(millingBatches);
            }

            const millingBatches = await getMillingBatches(limit, offset);
            res.json(millingBatches);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countMillingBatches());
    });

    router.get('/totals/quantity-bags', async (_req, res) => {
        const total = await getTotalQuantityBags();
        res.json({ total });
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const millingBatch = await getMillingBatch(String(id));

        res.json(millingBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { dryingBatchId: string; palayBatchId: string; millerId: string; millerType: string; startDateTime: Date; endDateTime: Date; milledQuantityBags: number; milledGrossWeight: number; milledNetWeight: number; millingEfficiency: number; status: string }>,
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
        { id: string; dryingBatchId?: string; palayBatchId?: string; millerId?: string; millerType?: string; startDateTime?: Date; endDateTime?: Date; milledQuantityBags?: number; milledGrossWeight?: number; milledNetWeight?: number; millingEfficiency?: number; status?: string }
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
