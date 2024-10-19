import express, { Request, Response, Router } from 'express';

import { createBuyingStation } from '../buyingstations/db';
import { createQualitySpec } from '../qualityspecs/db';
import { createPalaySupplier } from '../palaysuppliers/db';
import { createHouseOfficeAddress } from '../houseofficeaddresses/db';
import { createFarm } from '../farms/db';
import {
    countPalayBatches,
    createPalayBatch,
    getPalayBatch,
    getPalayBatches,
    updatePalayBatch
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

            const palayBatches = await getPalayBatches(limit, offset);

            res.json(palayBatches);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countPalayBatches());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const palayBatch = await getPalayBatch(Number(id));

        res.json(palayBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { palayVariety: string;
                dateBought: Date;
                buyingStationName: string;
                location: string;
                quantityBags: number;
                grossWeight: number;
                netWeight: number;
                qualityType: string;
                moistureContent: number;
                purity: number;
                damaged: number;
                price: number;
                farmerName: string;
                palaySupplierRegion: string;
                palaySupplierProvince: string;
                palaySupplierCityTown: string;
                palaySupplierBarangay: string;
                palaySupplierStreet: string;
                category: string;
                numOfFarmer: number;
                contactNumber: string;
                email: string;
                birthDate: Date;
                gender: string;
                farmSize: number;
                farmRegion: string;
                farmProvince: string;
                farmCityTown: string;
                farmBarangay: string;
                farmStreet: string;
                plantedDate: Date;
                harvestedDate: Date;
                estimatedCapital: number;
                status: string }>,
            res
        ) => {
            const { palayVariety,
                dateBought,
                buyingStationName,
                location,
                quantityBags,
                grossWeight,
                netWeight,
                qualityType,
                moistureContent,
                purity,
                damaged,
                price,
                farmerName,
                palaySupplierRegion,
                palaySupplierProvince,
                palaySupplierCityTown,
                palaySupplierBarangay,
                palaySupplierStreet,
                category,
                numOfFarmer,
                contactNumber,
                email,
                birthDate,
                gender,
                farmSize,
                farmRegion,
                farmProvince,
                farmCityTown,
                farmBarangay,
                farmStreet,
                plantedDate,
                harvestedDate,
                estimatedCapital,
                status } = req.body;

            const buyingStation = await createBuyingStation({
                buyingStationName: buyingStationName,
                location: location
            })

            const qualitySpec = await createQualitySpec({
                moistureContent: moistureContent,
                purity: purity,
                damaged: damaged
            });

            const houseOfficeAddress = await createHouseOfficeAddress({
                region: palaySupplierRegion,
                province: palaySupplierProvince,
                cityTown: palaySupplierCityTown,
                barangay: palaySupplierBarangay,
                street: palaySupplierStreet
            })

            const palaySupplier = await createPalaySupplier({
                farmerName: farmerName,
                houseOfficeAddressId: houseOfficeAddress.id,
                category: category,
                numOfFarmer: numOfFarmer,
                contactNumber: contactNumber,
                email: email,
                birthDate: birthDate,
                gender: gender
            })

            const farm = await createFarm({
                palaySupplierId: palaySupplier.id,
                farmSize: farmSize,
                region: farmRegion,
                province: farmProvince,
                cityTown: farmCityTown,
                barangay: farmBarangay,
                street: farmStreet
            })

            const palayBatch = await createPalayBatch({
                palayVariety,
                dateBought,
                buyingStationId: buyingStation.id,
                quantityBags,
                grossWeight,
                netWeight,
                qualityType,
                qualitySpecId: qualitySpec.id,
                price,
                palaySupplierId: palaySupplier.id,
                farmId: farm.id,
                plantedDate,
                harvestedDate,
                estimatedCapital,
                status
            });

            res.json(palayBatch);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number;
        palayVariety?: string
        dateBought?: Date;
        quantityBags?: number;
        grossWeight?: number;
        netWeight?: number;
        qualityType?: string;
        price?: number
        plantedDate?: Date;
        harvestedDate?: Date;
        estimatedCapital?: number;
        status?: string }>,
    res: Response
): Promise<void> {
    const { id,
        palayVariety,
        dateBought,
        quantityBags,
        grossWeight,
        netWeight,
        qualityType,
        price,
        plantedDate,
        harvestedDate,
        estimatedCapital,
        status } = req.body;

    const palayBatch = await updatePalayBatch({
        id,
        palayVariety,
        dateBought,
        quantityBags,
        grossWeight,
        netWeight,
        qualityType,
        price,
        plantedDate,
        harvestedDate,
        estimatedCapital,
        status
    });

    res.json(palayBatch);
}
