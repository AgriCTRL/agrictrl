import React, { useState } from 'react';
import { ThermometerSun, Warehouse, Factory } from "lucide-react";
import AdminLayout from '../../../../Layouts/AdminLayout';
import Pending from './Pending';
import Active from './Active';
import Inactive from './Inactive';

function Users() {
    const [selectedCard, setSelectedCard] = useState('pending');

    const handleCardClick = (cardId) => {
        setSelectedCard(cardId);
    };

    const renderSelectedComponent = () => {
        switch(selectedCard) {
            case 'pending':
                return <Pending />;
            case 'active':
                return <Active />;
            case 'inactive':
                return <Inactive />;
            default:
                return null;
        }
    };

    const CardButton = ({ id, icon: Icon, label }) => (
        <div
            className={`shadow-none flex justify-center w-full mx-2 rounded-md cursor-pointer transition-colors duration-200
                ${selectedCard === id 
                    ? 'bg-primary border border-transparent text-white' 
                    : 'hover:border hover:border-primary text-primary'}`}
            onClick={() => handleCardClick(id)}
        >
            <div className="flex flex-row items-center justify-center m-2">
                <Icon size={20} className="m-2" />
                <span className='font-bold'>{label}</span>
            </div>
        </div>
    );

    return (
        <AdminLayout activePage="Users">
            <div className='flex flex-col h-full w-full px-4 py-2'>
                <div className='flex items-center w-full justify-between mb-4'>
                    <CardButton id="pending" icon={Warehouse} label="Pending" />
                    <CardButton id="active" icon={ThermometerSun} label="Active" />
                    <CardButton id="inactive" icon={Factory} label="Inactive" />
                </div>

                <section className="flex-1 overflow-y-auto">
                    {renderSelectedComponent()}
                </section>
            </div>
        </AdminLayout>
    );
}

export default Users;