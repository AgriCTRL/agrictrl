import express, { Request, Response, Router } from 'express';

import { createQualitySpec } from '../qualityspecs/db';
import {
    countPalayBatches,
    createPalayBatch,
    getPalayBatch,
    getPalayBatches,
    updatePalayBatch
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

            const palayBatches = await getPalayBatches(limit, offset);

            res.json(palayBatches);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countPalayBatches());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const palayBatch = await getPalayBatch(Number(id));

        res.json(palayBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { dateBought: Date;
                quantityKg: number;
                qualityType: string;
                moistureContent: number;
                purity: number;
                damaged: number;
                price: number
                palaySupplierId: number;
                userId: number;
                status: string }>,
            res
        ) => {
            const { dateBought,
                quantityKg,
                qualityType,
                moistureContent,
                purity,
                damaged,
                price,
                palaySupplierId,
                userId,
                status } = req.body;

            const qualitySpec = await createQualitySpec({
                moistureContent: moistureContent,
                purity: purity,
                damaged: damaged
            });

            const palayBatch = await createPalayBatch({
                dateBought,
                quantityKg,
                qualityType,
                qualitySpecId: qualitySpec.id,
                price,
                palaySupplierId,
                userId,
                status
            });

            res.json(palayBatch);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number;
        dateBought: Date;
        quantityKg: number;
        qualityType: string;
        price: number
        palaySupplierId: number;
        userId: number;
        status: string }>,
    res: Response
): Promise<void> {
    const { id,
        dateBought,
        quantityKg,
        qualityType,
        price,
        palaySupplierId,
        userId,
        status } = req.body;

    const palayBatch = await updatePalayBatch({
        id,
        dateBought,
        quantityKg,
        qualityType,
        price,
        palaySupplierId,
        userId,
        status
    });

    res.json(palayBatch);
}
