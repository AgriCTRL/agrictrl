import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { WheatOff } from 'lucide-react';
import { format } from 'date-fns';
import CardComponent from '@/Components/CardComponent';

const RiceInventoryLevels = ({ apiUrl, setInterpretations }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [interpretation, setInterpretation] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${apiUrl}/analytics/rice-inventory-timeseries`);
            const data = await response.json();
            
            setChartData({
                labels: data.map(d => d.batchName),
                datasets: [
                    {
                        label: 'Current Capacity',
                        data: data.map(d => d.currentCapacity),
                        backgroundColor: "#00C261",
                        borderWidth: 1,
                        stack: 'Capacity'
                    },
                    {
                        label: 'Remaining Capacity',
                        data: data.map(d => d.maxCapacity - d.currentCapacity),
                        backgroundColor: "#B0A6A6",
                        borderWidth: 1,
                        stack: 'Capacity'
                    }
                ]
            });

            // Generate interpretation based on the data
            const generatedInterpretation = generateInterpretation(data);
            setInterpretation(generatedInterpretation);

            setInterpretations((prev) => ({ ...prev, 'rice-inventory-level': generatedInterpretation }));
        };
        
        fetchData();
    }, []);
    
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        setChartOptions({
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        });
    }, []);

    const calculateAverageUtilization = (data) => {
        const batchPercentages = data.map(batch => {
            const percentUtilized = (batch.currentCapacity / batch.maxCapacity) * 100;
            return percentUtilized || 0; // Handle division by zero
        });

        const averagePercentage = batchPercentages.reduce((sum, percent) => sum + percent, 0) / batchPercentages.length;
        
        // Calculate overall trend
        const totalCurrentCapacity = data.reduce((sum, batch) => sum + batch.currentCapacity, 0);
        const totalMaxCapacity = data.reduce((sum, batch) => sum + batch.maxCapacity, 0);
        const overallUtilization = (totalCurrentCapacity / totalMaxCapacity) * 100;

        return {
            averagePercentage: averagePercentage.toFixed(1),
            totalCurrentCapacity,
            totalMaxCapacity,
            overallUtilization: overallUtilization.toFixed(1)
        };
    };

    const generateInterpretation = (data) => {
        const stats = calculateAverageUtilization(data);
        
        return `Across ${data.length} batches, the average capacity utilization is ${stats.averagePercentage}%. ` +
               `Total current inventory is ${stats.totalCurrentCapacity.toLocaleString()} bags out of ` +
               `${stats.totalMaxCapacity.toLocaleString()} maximum capacity (${stats.overallUtilization}% utilized).`;
    };

    return (
        <CardComponent className="bg-white w-full flex-col gap-4">
            <div className="title flex gap-4 text-black">
                <WheatOff  size={20}/>
                <p className="font-bold">Rice Inventory Levels</p>
            </div>
            
            <div className="card">
                <Chart id="rice-inventory-level" type="bar" data={chartData} options={chartOptions} />
            </div>
            
            {interpretation && (
                <div id='rice-inventory-level' className="text-sm text-gray-600 mt-4">
                    {interpretation}
                </div>
            )}
        </CardComponent>
    );
};

export default RiceInventoryLevels;