import React, { useEffect, useState } from 'react';
import { Wheat } from 'lucide-react';
import { Chart } from 'primereact/chart';
import CardComponent from '../../CardComponent';

const MillingStatusChart = ({ palayBatches, setInterpretations }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [millingStatusGroups, setMillingStatusGroups] = useState({ Milled: 0, 'Not Milled': 0 });

    useEffect(() => {
        if (!palayBatches || palayBatches.length === 0) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // Calculate net weight totals for milling statuses
        const updatedMillingStatusGroups = { Milled: 0, 'Not Milled': 0 };
        const notMilledStatuses = ['To be Dry', 'To be Mill', 'In Milling', 'In Drying'];

        palayBatches.data.forEach(batch => {
            if (batch.status === 'Milled') {
                updatedMillingStatusGroups.Milled += batch.netWeight;
            } else if (notMilledStatuses.includes(batch.status)) {
                updatedMillingStatusGroups['Not Milled'] += batch.netWeight;
            }
        });

        setMillingStatusGroups(updatedMillingStatusGroups);

        // Set up chart data
        setChartData({
            labels: ['Milled', 'Not Milled'],
            datasets: [{
                label: 'Palay Batches (KG)',
                data: [updatedMillingStatusGroups.Milled, updatedMillingStatusGroups['Not Milled']],
                backgroundColor: ['#4CAF50', '#FF5722']
            }]
        });

        // Configure chart options
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

        const generatedInterpretation = `Milled: ${millingStatusGroups.Milled} Kg, Not Milled: ${millingStatusGroups['Not Milled']} Kg`;

        // Update the interpretations with the generated interpretation for 'rice-orders-analytics'
        setInterpretations((prev) => ({
            ...prev,
            'milling-status-chart': generatedInterpretation
        }));
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
                <Chart id="milling-status-chart" type="bar" data={chartData} options={chartOptions} className="graph" />
            </div>
            <div className="mt-4 text-center space-y-2">
                <div className="flex justify-center gap-4 text-sm font-medium text-gray-700">
                    <span>Milled:</span>
                    <span>{millingStatusGroups.Milled} KG</span>
                </div>
                <div className="flex justify-center gap-4 text-sm font-medium text-gray-700">
                    <span>Not Milled:</span>
                    <span>{millingStatusGroups['Not Milled']} KG</span>
                </div>
            </div>
        </CardComponent>
    );
};

export default MillingStatusChart;
