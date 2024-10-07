import express, { Request, Response, Router } from 'express';

import {
    countRiceOrders,
    createRiceOrder,
    getRiceOrder,
    getRiceOrders,
    updateRiceOrder
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

            const riceOrders = await getRiceOrders(limit, offset);

            res.json(riceOrders);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countRiceOrders());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const riceOrder = await getRiceOrder(Number(id));

        res.json(riceOrder);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { riceRecipient: string; riceBatchId: number; orderDate: Date; riceQuantity: number; cost: number; orderStatus: string }>,
            res
        ) => {
            const { riceRecipient, riceBatchId, orderDate, riceQuantity, cost, orderStatus } = req.body;

            const riceOrder = await createRiceOrder({
                riceRecipient,
                riceBatchId,
                orderDate,
                riceQuantity,
                cost,
                orderStatus
            });

            res.json(riceOrder);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; riceRecipient?: string; riceBatchId?: number; orderDate?: Date; riceQuantity?: number; cost?: number; orderStatus?: string }>,
    res: Response
): Promise<void> {
    const { id, riceRecipient, riceBatchId, orderDate, riceQuantity, cost, orderStatus } = req.body;

    const riceOrder = await updateRiceOrder({
        id,
        riceRecipient,
        riceBatchId,
        orderDate,
        riceQuantity,
        cost,
        orderStatus
    });

    res.json(riceOrder);
}
