import express, { Request, Response, Router } from 'express';

import {
    countPalaySuppliers,
    createPalaySupplier,
    getPalaySupplier,
    getPalaySuppliers,
    updatePalaySupplier
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

            const palaySuppliers = await getPalaySuppliers(limit, offset);

            res.json(palaySuppliers);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countPalaySuppliers());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const palaySupplier = await getPalaySupplier(Number(id));

        res.json(palaySupplier);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { farmerName: string; farmAddress: string; category: string; contactNumber: string; email: string }>,
            res
        ) => {
            const { farmerName, farmAddress, category, contactNumber, email } = req.body;

            const palaySupplier = await createPalaySupplier({
                farmerName,
                farmAddress,
                category,
                contactNumber,
                email
            });

            res.json(palaySupplier);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; farmerName?: string; farmAddress?: string; category?: string; contactNumber?: string; email?: string; }>,
    res: Response
): Promise<void> {
    const { id, farmerName, farmAddress, category, contactNumber, email } = req.body;

    const palaySupplier = await updatePalaySupplier({
        id,
        farmerName,
        farmAddress,
        category,
        contactNumber,
        email
    });

    res.json(palaySupplier);
}
