import React, { useState, useEffect } from 'react';

import { Factory } from 'lucide-react'

import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';

import CardComponent from '../../CardComponent'

const MillingCapacity = () => {
    const [millers, setMillers] = useState([]);
    
    useEffect(() => {
        setMillers([
            {
                "ID": 1,
                "miller_name": "Central Milling Corp",
                "category": "Large",
                "location": "Manila",
                "capacity": 10000,
                "status": "Active",
                "miller_type": "Private"
            },
            {
                "ID": 2,
                "miller_name": "AgriTech Millers",
                "category": "Medium",
                "location": "Cebu",
                "capacity": 5000,
                "status": "Active",
                "miller_type": "In-house"
            },
            {
                "ID": 3,
                "miller_name": "Harvest Mills",
                "category": "Small",
                "location": "Davao",
                "capacity": 1500,
                "status": "Inactive",
                "miller_type": "Private"
            },
            {
                "ID": 4,
                "miller_name": "Golden Grains Processing",
                "category": "Large",
                "location": "Iloilo",
                "capacity": 12000,
                "status": "Active",
                "miller_type": "In-house"
            },
            {
                "ID": 5,
                "miller_name": "Farmers Pride Millers",
                "category": "Medium",
                "location": "Batangas",
                "capacity": 7000,
                "status": "Active",
                "miller_type": "Private"
            },
            {
                "ID": 6,
                "miller_name": "Green Fields Mill",
                "category": "Small",
                "location": "Laguna",
                "capacity": 1800,
                "status": "Inactive",
                "miller_type": "In-house"
            },
            {
                "ID": 7,
                "miller_name": "Pacific Milling Inc.",
                "category": "Large",
                "location": "Quezon City",
                "capacity": 11000,
                "status": "Active",
                "miller_type": "Private"
            },
            {
                "ID": 8,
                "miller_name": "Sunrise Rice Millers",
                "category": "Medium",
                "location": "Pampanga",
                "capacity": 4500,
                "status": "Inactive",
                "miller_type": "In-house"
            },
            {
                "ID": 9,
                "miller_name": "Northern Plains Milling",
                "category": "Small",
                "location": "Isabela",
                "capacity": 2000,
                "status": "Active",
                "miller_type": "Private"
            },
            {
                "ID": 10,
                "miller_name": "Southern Rice Millers",
                "category": "Large",
                "location": "General Santos",
                "capacity": 13000,
                "status": "Active",
                "miller_type": "In-house"
            }
        ])    
    }, []);

    const itemTemplate = (miller, index) => {
        return (
            <div className="w-full" key={miller.ID}>
                <div className={`flex flex-col xl:flex-row xl:items-start py-4 ${index !== 0 ? 'border-t border-lightest-grey' : ''}`}>
                    {/* <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://primefaces.org/cdn/primereact/images/miller/${miller.image}`} alt={miller.name} /> */}
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4">
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="font-bold text-primary">{miller.miller_name}</div>
                            <div className="flex items-center gap-3">
                                <Tag value={miller.status} className='bg-tag-grey text-light-grey'></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                            <span className="font-semibold text-black">{miller.capacity}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((miller, index) => {
            return itemTemplate(miller, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    return (
        <CardComponent className="bg-white transition hover:shadow-lg row-start-2 row-end-3">
            <CardComponent className="bg-white w-full flex-col gap-2">
                <div className='w-full flex justify-between'>
                    <div className="title flex gap-4 text-black">
                        <Factory size={20}/>
                        <p className='font-bold'>Milling Capacity</p>
                    </div>
                </div>
                <TabView className='dashboard max-h-[20rem] overflow-hidden'>
                    <TabPanel header={<p className='font-semibold'>In-house</p>} className='p-0' >
                        <DataView value={millers} listTemplate={listTemplate} />
                    </TabPanel>
                    <TabPanel header={<p className='font-semibold'>Private</p>} className='p-0' >

                    </TabPanel>
                </TabView>
            </CardComponent>
        </CardComponent>
    )
}

export default MillingCapacity;