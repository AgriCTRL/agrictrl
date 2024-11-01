import React, { useEffect, useState } from 'react';
import { Wheat } from 'lucide-react';
import { Chart } from 'primereact/chart';
import CardComponent from '../../CardComponent';

const ProcessingStatusChart = ({ palayBatches }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        if (!palayBatches || palayBatches.length === 0) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const processingStatusGroups = { 'In Drying': 0, 'In Milling': 0 };

        palayBatches.forEach(batch => {
            if (batch.status === 'In Drying') {
                processingStatusGroups['In Drying'] += batch.netWeight;
            } else if (batch.status === 'In Milling') {
                processingStatusGroups['In Milling'] += batch.netWeight;
            }
        });

        setChartData({
            labels: ['In Drying', 'In Milling'],
            datasets: [{ label: 'Palay Batches (KG)', data: [processingStatusGroups['In Drying'], processingStatusGroups['In Milling']], backgroundColor: ['#2196F3', '#FFC107'] }]
        });

        setChartOptions({
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    }
                }
            }
        });        
    }, [palayBatches]);

    return (
        <CardComponent className="w-full flex-col gap-8">
            <div className='w-full flex justify-between'>
                <div className="title flex gap-4 text-black">
                    <Wheat size={20} />
                    <p className='font-bold'>Processing Status (net weight)</p>
                </div>
            </div>
            <div className="graph">
                <Chart id="processing-status-chart" type="bar" data={chartData} options={chartOptions} className="graph"/>
            </div>
        </CardComponent>
    );
};

export default ProcessingStatusChart;
