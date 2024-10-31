import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import AnalyticsTemplate from './AnalyticsTemplate';
import CardComponent from '../../CardComponent';

const NfaFacilities = ({ warehousesCount, dryersCount, millersCount }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: ['Warehouses', 'Dryers', 'Millers'],
            datasets: [
                {
                    type: 'bar',
                    backgroundColor: ['#005155', '#00C261', '#009E4F'],
                    data: [warehousesCount, dryersCount, millersCount]
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 1.2,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [warehousesCount, dryersCount, millersCount]);

    return (
        <CardComponent className="bg-white col-start-2 col-end-4 row-start-2 row-end-2 transition hover:shadow-lg">
            <AnalyticsTemplate
                headerIcon={<Building size={20}/>}
                headerText="NFA Facilities"
                graphType="bar"
                graphData={chartData}
                graphOptions={chartOptions}
            />
        </CardComponent>
    );
};

export default NfaFacilities;