import express, { Request, Response, Router } from 'express';

import {
    countWarehouses,
    createWarehouse,
    getWarehouse,
    getWarehouses,
    updateWarehouse
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

            const warehouses = await getWarehouses(limit, offset);

            res.json(warehouses);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countWarehouses());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const warehouse = await getWarehouse(String(id));

        res.json(warehouse);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { userId: string; facilityName: string; nfaBranch: string, location: string, totalCapacity: number, currentStock: number, contactNumber: string, email: string, status: string }>,
            res
        ) => {
            const { userId, facilityName, nfaBranch, location, totalCapacity, currentStock, contactNumber, email, status } = req.body;

            const warehouse = await createWarehouse({
                userId,
                facilityName,
                nfaBranch,
                location,
                totalCapacity,
                currentStock,
                contactNumber,
                email,
                status
            });

            res.json(warehouse);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: string; userId?: string; facilityName?: string; nfaBranch?: string, location?: string, totalCapacity?: number, currentStock?: number, contactNumber?: string, email?: string, status?: string }>,
    res: Response
): Promise<void> {
    const { id, userId, facilityName, nfaBranch, location, totalCapacity, currentStock, contactNumber, email, status } = req.body;

    const warehouse = await updateWarehouse({
        id,
        userId,
        facilityName,
        nfaBranch,
        location,
        totalCapacity,
        currentStock,
        contactNumber,
        email,
        status
    });

    res.json(warehouse);
}
