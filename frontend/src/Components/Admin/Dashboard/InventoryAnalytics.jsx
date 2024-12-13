import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Warehouse } from 'lucide-react';
import CardComponent from '@/Components/CardComponent';

const InventoryAnalytics = ({ setInterpretations }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    
    // States for Statistics and Analytics Data
    const [analyticsData, setAnalyticsData] = useState({});
    const [interval, setInterval] = useState("Daily");
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateMode, setDateMode] = useState('date');
    const [dataValues, setDataValues] = useState([]);

    const intervalOptions = [
        { label: 'Daily', value: 'Daily' },
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Annually', value: 'Annually' }
    ];


    // Handle Interval Change
    const handleIntervalChange = (e) => {
        const newInterval = e.target.value;
        setInterval(newInterval);

        // Adjust date mode and default date based on interval
        let today = new Date();
        switch (newInterval) {
            case "Monthly":
                setDateMode('month');
                // Set to first day of current month
                setSelectedDate(new Date(today.getFullYear(), today.getMonth(), 1));
                break;
            case "Annually":
                setDateMode('year');
                // Set to January 1st of current year
                setSelectedDate(new Date(today.getFullYear(), 0, 1));
                break;
            default:
                setDateMode('date');
                setSelectedDate(today);
        }
    };

    // Handle Date Change
    const handleDateChange = (e) => {
        const inputValue = e.target.value;
        let newDate;

        try {
            switch (dateMode) {
                case 'date':
                    newDate = new Date(inputValue);
                    break;
                case 'month':
                    const [year, month] = inputValue.split('-').map(Number);
                    newDate = new Date(year, month - 1, 1);
                    break;
                case 'year':
                    newDate = new Date(Number(inputValue), 0, 1);
                    break;
                default:
                    throw new Error('Invalid date mode');
            }

            // Validate date
            if (isNaN(newDate.getTime())) {
                throw new Error('Invalid date');
            }

            setSelectedDate(newDate);
        } catch (error) {
            console.error('Date selection error:', error);
            // Optionally, you could reset to current date or keep existing date
            // For now, we'll just log the error
        }
    };

    const renderDateInput = () => {
        const formatDate = (date) => {
            switch (dateMode) {
                case 'date':
                    return date.toISOString().split('T')[0];
                case 'month':
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                case 'year':
                    return date.getFullYear().toString();
            }
        };

        switch (dateMode) {
            case 'date':
                return (
                    <input 
                        type="date" 
                        value={formatDate(selectedDate)} 
                        onChange={handleDateChange} 
                        className="w-1/5 p-2 border rounded"
                    />
                );
            case 'month':
                return (
                    <input 
                        type="month" 
                        value={formatDate(selectedDate)} 
                        onChange={handleDateChange} 
                        className="w-1/5 p-2 border rounded"
                    />
                );
            case 'year':
                return (
                    <input 
                        type="number" 
                        value={formatDate(selectedDate)} 
                        onChange={handleDateChange}
                        min="2000" 
                        max="2050" 
                        className="w-1/5 p-2 border rounded"
                    />
                );
        }
    };

    const prepareDateString = () => {
        switch (interval) {
            case "Daily":
                return selectedDate.toISOString().split('T')[0];
            case "Weekly":
                return selectedDate.toISOString().split('T')[0];
            case "Monthly":
                return `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
            case "Annually":
                return `${selectedDate.getFullYear()}`;
            default:
                return '';
        }
    };

    const formatDateConsistently = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}/${day}/${year}`;
    };

    // Fetch Analytics Data based on Interval and Date
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const dateString = prepareDateString();
                let endpoint = `${apiUrl}/analytics`;

                // Choose the correct endpoint based on the interval
                switch (interval) {
                    case "Daily":
                        endpoint += `/daily-summary?date=${dateString}`;
                        break;
                    case "Weekly":
                        endpoint += `/weekly-summary?date=${dateString}`;
                        break;
                    case "Monthly":
                        endpoint += `/monthly-summary?year=${selectedDate.getFullYear()}&month=${selectedDate.getMonth() + 1}`;
                        break;
                    case "Annually":
                        endpoint += `/annual-summary?year=${selectedDate.getFullYear()}`;
                        break;
                    default:
                        break;
                }

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                setAnalyticsData(data);

            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchAnalyticsData();
    }, [interval, selectedDate, apiUrl]);

    useEffect(() => {
        if (Object.keys(analyticsData).length === 0) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        let labels = [];
        let dataPoints = [];
        let totalQuantity = 0;
        let batchCount = 0;

        // Prepare data based on interval (same as before)
        switch (interval) {
            case "Daily":         
                labels = [
                    new Date(analyticsData.startDate).toISOString().split('T')[0], 
                    new Date(analyticsData.endDate).toISOString().split('T')[0]
                ];
                dataPoints = [
                    analyticsData.previousDayTotal || 0, 
                    analyticsData.currentDayTotal || 0
                ];
                totalQuantity = analyticsData.currentDayTotal || 0;
                batchCount = analyticsData.currentDayBatchCount || 0;
                break;
    
            case "Weekly":
                labels = analyticsData.dailyTotals && Array.isArray(analyticsData.dailyTotals) 
                    ? analyticsData.dailyTotals.map(day => 
                        new Date(day.date).toLocaleDateString()
                    ) 
                    : [];
                
                dataPoints = analyticsData.dailyTotals && Array.isArray(analyticsData.dailyTotals)
                    ? analyticsData.dailyTotals.map(day => day.total || 0)
                    : [];
                
                totalQuantity = analyticsData.weekTotal || 0;
                batchCount = analyticsData.weekBatchCount || 0;
                break;
    
            case "Monthly":
                labels = analyticsData.weeklyTotals && Array.isArray(analyticsData.weeklyTotals)
                    ? analyticsData.weeklyTotals.map(week => 
                        `Week ${week.week}`
                    )
                    : [];
                
                dataPoints = analyticsData.weeklyTotals && Array.isArray(analyticsData.weeklyTotals)
                    ? analyticsData.weeklyTotals.map(week => week.total || 0)
                    : [];
                
                totalQuantity = analyticsData.monthTotal || 0;
                batchCount = analyticsData.monthBatchCount || 0;
                break;
    
            case "Annually":
                labels = analyticsData.monthlyTotals && Array.isArray(analyticsData.monthlyTotals)
                    ? analyticsData.monthlyTotals.map(month => 
                        new Date(2023, month.month - 1).toLocaleString('default', { month: 'short' })
                    )
                    : [];
                
                dataPoints = analyticsData.monthlyTotals && Array.isArray(analyticsData.monthlyTotals)
                    ? analyticsData.monthlyTotals.map(month => month.total || 0)
                    : [];
                
                totalQuantity = analyticsData.yearTotal || 0;
                batchCount = analyticsData.yearBatchCount || 0;
                break;
        }

        // Prepare chart data
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Palay Bags',
                    data: dataPoints,
                    fill: true,
                    borderColor: '#005155',
                    tension: 0.4,
                    backgroundColor: 'rgba(0, 81, 85, 0.2)'
                }
            ]
        });

        // Store data values for horizontal legend
        setDataValues(dataPoints);

        // Chart options (same as before)
        setChartOptions({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false  // Hide the default legend
                },
                tooltip: {
                    mode: 'index'
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    title: {
                        display: true,
                        text: 'Palay Bags Quantity'
                    }
                }
            }
        });

        // Generate interpretation
        const generatedInterpretation = `Total Palay Bags: ${totalQuantity}, Batch Count: ${batchCount}`;

        // Update the interpretations
        setInterpretations((prev) => ({
            ...prev,
            'inventory-analytics-chart': generatedInterpretation
        }));
    }, [analyticsData, interval, setInterpretations]);

    return (
        <CardComponent className="bg-white w-full flex-col gap-4">
            <div className="w-full flex flex-col gap-4">
                <div className="title flex gap-4 text-black">
                    <Warehouse size={20}/>
                    <p className="font-bold">Inventory Analytics</p>
                </div>
                
                <div className="flex gap-2 justify-center items-center">
                    <select 
                        value={interval}
                        onChange={handleIntervalChange}
                        className="w-1/5 p-2 border rounded"
                    >
                        {intervalOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {renderDateInput()}
                </div>

                <div className="stats grid grid-cols-2 gap-4 text-sm">
                    <div className="stat p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Total Palay Bags</p>
                        <p className="font-bold">
                            {interval === "Daily" && analyticsData.currentDayTotal}
                            {interval === "Weekly" && analyticsData.weekTotal}
                            {interval === "Monthly" && analyticsData.monthTotal}
                            {interval === "Annually" && analyticsData.yearTotal}
                        </p>
                    </div>
                    <div className="stat p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Batch Count</p>
                        <p className="font-bold">
                            {interval === "Daily" && analyticsData.currentDayBatchCount}
                            {interval === "Weekly" && analyticsData.weekBatchCount}
                            {interval === "Monthly" && analyticsData.monthBatchCount}
                            {interval === "Annually" && analyticsData.yearBatchCount}
                        </p>
                    </div>
                </div>

                <div className="graph h-80">
                    <Chart 
                        id="inventory-analytics-chart" 
                        type="line" 
                        data={chartData} 
                        options={chartOptions} 
                    />
                </div>

                {/* New horizontal legend with actual values */}
                <div className="flex justify-between items-center px-4 bg-gray-50 rounded py-2">
                    {chartData.labels && chartData.labels.map((label, index) => (
                        <div 
                            key={label} 
                            className="flex flex-col items-center text-xs"
                        >
                            <span className="text-gray-600">{label}</span>
                            <span className="font-bold">{dataValues[index]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </CardComponent>
    );
};

export default InventoryAnalytics;