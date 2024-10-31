import React, { useState, useEffect } from 'react';

import { Users } from 'lucide-react'

import CardComponent from '../../CardComponent'
import AnalyticsTemplate from './AnalyticsTemplate';

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
        <CardComponent className="bg-white transition hover:shadow-lg row-start-2 col-start-1 row-end-2">
            <AnalyticsTemplate
                headerIcon={<Users size={20}/>}
                headerText="Supplier Category"
                graphContainerClassName="flex items-center justify-center w-3/4 self-center"
                graphClassName="w-full self-center"
                graphType="doughnut"
                graphData={chartData}
                graphOptions={chartOptions}
            />
        </CardComponent>
    )
}

export default UserDemographic;