import React, { useState, useEffect } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

import { Settings2, Search, CircleAlert, FileX } from "lucide-react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import PalayRegister from './PalayRegister';

function BuyPalay() {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [showRegisterPalay, setShowRegisterPalay] = useState(false);

    const [inventoryData, setInventoryData] = useState([
        { id: 1, trackingId: '001', dateBought: '2024-03-01', quantityInBags: 1000, grossWeight: 1000, netWeight: 1000, qualityType: 'Premium', status: 'Palay', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 20, farmer: 'Pablo Garcia', originFarm: 'Sta. Rosa', currentLocation: '001 Warehouse' },
        { id: 2, trackingId: '002', dateBought: '2024-03-02', quantityInBags: 1000, grossWeight: 1000, netWeight: 1000, qualityType: 'Standard', status: 'Processing', moistureContent: 14, purity: 98, damage: 2, pricePerKg: 18, farmer: 'Juan Dela Cruz', originFarm: 'Sta. Rosa', currentLocation: '002 Dryer' },
        { id: 3, trackingId: '003', dateBought: '2024-03-03', quantityInBags: 1000, grossWeight: 1000, netWeight: 1000, qualityType: 'Premium', status: 'Palay', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 21, farmer: 'Maria Santos', originFarm: 'San Pedro', currentLocation: '003 Warehouse' },
        { id: 4, trackingId: '004', dateBought: '2024-03-04', quantityInBags: 1000, grossWeight: 1000, netWeight: 1000, qualityType: 'Standard', status: 'Rice', moistureContent: 12, purity: 97, damage: 3, pricePerKg: 17, farmer: 'Pedro Reyes', originFarm: 'Biñan', currentLocation: 'Mill 01' },
        { id: 5, trackingId: '005', dateBought: '2024-03-05', quantityInBags: 1000, grossWeight: 1000, netWeight: 1000, qualityType: 'Premium', status: 'Processing', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 22, farmer: 'Ana Lim', originFarm: 'Cabuyao', currentLocation: '001 Warehouse' },
        { id: 6, trackingId: '001', dateBought: '2024-03-01', quantityInBags: 1000, grossWeight: 1000, netWeight: 1000, qualityType: 'Premium', status: 'Palay', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 20, farmer: 'Pablo Garcia', originFarm: 'Sta. Rosa', currentLocation: '001 Warehouse' },
        { id: 7, trackingId: '002', dateBought: '2024-03-02', quantityInBags: 1000, grossWeight: 1000, netWeight: 1000, qualityType: 'Standard', status: 'Processing', moistureContent: 14, purity: 98, damage: 2, pricePerKg: 18, farmer: 'Juan Dela Cruz', originFarm: 'Sta. Rosa', currentLocation: '002 Dryer' },
        { id: 8, trackingId: '003', dateBought: '2024-03-03', quantityInBags: 1000, grossWeight: 1000, netWeight: 1000, qualityType: 'Premium', status: 'Palay', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 21, farmer: 'Maria Santos', originFarm: 'San Pedro', currentLocation: '003 Warehouse' },
        { id: 9, trackingId: '004', dateBought: '2024-03-04', quantityInBags: 1000, grossWeight: 1000, netWeight: 1000, qualityType: 'Standard', status: 'Rice', moistureContent: 12, purity: 97, damage: 3, pricePerKg: 17, farmer: 'Pedro Reyes', originFarm: 'Biñan', currentLocation: 'Mill 01' },
        { id: 10, trackingId: '005', dateBought: '2024-03-05', quantityInBags: 1000, grossWeight: 1000, netWeight: 1000, qualityType: 'Premium', status: 'Palay', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 22, farmer: 'Ana Lim', originFarm: 'Cabuyao', currentLocation: '001 Warehouse' },
    ]);

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'palay': return 'success';
            case 'processing': return 'info';
            case 'rice': return 'warning';
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
    
    const actionBodyTemplate = (rowData) => (
        <CircleAlert 
            className="text-red-500"
            onClick={() => console.log('Edit clicked for:', rowData)}
        />
    );

    const handleAddPalay = () => {
        setShowRegisterPalay(true);
    };

    const handlePalayRegistered = (newPalay) => {
        console.log('New Palay registered:', newPalay);
        setShowRegisterPalay(false);
    };
    

    return (
        <StaffLayout activePage="Procurement">
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl text-white font-bold mb-2">Palay Procurement</h1>
                    <span className="p-input-icon-left w-1/2 mr-4 mb-4">
                        <Search className="text-white ml-2 -translate-y-1"/>
                        <InputText 
                            type="search"
                            value={globalFilterValue} 
                            onChange={(e) => setGlobalFilterValue(e.target.value)} 
                            placeholder="Tap to Search" 
                            className="w-full pl-10 pr-4 py-2 rounded-full text-white bg-transparent border border-white placeholder:text-white"
                        />
                    </span>
                </div>

                {/* Buttons & Search bar */}
                <div className="flex items-center space-x-2 justify-between mb-2 py-2">
                    <div className="flex flex-row space-x-2 items-center w-1/2 drop-shadow-md">
                        <Button className="p-2 px-3 rounded-lg text-md font-medium text-white bg-primary ring-0">All</Button>
                        <Button 
                            icon={<Settings2 className="mr-2 text-primary" />}
                            label="Filters" 
                            className="p-button-success text-primary border border-gray-300 rounded-full bg-white p-2 w-1/16 ring-0" />
                    </div>
                    

                    <div className="flex flex-row w-1/2 justify-end">
                        <Button 
                            label="Buy Palay +" 
                            className="w-1/16 p-2 rounded-md p-button-success text-white bg-gradient-to-r from-primary to-secondary ring-0"
                            onClick={handleAddPalay} />
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                    <div className="flex-grow overflow-hidden bg-white">
                        <DataTable 
                            value={inventoryData}
                            scrollable
                            scrollHeight="flex"
                            scrollDirection="both"
                            className="p-datatable-sm pt-5"
                            filters={filters}
                            globalFilterFields={['trackingId', 'qualityType', 'status', 'farmer', 'originFarm']}
                            emptyMessage="No inventory found."
                            paginator
                            rows={30}
                            tableStyle={{ minWidth: '2900px' }}
                        >
                            <Column field="trackingId" header="Tracking ID" className="text-center" headerClassName="text-center" />
                            <Column field="id" header="Batch ID" className="text-center" headerClassName="text-center" />
                            <Column field="dateBought" header="Date Bought" className="text-center" headerClassName="text-center" />
                            <Column field="quantityInBags" header="Quantity in Bags" className="text-center" headerClassName="text-center" />
                            <Column field="grossWeight" header="Gross Weight" className="text-center" headerClassName="text-center" />
                            <Column field="netWeight" header="Net Weight" className="text-center" headerClassName="text-center" />
                            <Column field="qualityType" header="Quality Type" className="text-center" headerClassName="text-center" />
                            <Column field="moistureContent" header="Moisture Content" className="text-center" headerClassName="text-center" />
                            <Column field="purity" header="Purity" className="text-center" headerClassName="text-center" />
                            <Column field="damage" header="Damage" className="text-center" headerClassName="text-center" />
                            <Column field="pricePerKg" header="Price/Kg" className="text-center" headerClassName="text-center" />
                            <Column field="farmer" header="Farmer" className="text-center" headerClassName="text-center" />
                            <Column field="originFarm" header="Origin Farm" className="text-center" headerClassName="text-center" />
                            <Column field="currentLocation" header="Current Location" className="text-center" headerClassName="text-center" />
                            <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center" frozen alignFrozen="right" />
                            <Column body={actionBodyTemplate} exportable={false} className="text-center" headerClassName="text-center" frozen alignFrozen="right" />
                        </DataTable>
                    </div>
                </div>
            </div>

            <PalayRegister
                    visible={showRegisterPalay}
                    onHide={() => setShowRegisterPalay(false)}
                    onPalayRegistered={handlePalayRegistered}
                />
        </StaffLayout> 
    );
}

export default BuyPalay;