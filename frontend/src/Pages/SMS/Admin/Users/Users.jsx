import React, { useState } from 'react';
import { ThermometerSun, Warehouse, Factory, Loader, UserCheck, UserX } from "lucide-react";
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import Pending from './Pending';
import Active from './Active';
import Inactive from './Inactive';
import { SelectButton } from 'primereact/selectbutton';

function Users() {
    const categories = [
        { label: 'Pending', value: 'pending', icon: <Loader size={20} /> },
        { label: 'Active', value: 'active', icon: <UserCheck size={20} /> },
        { label: 'Inactive', value: 'inactive', icon: <UserX size={20} /> },
    ]

    const [selectedCard, setSelectedCard] = useState('pending');

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

    return (
        <AdminLayout activePage="Users">
            <div className='flex flex-col h-full w-full gap-4'>
                <SelectButton 
                    invalid
                    id="status"
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.value)} 
                    options={categories}
                    className="admin-select-button w-full bg-white 
                        grid grid-flow-col-1
                        grid-cols-3
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

                <section className="flex-1 overflow-y-auto">
                    {renderSelectedComponent()}
                </section>
            </div>
        </AdminLayout>
    );
}

export default Users;