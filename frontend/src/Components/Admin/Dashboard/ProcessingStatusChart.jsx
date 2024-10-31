import React, { useEffect, useState } from 'react';
import { Wheat } from 'lucide-react';
import AnalyticsTemplate from './AnalyticsTemplate';

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
                        generateLabels: (chart) => {
                            return chart.data.datasets.map((dataset) => {
                                return {
                                    text: dataset.label,
                                    fillStyle: 'transparent',
                                    hidden: false,
                                    lineCap: 'butt',
                                    lineDash: [],
                                    lineDashOffset: 0,
                                    lineJoin: 'miter',
                                    strokeStyle: 'transparent',
                                    pointStyle: 'line'
                                };
                            });
                        }
                    }
                }
            }
        });        
    }, [palayBatches]);

    return (
        <AnalyticsTemplate
            headerIcon={<Wheat size={20} />}
            headerText="Processing Status (net weight)"
            graphType="bar"
            graphData={chartData}
            graphOptions={chartOptions}
        />
    );
};

export default ProcessingStatusChart;
