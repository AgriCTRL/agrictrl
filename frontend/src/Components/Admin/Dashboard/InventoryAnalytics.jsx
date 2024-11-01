import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Warehouse } from 'lucide-react';
import CardComponent from '@/Components/CardComponent';

const InventoryAnalytics = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    // States for Statistics and Analytics Data
    const [analyticsData, setAnalyticsData] = useState({
        totalQuantity: 0,
        startDate: "",
        endDate: "",
        palayBatches: 0,
    });
    const [interval, setInterval] = useState("Daily");
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Handle Interval Change
    const handleIntervalChange = (event) => {
        setInterval(event.target.value);
    };

    // Handle Date Change
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    // Fetch Analytics Data based on Interval and Date
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                let endpoint = `${apiUrl}/analytics`;

                // Choose the correct endpoint based on the interval
                switch (interval) {
                    case "Daily":
                        endpoint += `/daily-summary?date=${selectedDate}`;
                        break;
                    case "Weekly":
                        endpoint += `/weekly-summary?date=${selectedDate}`;
                        break;
                    case "Monthly":
                        const [year, month] = selectedDate.split('-');
                        endpoint += `/monthly-summary?year=${year}&month=${parseInt(month)}`;
                        break;
                    case "Annually":
                        endpoint += `/annual-summary?year=${selectedDate.split('-')[0]}`;
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
    }, [interval, selectedDate]);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Format the dates for display
        const startDate = new Date(analyticsData.startDate).toLocaleDateString();
        const endDate = new Date(analyticsData.endDate).toLocaleDateString();

        // Prepare chart data
        // Using a line chart to show inventory trends
        setChartData({
            labels: [startDate, endDate],
            datasets: [
                {
                    label: 'Average Palay Bags',
                    data: [0, analyticsData.totalQuantity], // Starting from 0 to current quantity
                    fill: true,
                    borderColor: '#005155',
                    tension: 0.4,
                    backgroundColor: 'rgba(0, 81, 85, 0.2)'
                },
                {
                    label: 'Palay Batches',
                    data: [0, analyticsData.palayBatches], // Starting from 0 to current batches
                    fill: true,
                    borderColor: '#00C261',
                    tension: 0.4,
                    backgroundColor: 'rgba(0, 194, 97, 0.2)'
                }
            ]
        });

        // Chart options
        setChartOptions({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
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
                        text: 'Quantity'
                    }
                }
            }
        });
    }, [analyticsData]);

    return (
        <CardComponent className="bg-white w-full flex-col gap-4">
            <div className="w-full flex flex-col gap-4">
                <div className="title flex gap-4 text-black">
                    <Warehouse size={20}/>
                    <p className="font-bold">Inventory Analytics</p>
                </div>
                
                <div className="flex gap-2 items-center">
                    <select 
                        className="border p-2 rounded"
                        value={interval}
                        onChange={handleIntervalChange}
                    >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Annually">Annually</option>
                    </select>

                    <input 
                        type="date"
                        className="border p-2 rounded"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </div>

                <div className="stats grid grid-cols-2 gap-4 text-sm">
                    <div className="stat p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Average Palay Bags</p>
                        <p className="font-bold">{analyticsData.totalQuantity}</p>
                    </div>
                    <div className="stat p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Palay Batches</p>
                        <p className="font-bold">{analyticsData.palayBatches}</p>
                    </div>
                    <div className="stat p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-bold">{new Date(analyticsData.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="stat p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">End Date</p>
                        <p className="font-bold">{new Date(analyticsData.endDate).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="graph h-64">
                    <Chart id="inventory-analytics-chart" type="line" data={chartData} options={chartOptions} />
                </div>
            </div>
        </CardComponent>
    );
};

export default InventoryAnalytics;