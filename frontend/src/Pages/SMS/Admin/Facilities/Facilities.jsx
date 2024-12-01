import React, { useState } from 'react';

import { SelectButton } from 'primereact/selectbutton';

import {
    ThermometerSun,
    Warehouse,
    Factory,
    Truck,
} from "lucide-react";

import AdminLayout from '@/Layouts/Admin/AdminLayout'
import WarehouseComponent from './Warehouse/WarehouseFacility';
import DryerComponent from './Dryer/DryerFacility';
import MillerComponent from './Miller/MillerFacility';
import TransporterComponent from './Transporter/Transporter'

function Facilities() {
    const categories = [
        { label: 'Warehouses', value: 'warehouse', icon: <Warehouse size={20} /> },
        { label: 'Dryers', value: 'dryer', icon: <ThermometerSun size={20} /> },
        { label: 'Millers', value: 'miller', icon: <Factory size={20} /> },
        { label: 'Transporter', value: 'transporter', icon: <Truck size={20} /> },
    ]

    const [selectedCard, setSelectedCard] = useState('warehouse');

    const renderSelectedComponent = () => {
        switch(selectedCard) {
            case 'warehouse':
                return <WarehouseComponent />;
            case 'dryer':
                return <DryerComponent />;
            case 'miller':
                return <MillerComponent />;
            case 'transporter':
                return <TransporterComponent />;
            default:
                return null;
        }
    };

    return (
        <AdminLayout activePage="Facilities">
            <div className='flex flex-col h-full w-full gap-4'>
                <SelectButton
                    invalid
                    id="facilities"
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.value)} 
                    options={categories}
                    className="admin-select-button w-full bg-white 
                        grid grid-flow-col-1
                        grid-cols-4
                    p-2 rounded-lg items-center justify-between gap-4"
                    optionValue="value" 
                    itemTemplate={(item) => (
                        <div className="flex gap-4 items-center">
                            {item.icon}
                            <p>{item.label}</p>
                        </div>
                    )}
                    pt={{
                        button: {
                            className: 'hover:bg-tag-grey rounded-lg flex justify-center items-center border-0 ring-0 w-full bg-transparent'
                        }
                    }}
                />

                {selectedCard && (
                    <section className="h-full overflow-y-auto">
                        {renderSelectedComponent()}
                    </section>
                )}
            </div>
        </AdminLayout>
    );
}

export default Facilities;