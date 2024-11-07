import { PalayBatch } from "../palaybatches/db";
import { Warehouse } from "../warehouses/db";
import { Miller } from "../millers/db";
import { RiceBatch } from "../ricebatches/db";
import { MillingBatch } from "../millingbatches/db";
import { AnalyticsSummary } from "./types";

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

// Daily average summary
export async function getDailySummary(date: Date): Promise<AnalyticsSummary> {
    return getAverageQuantityByDate(date);
}

// Weekly average summary
export async function getWeeklySummary(date: Date): Promise<AnalyticsSummary> {
    // Ensure we're working with a proper Date object
    const inputDate = new Date(date);
    
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const day = inputDate.getDay();
    
    // Calculate the start date (Monday) by subtracting days to get to last Monday
    const startDate = new Date(inputDate);
    startDate.setDate(inputDate.getDate() - day + (day === 0 ? -6 : 1));
    startDate.setHours(0, 0, 0, 0);
    
    // Calculate the end date (Sunday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    try {
        // Retrieve all PalayBatches
        const targetBatches = await PalayBatch.find();

        // Filter palayBatches between the startDate and endDate
        const filteredBatches = targetBatches.filter(batch => {
            const batchDate = new Date(batch.dateBought);
            return batchDate >= startDate && batchDate <= endDate;
        });

        // Calculate total quantity and average
        const totalQuantity = filteredBatches.reduce((sum, batch) => sum + (batch.quantityBags || 0), 0);
        const averageQuantity = filteredBatches.length > 0 ? totalQuantity / filteredBatches.length : 0;

        return {
            totalQuantity: averageQuantity, // Average quantity of bags
            startDate: startDate,           // Start date of the week (Monday)
            endDate: endDate,               // End date of the week (Sunday)
            palayBatches: filteredBatches.length, // Total number of batches queried
        };
    } catch (error) {
        console.error("Error in getWeeklySummary:", error);
        throw error;
    }
}

// Monthly average summary
export async function getMonthlySummary(year: number, month: number): Promise<AnalyticsSummary> {
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0);       // Last day of the month

    const targetBatches = await PalayBatch.find();
    
    const filteredBatches = targetBatches.filter(batch => {
        const batchDate = new Date(batch.dateBought);
        return batchDate >= startDate && batchDate <= endDate;
    });

    // Calculate total quantity and average
    const totalQuantity = filteredBatches.reduce((sum, batch) => sum + (batch.quantityBags || 0), 0);
    const averageQuantity = filteredBatches.length > 0 ? totalQuantity / filteredBatches.length : 0;

    return {
        totalQuantity: averageQuantity, // Average quantity of bags
        startDate: startDate,            // Start date of the month
        endDate: endDate,                // End date of the month
        palayBatches: filteredBatches.length, // Total number of batches queried
    };
}

// Annual average summary
export async function getAnnualSummary(year: number): Promise<AnalyticsSummary> {
    const startDate = new Date(year, 0, 1); // First day of the year
    const endDate = new Date(year, 11, 31);  // Last day of the year

    const targetBatches = await PalayBatch.find();
    
    const filteredBatches = targetBatches.filter(batch => {
        const batchDate = new Date(batch.dateBought);
        return batchDate >= startDate && batchDate <= endDate;
    });

    // Calculate total quantity and average
    const totalQuantity = filteredBatches.reduce((sum, batch) => sum + (batch.quantityBags || 0), 0);
    const averageQuantity = filteredBatches.length > 0 ? totalQuantity / filteredBatches.length : 0;

    return {
        totalQuantity: averageQuantity, // Average quantity of bags
        startDate: startDate,            // Start date of the year
        endDate: endDate,                // End date of the year
        palayBatches: filteredBatches.length, // Total number of batches queried
    };
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
export async function getWarehouseInventoryTrend(warehouseId: string, startDate: Date, endDate: Date) {
    const warehouse = await Warehouse.findOne({ where: { id: warehouseId } });
    const riceBatches = await RiceBatch.find();
    
    // Create daily data points between start and end date
    const dailyData = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Filter batches for this warehouse and date
        const warehouseBatches = riceBatches.filter(batch => 
            batch.warehouseId === warehouseId &&
            new Date(batch.dateReceived).toISOString().split('T')[0] === dateStr
        );
        
        // Calculate total current stock for this date
        const currentStock = warehouseBatches.reduce((sum, batch) => 
            sum + (batch.currentCapacity || 0), 0);
            
        dailyData.push({
            date: dateStr,
            currentStock,
            maxCapacity: warehouse?.totalCapacity || 0
        });
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dailyData;
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
export async function getRiceInventoryTimeSeries(startDate: Date, endDate: Date) {
    const riceBatches = await RiceBatch.find();
    
    // Create daily data points
    const dailyData = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Get all batches up to this date
        const activeBatches = riceBatches.filter(batch => 
            new Date(batch.dateReceived) <= currentDate);
            
        // Calculate total current capacity
        const totalCapacity = activeBatches.reduce((sum, batch) => 
            sum + (batch.currentCapacity || 0), 0);
            
        dailyData.push({
            date: dateStr,
            totalCapacity
        });
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dailyData;
}
