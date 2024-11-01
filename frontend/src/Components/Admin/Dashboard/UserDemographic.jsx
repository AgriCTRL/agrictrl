import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Chart } from 'primereact/chart';
import CardComponent from '../../CardComponent';

const UserDemographic = ({ supplierCategories }) =>  {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: ['Farmer Organization', 'Individual Farmer'],
            datasets: [
                {
                    data: [supplierCategories.coop, supplierCategories.individual],
                    backgroundColor: [
                        '#005155',
                        '#00C261',
                    ],
                }
            ]
        };
        const options = {
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [supplierCategories]);

    return (
        <CardComponent className="bg-white transition hover:shadow-lg">
            <div className="title flex gap-4 text-black">
                <Users size={20}/>
                <p className='font-bold'>Supplier Category</p>
            </div>
            <div className="flex items-center justify-center w-3/4 self-center">
                <Chart id="supplier-demographic-chart" type="doughnut" data={chartData} options={chartOptions} className="w-full self-center" />
            </div>
        </CardComponent>
    );
};

export default UserDemographic;
