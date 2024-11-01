import React, { useEffect, useState } from 'react';
import { Wheat } from 'lucide-react';
import { Chart } from 'primereact/chart';
import CardComponent from '../../CardComponent';

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
                        color: textColor
                    }
                }
            }
        });
    }, [palayBatches]);

    return (
        <CardComponent className="bg-white w-full flex-col gap-8">
            <div className='w-full flex justify-between'>
                <div className="title flex gap-4 text-black">
                    <Wheat size={20} />
                    <p className='font-bold'>Milling Status (net weight)</p>
                </div>
            </div>
            <div className="graph">
                <Chart id="milling-status-chart" type="bar" data={chartData} options={chartOptions} className="graph"/>
            </div>
        </CardComponent>
    );
};

export default MillingStatusChart;
