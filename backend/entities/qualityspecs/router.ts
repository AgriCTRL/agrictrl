import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countQualitySpecs,
    createQualitySpec,
    deleteQualitySpec,
    getQualitySpec,
    getQualitySpecs,
    updateQualitySpec
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

            const qualitySpecs = await getQualitySpecs(limit, offset);

            res.json(qualitySpecs);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countQualitySpecs());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const qualitySpec = await getQualitySpec(Number(id));

        res.json(qualitySpec);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { moistureContent: number; purity: number; damaged: number }>,
            res
        ) => {
            const { moistureContent, purity, damaged } = req.body;

            const qualitySpec = await createQualitySpec({
                moistureContent,
                purity,
                damaged
            });

            res.json(qualitySpec);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         await createQualitySpec({
    //             qualitySpecname: `lastmjs${v4()}`,
    //             age: i
    //         });
    //     }

    //     res.json({
    //         Success: `${num} qualitySpecs created`
    //     });
    // });

    router.put('/', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteQualitySpec(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; moistureContent?: number; purity?: number; damaged?: number }>,
    res: Response
): Promise<void> {
    const { id, moistureContent, purity, damaged } = req.body;

    const qualitySpec = await updateQualitySpec({
        id,
        moistureContent,
        purity,
        damaged
    });

    res.json(qualitySpec);
}
