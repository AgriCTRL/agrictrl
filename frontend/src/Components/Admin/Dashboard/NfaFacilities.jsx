import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import CardComponent from '../../CardComponent';
import { Chart } from 'primereact/chart';

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
        <CardComponent className="bg-white w-full flex-col gap-8 col-span-3">
            <div className='w-full flex justify-between'>
                <div className="title flex gap-4 text-black">
                    <Building size={20} />
                    <p className='font-bold'>NFA Facilities</p>
                </div>
            </div>
            <div className={`graph`}>
                <Chart type="bar" data={chartData} options={chartOptions} className={`graph`} />
            </div>
        </CardComponent>
    );
};

export default NfaFacilities;
