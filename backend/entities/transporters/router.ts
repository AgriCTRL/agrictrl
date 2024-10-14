import express, { Request, Response, Router } from 'express';

import {
    countTransporters,
    createTransporter,
    getTransporter,
    getTransporters,
    updateTransporter
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

            const transporters = await getTransporters(limit, offset);

            res.json(transporters);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countTransporters());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const transporter = await getTransporter(Number(id));

        res.json(transporter);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { transporterName: string; description: string }>,
            res
        ) => {
            const { transporterName, description } = req.body;

            const transporter = await createTransporter({
                transporterName,
                description
            });

            res.json(transporter);
        }
    );

    router.post('/update', updateHandler);

    return router;
}   

async function updateHandler(
    req: Request<any, any, { id: number; transporterName?: string; description?: string }>,
    res: Response
): Promise<void> {
    const { id, transporterName, description } = req.body;

    const transporter = await updateTransporter({
        id,
        transporterName,
        description
    });

    res.json(transporter);
}
