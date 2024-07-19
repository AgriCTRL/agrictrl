import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countDryingProcesses,
    createDryingProcess,
    deleteDryingProcess,
    getDryingProcess,
    getDryingProcesses,
    updateDryingProcess
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

            const dryingProcesses = await getDryingProcesses(limit, offset);

            res.json(dryingProcesses);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countDryingProcesses());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const dryingProcess = await getDryingProcess(Number(id));

        console.log('dryingProcess', dryingProcess);

        res.json(dryingProcess);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { palayBatchId: number; type: string; dryerId: number; dateSent: Date; dateReturned: Date;
                palayQuantitySent: number; palayQuantityReturned: number; warehouseId: number;}>,
            res
        ) => {
            const { palayBatchId, type, dryerId, dateSent, dateReturned,
                palayQuantitySent, palayQuantityReturned, warehouseId } = req.body;

            const dryingProcess = await createDryingProcess({
                palayBatchId,
                type,
                dryerId,
                dateSent,
                dateReturned,
                palayQuantitySent,
                palayQuantityReturned,
                warehouseId
            });

            res.json(dryingProcess);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         const user = await createUser({
    //             username: `lastmjs${v4()}`,
    //             age: i
    //         });

    //         await createDryingProcess({
    //             user_id: user.id,
    //             title: `DryingProcess ${v4()}`,
    //             body: `${v4()}${v4()}${v4()}${v4()}`
    //         });
    //     }

    //     res.send({
    //         Success: `${num} dryingProcesses created`
    //     });
    // });

    router.put('/', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteDryingProcess(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<
        any,
        any,
        { id: number; palayBatchId?: number; type?: string, dryerId?: number, dateSent?: Date; dateReturned?: Date;
            palayQuantitySent?: number; palayQuantityReturned?: number; warehouseId?: number }
    >,
    res: Response
): Promise<void> {
    const { id,
        palayBatchId,
        type,
        dryerId,
        dateSent,
        dateReturned,
        palayQuantitySent,
        palayQuantityReturned,
        warehouseId } = req.body;

    const dryingProcess = await updateDryingProcess({
        id,
        palayBatchId,
        type,
        dryerId,
        dateSent,
        dateReturned,
        palayQuantitySent,
        palayQuantityReturned,
        warehouseId
    });

    res.json(dryingProcess);
}
