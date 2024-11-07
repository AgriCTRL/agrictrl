import express from "express";
import {
  getDailySummary,
  getWeeklySummary,
  getMonthlySummary,
  getAnnualSummary,
  getMonthlyWeeklySummary,
  getWarehouseInventoryTrend, 
  getMillersEfficiencyComparison,
  getRiceInventoryTimeSeries
} from "./db";

const router = express.Router();

router.get("/daily-summary", async (req, res) => {
  const { date } = req.query;
  const parsedDate = new Date(date as string);
  const summary = await getDailySummary(parsedDate);
  res.json(summary);
});

router.get("/weekly-summary", async (req, res) => {
  const { date } = req.query;
  const parsedDate = new Date(date as string);
  const summary = await getWeeklySummary(parsedDate);
  res.json(summary);
});

router.get("/monthly-summary", async (req, res) => {
  const { year, month } = req.query;
  const summary = await getMonthlySummary(Number(year), Number(month));
  res.json(summary);
});

router.get("/annual-summary", async (req, res) => {
  const { year } = req.query;
  const summary = await getAnnualSummary(Number(year));
  res.json(summary);
});

router.get("/monthly-weekly-summary", async (req, res) => {
  const { year, month } = req.query;
  const summary = await getMonthlyWeeklySummary(Number(year), Number(month));
  res.json(summary);
});

router.get("/warehouse-inventory-trend", async (req, res) => {
    const { warehouseId, startDate, endDate } = req.query;
    const trend = await getWarehouseInventoryTrend(
        warehouseId as string,
        new Date(startDate as string),
        new Date(endDate as string)
    );
    res.json(trend);
});

router.get("/millers-efficiency", async (req, res) => {
    const efficiency = await getMillersEfficiencyComparison();
    res.json(efficiency);
});

router.get("/rice-inventory-timeseries", async (req, res) => {
    const { startDate, endDate } = req.query;
    const timeseries = await getRiceInventoryTimeSeries(
        new Date(startDate as string),
        new Date(endDate as string)
    );
    res.json(timeseries);
});

export function getRouter() {
  return router;
}
