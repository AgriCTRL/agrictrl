import React, { useState, useEffect } from 'react';
import RecipientLayout from '../../../../Layouts/RecipientLayout';

import { Settings2, Search, CircleAlert, RotateCw } from "lucide-react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import ConfirmReceive from './ConfirmReceive';
import { useAuth } from '../../../Authentication/Login/AuthContext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

function RiceReceive() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { user } = useAuth();

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [showConfirmReceive, setShowConfirmReceive] = useState(false);
    const [selectedOrderData, setSelectedOrderData] = useState(null);
    const [inventoryData, setInventoryData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('riceOrders');

    useEffect(() => {
        fetchData();
    }, [selectedFilter]);

    useEffect(() => {
        const newFilters = {
            global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
        };
        setFilters(newFilters);
    }, [globalFilterValue]);

    const fetchData = async () => {
        try {
            const res = await fetch(`${apiUrl}/riceorders?riceRecipientId=${user.id}&status=Accepted&status=In%20Transit&status=Received`);
            if(!res.ok) {
                throw new Error('Failed to fetch rice orders')
            }
            const data = await res.json();
            setInventoryData(data);
        }
        catch (error) {
            console.error(error.message)
        }
    };

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'in transit': return 'primary';
            case 'received': return 'success';
            case 'accepted': return 'info';
            default: return 'secondary';
        }
    };
    
    const statusBodyTemplate = (rowData) => (
        <Tag 
            value={rowData.status} 
            severity={getSeverity(rowData.status)} 
            style={{ minWidth: '80px', textAlign: 'center' }}
            className="text-sm px-2 rounded-md"
        />
    );
    
    const actionBodyTemplate = (rowData) => {
        if (rowData.status === 'In Transit') {
            return (
                <Button 
                    label="Receive"
                    className="p-button-success p-button-sm" 
                    onClick={() => handleReceiveClick(rowData)}
                />
            );
        }
        return null;
    };

    const dateBodyTemplate = (rowData, field) => {
        const date = new Date(rowData[field]).toISOString().split('T')[0];

        return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
        });
    };

    const orderIdBodyTemplate = (rowData) => {
        return `0304-${rowData.id}`;
    };

    const handleReceiveClick = (rowData) => {
        setSelectedOrderData({
            ...rowData,
            dateBought: new Date(rowData.dateBought)
        });
        console.log(rowData);
        setShowConfirmReceive(true);
    };

    const filteredData = inventoryData.filter(item => 
        selectedFilter === 'riceOrders' ? item.status !== 'Received' : item.status === 'Received'
    );

    const buttonStyle = (isSelected) => isSelected
        ? 'bg-primary text-white'
        : 'bg-white text-primary border border-gray-300';

    // RIGHT SIDEBAR DETAILS
    const personalStats = [
        { title: "Palay Bought", value: 9 },
        { title: "Processed", value: 4 },
        { title: "Distributed", value: 2 },
    ];

    const totalValue = personalStats.reduce((acc, stat) => acc + stat.value, 0);

    const rightSidebar = () => {
        return (
            <div className="p-4 bg-white rounded-lg flex flex-col gap-4">
                <div className="header flex flex-col gap-4">
                    <div className='flex flex-col items-center justify-center gap-2'>
                        <p className="">Total</p>
                        <p className="text-2xl sm:text-4xl font-semibold text-primary">{totalValue}</p>
                    </div>
                    <div className="flex gap-2">
                        {personalStats.map((stat, index) => (
                            <div key={index} className="flex flex-col gap-2 flex-1 items-center justify-center">
                                <p className="text-sm">{stat.title}</p>
                                <p className="font-semibold text-primary">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <RecipientLayout activePage="Rice Receive" user={user} isRightSidebarOpen={false} rightSidebar={rightSidebar()}>
            <div className="flex flex-col h-full gap-4 bg-[#F1F5F9]">
                <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
                    <h1 className="text-2xl sm:text-4xl text-white font-semibold">Rice Receive</h1>
                    <span className="w-1/2">
                        <IconField iconPosition="left">
                            <InputIcon className=""> 
                                <Search className="text-white" size={18} />
                            </InputIcon>
                            <InputText 
                                className="ring-0 w-full rounded-full text-white bg-transparent border border-white placeholder:text-white" 
                                value={globalFilterValue} 
                                onChange={onGlobalFilterChange} 
                                placeholder="Tap to search" 
                            />
                        </IconField>
                    </span>
                </div>

                {/* Buttons & Search bar */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center bg-white p-2 rounded-full">
                        <Button 
                            icon={<Settings2 size={18} />} 
                            label="Rice Orders" 
                            className={`p-button-sm gap-4 border-none ring-0 rounded-full ${buttonStyle(selectedFilter === 'riceOrders')}`} 
                            onClick={() => setSelectedFilter('riceOrders')}
                        />

                        <Button 
                            icon={<Settings2 size={18} />}
                            label="Orders Received" 
                            className={`p-button-sm gap-4 border-none ring-0 rounded-full ${buttonStyle(selectedFilter === 'received')}`} 
                            onClick={() => setSelectedFilter('received')}
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-grow flex flex-col overflow-hidden rounded-lg">
                    <div className="overflow-hidden bg-white flex flex-col gap-4 p-5">
                    <div className='flex justify-between items-center'>
                        <p className='font-medium text-black'>Orders</p>
                        <RotateCw size={18} 
                            onClick={fetchData}
                            className='text-primary cursor-pointer hover:text-primaryHover'
                            title="Refresh data"                                
                        />
                    </div>
                    <DataTable 
                        value={filteredData}
                        scrollable
                        scrollHeight="flex"
                        scrolldirection="both"
                        filters={filters}
                        globalFilterFields={['id', 'status']}
                        emptyMessage="No inventory found."
                        paginator
                        rows={30}
                    > 
                        <Column field="id" header="Order ID" body={orderIdBodyTemplate} className="text-center" headerClassName="text-center" />
                        <Column field="orderDate" header="Date Ordered" body={(rowData) => dateBodyTemplate(rowData, 'orderDate')} className="text-center" headerClassName="text-center" />
                        <Column field="riceQuantityBags" header="Quantity in Bags" className="text-center" headerClassName="text-center" />
                        <Column field="totalCost" header="Price" className="text-center" headerClassName="text-center" />
                        <Column field="preferredDeliveryDate" header="Delivery Date" body={(rowData) => dateBodyTemplate(rowData, 'preferredDeliveryDate')} className="text-center" headerClassName="text-center" />
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column body={actionBodyTemplate} exportable={false} className="text-center" headerClassName="text-center"/>
                    </DataTable>

                    </div>
                </div>
            </div>

            <ConfirmReceive
                visible={showConfirmReceive}
                onHide={() => setShowConfirmReceive(false)}
                data={selectedOrderData}
                user={user}
                onConfirmReceive={fetchData}
            />
        </RecipientLayout> 
    );
}

export default RiceReceive;
