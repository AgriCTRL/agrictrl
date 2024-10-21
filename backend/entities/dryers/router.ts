import express, { Request, Response, Router } from 'express';

import {
    countDryers,
    createDryer,
    getDryer,
    getDryers,
    updateDryer
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

            const dryers = await getDryers(limit, offset);

            res.json(dryers);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countDryers());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const dryer = await getDryer(Number(id));

        res.json(dryer);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { dryerName: string; userId: number; location: string;  capacity: number; processing: number; contactNumber: string; email: string; status: string }>,
            res
        ) => {
            const { dryerName, userId, location, capacity, processing, contactNumber, email, status } = req.body;

            const dryer = await createDryer({
                dryerName,
                userId,
                location,
                capacity,
                processing,
                contactNumber,
                email,
                status
            });

            res.json(dryer);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; dryerName?: string; userId?: number; location?: string;  capacity?: number; processing?: number; contactNumber?: string; email?: string; status?: string }>,
    res: Response
): Promise<void> {
    const { id, dryerName, userId, location, capacity, processing, contactNumber, email, status } = req.body;

    const dryer = await updateDryer({
        id,
        dryerName,
        userId,
        location,
        capacity,
        processing,
        contactNumber,
        email,
        status
    });

    res.json(dryer);
}
