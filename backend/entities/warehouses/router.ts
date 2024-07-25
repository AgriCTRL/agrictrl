import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countWarehouses,
    createWarehouse,
    deleteWarehouse,
    getWarehouse,
    getWarehouses,
    updateWarehouse
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

            const warehouses = await getWarehouses(limit, offset);

            res.json(warehouses);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countWarehouses());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const warehouse = await getWarehouse(Number(id));

        res.json(warehouse);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { facilityName: string; capacity: number; location: string;  contactInfo: string; status: string }>,
            res
        ) => {
            const { facilityName, capacity, location, contactInfo, status } = req.body;

            const warehouse = await createWarehouse({
                facilityName,
                capacity, 
                location, 
                contactInfo,
                status
            });

            res.json(warehouse);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         await createWarehouse({
    //             facilityName: `lastmjs${v4()}`,
    //             age: i
    //         });
    //     }

    //     res.json({
    //         Success: `${num} warehouses created`
    //     });
    // });

    router.put('/', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteWarehouse(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; facilityName?: string; capacity?: number; location?: string; contactInfo?: string; status?: string }>,
    res: Response
): Promise<void> {
    const { id, facilityName, capacity, location, contactInfo, status } = req.body;

    const warehouse = await updateWarehouse({
        id,
        facilityName,
        capacity,
        location,
        contactInfo,
        status
    });

    res.json(warehouse);
}
