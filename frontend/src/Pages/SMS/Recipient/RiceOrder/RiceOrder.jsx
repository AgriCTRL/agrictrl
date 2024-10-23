import React, { useState, useEffect } from 'react';
import RecipientLayout from '../../../../Layouts/RecipientLayout';

import { Settings2, Search, CircleAlert } from "lucide-react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import PalayRegister from './PalayRegister';
import DeclinedDetails from './DeclineDetails';


function RiceOrder() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [showRegisterPalay, setShowRegisterPalay] = useState(false);
    const [showDeclinedDetails, setShowDeclinedDetails] = useState(false);
    const [selectedDeclinedData, setSelectedDeclinedData] = useState(null);
    const [inventoryData, setInventoryData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${apiUrl}/riceorders`, {
                    headers: { 'API-Key': `${apiKey}` }
                });
                if(!res.ok) {
                    throw new Error('Failed to fetch rice orders')
                }
                const data = await res.json();
                setInventoryData(data);
            }
            catch (error) {
                console.error(error.message)
            }
        }
        fetchData();
    }, [inventoryData]);

    const [selectedFilter, setSelectedFilter] = useState('riceOrders');

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'received': return 'success';
            case 'for approval': return 'warning';
            case 'declined': return 'danger';
            case 'in transit': return 'info';
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
        if (rowData.status === 'Declined') {
            return (
                <CircleAlert 
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeclinedClick(rowData)}  // Open the DeclinedDetails
                />
            );
        }
        return null;
    };

    const handleAddPalay = () => {
        setShowRegisterPalay(true);
    };

    const handlePalayRegistered = (newPalay) => {
        console.log('New Palay registered:', newPalay);
        setShowRegisterPalay(false);
    };

    const handleDeclinedClick = (rowData) => {
        setSelectedDeclinedData({
            ...rowData
        });
        setShowDeclinedDetails(true);
    };

    const dateBodyTemplate = (rowData, field) => {
        const date = rowData[field];
        if (!date) return '';

        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const filteredData = inventoryData.filter(item => 
        selectedFilter === 'riceOrders' ? item.status !== 'Declined' : item.status === 'Declined'
    );

    const buttonStyle = (isSelected) => isSelected
        ? 'bg-primary text-white'
        : 'bg-white text-primary border border-gray-300';

    return (
        <RecipientLayout activePage="Rice Order">
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl h-full text-white font-bold mb-2">Rice Order</h1>
                    <span className="p-input-icon-left w-1/2 mr-4">
                        <Search className="text-primary ml-2 -translate-y-1"/>
                        <InputText 
                            type="search"
                            value={globalFilterValue} 
                            onChange={(e) => setGlobalFilterValue(e.target.value)} 
                            placeholder="Tap to Search" 
                            className="w-full pl-10 pr-4 py-2 rounded-full text-primary border border-gray-300 ring-0 placeholder:text-primary"
                        />
                    </span>
                </div>

                {/* Buttons & Search bar */}
                <div className="flex items-center space-x-2 justify-between mb-2 py-2">
                    <div className="flex flex-row space-x-2 items-center w-1/2 drop-shadow-md">
                        <Button 
                            icon={<Settings2 className="mr-2" />} 
                            label="Rice Orders" 
                            className={`p-button-success p-2 w-1/16 ring-0 rounded-full ${buttonStyle(selectedFilter === 'riceOrders')}`} 
                            onClick={() => setSelectedFilter('riceOrders')}
                        />

                        <Button 
                            icon={<Settings2 className="mr-2" />}
                            label="Declined" 
                            className={`p-button-success p-2 w-1/16 ring-0 rounded-full ${buttonStyle(selectedFilter === 'declined')}`} 
                            onClick={() => setSelectedFilter('declined')}
                        />
                    </div>

                    <div className="flex flex-row w-1/2 justify-end">
                        <Button 
                            label="New Order + " 
                            className="w-1/16 p-2 rounded-md p-button-success text-white bg-gradient-to-r from-primary to-secondary ring-0"
                            onClick={handleAddPalay} />
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                    <div className="flex-grow overflow-hidden bg-white">
                    <DataTable 
                        value={filteredData}
                        scrollable
                        scrollHeight="flex"
                        scrolldirection="both"
                        className="p-datatable-sm pt-5" 
                        filters={filters}
                        globalFilterFields={['trackingId', 'qualityType', 'status', 'farmer', 'originFarm']}
                        emptyMessage="No inventory found."
                        paginator
                        rows={30}
                    > 
                        <Column field="id" header="Order ID" className="text-center" headerClassName="text-center" />
                        <Column field="orderDate" header="Order Date" body={(rowData) => dateBodyTemplate(rowData, 'orderDate')} className="text-center" headerClassName="text-center" />
                        <Column field="riceQuantityBags" header="Quantity" className="text-center" headerClassName="text-center" />
                        <Column field="totalCost" header="Price" className="text-center" headerClassName="text-center" />
                        <Column field="preferredDeliveryDate" header="Delivery Date" body={(rowData) => dateBodyTemplate(rowData, 'preferredDeliveryDate')} className="text-center" headerClassName="text-center" />
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column body={actionBodyTemplate} exportable={false} className="text-center" headerClassName="text-center"/>
                    </DataTable>

                    </div>
                </div>
            </div>

            <PalayRegister
                visible={showRegisterPalay}
                onHide={() => setShowRegisterPalay(false)}
                onPalayRegistered={handlePalayRegistered}
            />

            <DeclinedDetails
                visible={showDeclinedDetails}
                onHide={() => setShowDeclinedDetails(false)}
                data={selectedDeclinedData}
            />
        </RecipientLayout> 
    );
}

export default RiceOrder;
