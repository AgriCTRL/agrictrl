import { PalayBatch } from "../palaybatches/db";
import { Warehouse } from "../warehouses/db";
import { Miller } from "../millers/db";
import { RiceBatch } from "../ricebatches/db";
import { MillingBatch } from "../millingbatches/db";
import { RiceOrder } from "../riceorders/db";
import { AnalyticsSummary } from "./types";

import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { Pile } from "../piles/db";

// Function to get average quantityBags for batches bought on a specific date
export async function getAverageQuantityByDate(date: Date): Promise<AnalyticsSummary> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Set to start of the day for comparison

    try {
        // Retrieve all PalayBatches
        const palayBatches = await PalayBatch.find();

        // Filter palayBatches by dateBought
        const filteredBatches = palayBatches.filter(batch => {
            const batchDate = new Date(batch.dateBought);
            return batchDate.setHours(0, 0, 0, 0) === targetDate.getTime();
        });

        // Calculate the total quantity of bags for the filtered batches
        const totalQuantity = filteredBatches.reduce((sum, batch) => sum + (batch.quantityBags || 0), 0);
        const averageQuantity = filteredBatches.length > 0 ? totalQuantity / filteredBatches.length : 0;

        // Return the expected output structure
        return {
            totalQuantity: averageQuantity, // Average quantity of bags
            startDate: targetDate,          // Start date
            endDate: targetDate,            // End date
            palayBatches: filteredBatches.length, // Total number of batches queried
        };
    } catch (error) {
        console.error("Error in getAverageQuantityByDate:", error);
        throw error;
    }
}

// Daily Summary with Previous Day Comparison
export async function getDailySummary(date: Date): Promise<{
    currentDayTotal: number,
    previousDayTotal: number,
    startDate: Date,
    endDate: Date,
    currentDayBatchCount: number,
    previousDayBatchCount: number
}> {
    const targetDate = new Date(date);
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);

    try {
        // Retrieve all PalayBatches
        const palayBatches = await PalayBatch.find();

        // Filter current day batches
        const currentDayBatches = palayBatches.filter(batch => {
            const batchDate = new Date(batch.dateBought);
            return batchDate >= startOfDay(targetDate) && batchDate <= endOfDay(targetDate);
        });

        // Filter previous day batches
        const previousDayBatches = palayBatches.filter(batch => {
            const batchDate = new Date(batch.dateBought);
            return batchDate >= startOfDay(previousDate) && batchDate <= endOfDay(previousDate);
        });

        // Calculate total quantities
        const currentDayTotal = currentDayBatches.reduce((sum, batch) => sum + (batch.quantityBags || 0), 0);
        const previousDayTotal = previousDayBatches.reduce((sum, batch) => sum + (batch.quantityBags || 0), 0);

        return {
            currentDayTotal,
            previousDayTotal,
            startDate: startOfDay(previousDate),
            endDate: endOfDay(targetDate),
            currentDayBatchCount: currentDayBatches.length,
            previousDayBatchCount: previousDayBatches.length
        };
    } catch (error) {
        console.error("Error in getDailySummary:", error);
        throw error;
    }
}

// Weekly Summary with Daily Breakdown
export async function getWeeklySummary(date: Date): Promise<{
    dailyTotals: Array<{date: Date, total: number, batchCount: number}>,
    startDate: Date,
    endDate: Date,
    weekTotal: number,
    weekBatchCount: number
}> {
    const targetDate = new Date(date);
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Monday as start of week
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });

    try {
        // Retrieve all PalayBatches
        const palayBatches = await PalayBatch.find();

        // Filter batches for the week
        const weekBatches = palayBatches.filter(batch => {
            const batchDate = new Date(batch.dateBought);
            return batchDate >= weekStart && batchDate <= weekEnd;
        });

        // Group batches by day
        const dailyTotals = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(weekStart);
            currentDate.setDate(weekStart.getDate() + i);

            const dayBatches = weekBatches.filter(batch => {
                const batchDate = new Date(batch.dateBought);
                return batchDate >= startOfDay(currentDate) && batchDate <= endOfDay(currentDate);
            });

            const total = dayBatches.reduce((sum, batch) => sum + (batch.quantityBags || 0), 0);
            
            dailyTotals.push({
                date: currentDate,
                total,
                batchCount: dayBatches.length
            });
        }

        // Calculate week total
        const weekTotal = dailyTotals.reduce((sum, day) => sum + day.total, 0);
        const weekBatchCount = dailyTotals.reduce((sum, day) => sum + day.batchCount, 0);

        return {
            dailyTotals,
            startDate: weekStart,
            endDate: weekEnd,
            weekTotal,
            weekBatchCount
        };
    } catch (error) {
        console.error("Error in getWeeklySummary:", error);
        throw error;
    }
}

// Monthly Summary with Weekly Breakdown
export async function getMonthlySummary(year: number, month: number): Promise<{
    weeklyTotals: Array<{week: number, total: number, batchCount: number}>,
    startDate: Date,
    endDate: Date,
    monthTotal: number,
    monthBatchCount: number
}> {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    try {
        // Retrieve all PalayBatches
        const targetBatches = await PalayBatch.find();

        // Filter batches for the month
        const monthBatches = targetBatches.filter(batch => {
            const batchDate = new Date(batch.dateBought);
            return batchDate >= startDate && batchDate <= endDate;
        });

        // Initialize weekly totals
        const weeklyTotals = [
            { week: 1, total: 0, batchCount: 0 },
            { week: 2, total: 0, batchCount: 0 },
            { week: 3, total: 0, batchCount: 0 },
            { week: 4, total: 0, batchCount: 0 }
        ];

        // Categorize batches into weeks
        monthBatches.forEach(batch => {
            const batchDate = new Date(batch.dateBought);
            const week = Math.floor((batchDate.getDate() - 1) / 7);
            
            weeklyTotals[week].total += batch.quantityBags || 0;
            weeklyTotals[week].batchCount += 1;
        });

        // Calculate month totals
        const monthTotal = weeklyTotals.reduce((sum, week) => sum + week.total, 0);
        const monthBatchCount = weeklyTotals.reduce((sum, week) => sum + week.batchCount, 0);

        return {
            weeklyTotals,
            startDate,
            endDate,
            monthTotal,
            monthBatchCount
        };
    } catch (error) {
        console.error("Error in getMonthlySummary:", error);
        throw error;
    }
}

// Annual Summary with Monthly Breakdown
export async function getAnnualSummary(year: number): Promise<{
    monthlyTotals: Array<{month: number, total: number, batchCount: number}>,
    startDate: Date,
    endDate: Date,
    yearTotal: number,
    yearBatchCount: number
}> {
    const startDate = startOfYear(new Date(year, 0));
    const endDate = endOfYear(new Date(year, 0));

    try {
        // Retrieve all PalayBatches
        const targetBatches = await PalayBatch.find();
        
        // Filter batches for the year
        const yearBatches = targetBatches.filter(batch => {
            const batchDate = new Date(batch.dateBought);
            return batchDate >= startDate && batchDate <= endDate;
        });

        // Initialize monthly totals
        const monthlyTotals = Array(12).fill(0).map((_, index) => ({
            month: index + 1,
            total: 0,
            batchCount: 0
        }));

        // Categorize batches into months
        yearBatches.forEach(batch => {
            const batchDate = new Date(batch.dateBought);
            const month = batchDate.getMonth();
            
            monthlyTotals[month].total += batch.quantityBags || 0;
            monthlyTotals[month].batchCount += 1;
        });

        // Calculate year totals
        const yearTotal = monthlyTotals.reduce((sum, month) => sum + month.total, 0);
        const yearBatchCount = monthlyTotals.reduce((sum, month) => sum + month.batchCount, 0);

        return {
            monthlyTotals,
            startDate,
            endDate,
            yearTotal,
            yearBatchCount
        };
    } catch (error) {
        console.error("Error in getAnnualSummary:", error);
        throw error;
    }
}

// Function to get quantity of palay bought weekly within a given month and year
export async function getMonthlyWeeklySummary(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0);       // Last day of the month

    // Retrieve all PalayBatches
    const targetBatches = await PalayBatch.find();

    // Filter palayBatches for those bought within the month
    const filteredBatches = targetBatches.filter(batch => {
        const batchDate = new Date(batch.dateBought);
        return batchDate >= startDate && batchDate <= endDate;
    });

    // Initialize an array to hold weekly data
    const weeklySummary = Array(4).fill(0).map((_, i) => ({
        week: i + 1,
        palayBatches: 0
    }));

    // Loop through filtered batches and categorize by week
    filteredBatches.forEach(batch => {
        const batchDate = new Date(batch.dateBought);
        const week = Math.ceil(batchDate.getDate() / 7) - 1;
        
        // Add the quantityBags of the current batch to the corresponding week
        weeklySummary[week].palayBatches += batch.quantityBags || 0;
    });

    return weeklySummary;
}

// Inventory Trend Analysis
export async function getWarehouseInventoryStock() {
    const warehouses = await Warehouse.find();
  
    const warehouseData = await Promise.all(
      warehouses.map(async (warehouse) => {
        return {
          warehouseName: warehouse.facilityName,
          totalCapacity: warehouse.totalCapacity,
          currentStock: warehouse.currentStock
        };
      })
    );
  
    return warehouseData;
}

// Milling Efficiency Analysis
export async function getMillersEfficiencyComparison() {
    const millers = await Miller.find();
    const millingBatches = await MillingBatch.find();
    
    const millerEfficiencies = millers.map(miller => {
        // Get all batches for this miller
        const millerBatches = millingBatches.filter(batch => 
            batch.millerId === miller.id);
            
        // Calculate average efficiency
        const totalEfficiency = millerBatches.reduce((sum, batch) => 
            sum + (batch.millingEfficiency || 0), 0);
        const averageEfficiency = millerBatches.length > 0 ? 
            totalEfficiency / millerBatches.length : 0;
            
        return {
            millerName: miller.millerName,
            averageEfficiency,
            batchCount: millerBatches.length
        };
    });
    
    return millerEfficiencies;
}

// Rice Inventory Time Series
export async function getRiceInventoryTimeSeries() {
    const ricePiles = await Pile.find({
        where: { type: 'Rice' }
    });
    
    // Map each rice pile to show its current vs max capacity
    const batchData = ricePiles.map(pile => ({
        batchId: pile.id,
        batchName: `Pile ${pile.pileNumber}`,
        currentCapacity: pile.currentQuantity || 0,
        maxCapacity: pile.maxCapacity || 0
    }));
    
    // Sort by batchId to ensure consistent ordering
    return batchData.sort((a, b) => a.batchId.localeCompare(b.batchId));
}

// Rice Order Analytics
export async function getRiceOrderAnalytics(): Promise<{ labels: string[]; data: number[] }> {
    try {
      // Fetch all rice orders with status 'Received'
      const riceOrders = await RiceOrder.find({
        where: {
          status: 'Received',
        },
      });
  
      // Group the orders by date and calculate the total bags sold per day
      const bagsSoldPerDay: { [key: string]: number } = {};
  
      riceOrders.forEach((order) => {
        const orderDate = format(new Date(order.orderDate), 'yyyy-MM-dd');
        // Accumulate the bags sold for the same day
        if (bagsSoldPerDay[orderDate]) {
          bagsSoldPerDay[orderDate] += order.riceQuantityBags;
        } else {
          bagsSoldPerDay[orderDate] = order.riceQuantityBags;
        }
      });
  
      const labels = Object.keys(bagsSoldPerDay);
      const data = labels.map((label) => bagsSoldPerDay[label]);
  
      return { labels, data };
    } catch (error) {
      console.error('Error in getRiceOrderAnalytics:', error);
      throw error;
    }
}
  
