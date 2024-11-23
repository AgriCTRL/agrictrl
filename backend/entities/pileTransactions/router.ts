import express, { Request, Response, Router } from 'express';
import {
  createPileTransaction,
  getPileTransactions,
  getPileTransactionsByPile,
  getPileTransactionsByPalayBatch
} from './db';

export function getRouter(): Router {
  const router = express.Router();

  router.get(
    '/',
    async (
      req: Request<any, any, any, { limit?: string; offset?: string }>,
      res
    ) => {
      const limit = Number(req.query.limit ?? 10);
      const offset = Number(req.query.offset ?? 0);

      const result = await getPileTransactions(limit, offset);
      res.json(result);
    }
  );

  router.get(
    '/pile/:pileId',
    async (
      req: Request<{ pileId: string }, any, any, { limit?: string; offset?: string }>,
      res
    ) => {
      const { pileId } = req.params;
      const limit = Number(req.query.limit ?? 10);
      const offset = Number(req.query.offset ?? 0);

      const result = await getPileTransactionsByPile(pileId, limit, offset);
      res.json(result);
    }
  );

  router.get(
    '/palaybatch/:palayBatchId',
    async (
      req: Request<{ palayBatchId: string }, any, any, { limit?: string; offset?: string }>,
      res
    ) => {
      const { palayBatchId } = req.params;
      const limit = Number(req.query.limit ?? 10);
      const offset = Number(req.query.offset ?? 0);

      const result = await getPileTransactionsByPalayBatch(palayBatchId, limit, offset);
      res.json(result);
    }
  );

  router.post(
    '/',
    async (
      req: Request<
        any,
        any,
        {
          palayBatchId: string;
          pileId: string;
          transactionType: 'IN' | 'OUT';
          quantityBags: number;
          transactionDate: Date;
          performedBy: string;
          notes?: string;
        }
      >,
      res
    ) => {
      const {
        palayBatchId,
        pileId,
        transactionType,
        quantityBags,
        transactionDate,
        performedBy,
        notes
      } = req.body;

      const pileTransaction = await createPileTransaction({
        palayBatchId,
        pileId,
        transactionType,
        quantityBags,
        transactionDate,
        performedBy,
        notes
      });

      res.json(pileTransaction);
    }
  );

  return router;
}