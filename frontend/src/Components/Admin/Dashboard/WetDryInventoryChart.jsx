import React, { useEffect, useState } from 'react';
import { Wheat } from 'lucide-react';
import AnalyticsTemplate from './AnalyticsTemplate';

const WetDryInventoryChart = ({ palayBatches }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        if (!palayBatches || palayBatches.length === 0) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const monthlyInventory = {};
        palayBatches.forEach(batch => {
            const date = new Date(batch.dateBought);
            const monthKey = date.toLocaleString('default', { month: 'short' });

            if (!monthlyInventory[monthKey]) {
                monthlyInventory[monthKey] = { Wet: 0, Dry: 0 };
            }

            monthlyInventory[monthKey][batch.qualityType]++;
        });

        const wetDryLabels = Object.keys(monthlyInventory);
        const wetData = wetDryLabels.map(month => monthlyInventory[month].Wet);
        const dryData = wetDryLabels.map(month => monthlyInventory[month].Dry);

        setChartData({
            labels: wetDryLabels,
            datasets: [
                { label: 'Wet Palay Batches', data: wetData, backgroundColor: '#005155' },
                { label: 'Dry Palay Batches', data: dryData, backgroundColor: '#00C261' }
            ]
        });

        setChartOptions({
            responsive: true,
            plugins: { legend: { labels: { color: textColor } } },
            scales: {
                x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
                y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder }, title: { display: true, text: 'Number of Batches' } }
            }
        });
    }, [palayBatches]);

    return (
        <AnalyticsTemplate
            headerIcon={<Wheat size={20} />}
            headerText="Palay Inventory (Batch Count)"
            graphType="bar"
            graphData={chartData}
            graphOptions={chartOptions}
        />
    );
};

export default WetDryInventoryChart;
