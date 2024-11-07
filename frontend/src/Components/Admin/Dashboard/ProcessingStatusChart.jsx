import React, { useEffect, useState } from 'react';
import { Wheat } from 'lucide-react';
import { Chart } from 'primereact/chart';
import CardComponent from '../../CardComponent';

const ProcessingStatusChart = ({ palayBatches, setInterpretations }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [processingStatusGroups, setProcessingStatusGroups] = useState({ 'In Drying': 0, 'In Milling': 0 });

    useEffect(() => {
        if (!palayBatches || palayBatches.length === 0) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // Calculate net weight totals for each processing status
        const updatedProcessingStatusGroups = { 'In Drying': 0, 'In Milling': 0 };
        palayBatches.forEach(batch => {
            if (batch.status === 'In Drying') {
                updatedProcessingStatusGroups['In Drying'] += batch.netWeight;
            } else if (batch.status === 'In Milling') {
                updatedProcessingStatusGroups['In Milling'] += batch.netWeight;
            }
        });

        setProcessingStatusGroups(updatedProcessingStatusGroups);

        // Set up chart data
        setChartData({
            labels: ['In Drying', 'In Milling'],
            datasets: [
                {
                    label: 'Palay Batches (KG)',
                    data: [updatedProcessingStatusGroups['In Drying'], updatedProcessingStatusGroups['In Milling']],
                    backgroundColor: ['#2196F3', '#FFC107']
                }
            ]
        });

        // Configure chart options
        setChartOptions({
            responsive: true,
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
                }
            }
        });

        // Generate the interpretation as a string
        const generatedInterpretation = `In Drying: ${processingStatusGroups['In Drying']}, In Milling: ${processingStatusGroups['In Milling']}`;

        // Update the interpretations with the generated interpretation for 'rice-orders-analytics'
        setInterpretations((prev) => ({
            ...prev,
            'processing-status-chart': generatedInterpretation
        }));
    }, [palayBatches]);

    return (
        <CardComponent className="w-full flex-col gap-8">
        <div className="flex flex-col w-full h-full gap-2">
            <div className='w-full flex justify-between'>
                <div className="title flex gap-4 text-black">
                    <Wheat size={20} />
                    <p className='font-bold'>Processing Status (net weight)</p>
                </div>
            </div>
            <div className="graph">
                <Chart id="processing-status-chart" type="bar" data={chartData} options={chartOptions} className="graph"/>
            </div>
            <div className="mt-4 text-center space-y-2">
                <div className="flex justify-center gap-4 text-sm font-medium text-gray-700">
                    <span>In Drying:</span>
                    <span>{processingStatusGroups['In Drying']} KG</span>
                </div>
                <div className="flex justify-center gap-4 text-sm font-medium text-gray-700">
                    <span>In Milling:</span>
                    <span>{processingStatusGroups['In Milling']} KG</span>
                </div>
            </div>
        </div>
        </CardComponent>
    );
};

export default ProcessingStatusChart;
