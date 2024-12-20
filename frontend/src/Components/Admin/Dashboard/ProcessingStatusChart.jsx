import React, { useEffect, useState } from 'react';
import { Wheat } from 'lucide-react';
import { Chart } from 'primereact/chart';
import CardComponent from '../../CardComponent';

const ProcessingStatusChart = ({ setInterpretations, apiUrl }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [processingStatusGroups, setProcessingStatusGroups] = useState({ 
        inDrying: 0, 
        inMilling: 0 
    });

    useEffect(() => {
        const fetchProcessingStatus = async () => {
            try {
                const response = await fetch(`${apiUrl}/analytics/processing-status`);
                const data = await response.json();
                const { inDrying, inMilling } = data;

                setProcessingStatusGroups({ inDrying, inMilling });

                const documentStyle = getComputedStyle(document.documentElement);
                const textColor = documentStyle.getPropertyValue('--text-color');

                // Set up chart data
                setChartData({
                    labels: ['In Drying', 'In Milling'],
                    datasets: [
                        {
                            label: 'Palay Batches (KG)',
                            data: [inDrying, inMilling],
                            backgroundColor: ['#2196F3', '#FFC107']
                        }
                    ]
                });

                // Configure chart options
                setChartOptions({
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: textColor },
                        },
                        y: {
                            ticks: { color: textColor },
                            beginAtZero: true
                        }
                    }
                });

                // Generate the interpretation
                const generatedInterpretation = `In Drying: ${inDrying}, In Milling: ${inMilling}`;

                // Update the interpretations
                setInterpretations((prev) => ({
                    ...prev,
                    'processing-status-chart': generatedInterpretation
                }));
            } catch (error) {
                console.error('Error fetching processing status:', error);
            }
        };

        fetchProcessingStatus();
    }, [setInterpretations]);

    return (
        <CardComponent className="w-full h-96">
            <div className="flex flex-col w-full h-full gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Wheat className="text-gray-600" size={20} />
                        <h2 className="font-bold text-gray-800">Processing Status (net weight)</h2>
                    </div>
                </div>
                
                <div className="flex-grow">
                    <Chart 
                        id="processing-status-chart" 
                        type="bar" 
                        data={chartData} 
                        options={chartOptions} 
                        className="w-full h-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="font-medium text-gray-700">In Drying:</span>
                        <span className="font-bold text-blue-600">
                            {processingStatusGroups.inDrying} KG
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="font-medium text-gray-700">In Milling:</span>
                        <span className="font-bold text-yellow-600">
                            {processingStatusGroups.inMilling} KG
                        </span>
                    </div>
                </div>
            </div>
        </CardComponent>
    );
};

export default ProcessingStatusChart;