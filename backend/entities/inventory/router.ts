import express from 'express';
import { getInventory, getEnhancedInventory, getInventoryByPileId } from './db';
import { InventoryFilters, ProcessingType } from './types';

export function getRouter(): express.Router {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const filters: InventoryFilters = {
              toLocationType: Array.isArray(req.query.toLocationType) 
              ? req.query.toLocationType as string[] 
              : req.query.toLocationType 
                  ? [req.query.toLocationType as string] 
                  : undefined,
                transactionStatus: req.query.status as string,
                processingStatus: req.query.processingStatus as string,
                item: req.query.item as string,
                millerType: req.query.millerType as 'In House' | 'Private' | undefined,
                userId: req.query.userId as string,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
                wsr: req.query.wsr as string,
                wsi: req.query.wsi as string
            };

            // Validate required parameters
            if (!filters.toLocationType) {
                return res.status(400).json({ error: 'Missing required parameter: toLocationType' });
            }

            // If destination is warehouse, require userId
            if (filters.toLocationType === 'Warehouse' && !filters.userId) {
                return res.status(400).json({ error: 'Missing required parameter: userId for warehouse filtering' });
            }

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
                palaybatchId: req.query.palaybatchId as string,
                palayStatus: req.query.palayBatchStatus as string,
                transactionStatus: req.query.transactionStatus as string,
                processingStatus: req.query.processingStatus as string,
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

    router.get('/by-pile/:pileId', async (req, res) => {
        try {
            const { pileId } = req.params;

            if (!pileId) {
                return res.status(400).json({ error: 'Missing required parameter: pileId' });
            }

            const filters: InventoryFilters = {
                toLocationType: req.query.toLocationType as string,
                transactionStatus: req.query.status as string,
                processingStatus: req.query.processingStatus as string,
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

            const inventory = await getInventoryByPileId(pileId, filters);
            res.json(inventory);
        } catch (error) {
            console.error('Error fetching inventory by pile:', error);
            res.status(500).json({
                error: 'Internal server error',
                details: String(error)
            });
        }
    });

    router.get('/pending/count', async (req, res) => {
        try {
            const userId = req.query.userId as string;
    
            if (!userId) {
                return res.status(400).json({ error: 'Missing required parameter: userId' });
            }
    
            const filters: InventoryFilters = {
                toLocationType: 'Warehouse',
                transactionStatus: 'Pending',
                userId: userId
            };
    
            const inventory = await getInventory(filters);
            
            res.json(inventory.total);
        } catch (error) {
            console.error('Error fetching pending inventory count:', error);
            res.status(500).json({
                error: 'Internal server error',
                details: String(error)
            });
        }
    });
    
    return router;
}