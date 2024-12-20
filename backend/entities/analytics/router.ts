import express from "express";
import {
  getDailySummary,
  getWeeklySummary,
  getMonthlySummary,
  getAnnualSummary,
  getMonthlyWeeklySummary,
  getWarehouseInventoryStock, 
  getMillersEfficiencyComparison,
  getRiceInventoryTimeSeries,
  getRiceOrderAnalytics,
  getProcessingStatusAnalytics
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

router.get("/warehouse-inventory-stock", async (_req, res) => {
  const data = await getWarehouseInventoryStock();
  res.json(data);
});

router.get("/millers-efficiency", async (req, res) => {
    const efficiency = await getMillersEfficiencyComparison();
    res.json(efficiency);
});

router.get("/rice-inventory-timeseries", async (_req, res) => {
  const batchData = await getRiceInventoryTimeSeries();
  res.json(batchData);
});

router.get('/rice-order-analytics', async (_req, res) => {
  try {
    const analytics = await getRiceOrderAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching rice order analytics' });
  }
});

router.get("/processing-status", async (_req, res) => {
  try {
      const processingStatus = await getProcessingStatusAnalytics();
      res.json(processingStatus);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching processing status analytics' });
  }
});

export function getRouter() {
  return router;
}
