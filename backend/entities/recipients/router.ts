import express, { Request, Response, Router } from 'express';
// import { v4 } from 'uuid';

import {
    countRecipients,
    createRecipient,
    deleteRecipient,
    getRecipient,
    getRecipients,
    updateRecipient
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

            const recipients = await getRecipients(limit, offset);

            res.json(recipients);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countRecipients());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const recipient = await getRecipient(Number(id));

        res.json(recipient);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { name: string; type: string; contactNo: number; email: string }>,
            res
        ) => {
            const { name, type, contactNo, email } = req.body;

            const recipient = await createRecipient({
                name,
                type,
                contactNo,
                email
            });

            res.json(recipient);
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         await createRecipient({
    //             name: `lastmjs${v4()}`,
    //             age: i
    //         });
    //     }

    //     res.json({
    //         Success: `${num} recipients created`
    //     });
    // });

    router.post('/update', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deleteRecipient(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number; name?: string; type?: string; contactNo?: number; email?: string; }>,
    res: Response
): Promise<void> {
    const { id, name, type, contactNo, email } = req.body;

    const recipient = await updateRecipient({
        id,
        name,
        type,
        contactNo,
        email
    });

    res.json(recipient);
}
