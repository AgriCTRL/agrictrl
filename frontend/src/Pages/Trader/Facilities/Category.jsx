import React, { useState } from 'react';
import { Card } from 'primereact/card';
import {
    ThermometerSun,
    Warehouse,
    Factory,
} from "lucide-react";
import UserLayout from '../../../Layouts/UserLayout'

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
        <UserLayout activePage="Facilities">
            <div className='bg-white p-3 rounded'>
                <section className='flex flex-col gap-4'>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card
                            className={`shadow-none rounded-md text-primary cursor-pointer 
                                ${selectedCard === 'warehouse' ? 'bg-gradient-to-r from-secondary to-primary text-white' : 'hover:bg-primary hover:text-white text-primary'}`}
                            onClick={() => handleCardClick('warehouse')}
                        >
                            <div className="flex flex-col items-center ">
                                <Warehouse size={40} />
                                <span className='font-bold'>Warehouses</span>
                            </div>
                        </Card>
                        <Card
                            className={`shadow-none rounded-md text-primary cursor-pointer 
                                ${selectedCard === 'dryer' ? 'bg-gradient-to-r from-secondary to-primary text-white' : 'hover:bg-primary hover:text-white text-primary'}`}
                            onClick={() => handleCardClick('dryer')}
                        >
                            <div className="flex flex-col items-center">
                                <ThermometerSun size={40} />
                                <span className='font-bold'>Dryers</span>
                            </div>
                        </Card>
                        <Card
                            className={`shadow-none rounded-md text-primary cursor-pointer 
                                ${selectedCard === 'miller' ? 'bg-gradient-to-r from-secondary to-primary text-white' : 'hover:bg-primary hover:text-white text-primary'}`}
                            onClick={() => handleCardClick('miller')}
                        >
                            <div className="flex flex-col items-center">
                                <Factory size={40} />
                                <span className='font-bold'>Millers</span>
                            </div>
                        </Card>
                    </div>
                </section>

                {selectedCard && (
                    <section className="mt-4">
                        {renderSelectedComponent()}
                    </section>
                )}
            </div>
        </UserLayout>
    );
}

export default Category;