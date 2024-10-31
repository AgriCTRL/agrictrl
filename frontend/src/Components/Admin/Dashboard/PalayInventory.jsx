import React, { useState, useEffect } from 'react';
import { Wheat } from 'lucide-react';
import AnalyticsTemplate from './AnalyticsTemplate';
import CardComponent from '../../CardComponent';

const PalayInventory = ({ palayBatches }) => {
    const [wetDryChartData, setWetDryChartData] = useState({});
    const [wetDryChartOptions, setWetDryChartOptions] = useState({});
    const [millingStatusChartData, setMillingStatusChartData] = useState({});
    const [millingStatusChartOptions, setMillingStatusChartOptions] = useState({});
    const [processingStatusChartData, setProcessingStatusChartData] = useState({});
    const [processingStatusChartOptions, setProcessingStatusChartOptions] = useState({});

    useEffect(() => {
        if (!palayBatches || palayBatches.length === 0) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Graph 1: Wet vs Dry Palay Inventory (Batch Count)
        const monthlyInventory = {};
        palayBatches.forEach(batch => {
            const date = new Date(batch.dateBought);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            
            if (!monthlyInventory[monthKey]) {
                monthlyInventory[monthKey] = {
                    Wet: 0,
                    Dry: 0
                };
            }
            
            monthlyInventory[monthKey][batch.qualityType]++;
        });

        const wetDryLabels = Object.keys(monthlyInventory);
        const wetData = wetDryLabels.map(month => monthlyInventory[month].Wet);
        const dryData = wetDryLabels.map(month => monthlyInventory[month].Dry);

        const wetDryData = {
            labels: wetDryLabels,
            datasets: [
                {
                    label: 'Wet Palay Batches',
                    data: wetData,
                    backgroundColor: '#005155',
                },
                {
                    label: 'Dry Palay Batches',
                    data: dryData,
                    backgroundColor: '#00C261',
                }
            ]
        };

        const wetDryOptions = {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                    title: {
                        display: true,
                        text: 'Number of Batches'
                    }
                },
            },
        };

        // Rest of the code remains the same as in the original component
        // Graph 2: Milling Status (Milled vs Not Milled)
        const millingStatusGroups = {
            Milled: 0,
            'Not Milled': 0
        };

        const notMilledStatuses = ['To be Dry', 'To be Mill', 'In Milling', 'In Drying'];
        
        palayBatches.forEach(batch => {
            if (batch.status === 'Milled') {
                millingStatusGroups.Milled += batch.netWeight;
            } else if (notMilledStatuses.includes(batch.status)) {
                millingStatusGroups['Not Milled'] += batch.netWeight;
            }
        });

        const millingStatusData = {
            labels: ['Milled', 'Not Milled'],
            datasets: [{
                label: 'Palay Batches (KG)',
                data: [millingStatusGroups.Milled, millingStatusGroups['Not Milled']],
                backgroundColor: ['#4CAF50', '#FF5722']
            }]
        };

        const millingStatusOptions = {
            ...wetDryOptions,
            plugins: {
                ...wetDryOptions.plugins,
                title: {
                    display: true,
                    text: 'Milling Status'
                }
            }
        };

        // Graph 3: Processing Status (In Drying vs In Milling)
        const processingStatusGroups = {
            'In Drying': 0,
            'In Milling': 0
        };

        palayBatches.forEach(batch => {
            if (batch.status === 'In Drying') {
                processingStatusGroups['In Drying'] += batch.netWeight;
            } else if (batch.status === 'In Milling') {
                processingStatusGroups['In Milling'] += batch.netWeight;
            }
        });

        const processingStatusData = {
            labels: ['In Drying', 'In Milling'],
            datasets: [{
                label: 'Palay Batches (KG)',
                data: [processingStatusGroups['In Drying'], processingStatusGroups['In Milling']],
                backgroundColor: ['#2196F3', '#FFC107']
            }]
        };

        const processingStatusOptions = {
            ...wetDryOptions,
            plugins: {
                ...wetDryOptions.plugins,
                title: {
                    display: true,
                    text: 'Processing Status'
                }
            }
        };

        // Set state for all charts
        setWetDryChartData(wetDryData);
        setWetDryChartOptions(wetDryOptions);
        setMillingStatusChartData(millingStatusData);
        setMillingStatusChartOptions(millingStatusOptions);
        setProcessingStatusChartData(processingStatusData);
        setProcessingStatusChartOptions(processingStatusOptions);
    }, [palayBatches]);

    return (
        <div className="col-start-1 col-end-4 row-start-1 row-end-1 transition hover:shadow-lg grid grid-cols-3 gap-4">
            <CardComponent className="bg-white col-span-1 transition hover:shadow-lg">
                <AnalyticsTemplate
                    headerIcon={<Wheat size={20} />}
                    headerText="Palay Inventory (Batch Count)"
                    graphType="bar"
                    graphData={wetDryChartData}
                    graphOptions={wetDryChartOptions}
                />
            </CardComponent>

            <CardComponent className="bg-white transition hover:shadow-lg">
                <AnalyticsTemplate
                    headerIcon={<Wheat size={20} />}
                    headerText="Milling Status"
                    graphType="bar"
                    graphData={millingStatusChartData}
                    graphOptions={millingStatusChartOptions}
                />
            </CardComponent>

            <CardComponent className="bg-white transition hover:shadow-lg">
                <AnalyticsTemplate
                    headerIcon={<Wheat size={20} />}
                    headerText="Processing Status"
                    graphType="bar"
                    graphData={processingStatusChartData}
                    graphOptions={processingStatusChartOptions}
                />
            </CardComponent>
        </div>
    );
};

export default PalayInventory;