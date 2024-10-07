import express, { Request, Response, Router } from 'express';

import {
    countHouseHouseOfficeAddresses,
    createHouseOfficeAddress,
    getHouseOfficeAddress,
    getHouseHouseOfficeAddresses,
    updateHouseOfficeAddress
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

            const houseHouseOfficeAddresses = await getHouseHouseOfficeAddresses(limit, offset);

            res.json(houseHouseOfficeAddresses);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countHouseHouseOfficeAddresses());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const houseOfficeAddress = await getHouseOfficeAddress(Number(id));

        res.json(houseOfficeAddress);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { region: string; province: string; cityTown: string; barangay: string; street: string }>,
            res
        ) => {
            const { region, province, cityTown, barangay, street } = req.body;

            const houseOfficeAddress = await createHouseOfficeAddress({
                region,
                province,
                cityTown,
                barangay,
                street
            });

            res.json(houseOfficeAddress);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; region?: string; province?: string; cityTown?: string; barangay?: string; street?: string; }>,
    res: Response
): Promise<void> {
    const { id, region, province, cityTown, barangay, street } = req.body;

    const houseOfficeAddress = await updateHouseOfficeAddress({
        id,
        region,
        province, 
        cityTown,
        barangay,
        street
    });

    res.json(houseOfficeAddress);
}
