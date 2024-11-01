import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Warehouse } from 'lucide-react';
import CardComponent from '@/Components/CardComponent';

const MonthlyBatchCountAnalytics = ({ apiUrl }) => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    

    // Fetch data for the selected month, split into 4 weekly segments
    useEffect(() => {
        if (!selectedMonth) return;

        const fetchMonthlyBatchData = async () => {
            try {
                // Extract year and month from the selected month (YYYY-MM format)
                const [year, month] = selectedMonth.split('-');

                // Fetch data for the selected month with a "monthly-weekly-summary" endpoint
                const endpoint = `${apiUrl}/analytics/monthly-weekly-summary?year=${year}&month=${month}`;
                
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                setAnalyticsData(data);

            } catch (error) {
                console.error('Error fetching monthly batch data:', error);
            }
        };

        fetchMonthlyBatchData();
    }, [selectedMonth]);

    // Update chart data and options whenever analyticsData changes
    useEffect(() => {
        if (analyticsData && analyticsData.length > 0) {
            const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            const batchCounts = analyticsData.map(item => item.palayBatches); // Assuming each item has a `palayBatches` field

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Batch Count',
                        data: batchCounts,
                        backgroundColor: '#00C261',
                        borderColor: '#00A049',
                        borderWidth: 1
                    }
                ]
            });

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

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
                            text: 'Batch Count',
                            color: textColor
                        }
                    }
                }
            });
        }
    }, [analyticsData]);

    return (
        <CardComponent className="bg-white w-full flex-col gap-4">
            <div className="w-full flex flex-col gap-4">
                <div className="title flex gap-4 text-black">
                    <Warehouse size={20}/>
                    <p className="font-bold">Monthly Batch Count</p>
                </div>
                
                <div className="flex gap-2 justify-center items-center">
                    <input 
                        type="month"
                        className="border p-2 rounded"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                </div>

                <div className="graph h-64">
                    <Chart id="monthly-batch-count-chart" type="bar" data={chartData} options={chartOptions} />
                </div>
            </div>
        </CardComponent>
    );
};

export default MonthlyBatchCountAnalytics;
