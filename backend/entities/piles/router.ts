import express, { Request, Response, Router } from 'express';
import {
    createPile,
    getPile,
    getPiles,
    getPilesByWarehouse,
    getPilesByWarehouseWithTypeAgeFilter,
    updatePile
} from './db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/',
        async (
            req: Request<any, any, any, {
                limit?: string;
                offset?: string;
                pbLimit?: string;
                pbOffset?: string;
            }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);
            const pbLimit = req.query.pbLimit ? Number(req.query.pbLimit) : undefined;
            const pbOffset = req.query.pbOffset ? Number(req.query.pbOffset) : undefined;

            const piles = await getPiles(limit, offset, pbLimit, pbOffset);

            res.json(piles);
        }
    );

    router.get(
        '/:id',
        async (
            req: Request<{ id: string }, any, any, {
                pbLimit?: string;
                pbOffset?: string;
            }>,
            res
        ) => {
            const { id } = req.params;
            const pbLimit = req.query.pbLimit ? Number(req.query.pbLimit) : undefined;
            const pbOffset = req.query.pbOffset ? Number(req.query.pbOffset) : undefined;

            const pile = await getPile(String(id), pbLimit, pbOffset);

            res.json(pile);
        }
    );

    router.get(
        '/warehouse/:warehouseId',
        async (
            req: Request<
                { warehouseId: string },
                any,
                any,
                {
                    limit?: string;
                    offset?: string;
                    pbLimit?: string;
                    pbOffset?: string;
                    pileNumber?: string;
                    wsr?: number;
                }
            >,
            res
        ) => {
            const { warehouseId } = req.params;
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);
            const pbLimit = req.query.pbLimit ? Number(req.query.pbLimit) : undefined;
            const pbOffset = req.query.pbOffset ? Number(req.query.pbOffset) : undefined;
            const pileNumber = req.query.pileNumber;
            const wsr = req.query.wsr;

            const piles = await getPilesByWarehouse(
                warehouseId,
                limit,
                offset,
                pileNumber,
                pbLimit,
                pbOffset,
                wsr
            );

            res.json(piles);
        }
    );

    router.get(
        '/warehouse/:warehouseId/filtered-piles',
        async (req, res) => {
          const { warehouseId } = req.params;
      
          // Fetch Palay piles
          const palayPiles = await getPilesByWarehouseWithTypeAgeFilter(
            warehouseId,
            'Palay', 
            6
          );
      
          // Fetch Rice piles
          const ricePiles = await getPilesByWarehouseWithTypeAgeFilter(
            warehouseId,
            'Rice', 
            9
          );
      
          res.json(palayPiles + ricePiles);
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
                type: string;
                age: number;
                price: number;
                forSale: boolean;
            }>,
            res
        ) => {
            const { warehouseId, pileNumber, maxCapacity, currentQuantity, description, status, type, age, price, forSale } = req.body;

            const pile = await createPile({
                warehouseId,
                pileNumber,
                maxCapacity,
                currentQuantity,
                description,
                status,
                type,
                age,
                price,
                forSale,

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
        type?: string;
        age?: number;
        price?: number;
        forSale?: boolean;
    }>,
    res: Response
): Promise<void> {
    const { id, pileNumber, maxCapacity, currentQuantity, description, status, type, age, price, forSale } = req.body;

    const pile = await updatePile({
        id,
        pileNumber,
        maxCapacity,
        currentQuantity,
        description,
        status,
        type,
        age,
        price,
        forSale
    });

    res.json(pile);
}