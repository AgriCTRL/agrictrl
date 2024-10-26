import express, { Request, Response, Router } from 'express';

import {
    countTransactions,
    createTransaction,
    getTransaction,
    getTransactions,
    updateTransaction
} from './db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/',
        async (
            req: Request<any, any, any, { limit?: string; offset?: string; toLocationType?: string; status?: string }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);
            const toLocationType = req.query.toLocationType;
            const status = req.query.status;

            const transactions = await getTransactions(limit, offset, toLocationType, status);

            res.json(transactions);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countTransactions());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const transaction = await getTransaction(Number(id));

        res.json(transaction);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { item: string; itemId: number; senderId: number; sendDateTime: Date; fromLocationType: string; fromLocationId: number; transporterName: string; transporterDesc: string; receiverId: number; receiveDateTime: Date; toLocationType: string; toLocationId: number; status: string; remarks: string }>,
            res
        ) => {
            const { item, itemId, senderId, sendDateTime, fromLocationType, fromLocationId, transporterName, transporterDesc, receiverId, receiveDateTime, toLocationType, toLocationId, status, remarks } = req.body;
            
            const transaction = await createTransaction({
                item,
                itemId,
                senderId,
                sendDateTime,
                fromLocationType,
                fromLocationId,
                transporterName,
                transporterDesc,
                receiverId,
                receiveDateTime,
                toLocationType,
                toLocationId,
                status,
                remarks
            });

            res.json(transaction);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; item?: string; itemId?: number; senderId?: number; sendDateTime?: Date; fromLocationType?: string; fromLocationId?: number; transporterName?: string; transporterDesc?: string; receiverId?: number; receiveDateTime?: Date; toLocationType?: string; toLocationId?: number; status?: string; remarks?: string }>,
    res: Response
): Promise<void> {
    const { id, item, itemId, senderId, sendDateTime, fromLocationType, fromLocationId, transporterName, transporterDesc, receiverId, receiveDateTime, toLocationType, toLocationId, status, remarks } = req.body;

    const transaction = await updateTransaction({
        id,
        item,
        itemId,
        senderId,
        sendDateTime,
        fromLocationType,
        fromLocationId,
        transporterName,
        transporterDesc,
        receiverId,
        receiveDateTime,
        toLocationType,
        toLocationId,
        status,
        remarks
    });

    res.json(transaction);
}
