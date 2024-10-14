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
            req: Request<any, any, { item: string; itemIds: number[]; userId: number; fromLocationType: string; fromLocationId: number; transporterName: string; description: string; toLocationType: string; toLocationId: number; transactionTimeDate: Date }>,
            res
        ) => {
            const { item, itemIds, userId, fromLocationType, fromLocationId, transporterName, description, toLocationType, toLocationId, transactionTimeDate } = req.body;

            const transporter = await createTransporter({
                transporterName: transporterName,
                description: description,
            });
            
            const transaction = await createTransaction({
                item,
                itemIds,
                userId,
                fromLocationType,
                fromLocationId,
                transporterId: transporter.id,
                toLocationType,
                toLocationId,
                transactionTimeDate
            });

            res.json(transaction);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; item?: string; itemIds?: number[]; userId?: number; fromLocationType?: string; fromLocationId?: number; toLocationType?: string; toLocationId?: number; transactionTimeDate?: Date }>,
    res: Response
): Promise<void> {
    const { id, item, itemIds, userId, fromLocationType, fromLocationId, toLocationType, toLocationId, transactionTimeDate } = req.body;

    const transaction = await updateTransaction({
        id,
        item,
        itemIds,
        userId,
        fromLocationType,
        fromLocationId,
        toLocationType,
        toLocationId,
        transactionTimeDate
    });

    res.json(transaction);
}
