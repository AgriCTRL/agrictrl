import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Factory } from 'lucide-react';
import CardComponent from '@/Components/CardComponent';

const MillerEfficiencyComparison = ({ apiUrl, setInterpretations }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [interpretation, setInterpretation] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${apiUrl}/analytics/millers-efficiency`);
            const data = await response.json();
            
            // Prepare chart data
            setChartData({
                labels: data.map(d => d.millerName),
                datasets: [
                    {
                        label: 'Average Efficiency (%)',
                        data: data.map(d => d.averageEfficiency),
                        backgroundColor: '#00C261'
                    }
                ]
            });
            
            // Generate interpretation
            const highestEfficiency = Math.max(...data.map(d => d.averageEfficiency));
            const mostEfficient = data.find(d => d.averageEfficiency === highestEfficiency);
            
            setInterpretation(
                `${mostEfficient.millerName} has the highest milling efficiency at ` +
                `${highestEfficiency.toFixed(2)}% based on ${mostEfficient.batchCount} batches.`
            );

            setInterpretations((prev) => ({ ...prev, 'miller-efficiency-comparison': interpretation }));
        };
        
        fetchData();
    }, []);
    
    useEffect(() => {
        setChartOptions({
            indexAxis: 'y',
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
                    min: 0,
                    max: 100
                }
            }
        });
    }, []);

    return (
        <CardComponent className="bg-white w-full flex-col gap-4">
            <div className="title flex gap-4 text-black">
                <Factory size={20}/>
                <p className="font-bold">Miller Efficiency Comparison</p>
            </div>
            
            <div className="graph h-64">
                <Chart id="miller-efficiency-comparison" type="bar" data={chartData} options={chartOptions} />
            </div>
            
            {interpretation && (
                <div id='miller-efficency-comparison' className="text-sm text-gray-600 mt-4">
                    {interpretation}
                </div>
            )}
        </CardComponent>
    );
};

export default MillerEfficiencyComparison;