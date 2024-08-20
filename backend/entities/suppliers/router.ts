import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countSuppliers,
    createSupplier,
    deleteSupplier,
    getSupplier,
    getSuppliers,
    updateSupplier
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

            const suppliers = await getSuppliers(limit, offset);

            res.json(suppliers);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countSuppliers());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const supplier = await getSupplier(Number(id));

        res.json(supplier);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { name: string; type: string; contactNo: number; email: string; location: string; }>,
            res
        ) => {
            const { name, type, contactNo, email, location } = req.body;

            const supplier = await createSupplier({
                name,
                type,
                contactNo,
                email,
                location
            });

            res.json(supplier);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         await createSupplier({
    //             name: `lastmjs${v4()}`,
    //             age: i
    //         });
    //     }

    //     res.json({
    //         Success: `${num} suppliers created`
    //     });
    // });

    router.post('/update', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteSupplier(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; name?: string; type?: string; contactNo?: number; email?: string; location?: string }>,
    res: Response
): Promise<void> {
    const { id, name, type, contactNo, email, location } = req.body;

    const supplier = await updateSupplier({
        id,
        name,
        type,
        contactNo,
        email,
        location
    });

    res.json(supplier);
}
