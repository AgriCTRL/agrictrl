import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Chart } from 'primereact/chart';
import CardComponent from '../../CardComponent';

const UserDemographic = ({ supplierCategories, setInterpretations }) =>  {
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

        // Generate the interpretation as a string
        const generatedInterpretation = `Farmer Organization: ${supplierCategories.coop}, Individual Farmer: ${supplierCategories.individual}`;

        // Update the interpretations with the generated interpretation for 'rice-orders-analytics'
        setInterpretations((prev) => ({
            ...prev,
            'supplier-demographic-chart': generatedInterpretation
        }));
        
    }, [supplierCategories]);

    return (
        <CardComponent className="bg-white transition hover:shadow-lg">
            <div className="flex flex-col w-full h-full gap-2">
                <div className="title flex gap-4 text-black">
                    <Users size={20}/>
                    <p className='font-bold'>Supplier Category</p>
                </div>
                <div className="flex flex-col"></div>
                <div className="flex items-center justify-center w-3/4 self-center">
                    <Chart id="supplier-demographic-chart" type="doughnut" data={chartData} options={chartOptions} className="w-full self-center" />
                </div>
                <div className="mt-4 text-center space-y-2">
                    <div className="flex justify-center gap-4 text-sm font-medium text-gray-700">
                        <span>Farmer Organization:</span>
                        <span>{supplierCategories.coop}</span>
                    </div>
                    <div className="flex justify-center gap-4 text-sm font-medium text-gray-700">
                        <span>Individual Farmer:</span>
                        <span>{supplierCategories.individual}</span>
                    </div>
                </div>
            </div>
            
        </CardComponent>
    );
};

export default UserDemographic;
