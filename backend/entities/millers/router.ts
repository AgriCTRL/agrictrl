import express, { Request, Response, Router } from 'express';

import {
    countMillers,
    createMiller,
    getMiller,
    getMillers,
    updateMiller,
    getMillerByUserId
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

            const millers = await getMillers(limit, offset);

            res.json(millers);
        }
    );

    router.get('/user/:userId', async (req, res) => {
        const { userId } = req.params;
        try {
            const miller = await getMillerByUserId(String(userId));
            if (!miller) {
                return res.status(404).json({ message: 'Miller not found for this user' });
            }
            res.json(miller);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching miller by userId' });
        }
    });

    router.get('/count', async (_req, res) => {
        res.json(await countMillers());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const miller = await getMiller(String(id));

        res.json(miller);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { millerName: string; userId: string; category: string; type: string; location: string; capacity: number; processing: number; contactNumber: string; email: string; status: string }>,
            res
        ) => {
            const { millerName, userId, category, type, location, capacity, processing, contactNumber, email, status } = req.body;

            const miller = await createMiller({
                millerName,
                userId,
                category,
                type,
                location,
                capacity,
                processing,
                contactNumber,
                email,
                status
            });

            res.json(miller);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: string; millerName?: string; userId?: string; category?: string; type?: string; location?: string; capacity?: number; processing?: number; contactNumber?: string; email?: string; status?: string }>,
    res: Response
): Promise<void> {
    const { id, millerName, userId, category, type, location, capacity, processing, contactNumber, email, status } = req.body;

    const miller = await updateMiller({
        id,
        millerName,
        userId,
        category,
        type,
        location,
        capacity,
        processing,
        contactNumber,
        email,
        status
    });

    res.json(miller);
}
