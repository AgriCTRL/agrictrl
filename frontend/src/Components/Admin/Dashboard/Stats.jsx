import React from 'react'
import { 
    Wheat, 
    HeartHandshake,
    Building2,
} from "lucide-react";
import CardComponent from '../../CardComponent';

import { Button } from 'primereact/button';
        
const Stats = ({ 
    partnerFarmersCount, 
    totalPalaysCount, 
    totalRiceCount, 
    riceSoldCount 
}) => {
    const stats = [
        {
            label: "Partner Farmers",
            icon: <HeartHandshake size={20} />,
            count: partnerFarmersCount,
        },
        {
            label: "Total Palays",
            icon: <Wheat size={20} />,
            count: totalPalaysCount,
        },
        {
            label: "Total Rice",
            icon: <Wheat size={20} />,
            count: totalRiceCount,
        },
        {
            label: "Rice Sold",
            icon: <Building2 size={20} />,
            count: riceSoldCount,
        },
    ];

    return (
        <div className='grid grid-cols-4 gap-4'>
            {stats.map((stat, index) => (
                <CardComponent 
                    key={index} 
                    className="bg-white flex gap-4 justify-between rounded-lg transition hover:shadow-lg"
                >
                    <Button
                        icon={stat.icon}
                        className='h-fit bg-gradient-to-t from-secondary to-primary text-white'
                    />
                    <div className='text-end'>
                        <small>{stat.label}</small>
                        <h1 className='text-3xl text-black font-semibold'>{stat.count}</h1>
                    </div>
                </CardComponent>
            ))}
        </div>
    )
}

export default Stats;