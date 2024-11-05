import express, { Request, Response, Router } from 'express';

import {
    countOfficeAddresses,
    createOfficeAddress,
    getOfficeAddress,
    getOfficeAddresses,
    updateOfficeAddress
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

            const officeAddresses = await getOfficeAddresses(limit, offset);

            res.json(officeAddresses);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countOfficeAddresses());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const officeAddress = await getOfficeAddress(String(id));

        res.json(officeAddress);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { region: string; province: string; cityTown: string; barangay: string; street: string }>,
            res
        ) => {
            const { region, province, cityTown, barangay, street } = req.body;

            const officeAddress = await createOfficeAddress({
                region,
                province,
                cityTown,
                barangay,
                street
            });

            res.json(officeAddress);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: string; region?: string; province?: string; cityTown?: string; barangay?: string; street?: string; }>,
    res: Response
): Promise<void> {
    const { id, region, province, cityTown, barangay, street } = req.body;

    const officeAddress = await updateOfficeAddress({
        id,
        region,
        province, 
        cityTown,
        barangay,
        street
    });

    res.json(officeAddress);
}
