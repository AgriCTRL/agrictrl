import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { GrainIcon } from 'lucide-react';
import { format } from 'date-fns';
import CardComponent from '@/Components/CardComponent';

const RiceInventoryLevels = ({ apiUrl }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [interpretation, setInterpretation] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            
            const response = await fetch(
                `${apiUrl}/analytics/rice-inventory-timeseries?` +
                `startDate=${startDate.toISOString()}&` +
                `endDate=${endDate.toISOString()}`
            );
            const data = await response.json();
            
            // Prepare chart data
            const labels = data.map(d => format(new Date(d.date), 'MMM dd'));
            
            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Total Rice Inventory',
                        data: data.map(d => d.totalCapacity),
                        borderColor: '#00C261',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(0, 194, 97, 0.2)'
                    }
                ]
            });
            
            // Generate interpretation
            const lastTwoPoints = data.slice(-2);
            if (lastTwoPoints.length === 2) {
                const interpretationText = generateInterpretation(
                    lastTwoPoints[1].totalCapacity,
                    lastTwoPoints[0].totalCapacity,
                    'inventory',
                    'bags',
                    'total rice inventory'
                );
                setInterpretation(interpretationText);
            }
        };
        
        fetchData();
    }, []);
    
    useEffect(() => {
        setChartOptions({
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    min: 0
                }
            }
        });
    }, []);

    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    const generateInterpretation = (current, previous, metric, unit, metricName) => {
        const percentageChange = calculatePercentageChange(current, previous);
        const direction = current > previous ? "higher" : "lower";
        return `Today's ${metricName} is ${current.toFixed(2)} ${unit}, which is ${Math.abs(percentageChange.toFixed(2))}% ${direction} than yesterday's.`;
    };

    return (
        <CardComponent className="bg-white w-full flex-col gap-4">
            <div className="title flex gap-4 text-black">
                <GrainIcon size={20}/>
                <p className="font-bold">Rice Inventory Levels</p>
            </div>
            
            <div className="graph h-64">
                <Chart type="line" data={chartData} options={chartOptions} />
            </div>
            
            {interpretation && (
                <div className="text-sm text-gray-600 mt-4">
                    {interpretation}
                </div>
            )}
        </CardComponent>
    );
};

export default RiceInventoryLevels;