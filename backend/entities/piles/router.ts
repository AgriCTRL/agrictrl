import express, { Request, Response, Router } from 'express';
import {
    createPile,
    getPile,
    getPiles,
    getPilesByWarehouse,
    updatePile
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

            const piles = await getPiles(limit, offset);

            res.json(piles);
        }
    );

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const pile = await getPile(String(id));

        res.json(pile);
    });

    router.get(
        '/warehouse/:warehouseId',
        async (
            req: Request<{ warehouseId: string }, any, any, { limit?: string; offset?: string }>,
            res
        ) => {
            const { warehouseId } = req.params;
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);

            const piles = await getPilesByWarehouse(warehouseId, limit, offset);

            res.json(piles);
        }
    );

    router.post(
        '/',
        async (
            req: Request<any, any, {
                warehouseId: string;
                pileNumber: string;
                maxCapacity: number;
                currentQuantity: number;
                description: string;
                status: string;
            }>,
            res
        ) => {
            const { warehouseId, pileNumber, maxCapacity, currentQuantity, description, status } = req.body;

            const pile = await createPile({
                warehouseId,
                pileNumber,
                maxCapacity,
                currentQuantity,
                description,
                status
            });

            res.json(pile);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, {
        id: string;
        pileNumber: string;
        maxCapacity?: number;
        currentQuantity?: number;
        description?: string;
        status?: string;
    }>,
    res: Response
): Promise<void> {
    const { id, pileNumber, maxCapacity, currentQuantity, description, status } = req.body;

    const pile = await updatePile({
        id,
        pileNumber,
        maxCapacity,
        currentQuantity,
        description,
        status
    });

    res.json(pile);
}