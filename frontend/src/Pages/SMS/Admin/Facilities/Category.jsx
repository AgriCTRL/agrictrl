import React, { useState } from 'react';
import { Card } from 'primereact/card';
import {
    ThermometerSun,
    Warehouse,
    Factory,
} from "lucide-react";
import AdminLayout from '../../../../Layouts/AdminLayout'

import WarehouseComponent from './Warehouse/WarehouseFacility';
import DryerComponent from './Dryer/DryerFacility';
import MillerComponent from './Miller/MillerFacility';

function Category() {
    const [selectedCard, setSelectedCard] = useState('warehouse');

    const handleCardClick = (cardId) => {
        setSelectedCard(cardId);
    };

    const renderSelectedComponent = () => {
        switch(selectedCard) {
            case 'warehouse':
                return <WarehouseComponent />;
            case 'dryer':
                return <DryerComponent />;
            case 'miller':
                return <MillerComponent />;
            default:
                return null;
        }
    };

    return (
        <AdminLayout activePage="Facilities">
            <div className='flex flex-col h-full w-full px-4 py-2'>

                {/* top navigation */}
                <div className='flex items-center w-full justify-between'>
                    {/* warehouse */}
                    <div
                        className={`shadow-none flex justify-center w-full mx-2 rounded-md text-primary cursor-pointer
                            ${selectedCard === 'warehouse' ? 'bg-primary border border-transparent  text-white' : 'hover:border border-primary text-primary'}`}
                        onClick={() => handleCardClick('warehouse')}
                    >
                        <div className="flex flex-row items-center justify-center m-2">
                            <Warehouse size={20} className="m-2" />
                            <span className='font-bold'>Warehouses</span>
                        </div>
                    </div>

                    {/* Dryers */}
                    <div
                        className={`shadow-none flex justify-center w-full mx-2 rounded-md text-primary cursor-pointer 
                            ${selectedCard === 'dryer' ? 'bg-primary border border-transparent text-white' : 'hover:border border-primary text-primary'}`}
                        onClick={() => handleCardClick('dryer')}
                    >
                        <div className="flex flex-row items-center justify-center m-2">
                            <ThermometerSun size={20} className="m-2" />
                            <span className='font-bold'>Dryers</span>
                        </div>
                    </div>

                    {/* Millers */}
                    <div
                        className={`shadow-none flex justify-center w-full mx-2 rounded-md text-primary cursor-pointer 
                            ${selectedCard === 'miller' ? 'bg-primary border border-transparent text-white' : 'hover:border border-primary text-primary'}`}
                        onClick={() => handleCardClick('miller')}
                    >
                        <div className="flex flex-row items-center m-2">
                            <Factory size={20} className="m-2"/>
                            <span className='font-bold'>Millers</span>
                        </div>
                    </div>
                
                </div>

                {selectedCard && (
                    <section className="mt-3 h-full overflow-y-auto">
                        {renderSelectedComponent()}
                    </section>
                )}
            </div>
            

                
            
        </AdminLayout>
    );
}

export default Category;