import { PalayBatch } from "../palaybatches/db";
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
