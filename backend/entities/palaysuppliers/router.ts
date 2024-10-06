import express, { Request, Response, Router } from 'express';

import { createHouseOfficeAddress } from '../houseofficeaddresses/db';
import {
    countPalaySuppliers,
    createPalaySupplier,
    getPalaySupplier,
    getPalaySuppliers,
    updatePalaySupplier
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

            const palaySuppliers = await getPalaySuppliers(limit, offset);

            res.json(palaySuppliers);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countPalaySuppliers());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const palaySupplier = await getPalaySupplier(Number(id));

        res.json(palaySupplier);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { farmerName: string;
                region: string;
                province: string;
                cityTown: string;
                barangay: string;
                street: string;
                category: string;
                numOfFarmer: number;
                contactNumber: string;
                email: string;
                birthDate: Date;
                gender: string }>,
            res
        ) => {
            const { farmerName,
                region,
                province,
                cityTown,
                barangay,
                street,
                category,
                numOfFarmer,
                contactNumber,
                email,
                birthDate,
                gender } = req.body;

            const houseOfficeAddress = await createHouseOfficeAddress({
                region: region,
                province: province,
                cityTown: cityTown,
                barangay: barangay,
                street: street
            });

            const palaySupplier = await createPalaySupplier({
                farmerName,
                houseOfficeAddressId: houseOfficeAddress.id,
                category,
                numOfFarmer,
                contactNumber,
                email,
                birthDate,
                gender
            });

            res.json(palaySupplier);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number;
        farmerName?: string;
        category?: string;
        numOfFarmer?: number;
        contactNumber?: string;
        email?: string;
        birthDate?: Date;
        gender?: string  }>,
    res: Response
): Promise<void> {
    const { id,
        farmerName,
        category,
        numOfFarmer,
        contactNumber,
        email,
        birthDate,
        gender } = req.body;

    const palaySupplier = await updatePalaySupplier({
        id,
        farmerName,
        category,
        numOfFarmer,
        contactNumber,
        email,
        birthDate,
        gender
    });

    res.json(palaySupplier);
}
