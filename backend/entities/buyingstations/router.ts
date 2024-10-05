import express, { Request, Response, Router } from 'express';

import {
    countBuyingStations,
    createBuyingStation,
    getBuyingStation,
    getBuyingStations,
    updateBuyingStation
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

            const buyingStations = await getBuyingStations(limit, offset);

            res.json(buyingStations);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countBuyingStations());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const buyingStation = await getBuyingStation(Number(id));

        res.json(buyingStation);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { buyingStationName: string; location: string }>,
            res
        ) => {
            const { buyingStationName, location } = req.body;

            const buyingStation = await createBuyingStation({
                buyingStationName,
                location
            });

            res.json(buyingStation);
        }
    );

    router.post('/update', updateHandler);

    return router;
}   

async function updateHandler(
    req: Request<any, any, { id: number; buyingStationName?: string; location?: string }>,
    res: Response
): Promise<void> {
    const { id, buyingStationName, location } = req.body;

    const buyingStation = await updateBuyingStation({
        id,
        buyingStationName,
        location
    });

    res.json(buyingStation);
}
