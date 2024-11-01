import express from "express";
import { getDailySummary, getWeeklySummary, getMonthlySummary, getAnnualSummary, getMonthlyWeeklySummary } from "./db";

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

export function getRouter() {
    return router;
}
