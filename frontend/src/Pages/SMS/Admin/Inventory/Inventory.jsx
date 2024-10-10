import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Search, CircleAlert, Settings2, FileX } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';

function Inventory() { 
    // const apiUrl = import.meta.env.VITE_API_BASE_URL;
    // const [displayPalayRegister, setDisplayPalayRegister] = useState(false);
    // const [displayPalayUpdate, setDisplayPalayUpdate] = useState(false);
    // const [selectedPalay, setSelectedPalay] = useState(null);
    // const [refreshTrigger, setRefreshTrigger] = useState(0);

    // useEffect(() => {
    //     fetchInventoryData();
    // }, [refreshTrigger]);

    // const fetchInventoryData = async () => {
    //     try {
    //         const response = await fetch(`${apiUrl}/palaybatches`);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch inventory data');
    //         }
    //         const data = await response.json();
    //         setInventoryData(data);
    //     } catch (error) {
    //         console.error('Error fetching inventory data:', error);
    //         toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch inventory data' });
    //     }
    // };

    // const handlePalayRegistered = (newPalay) => {
    //     const relevantFields = {
    //         id: newPalay.id,
    //         dateReceived: newPalay.dateReceived,
    //         quantity: newPalay.quantity,
    //         qualityType: newPalay.qualityType,
    //         price: newPalay.price,
    //         status: newPalay.status,
    //     };
    //     setInventoryData([...inventoryData, relevantFields]);
    //     setDisplayPalayRegister(false);
    // };

    // const handlePalayUpdated = async (updatedPalay) => {
    //     try {
    //         // Update UI optimistically
    //         const relevantFields = {
    //             id: updatedPalay.id,
    //             dateReceived: updatedPalay.dateReceived,
    //             quantity: updatedPalay.quantity,
    //             qualityType: updatedPalay.qualityType,
    //             price: updatedPalay.price,
    //             status: updatedPalay.status,
    //         };
    //         setInventoryData(inventoryData.map(palay => 
    //             palay.id === updatedPalay.id ? relevantFields : palay
    //         ));

    //         // Optionally refetch the entire data for consistency
    //         await fetchInventoryData();
    //     } catch (error) {
    //         console.error('Error updating palay data:', error);
    //     } finally {
    //         setRefreshTrigger(prev => prev + 1);
    //         setDisplayPalayUpdate(false);
    //     }
    // };

    // const customFilter = (value, data) => {
    //     if (!value) return data;
    //     return data.filter(item => item.id.toString().includes(value));
    // };

    const [inventoryData, setInventoryData] = useState([
        { id: 1, trackingId: '001', dateBought: '2024-03-01', quantity: 1000, qualityType: 'Premium', status: 'Palay', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 20, farmer: 'Pablo Garcia', originFarm: 'Sta. Rosa', currentLocation: '001 Warehouse' },
        { id: 2, trackingId: '002', dateBought: '2024-03-02', quantity: 1500, qualityType: 'Standard', status: 'Processing', moistureContent: 14, purity: 98, damage: 2, pricePerKg: 18, farmer: 'Juan Dela Cruz', originFarm: 'Sta. Rosa', currentLocation: '002 Dryer' },
        { id: 3, trackingId: '003', dateBought: '2024-03-03', quantity: 2000, qualityType: 'Premium', status: 'Palay', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 21, farmer: 'Maria Santos', originFarm: 'San Pedro', currentLocation: '003 Warehouse' },
        { id: 4, trackingId: '004', dateBought: '2024-03-04', quantity: 1800, qualityType: 'Standard', status: 'Rice', moistureContent: 12, purity: 97, damage: 3, pricePerKg: 17, farmer: 'Pedro Reyes', originFarm: 'Biñan', currentLocation: 'Mill 01' },
        { id: 5, trackingId: '005', dateBought: '2024-03-05', quantity: 2200, qualityType: 'Premium', status: 'Processing', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 22, farmer: 'Ana Lim', originFarm: 'Cabuyao', currentLocation: '001 Warehouse' },
        { id: 6, trackingId: '001', dateBought: '2024-03-01', quantity: 1000, qualityType: 'Premium', status: 'Palay', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 20, farmer: 'Pablo Garcia', originFarm: 'Sta. Rosa', currentLocation: '001 Warehouse' },
        { id: 7, trackingId: '002', dateBought: '2024-03-02', quantity: 1500, qualityType: 'Standard', status: 'Processing', moistureContent: 14, purity: 98, damage: 2, pricePerKg: 18, farmer: 'Juan Dela Cruz', originFarm: 'Sta. Rosa', currentLocation: '002 Dryer' },
        { id: 8, trackingId: '003', dateBought: '2024-03-03', quantity: 2000, qualityType: 'Premium', status: 'Palay', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 21, farmer: 'Maria Santos', originFarm: 'San Pedro', currentLocation: '003 Warehouse' },
        { id: 9, trackingId: '004', dateBought: '2024-03-04', quantity: 1800, qualityType: 'Standard', status: 'Rice', moistureContent: 12, purity: 97, damage: 3, pricePerKg: 17, farmer: 'Pedro Reyes', originFarm: 'Biñan', currentLocation: 'Mill 01' },
        { id: 10, trackingId: '005', dateBought: '2024-03-05', quantity: 2200, qualityType: 'Premium', status: 'Palay', moistureContent: 13, purity: 99, damage: 1, pricePerKg: 22, farmer: 'Ana Lim', originFarm: 'Cabuyao', currentLocation: '001 Warehouse' },
    ]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

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

    return (
        <AdminLayout activePage="Inventory">
            <div className="flex flex-col h-full px-4 py-2">
                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <span className="p-input-icon-left w-1/2 mr-4">
                            <Search className="text-primary ml-2 -translate-y-1"/>
                            <InputText 
                                type="search"
                                value={globalFilterValue} 
                                onChange={(e) => setGlobalFilterValue(e.target.value)} 
                                placeholder="Tap to Search" 
                                className="w-full pl-10 pr-4 py-2 rounded-lg placeholder-gray-500 text-primary border border-gray-300 ring-0 placeholder:text-primary"
                            />
                        </span>

                        <div className="flex flex-row w-1/2 justify-between">
                            <Button 
                                icon={<Settings2 className="mr-2 text-primary" />}
                                label="Filters" 
                                className="p-button-success text-primary border border-gray-300 rounded-md bg-white p-2 w-1/16" />

                            <Button 
                                icon={<FileX className="mr-2" />} 
                                label="Export" 
                                className="p-button-success text-primary border border-primary rounded-md bg-transparent p-2 w-1/16" />
                        </div>

                    </div>
                </div>

                {/* DataTable Container */}
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
                            tableStyle={{ minWidth: '2200px' }}
                        >
                            <Column field="trackingId" header="Tracking ID" className="text-center" headerClassName="text-center" />
                            <Column field="id" header="Batch ID" className="text-center" headerClassName="text-center" />
                            <Column field="dateBought" header="Date Bought" className="text-center" headerClassName="text-center" />
                            <Column field="quantity" header="Quantity" className="text-center" headerClassName="text-center" />
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
        </AdminLayout>
    );
}

export default Inventory;
