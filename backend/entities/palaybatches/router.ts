import express, { Request, Response, Router } from 'express';

import { createQualitySpec } from '../qualityspecs/db';
import { createPalaySupplier } from '../palaysuppliers/db';
import { createHouseOfficeAddress } from '../houseofficeaddresses/db';
import { createFarm } from '../farms/db';
import {
    countPalayBatches,
    createPalayBatch,
    getPalayBatch,
    getPalayBatches,
    updatePalayBatch,
    getTotalQuantityBags,
    getTotalPalayQuantityBags
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

    router.get('/totals/quantity-bags', async (_req, res) => {
        const total = await getTotalQuantityBags();
        res.json({ total });
    });

    router.get('/totals/palay-quantity-bags', async (_req, res) => {
        const total = await getTotalPalayQuantityBags();
        res.json({ total });
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const palayBatch = await getPalayBatch(String(id));

        res.json(palayBatch);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { palayVariety: string;
                dateBought: Date;
                buyingStationName: string;
                buyingStationLoc: string;
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
                currentlyAt: string;
                status: string }>,
            res
        ) => {
            const { palayVariety,
                dateBought,
                buyingStationName,
                buyingStationLoc,
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
                currentlyAt,
                status } = req.body;

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
                buyingStationName,
                buyingStationLoc,
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
                currentlyAt,
                status
            });

            res.json(palayBatch);
        }
    );

    router.post('/update', updateHandler);

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: string;
        palayVariety?: string
        dateBought?: Date;
        buyingStationName?: string;
        buyingStationLoc?: string;
        quantityBags?: number;
        grossWeight?: number;
        netWeight?: number;
        qualityType?: string;
        price?: number
        plantedDate?: Date;
        harvestedDate?: Date;
        estimatedCapital?: number;
        currentlyAt?: string;
        status?: string }>,
    res: Response
): Promise<void> {
    const { id,
        palayVariety,
        dateBought,
        buyingStationName,
        buyingStationLoc,
        quantityBags,
        grossWeight,
        netWeight,
        qualityType,
        price,
        plantedDate,
        harvestedDate,
        estimatedCapital,
        currentlyAt,
        status } = req.body;

    const palayBatch = await updatePalayBatch({
        id,
        palayVariety,
        dateBought,
        buyingStationName,
        buyingStationLoc,
        quantityBags,
        grossWeight,
        netWeight,
        qualityType,
        price,
        plantedDate,
        harvestedDate,
        estimatedCapital,
        currentlyAt,
        status
    });

    res.json(palayBatch);
}
