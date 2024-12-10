import express, { Request, Response, Router } from "express";
import { UsedWSRWSI } from "./db";

export function getRouter(): Router {
  const router = express.Router();

  // Get all used WSR/WSI numbers
  router.get(
    "/",
    async (
      req: Request<
        any,
        any,
        any,
        {
          type?: "WSR" | "WSI";
          limit?: string;
          offset?: string;
        }
      >,
      res: Response
    ) => {
      try {
        const limit = Number(req.query.limit ?? 10);
        const offset = Number(req.query.offset ?? 0);
        const type = req.query.type;

        const queryBuilder = UsedWSRWSI.createQueryBuilder(
          "usedNumbers"
        ).orderBy("usedNumbers.createdAt", "DESC");

        // Optional filtering by type
        if (type) {
          queryBuilder.andWhere("usedNumbers.type = :type", { type });
        }

        const [data, total] = await queryBuilder
          .take(limit)
          .skip(offset)
          .getManyAndCount();

        res.json({
          data,
          total,
          limit,
          offset,
        });
      } catch (error) {
        res.status(500).json({
          message:
            error instanceof Error
              ? error.message
              : "Error fetching used numbers",
        });
      }
    }
  );

  // Get a specific used number by its ID
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const usedNumber = await UsedWSRWSI.findOne({
        where: { id: Number(id) },
        relations: {
          // Add any relations if needed
        },
      });

      if (!usedNumber) {
        return res.status(404).json({ message: "Used number not found" });
      }

      res.json(usedNumber);
    } catch (error) {
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Error fetching used number",
      });
    }
  });

  // Search used numbers
  router.get(
    "/search",
    async (
      req: Request<
        any,
        any,
        any,
        {
          number?: string;
          type?: "WSR" | "WSI";
          limit?: string;
          offset?: string;
        }
      >,
      res: Response
    ) => {
      try {
        const limit = Number(req.query.limit ?? 10);
        const offset = Number(req.query.offset ?? 0);
        const number = req.query.number;
        const type = req.query.type;

        const queryBuilder = UsedWSRWSI.createQueryBuilder(
          "usedNumbers"
        ).orderBy("usedNumbers.createdAt", "DESC");

        // Filter by number (if provided)
        if (number) {
          queryBuilder.andWhere("usedNumbers.number::text LIKE :number", {
            number: `%${number}%`,
          });
        }

        // Filter by type (if provided)
        if (type) {
          queryBuilder.andWhere("usedNumbers.type = :type", { type });
        }

        const [data, total] = await queryBuilder
          .take(limit)
          .skip(offset)
          .getManyAndCount();

        res.json({
          data,
          total,
          limit,
          offset,
        });
      } catch (error) {
        res.status(500).json({
          message:
            error instanceof Error
              ? error.message
              : "Error searching used numbers",
        });
      }
    }
  );

  // Count of used numbers
  router.get("/count", async (_req, res) => {
    try {
      const total = await UsedWSRWSI.count();
      res.json({ total });
    } catch (error) {
      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Error counting used numbers",
      });
    }
  });

  return router;
}
