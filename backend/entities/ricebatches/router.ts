import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import { createRiceDelivery } from '../ricedeliveries/db';
import {
    countRiceBatches,
    createRiceBatch,
    deleteRiceBatch,
    getRiceBatch,
    getRiceBatches,
    updateRiceBatch
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

            const riceBatches = await getRiceBatches(limit, offset);

            res.json(riceBatches);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countRiceBatches());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const riceBatch = await getRiceBatch(Number(id));

        console.log('riceBatch', riceBatch);

        res.json(riceBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { palayBatchId: number; dateReceived: Date; quantity: number; qualityType: string; warehouseId: number; recipientId: number;
                driverName: string, typeOfTranspo: string, plateNumber: string
             }>,
            res
        ) => {
            const { palayBatchId, dateReceived, quantity, qualityType, warehouseId, recipientId,
                driverName, typeOfTranspo, plateNumber } = req.body;

            const riceDelivery = await createRiceDelivery({
                driverName: driverName,
                typeOfTranspo: typeOfTranspo,
                plateNumber: plateNumber
            });

            const riceBatch = await createRiceBatch({
                palayBatchId,
                dateReceived,
                quantity,
                qualityType,
                warehouseId,
                recipientId,
                riceDeliveryId: riceDelivery.id
            });

            res.json(riceBatch);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         const user = await createUser({
    //             username: `lastmjs${v4()}`,
    //             age: i
    //         });

    //         await createRiceBatch({
    //             user_id: user.id,
    //             title: `RiceBatch ${v4()}`,
    //             body: `${v4()}${v4()}${v4()}${v4()}`
    //         });
    //     }

    //     res.send({
    //         Success: `${num} riceBatches created`
    //     });
    // });

    router.put('/', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteRiceBatch(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<
        any,
        any,
        { id: number; palayBatchId?: number; dateReceived?: Date, quantity?: number, qualityType?: string; warehouseId?: number; recipientId?: number }
    >,
    res: Response
): Promise<void> {
    const { id,
        palayBatchId,
        dateReceived,
        quantity,
        qualityType,
        warehouseId,
        recipientId } = req.body;

    const riceBatch = await updateRiceBatch({
        id,
        palayBatchId,
        dateReceived,
        quantity,
        qualityType,
        warehouseId,
        recipientId
    });

    res.json(riceBatch);
}
