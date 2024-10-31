import React, { useState, useEffect } from 'react';
import { Factory } from 'lucide-react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import CardComponent from '../../CardComponent';

const MillingCapacity = ({ inventoryData }) => {
    const [millerData, setMillerData] = useState({
        inHouse: [],
        private: []
    });

    useEffect(() => {
        if (!inventoryData?.length) return;

        // Process miller data from inventory
        const millers = inventoryData.reduce((acc, item) => {
            if (item.processingBatch?.millingBatch) {
                const { millerId, millerType, millingEfficiency } = item.processingBatch.millingBatch;
                const key = millerType.toLowerCase().replace(' ', '');
                
                if (!acc[key].some(m => m.ID === millerId)) {
                    acc[key].push({
                        ID: millerId,
                        miller_name: `Miller ${millerId}`,
                        capacity: millingEfficiency,
                        status: 'Active',
                        miller_type: millerType
                    });
                }
            }
            return acc;
        }, { inhouse: [], private: [] });

        setMillerData(millers);
    }, [inventoryData]);

    const itemTemplate = (miller, index) => {
        return (
            <div className="w-full" key={miller.ID}>
                <div className={`flex flex-col xl:flex-row xl:items-start py-4 ${index !== 0 ? 'border-t border-lightest-grey' : ''}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4">
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="font-bold text-primary">{miller.miller_name}</div>
                            <div className="flex items-center gap-3">
                                <Tag value={miller.status} className='bg-tag-grey text-light-grey'></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                            <span className="font-semibold text-black">{miller.capacity}% efficiency</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;
        return <div className="grid grid-nogutter">
            {items.map((miller, index) => itemTemplate(miller, index))}
        </div>;
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
                    <TabPanel header={<p className='font-semibold'>In-house</p>} className='p-0'>
                        <DataView value={millerData.inhouse} listTemplate={listTemplate} />
                    </TabPanel>
                    <TabPanel header={<p className='font-semibold'>Private</p>} className='p-0'>
                        <DataView value={millerData.private} listTemplate={listTemplate} />
                    </TabPanel>
                </TabView>
            </CardComponent>
        </CardComponent>
    );
};

export default MillingCapacity;