import express, { Request, Response, Router } from 'express';

import {
    countFarms,
    createFarm,
    getFarm,
    getFarms,
    updateFarm
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

            const farms = await getFarms(limit, offset);

            res.json(farms);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countFarms());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const farm = await getFarm(Number(id));

        res.json(farm);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { palaySupplierId: number; farmSize: number; region: string; province: string; cityTown: string; barangay: string; street: string }>,
            res
        ) => {
            const { palaySupplierId, farmSize, region, province, cityTown, barangay, street } = req.body;

            const farm = await createFarm({
                palaySupplierId,
                farmSize,
                region,
                province,
                cityTown,
                barangay,
                street
            });

            res.json(farm);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; palaySupplierId?: number; farmSize?: number; region?: string; province?: string; cityTown?: string; barangay?: string; street?: string }>,
    res: Response
): Promise<void> {
    const { id, palaySupplierId, farmSize, region, province, cityTown, barangay, street } = req.body;

    const farm = await updateFarm({
        id,
        palaySupplierId,
        farmSize,
        region,
        province,
        cityTown,
        barangay,
        street
    });

    res.json(farm);
}
