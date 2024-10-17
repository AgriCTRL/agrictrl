import React, { useState } from 'react'
import { 
    Wheat, 
    HeartHandshake,
    Building2,
} from "lucide-react";
import CardComponent from '../../CardComponent';

const Stats = (statsData) => {
    const [stats, setStats] = useState([
        {
            label: "Partner Farmers",
            icon: <HeartHandshake size={20}/>,
            count: 0,
            className: "border-r border-lightest-grey",
        },
        {
            label: "Total Palays",
            icon: <Wheat size={20}/>,
            count: 0,
            className: "border-r border-lightest-grey",
        },
        {
            label: "Total Rice",
            icon: <Wheat size={20}/>,
            count: 0,
            className: "border-r border-lightest-grey",
        },
        {
            label: "Rice Sold",
            icon: <Building2 size={20}/>,
            count: 0,
        },
    ])
    return (
        <CardComponent className="bg-white transition hover:shadow-lg">
            {stats.map((stat, index) => (
                <CardComponent 
                    key={index} 
                    className={`bg-white flex-1 flex-col gap-4 justify-center rounded-none ${index === (stats.length - 1) ? '' : stat.className}`}
                >
                    <div className='flex gap-4 text-black'>
                        {stat.icon}
                        <p className='font-bold'>{stat.label}</p>
                    </div>
                    <h1 className='text-heading text-primary text-center font-bold'>{stat.count}</h1>
                </CardComponent>
            ))}
        </CardComponent>
    )
}

export default Stats