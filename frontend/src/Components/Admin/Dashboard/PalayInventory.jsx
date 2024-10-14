import React, { useState, useEffect } from 'react';
import { Wheat } from 'lucide-react'

import { Button } from 'primereact/button'

import AnalyticsTemplate from './AnalyticsTemplate';
import CardComponent from '../../CardComponent'

const PalayInventory = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Wet',
                    backgroundColor: '#005155',
                    data: [50, 25, 12, 48, 90, 76, 42]
                },
                {
                    type: 'bar',
                    label: 'Dry',
                    backgroundColor: '#00C261',
                    data: [21, 84, 24, 75, 37, 65, 34]
                },
                {
                    type: 'bar',
                    label: 'Milled',
                    backgroundColor: '#009E4F',
                    data: [41, 52, 24, 74, 23, 21, 32]
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 1.2,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <CardComponent className="bg-white col-start-1 col-end-3 row-start-1 row-end-2 transition hover:shadow-lg">
            <AnalyticsTemplate
                headerIcon={<Wheat size={20}/>}
                headerText="Palay Inventory (KG)"
                graphType="bar"
                graphData={chartData}
                graphOptions={chartOptions}
            />
        </CardComponent>
    )
}

export default PalayInventory;