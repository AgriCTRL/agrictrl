import React, { useEffect, useState } from 'react';
import { Wheat } from 'lucide-react';
import AnalyticsTemplate from './AnalyticsTemplate';

const MillingStatusChart = ({ palayBatches }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        if (!palayBatches || palayBatches.length === 0) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const millingStatusGroups = { Milled: 0, 'Not Milled': 0 };
        const notMilledStatuses = ['To be Dry', 'To be Mill', 'In Milling', 'In Drying'];

        palayBatches.forEach(batch => {
            if (batch.status === 'Milled') {
                millingStatusGroups.Milled += batch.netWeight;
            } else if (notMilledStatuses.includes(batch.status)) {
                millingStatusGroups['Not Milled'] += batch.netWeight;
            }
        });

        setChartData({
            labels: ['Milled', 'Not Milled'],
            datasets: [{ label: 'Palay Batches (KG)', data: [millingStatusGroups.Milled, millingStatusGroups['Not Milled']], backgroundColor: ['#4CAF50', '#FF5722'] }]
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
            headerText="Milling Status (net weight)"
            graphType="bar"
            graphData={chartData}
            graphOptions={chartOptions}
        />
    );
};

export default MillingStatusChart;
