import express from 'express';
import { getInventory } from './db';

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
    
    return router;
}