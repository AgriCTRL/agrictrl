import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Search } from 'lucide-react';

import PalayRegister from './PalayRegister';
import PalayUpdate from './PalayUpdate';
import UserLayout from '@/Layouts/UserLayout';

function Inventory() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [inventoryData, setInventoryData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [displayPalayRegister, setDisplayPalayRegister] = useState(false);
    const [displayPalayUpdate, setDisplayPalayUpdate] = useState(false);
    const [selectedPalay, setSelectedPalay] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchInventoryData();
    }, [refreshTrigger]);

    const fetchInventoryData = async () => {
        try {
            const response = await fetch(`${apiUrl}/palaybatches`);
            if (!response.ok) {
                throw new Error('Failed to fetch inventory data');
            }
            const data = await response.json();
            setInventoryData(data);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch inventory data' });
        }
    };

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
        case 'palay': return 'success';
        case 'drying': return 'info';
        case 'milling': return 'warning';
        case 'rice': return 'danger';
        default: return 'secondary';
      }
    };

    const statusBodyTemplate = (rowData) => (
        <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );

    const actionBodyTemplate = (rowData) => (
        <Button 
            icon="pi pi-pencil" 
            rounded 
            text 
            severity="info" 
            onClick={() => {
                setSelectedPalay(rowData);
                setDisplayPalayUpdate(true);
            }}
        />
    );

    const handlePalayRegistered = (newPalay) => {
        const relevantFields = {
            id: newPalay.id,
            dateReceived: newPalay.dateReceived,
            quantity: newPalay.quantity,
            qualityType: newPalay.qualityType,
            price: newPalay.price,
            status: newPalay.status,
        };
        setInventoryData([...inventoryData, relevantFields]);
        setDisplayPalayRegister(false);
    };

    const handlePalayUpdated = async (updatedPalay) => {
        try {
            // Update UI optimistically
            const relevantFields = {
                id: updatedPalay.id,
                dateReceived: updatedPalay.dateReceived,
                quantity: updatedPalay.quantity,
                qualityType: updatedPalay.qualityType,
                price: updatedPalay.price,
                status: updatedPalay.status,
            };
            setInventoryData(inventoryData.map(palay => 
                palay.id === updatedPalay.id ? relevantFields : palay
            ));

            // Optionally refetch the entire data for consistency
            await fetchInventoryData();
        } catch (error) {
            console.error('Error updating palay data:', error);
        } finally {
            setRefreshTrigger(prev => prev + 1);
            setDisplayPalayUpdate(false);
        }
    };

    const customFilter = (value, data) => {
        if (!value) return data;
        return data.filter(item => item.id.toString().includes(value));
    };

    const header = (
        <div className="p-grid p-nogutter">
            <div className="px-3 flex items-center">
                <span className="p-input-icon-left ">
                    <Search className="ml-3 -translate-y-1 text-[#00C261]"/>
                    <InputText 
                        type="search"
                        value={globalFilterValue} 
                        onChange={(e) => setGlobalFilterValue(e.target.value)} 
                        placeholder="Search" 
                        className="w-full pl-10 pr-4 py-2 rounded-lg placeholder-[#00C261] text-[#00C261] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </span>
                <div className="flex-grow"></div>
                <div className="justify-end items-center">
                    <Button label="+ Add Palay" onClick={() => setDisplayPalayRegister(true)} className="p-button-success text-white bg-gradient-to-r from-[#005155] to-[#00C261] p-2" />
                </div>
            </div>
        </div>
    );

    return (
        <UserLayout activePage="Inventory">
            <DataTable 
                value={customFilter(globalFilterValue, inventoryData)} 
                scrollable={true}
                scrollHeight="70vh"
                header={header}
                filters={filters}
                globalFilterFields={['qualityType', 'status']}
                emptyMessage="No inventory found."
            >
                <Column field="id" header="Batch ID"/>
                <Column field="price" header="Price"/>
                <Column field="quantity" header="Quantity"/>
                <Column field="qualityType" header="Quality"/>
                <Column field="status" header="Status" body={statusBodyTemplate}/>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '4rem' }} />
            </DataTable>

            <PalayRegister visible={displayPalayRegister} onHide={() => setDisplayPalayRegister(false)} onPalayRegistered={handlePalayRegistered} />
            {selectedPalay && (
                <PalayUpdate 
                    visible={displayPalayUpdate} 
                    onHide={() => setDisplayPalayUpdate(false)} 
                    selectedPalay={selectedPalay} 
                    onUpdateSuccess={handlePalayUpdated} 
                />
            )}
        </UserLayout>
    );
}

export default Inventory;