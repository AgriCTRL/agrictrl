import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import { createQualitySpec } from '../qualityspecs/db';
import { createPalayDelivery } from '../palaydeliveries/db';
import {
    countPalayBatches,
    createPalayBatch,
    deletePalayBatch,
    getPalayBatch,
    getPalayBatches,
    updatePalayBatch
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

            const palayBatches = await getPalayBatches(limit, offset);

            res.json(palayBatches);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countPalayBatches());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const palayBatch = await getPalayBatch(Number(id));

        console.log('palayBatch', palayBatch);

        res.json(palayBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { dateReceived: Date; quantity: number; qualityType: string; price: number; status: string;
                moistureContent: number; purity: number; damaged: number;
                driverName: string, typeOfTranspo: string, plateNumber: string,
                supplierId: number; nfaPersonnelId: number; warehouseId: number
             }>,
            res
        ) => {
            const { dateReceived, quantity, qualityType, price, status,
                moistureContent, purity, damaged,
                driverName, typeOfTranspo, plateNumber,
                supplierId, nfaPersonnelId, warehouseId } = req.body;

            const qualitySpec = await createQualitySpec({
                moistureContent: moistureContent,
                purity: purity,
                damaged: damaged
            });

            const palayDelivery = await createPalayDelivery({
                driverName: driverName,
                typeOfTranspo: typeOfTranspo,
                plateNumber: plateNumber
            });

            const palayBatch = await createPalayBatch({
                dateReceived,
                quantity,
                qualityType,
                qualitySpecId: qualitySpec.id,
                price,
                supplierId,
                nfaPersonnelId,
                palayDeliveryId: palayDelivery.id,
                warehouseId,
                status,
            });

            res.json(palayBatch);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         const user = await createUser({
    //             username: `lastmjs${v4()}`,
    //             age: i
    //         });

    //         await createPalayBatch({
    //             user_id: user.id,
    //             title: `PalayBatch ${v4()}`,
    //             body: `${v4()}${v4()}${v4()}${v4()}`
    //         });
    //     }

    //     res.send({
    //         Success: `${num} palayBatches created`
    //     });
    // });

    router.put('/', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deletePalayBatch(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<
        any,
        any,
        { id: number; dateReceived?: Date; quantity?: number; qualityType?: string; price?: number; status?: string;
            supplierId?: number; nfaPersonnelId?: number; warehouseId?: number }
    >,
    res: Response
): Promise<void> {
    const { id,
        dateReceived,
        quantity,
        qualityType,
        price,
        supplierId,
        nfaPersonnelId,
        warehouseId,
        status } = req.body;

    const palayBatch = await updatePalayBatch({
        id,
        dateReceived,
        quantity,
        qualityType,
        price,
        supplierId,
        nfaPersonnelId,
        warehouseId,
        status
    });

    res.json(palayBatch);
}
