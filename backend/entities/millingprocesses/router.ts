import express, { Request, Response, Router } from 'express';

import {
    countMillingProcesses,
    createMillingProcess,
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
            req: Request<any, any, { transactionId: number; millerId: number; millerType: string; dateSent: Date; dateReturned: Date; palayQuantitySentKg: number; riceQuantityReturnedKg: number; millingEfficiency: number }>,
            res
        ) => {
            const { transactionId, millerId, millerType, dateSent, dateReturned, palayQuantitySentKg, riceQuantityReturnedKg, millingEfficiency } = req.body;

            const millingProcess = await createMillingProcess({
                transactionId,
                millerId,
                millerType,
                dateSent,
                dateReturned,
                palayQuantitySentKg,
                riceQuantityReturnedKg,
                millingEfficiency
            });

            res.json(millingProcess);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<
        any,
        any,
        { id: number; transactionId?: number; millerId?: number; millerType?: string; dateSent?: Date; dateReturned?: Date; palayQuantitySentKg?: number; riceQuantityReturnedKg?: number; millingEfficiency?: number }
    >,
    res: Response
): Promise<void> {
    const { id, transactionId, millerId, millerType, dateSent, dateReturned, palayQuantitySentKg, riceQuantityReturnedKg, millingEfficiency } = req.body;

    const millingProcess = await updateMillingProcess({
        id,
        transactionId,
        millerId,
        millerType,
        dateSent,
        dateReturned,
        palayQuantitySentKg,
        riceQuantityReturnedKg,
        millingEfficiency
    });

    res.json(millingProcess);
}
