import express, { Request, Response, Router } from 'express';

import {
    countTransactions,
    createTransaction,
    getTransaction,
    getTransactionByToLocationId,
    getTransactions,
    updateTransaction
} from './db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/',
        async (
            req: Request<any, any, any, { limit?: string; offset?: string; toLocationId?: string; toLocationType?: string; status?: string }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);
            const toLocationId = req.query.toLocationId ? String(req.query.toLocationId) : undefined;
            const toLocationType = req.query.toLocationType;
            const status = req.query.status;
    
            const transactions = await getTransactions(limit, offset, toLocationId, toLocationType, status);
    
            res.json(transactions);
        }
    );
    

    router.get('/count', async (_req, res) => {
        res.json(await countTransactions());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const transaction = await getTransaction(String(id));

        res.json(transaction);
    });

    router.get('/toLocation/:toLocationId', async (req, res) => {
        const { toLocationId } = req.params;
        const toLocationType = req.query.toLocationType as string | undefined;
    
        const transaction = await getTransactionByToLocationId(String(toLocationId), toLocationType);
    
        res.json(transaction);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { item: string; itemId: string; riceBatchId: string; senderId: string; sendDateTime: Date; fromLocationType: string; fromLocationId: string; transporterName: string; transporterDesc: string; receiverId: string; receiveDateTime: Date; toLocationType: string; toLocationId: string; status: string; remarks: string }>,
            res
        ) => {
            const { item, itemId, riceBatchId, senderId, sendDateTime, fromLocationType, fromLocationId, transporterName, transporterDesc, receiverId, receiveDateTime, toLocationType, toLocationId, status, remarks } = req.body;
            
            const transaction = await createTransaction({
                item,
                itemId,
                riceBatchId,
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
    req: Request<any, any, { id: string; item?: string; itemId?: string; riceBatchId?: string; senderId?: string; sendDateTime?: Date; fromLocationType?: string; fromLocationId?: string; transporterName?: string; transporterDesc?: string; receiverId?: string; receiveDateTime?: Date; toLocationType?: string; toLocationId?: string; status?: string; remarks?: string }>,
    res: Response
): Promise<void> {
    const { id, item, itemId, senderId, riceBatchId, sendDateTime, fromLocationType, fromLocationId, transporterName, transporterDesc, receiverId, receiveDateTime, toLocationType, toLocationId, status, remarks } = req.body;

    const transaction = await updateTransaction({
        id,
        item,
        itemId,
        riceBatchId,
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
