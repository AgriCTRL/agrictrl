import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countDeliveryDetails,
    createDeliveryDetail,
    deleteDeliveryDetail,
    getDeliveryDetail,
    getDeliveryDetails,
    updateDeliveryDetail
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

            const deliveryDetails = await getDeliveryDetails(limit, offset);

            res.json(deliveryDetails);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countDeliveryDetails());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const deliveryDetail = await getDeliveryDetail(Number(id));

        res.json(deliveryDetail);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { driverName: string; typeOfTranspo: string; plateNumber: string }>,
            res
        ) => {
            const { driverName, typeOfTranspo, plateNumber } = req.body;

            const deliveryDetail = await createDeliveryDetail({
                driverName,
                typeOfTranspo,
                plateNumber
            });

            res.json(deliveryDetail);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         await createDeliveryDetail({
    //             driverName: `lastmjs${v4()}`,
    //             age: i
    //         });
    //     }

    //     res.json({
    //         Success: `${num} deliveryDetails created`
    //     });
    // });

    router.put('/', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteDeliveryDetail(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; driverName?: string; typeOfTranspo?: string; plateNumber?: string }>,
    res: Response
): Promise<void> {
    const { id, driverName, typeOfTranspo, plateNumber } = req.body;

    const deliveryDetail = await updateDeliveryDetail({
        id,
        driverName,
        typeOfTranspo,
        plateNumber
    });

    res.json(deliveryDetail);
}
