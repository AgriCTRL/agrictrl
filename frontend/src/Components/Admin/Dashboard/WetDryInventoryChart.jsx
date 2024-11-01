import React, { useEffect, useState } from 'react';
import { Wheat } from 'lucide-react';
import { Chart } from 'primereact/chart';
import CardComponent from '../../CardComponent';

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
        <CardComponent className="bg-white w-full flex-col gap-8 col-span-2">
            <div className='w-full flex justify-between'>
                <div className="title flex gap-4 text-black">
                    <Wheat size={20} />
                    <p className='font-bold'>Palay Inventory (Batch Count)</p>
                </div>
            </div>
            <div className="graph">
                <Chart id="wet-dry-inventory-chart" type="bar" data={chartData} options={chartOptions} className="graph"/>
            </div>
        </CardComponent>
    );
};

export default WetDryInventoryChart;
