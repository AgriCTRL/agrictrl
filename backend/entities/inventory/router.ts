import express from 'express';
import { getInventory } from './db';
import { getEnhancedInventory } from './db';
import { InventoryFilters, ProcessingType } from './types';

export function getRouter(): express.Router {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const toLocationType = req.query.toLocationType as string;
            const status = req.query.status as string | undefined;
            const batchType = req.query.batchType as 'drying' | 'milling' | undefined;
            const millerType = req.query.millerType as 'In House' | 'Private' | undefined;
            const userId = req.query.userId as string | undefined;

            if (!toLocationType) {
                return res.status(400).json({ error: 'Missing required parameter: toLocationType' });
            }

            const inventory = await getInventory(toLocationType, status, batchType, millerType, userId);
            res.json(inventory);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            res.status(500).json({
                error: 'Internal server error',
                details: String(error)
            });
        }
    });

    router.get('/enhanced', async (req, res) => {
        try {
            const processingTypes = (Array.isArray(req.query.processingBatch) 
                ? req.query.processingBatch 
                : req.query.processingBatch 
                    ? [req.query.processingBatch] 
                    : []
            ).filter((type): type is ProcessingType => 
                type === 'drying' || type === 'milling'
            );

            const filters: InventoryFilters = {
                palayBatchStatus: req.query.palayBatchStatus as string,
                transactionStatus: req.query.transactionStatus as string,
                processingTypes,
                millingBatchId: req.query.millingBatchId as string // Changed to not parse as integer
            };

            const inventory = await getEnhancedInventory(filters);
            res.json(inventory);
        } catch (error) {
            console.error('Error fetching enhanced inventory:', error);
            res.status(500).json({
                error: 'Internal server error',
                details: String(error)
            });
        }
    });
    
    return router;
}