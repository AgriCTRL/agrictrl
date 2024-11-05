import express, { Request, Response, Router } from 'express';

import {
    countRiceOrders,
    countReceivedRiceOrders,
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
            req: Request<any, any, any, { limit?: string; offset?: string; riceRecipientId?: number; status?: string | string[] }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);
            const riceRecipientId = req.query.riceRecipientId;
            const status = Array.isArray(req.query.status) 
                ? req.query.status 
                : req.query.status ? [req.query.status] : undefined;

            const riceOrders = await getRiceOrders(limit, offset, riceRecipientId, status);

            res.json(riceOrders);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countRiceOrders());
    });

    router.get('/received/count', async (_req, res) => {
        res.json(await countReceivedRiceOrders());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const riceOrder = await getRiceOrder(String(id));

        res.json(riceOrder);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { riceRecipientId: string; riceBatchId: string; orderDate: Date; dropOffLocation: string; riceQuantityBags: number; description: string; totalCost: number; preferredDeliveryDate: Date; status: string; isAccepted: boolean; remarks: string }>,
            res
        ) => {
            const { riceRecipientId, riceBatchId, orderDate, dropOffLocation, riceQuantityBags, description, totalCost, preferredDeliveryDate, status, isAccepted, remarks } = req.body;

            const riceOrder = await createRiceOrder({
                riceRecipientId,
                riceBatchId,
                orderDate,
                dropOffLocation,
                riceQuantityBags,
                description,
                totalCost,
                preferredDeliveryDate,
                status,
                isAccepted,
                remarks
            });

            res.json(riceOrder);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: string; riceRecipientId?: string; riceBatchId?: string; orderDate?: Date; dropOffLocation?: string; riceQuantityBags?: number; description?: string; totalCost?: number; preferredDeliveryDate?: Date; status?: string; isAccepted?: boolean; remarks?: string }>,
    res: Response
): Promise<void> {
    const { id, riceRecipientId, riceBatchId, orderDate, dropOffLocation, riceQuantityBags, description, totalCost, preferredDeliveryDate, status, isAccepted, remarks } = req.body;

    const riceOrder = await updateRiceOrder({
        id,
        riceRecipientId,
        riceBatchId,
        orderDate,
        dropOffLocation,
        riceQuantityBags,
        description,
        totalCost,
        preferredDeliveryDate,
        status,
        isAccepted,
        remarks
    });

    res.json(riceOrder);
}
