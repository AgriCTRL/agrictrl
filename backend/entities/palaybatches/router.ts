import express, { Request, Response, Router } from "express";

import { createQualitySpec } from "../qualityspecs/db";
import { createPalaySupplier, getPalaySupplier } from "../palaysuppliers/db";
import { createHouseOfficeAddress } from "../houseofficeaddresses/db";
import { createFarm } from "../farms/db";
import {
  countPalayBatches,
  createPalayBatch,
  getPalayBatch,
  getPalayBatches,
  updatePalayBatch,
  getTotalQuantityBags,
  getTotalPalayQuantityBags,
  searchPalayBatches,
  PalayBatch,
} from "./db";
import { 
  checkExistingWSR, 
  checkExistingWSI, 
  recordUsedWSRWSI 
} from "../usedwsrwsi/db";

export function getRouter(): Router {
  const router = express.Router();

  router.get(
    "/",
    async (
      req: Request<any, any, any, { limit?: string; offset?: string }>,
      res
    ) => {
      const limit = Number(req.query.limit ?? 10);
      const offset = Number(req.query.offset ?? 0);
  
      const result = await getPalayBatches(limit, offset);
      res.json(result);
    }
  );

  router.get(
    "/search",
    async (
      req: Request<any, any, any, { 
        wsr?: string;
        status?: string;
        farmerName?: string;
        limit?: string; 
        offset?: string;
        // Add other search params as needed 
      }>,
      res
    ) => {
      const limit = Number(req.query.limit ?? 10);
      const offset = Number(req.query.offset ?? 0);
      const searchParams = {
        wsr: req.query.wsr,
        status: req.query.status,
        farmerName: req.query.farmerName,
        // Add other search params
      };
  
      const result = await searchPalayBatches(searchParams, limit, offset);
      res.json(result);
    }
  );

  router.get("/count", async (_req, res) => {
    res.json(await countPalayBatches());
  });

  router.get("/count/milled", async (_req, res) => {
    const queryBuilder = PalayBatch.createQueryBuilder("palayBatch")
      .where("LOWER(palayBatch.status) = LOWER(:status)", { status: "Milled" });
  
    const total = await queryBuilder.getCount();
    res.json(total);
  });

  router.get("/totals/quantity-bags", async (_req, res) => {
    const total = await getTotalQuantityBags();
    res.json({ total });
  });

  router.get("/totals/palay-quantity-bags", async (_req, res) => {
    const total = await getTotalPalayQuantityBags();
    res.json({ total });
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const palayBatch = await getPalayBatch(String(id));

    res.json(palayBatch);
  });

  router.post(
    "/",
    async (
      req: Request<
        any,
        any,
        {
          dateBought: Date;
          wsr: number;
          wsi: number;
          age: number;
          buyingStationName: string;
          buyingStationLoc: string;
          currentQuantityBags: number;
          quantityBags: number;
          grossWeight: number;
          netWeight: number;
          qualityType: string;
          moistureContent: number;
          purity: number;
          damaged: number;
          varietyCode: string;
          price: number;
          palaySupplierId?: string;
          farmerName?: string;
          palaySupplierRegion?: string;
          palaySupplierProvince?: string;
          palaySupplierCityTown?: string;
          palaySupplierBarangay?: string;
          palaySupplierStreet?: string;
          category?: string;
          numOfFarmer?: number;
          contactNumber?: string;
          email?: string;
          birthDate?: Date;
          gender?: string;
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
          weighedBy: string;
          correctedBy: string;
          classifiedBy: string;
          status: string;
          pileId: string;
        }
      >,
      res: Response
    ) => {
      try {
        const {
          dateBought,
          wsr,
          wsi,
          age,
          buyingStationName,
          buyingStationLoc,
          currentQuantityBags,
          quantityBags,
          grossWeight,
          netWeight,
          qualityType,
          moistureContent,
          purity,
          damaged,
          varietyCode,
          price,
          palaySupplierId,
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
          weighedBy,
          correctedBy,
          classifiedBy,
          status,
          pileId,
        } = req.body;

        const wsrExists = await checkExistingWSR(wsr);
        if (wsrExists) {
          return res.status(400).json({ 
            message: `WSR ${wsr} has already been used` 
          });
        }
  
        if (!palaySupplierId) {
          const houseOfficeAddress = await createHouseOfficeAddress({
            region: palaySupplierRegion,
            province: palaySupplierProvince,
            cityTown: palaySupplierCityTown,
            barangay: palaySupplierBarangay,
            street: palaySupplierStreet,
          });
    
          const palaySupplier = await createPalaySupplier({
            farmerName: farmerName,
            houseOfficeAddressId: houseOfficeAddress.id,
            category: category,
            numOfFarmer: numOfFarmer,
            contactNumber: contactNumber,
            email: email,
            birthDate: birthDate,
            gender: gender,
          });
  
          const qualitySpec = await createQualitySpec({
            moistureContent: moistureContent,
            purity: purity,
            damaged: damaged,
          });
    
          const farm = await createFarm({
            palaySupplierId: palaySupplier.id,
            farmSize: farmSize,
            region: farmRegion,
            province: farmProvince,
            cityTown: farmCityTown,
            barangay: farmBarangay,
            street: farmStreet,
          });
    
          const palayBatch = await createPalayBatch({
            dateBought,
            wsr,
            wsi,
            age,
            buyingStationName,
            buyingStationLoc,
            currentQuantityBags,
            quantityBags,
            grossWeight,
            netWeight,
            qualityType,
            qualitySpecId: qualitySpec.id,
            varietyCode,
            price,
            palaySupplierId: palaySupplier.id,
            farmId: farm.id,
            plantedDate,
            harvestedDate,
            estimatedCapital,
            currentlyAt,
            weighedBy,
            correctedBy,
            classifiedBy,
            status,
            pileId,
          });
          await recordUsedWSRWSI(wsr, "WSR", palayBatch.id);
          res.json(palayBatch);
        } else {
          const qualitySpec = await createQualitySpec({
            moistureContent: moistureContent,
            purity: purity,
            damaged: damaged,
          });
    
          const farm = await createFarm({
            palaySupplierId: palaySupplierId,
            farmSize: farmSize,
            region: farmRegion,
            province: farmProvince,
            cityTown: farmCityTown,
            barangay: farmBarangay,
            street: farmStreet,
          });
    
          const palayBatch = await createPalayBatch({
            dateBought,
            wsr,
            wsi,
            age,
            buyingStationName,
            buyingStationLoc,
            currentQuantityBags,
            quantityBags,
            grossWeight,
            netWeight,
            qualityType,
            qualitySpecId: qualitySpec.id,
            varietyCode,
            price,
            palaySupplierId: palaySupplierId,
            farmId: farm.id,
            plantedDate,
            harvestedDate,
            estimatedCapital,
            currentlyAt,
            weighedBy,
            correctedBy,
            classifiedBy,
            status,
            pileId,
          });
          await recordUsedWSRWSI(wsr, "WSR", palayBatch.id);
          res.json(palayBatch);
        }
      } catch (error) {
        res.status(500).json({ 
          message: error instanceof Error ? error.message : 'Error creating palay batch' 
        });
      }
    }
  );
  
  router.post("/update", 
    async (
      req: Request<
        any,
        any,
        {
          id: string;
          dateBought?: Date;
          wsr?: number;
          wsi?: number;
          age?: number;
          buyingStationName?: string;
          buyingStationLoc?: string;
          currentQuantityBags?: number;
          quantityBags?: number;
          grossWeight?: number;
          netWeight?: number;
          qualityType?: string;
          varietyCode?: string;
          price?: number;
          plantedDate?: Date;
          harvestedDate?: Date;
          estimatedCapital?: number;
          currentlyAt?: string;
          weighedBy?: string;
          correctedBy?: string;
          classifiedBy?: string;
          status?: string;
          pileId?: string;
        }
      >,
      res: Response
    ) => {
      try {
        const { id, wsr, wsi, ...updateData } = req.body;

        // Get the existing palay batch to compare
        const existingPalayBatch = await getPalayBatch(id);
        if (!existingPalayBatch) {
          return res.status(404).json({ message: "Palay Batch not found" });
        }

        // Check WSR if provided and different from existing
        if (wsr !== undefined && wsr !== existingPalayBatch.wsr) {
          const wsrExists = await checkExistingWSR(wsr);
          if (wsrExists) {
            return res.status(400).json({ 
              message: `WSR ${wsr} has already been used` 
            });
          }
        }

        // Check WSI if provided and different from existing
        if (wsi !== undefined && wsi !== existingPalayBatch.wsi) {
          const wsiExists = await checkExistingWSI(wsi);
          if (wsiExists) {
            return res.status(400).json({ 
              message: `WSI ${wsi} has already been used` 
            });
          }
        }

        // Prepare update data
        const updatePayload = {
          id,
          wsr,
          wsi,
          ...updateData
        };

        const palayBatch = await updatePalayBatch(updatePayload);

        // If WSR changed, record the new used WSR
        if (wsr !== undefined && wsr !== existingPalayBatch.wsr) {
          await recordUsedWSRWSI(wsr, "WSR", palayBatch.id);
        }

        // If WSI changed, record the new used WSI
        if (wsi !== undefined && wsi !== existingPalayBatch.wsi) {
          await recordUsedWSRWSI(wsi, "WSI", palayBatch.id);
        }

        res.json(palayBatch);
      } catch (error) {
        res.status(500).json({ 
          message: error instanceof Error ? error.message : 'Error updating palay batch' 
        });
      }
    }
  );

  return router;
}
