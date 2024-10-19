import express, { Request, Response, Router } from 'express';

import {
    countDryingBatches,
    createDryingBatch,
    getDryingBatch,
    getDryingBatches,
    updateDryingBatch
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

            const dryingBatches = await getDryingBatches(limit, offset);

            res.json(dryingBatches);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countDryingBatches());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const dryingBatch = await getDryingBatch(Number(id));

        console.log('dryingBatch', dryingBatch);

        res.json(dryingBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { palayBatchId: number; dryingMethod: string; dryerType: string; dryerId: number; startDateTime: Date; endDateTime: Date; driedQuantityBags: number; driedGrossWeight: number; driedNetWeight: number; moistureContent: number; status: string }>,
            res
        ) => {
            const { palayBatchId, dryingMethod, dryerType, dryerId, startDateTime, endDateTime, driedQuantityBags, driedGrossWeight, driedNetWeight, moistureContent, status } = req.body;

            const dryingBatch = await createDryingBatch({
                palayBatchId,
                dryingMethod,
                dryerType,
                dryerId,
                startDateTime,
                endDateTime,
                driedQuantityBags,
                driedGrossWeight,
                driedNetWeight,
                moistureContent,
                status
            });

            res.json(dryingBatch);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<
        any,
        any,
        { id: number; palayBatchId?: number; dryingMethod?: string; dryerType?: string; dryerId?: number; startDateTime?: Date; endDateTime?: Date; driedQuantityBags?: number; driedGrossWeight?: number; driedNetWeight?: number; moistureContent?: number; status?: string }
    >,
    res: Response
): Promise<void> {
    const { id, palayBatchId, dryingMethod, dryerType, dryerId, startDateTime, endDateTime, driedQuantityBags, driedGrossWeight, driedNetWeight, moistureContent, status } = req.body;

    const dryingBatch = await updateDryingBatch({
        id,
        palayBatchId,
        dryingMethod,
        dryerType,
        dryerId,
        startDateTime,
        endDateTime,
        driedQuantityBags,
        driedGrossWeight,
        driedNetWeight,
        moistureContent,
        status
    });

    res.json(dryingBatch);
}
