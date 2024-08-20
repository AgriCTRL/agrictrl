import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countMillingProcesses,
    createMillingProcess,
    deleteMillingProcess,
    getMillingProcess,
    getMillingProcesses,
    updateMillingProcess
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

            const millingProcesses = await getMillingProcesses(limit, offset);

            res.json(millingProcesses);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countMillingProcesses());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const millingProcess = await getMillingProcess(Number(id));

        console.log('millingProcess', millingProcess);

        res.json(millingProcess);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { palayBatchId: number; type: string; millerId: number; dateSent: Date; dateReturned: Date;
                palayQuantitySent: number; palayQuantityReturned: number; efficiency: number; warehouseId: number;}>,
            res
        ) => {
            const { palayBatchId, type, millerId, dateSent, dateReturned,
                palayQuantitySent, palayQuantityReturned, efficiency, warehouseId } = req.body;

            const millingProcess = await createMillingProcess({
                palayBatchId,
                type,
                millerId,
                dateSent,
                dateReturned,
                palayQuantitySent,
                palayQuantityReturned,
                efficiency,
                warehouseId
            });

            res.json(millingProcess);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         const user = await createUser({
    //             username: `lastmjs${v4()}`,
    //             age: i
    //         });

    //         await createMillingProcess({
    //             user_id: user.id,
    //             title: `MillingProcess ${v4()}`,
    //             body: `${v4()}${v4()}${v4()}${v4()}`
    //         });
    //     }

    //     res.send({
    //         Success: `${num} millingProcesses created`
    //     });
    // });

    router.post('/update', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteMillingProcess(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<
        any,
        any,
        { id: number; palayBatchId?: number; type?: string; millerId?: number; dateSent?: Date; dateReturned?: Date;
            palayQuantitySent?: number; palayQuantityReturned?: number; efficiency?: number; warehouseId?: number }
    >,
    res: Response
): Promise<void> {
    const { id,
        palayBatchId,
        type,
        millerId,
        dateSent,
        dateReturned,
        palayQuantitySent,
        palayQuantityReturned,
        efficiency,
        warehouseId } = req.body;

    const millingProcess = await updateMillingProcess({
        id,
        palayBatchId,
        type,
        millerId,
        dateSent,
        dateReturned,
        palayQuantitySent,
        palayQuantityReturned,
        efficiency,
        warehouseId
    });

    res.json(millingProcess);
}
