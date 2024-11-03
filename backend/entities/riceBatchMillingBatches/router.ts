import express, { Request, Response, Router } from 'express';
import {
    getRiceBatchMillingBatch,
    getRiceBatchMillingBatches,
    getRiceBatchMillingBatchesByRiceBatch,
    getRiceBatchMillingBatchesByMillingBatch,
    createRiceBatchMillingBatch,
    updateRiceBatchMillingBatch,
    RiceBatchMillingBatchCreate,
    RiceBatchMillingBatchUpdate
} from './db';

export function getRouter(): Router {
    const router = express.Router();

    router.get('/', async (
        req: Request<any, any, any, { 
            limit?: string; 
            offset?: string;
            relations?: string;
        }>,
        res
    ) => {
        const limit = Number(req.query.limit ?? -1);
        const offset = Number(req.query.offset ?? 0);
        const relations = req.query.relations !== 'false';

        const junctions = await getRiceBatchMillingBatches(limit, offset, relations);
        res.json(junctions);
    });

    router.get('/:id', async (
        req: Request<{ id: string }, any, any, { relations?: string }>,
        res
    ) => {
        const { id } = req.params;
        const relations = req.query.relations !== 'false';
        const junction = await getRiceBatchMillingBatch(String(id), relations);
        res.json(junction);
    });

    router.get('/byRiceBatch/:riceBatchId', async (
        req: Request<{ riceBatchId: string }, any, any, { relations?: string }>,
        res
    ) => {
        const { riceBatchId } = req.params;
        const relations = req.query.relations !== 'false';
        const junctions = await getRiceBatchMillingBatchesByRiceBatch(String(riceBatchId), relations);
        res.json(junctions);
    });

    router.get('/byMillingBatch/:millingBatchId', async (
        req: Request<{ millingBatchId: string }, any, any, { relations?: string }>,
        res
    ) => {
        const { millingBatchId } = req.params;
        const relations = req.query.relations !== 'false';
        const junctions = await getRiceBatchMillingBatchesByMillingBatch(String(millingBatchId), relations);
        res.json(junctions);
    });

    router.post('/', async (
        req: Request<any, any, RiceBatchMillingBatchCreate>,
        res
    ) => {
        const junction = await createRiceBatchMillingBatch(req.body);
        res.json(junction);
    });

    router.post('/update', async (
        req: Request<any, any, RiceBatchMillingBatchUpdate>,
        res: Response
    ) => {
        const junction = await updateRiceBatchMillingBatch(req.body);
        res.json(junction);
    });

    return router;
}