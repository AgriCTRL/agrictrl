import React, { useState, useEffect, useRef  } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import { Settings2, Search, CircleAlert, FileX, RotateCw } from "lucide-react";

import PalayRegister from './PalayRegister';
import { useAuth } from '../../../Authentication/Login/AuthContext';

function BuyPalay() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const { user } = useAuth();

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [showRegisterPalay, setShowRegisterPalay] = useState(false);
    const [inventoryData, setInventoryData] = useState([]);

    useEffect(() => {
        fetchPalayData();
    }, []);

    useEffect(() => {
        const newFilters = {
            global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
        };
        setFilters(newFilters);
    }, [globalFilterValue]);

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const fetchPalayData = async () => {
        try {
            const response = await fetch(`${apiUrl}/palaybatches`);

            if (!response.ok) {
                throw new Error('Failed to fetch palay data');
            }

            const data = await response.json();
            setInventoryData(data);
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch palay data',
                life: 3000
            });
        }
    };

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
          case 'to be dry': return 'success';
          case 'in drying': return 'success';
          case 'to be mill': return 'info';
          case 'in milling': return 'info';
          case 'milled': return 'primary';
          default: return 'danger';
        }
        // sucess - green
        // info - blue
        // warning - orange
        // danger - red 
        // primary - cyan
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
        fetchPalayData();
        setShowRegisterPalay(false);
    };

    const dateBodyTemplate = (rowData) => {
        return new Date(rowData.dateBought).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <StaffLayout activePage="Procurement" user={user}>
            <Toast ref={toast} />
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl text-white font-bold mb-2">Palay Procurement</h1>
                    <span className="p-input-icon-left w-1/2 mr-4 mb-4">
                        <Search className="text-white ml-2 -translate-y-1"/>
                        <InputText 
                            type="search"
                            value={globalFilterValue} 
                            onChange={onGlobalFilterChange} 
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
                        <RotateCw 
                            className="w-6 h-6 text-primary cursor-pointer hover:text-secondary transition-colors" 
                            onClick={fetchPalayData}
                            title="Refresh data"
                        />
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
                            scrolldirection="both"
                            className="p-datatable-sm pt-5"
                            filters={filters}
                            globalFilterFields={['id', 'status']}
                            emptyMessage="No inventory found."
                            paginator
                            rows={30}
                            tableStyle={{ minWidth: '2450px' }}
                        >
                            <Column field="id" header="Batch ID" className="text-center" headerClassName="text-center" />
                            <Column field="dateBought" body={dateBodyTemplate} header="Date Bought" className="text-center" headerClassName="text-center" />
                            <Column field="quantityBags" header="Quantity in Bags" className="text-center" headerClassName="text-center" />
                            <Column field="grossWeight" header="Gross Weight" className="text-center" headerClassName="text-center" />
                            <Column field="netWeight" header="Net Weight" className="text-center" headerClassName="text-center" />
                            <Column field="qualityType" header="Quality Type" className="text-center" headerClassName="text-center" />
                            <Column field="qualitySpec.moistureContent" header="Moisture Content" className="text-center" headerClassName="text-center" />
                            <Column field="qualitySpec.purity" header="Purity" className="text-center" headerClassName="text-center" />
                            <Column field="qualitySpec.damaged" header="Damage" className="text-center" headerClassName="text-center" />
                            <Column field="price" header="Price/Kg" className="text-center" headerClassName="text-center" />
                            <Column field="palaySupplier.farmerName" header="Supplier" className="text-center" headerClassName="text-center" />
                            <Column 
                                field=""
                                header="Farm Origin" 
                                className="text-center" 
                                headerClassName="text-center"
                                body={(rowData) => `${rowData.farm.region}, ${rowData.farm.province}`}
                            />
                            <Column field="currentlyAt" header="Current Location" className="text-center" headerClassName="text-center" />
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