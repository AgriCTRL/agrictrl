import express, { Request, Response, Router } from 'express';

import {
    countTransporters,
    createTransporter,
    getTransporter,
    getTransporters,
    getTransportersByUserId,
    getTransportersByType,
    updateTransporter
} from './db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/',
        async (
            req: Request<any, any, any, { 
                limit?: string; 
                offset?: string; 
                status?: string;
                transporterType?: string;
                userId?: string;
            }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);
            
            const options = {
                status: req.query.status ? String(req.query.status) : undefined,
                transporterType: req.query.transporterType ? String(req.query.transporterType) : undefined,
                userId: req.query.userId ? String(req.query.userId) : undefined
            };

            const transporters = await getTransporters(limit, offset, options);

            res.json(transporters);
        }
    );

    router.get('/count', async (req, res) => {
        const options = {
            status: req.query.status ? String(req.query.status) : undefined,
            transporterType: req.query.transporterType ? String(req.query.transporterType) : undefined,
            userId: req.query.userId ? String(req.query.userId) : undefined
        };

        res.json(await countTransporters(options));
    });

    router.get('/user/:userId', async (req, res) => {
        const { userId } = req.params;

        const transporters = await getTransportersByUserId(String(userId));

        res.json(transporters);
    });

    router.get('/type/:transporterType', async (req, res) => {
        const { transporterType } = req.params;

        const transporters = await getTransportersByType(String(transporterType));

        res.json(transporters);
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const transporter = await getTransporter(String(id));

        res.json(transporter);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { 
                transporterType: string; 
                transporterName: string; 
                plateNumber: string; 
                description: string;
                status: string;
                userId: string
            }>,
            res
        ) => {
            const { 
                transporterType, 
                transporterName, 
                plateNumber, 
                description,
                status,
                userId
            } = req.body;

            const transporter = await createTransporter({
                transporterType,
                transporterName,
                plateNumber,
                description,
                status,
                userId
            });

            res.json(transporter);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { 
        id: string; 
        transporterType?: string; 
        transporterName?: string; 
        plateNumber?: string; 
        description?: string;
        status?: string;
        userId?: string
    }>,
    res: Response
): Promise<void> {
    const { 
        id, 
        transporterType, 
        transporterName, 
        plateNumber, 
        description,
        status,
        userId
    } = req.body;

    const transporter = await updateTransporter({
        id,
        transporterType,
        transporterName,
        plateNumber,
        description,
        status,
        userId
    });

    res.json(transporter);
}