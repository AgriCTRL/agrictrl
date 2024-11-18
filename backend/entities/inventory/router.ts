import express from 'express';
import { getInventory } from './db';
import { getEnhancedInventory } from './db';
import { InventoryFilters, ProcessingType } from './types';

export function getRouter(): express.Router {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const filters: InventoryFilters = {
                toLocationType: req.query.toLocationType as string,
                status: req.query.status as string,
                item: req.query.item as string,
                millerType: req.query.millerType as 'In House' | 'Private' | undefined,
                userId: req.query.userId as string,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
            };

            // Handle palayStatus array or single value
            if (req.query.palayStatus) {
                filters.palayStatus = Array.isArray(req.query.palayStatus)
                    ? req.query.palayStatus as string[]
                    : [req.query.palayStatus as string];
            }

            // Handle processing types
            if (req.query.processingBatch) {
                filters.processingTypes = (Array.isArray(req.query.processingBatch)
                    ? req.query.processingBatch
                    : [req.query.processingBatch]
                ).filter((type): type is ProcessingType =>
                    type === 'drying' || type === 'milling'
                );
            }

            if (!filters.toLocationType) {
                return res.status(400).json({ error: 'Missing required parameter: toLocationType' });
            }

            const inventory = await getInventory(filters);
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
                palayStatus: req.query.palayBatchStatus as string,
                status: req.query.transactionStatus as string,
                processingTypes,
                millingBatchId: req.query.millingBatchId as string,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
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