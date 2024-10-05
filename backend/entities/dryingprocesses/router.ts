import express, { Request, Response, Router } from 'express';

import {
    countDryingProcesses,
    createDryingProcess,
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
            req: Request<any, any, { transactionId: number; dryingMethod: string; dryerType: string; dryerId: number; dateSent: Date; dateReturned: Date;
                palayQuantitySentKg: number; palayQuantityReturnedKg: number }>,
            res
        ) => {
            const { transactionId, dryingMethod, dryerType, dryerId, dateSent, dateReturned, palayQuantitySentKg, palayQuantityReturnedKg } = req.body;

            const dryingProcess = await createDryingProcess({
                transactionId,
                dryingMethod,
                dryerType,
                dryerId,
                dateSent,
                dateReturned,
                palayQuantitySentKg,
                palayQuantityReturnedKg
            });

            res.json(dryingProcess);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<
        any,
        any,
        { id: number; transactionId?: number; dryingMethod?: string; dryerType?: string; dryerId?: number; dateSent?: Date; dateReturned?: Date;
            palayQuantitySentKg?: number; palayQuantityReturnedKg?: number }
    >,
    res: Response
): Promise<void> {
    const { id, transactionId, dryingMethod, dryerType, dryerId, dateSent, dateReturned, palayQuantitySentKg, palayQuantityReturnedKg } = req.body;

    const dryingProcess = await updateDryingProcess({
        id,
        transactionId,
        dryingMethod,
        dryerType,
        dryerId,
        dateSent,
        dateReturned,
        palayQuantitySentKg,
        palayQuantityReturnedKg
    });

    res.json(dryingProcess);
}
