import express, { Request, Response, Router } from 'express';

import {
    countTransactions,
    createTransaction,
    getTransaction,
    getTransactions,
    updateTransaction
} from './db';
import { createTransporter } from '../transporters/db';

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

            const transactions = await getTransactions(limit, offset);

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
            req: Request<any, any, { item: string; itemIds: number[]; senderId: number; sendDateTime: Date; fromLocationType: string; fromLocationId: number; transporterName: string; description: string; receiverId: number; receiveDateTime: Date; toLocationType: string; toLocationId: number; status: string; remarks: string }>,
            res
        ) => {
            const { item, itemIds, senderId, sendDateTime, fromLocationType, fromLocationId, transporterName, description, receiverId, receiveDateTime, toLocationType, toLocationId, status, remarks } = req.body;

            const transporter = await createTransporter({
                transporterName: transporterName,
                description: description,
            });
            
            const transaction = await createTransaction({
                item,
                itemIds,
                senderId,
                sendDateTime,
                fromLocationType,
                fromLocationId,
                transporterId: transporter.id,
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
    req: Request<any, any, { id: number; item?: string; itemIds?: number[]; senderId?: number; sendDateTime?: Date; fromLocationType?: string; fromLocationId?: number; receiverId?: number; receiveDateTime?: Date; toLocationType?: string; toLocationId?: number; status?: string; remarks?: string }>,
    res: Response
): Promise<void> {
    const { id, item, itemIds, senderId, sendDateTime, fromLocationType, fromLocationId, receiverId, receiveDateTime, toLocationType, toLocationId, status, remarks } = req.body;

    const transaction = await updateTransaction({
        id,
        item,
        itemIds,
        senderId,
        sendDateTime,
        fromLocationType,
        fromLocationId,
        receiverId,
        receiveDateTime,
        toLocationType,
        toLocationId,
        status,
        remarks
    });

    res.json(transaction);
}
