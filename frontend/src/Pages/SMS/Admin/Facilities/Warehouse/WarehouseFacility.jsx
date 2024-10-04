import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search, Settings2, FileX } from 'lucide-react';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';

import WarehouseRegister from './WarehouseRegister';
import WarehouseUpdate from './WarehouseUpdate';

function Warehouse() {
    const [warehouseData, setWarehouseData] = useState([
        { id: 1, warehouseName: 'Warehouse A', location: 'San Pedro', capacity: 1000, currentStock: 750, status: 'Active' },
        { id: 2, warehouseName: 'Warehouse B', location: 'Biñan', capacity: 1500, currentStock: 1200, status: 'Active' },
        { id: 3, warehouseName: 'Warehouse C', location: 'Sta. Rosa', capacity: 2000, currentStock: 1800, status: 'Inactive' },
        { id: 4, warehouseName: 'Warehouse D', location: 'Cabuyao', capacity: 1800, currentStock: 900, status: 'Active' },
        { id: 5, warehouseName: 'Warehouse E', location: 'Calamba', capacity: 2200, currentStock: 1100, status: 'Inactive' },
        { id: 1, warehouseName: 'Warehouse A', location: 'San Pedro', capacity: 1000, currentStock: 750, status: 'Active' },
        { id: 2, warehouseName: 'Warehouse B', location: 'Biñan', capacity: 1500, currentStock: 1200, status: 'Active' },
        { id: 3, warehouseName: 'Warehouse C', location: 'Sta. Rosa', capacity: 2000, currentStock: 1800, status: 'Inactive' },
        { id: 4, warehouseName: 'Warehouse D', location: 'Cabuyao', capacity: 1800, currentStock: 900, status: 'Active' },
        { id: 5, warehouseName: 'Warehouse E', location: 'Calamba', capacity: 2200, currentStock: 1100, status: 'Inactive' },
    ]);

    // const apiUrl = import.meta.env.VITE_API_BASE_URL;
    // const [warehouseData, setWarehouseData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [displayWarehouseRegister, setDisplayWarehouseRegister] = useState(false);
    const [displayWarehouseUpdate, setDisplayWarehouseUpdate] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    // useEffect(() => {
    //     setFilters({
    //         global: { value: globalFilterValue, matchMode: 'contains' },
    //     });
    // }, [globalFilterValue]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await fetch(`${apiUrl}/warehouses`, {
    //                 method: 'GET',
    //                 headers: {'Content-Type': 'application/json'}
    //             });
    //             const data = await res.json();
    //             setWarehouseData(data);
    //         }
    //         catch (error) {
    //             console.log(error.message);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const handleWarehouseRegistered = (newWarehouse) => {
        setWarehouseData([...warehouseData, newWarehouse]);
        setDisplayWarehouseRegister(false);
    };

    const handleWarehouseUpdated = (updatedWarehouse) => {
        const updatedData = warehouseData.map(warehouse => warehouse.id === updatedWarehouse.id ? updatedWarehouse : warehouse);
        setWarehouseData(updatedData);
        setDisplayWarehouseUpdate(false);
    };

    const showDialog = () => {
        setDisplayWarehouseRegister(true);
    };

    const hideRegisterDialog = () => {
        setDisplayWarehouseRegister(false);
    };

    const hideUpdateDialog = () => {
        setDisplayWarehouseUpdate(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button 
                icon="pi pi-pencil" 
                rounded 
                text 
                severity="info" 
                onClick={() => {
                    setSelectedWarehouse(rowData);
                    setDisplayWarehouseUpdate(true);
                }}
            />
        );
    };

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'warning';
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

    return (
        <div className="flex flex-col h-full">
            {/* top buttons */}
            <div className="flex items-center justify-between mb-5">
                <span className="p-input-icon-left w-1/2">
                    <Search className="ml-3 -translate-y-1 text-primary"/>
                    <InputText 
                        type="search"
                        value={globalFilterValue} 
                        onChange={(e) => setGlobalFilterValue(e.target.value)} 
                        placeholder="Search" 
                        className="w-full pl-10 pr-4 py-2 ring-0 rounded-lg placeholder-primary text-primary border border-gray-300"
                    />
                </span>

                <div className="flex justify-between w-1/2 ml-2">
                    <Button 
                        icon={<Settings2 className="mr-2 text-primary" />}
                        label="Filters" 
                        className="p-button-success ring-0 text-primary border border-gray-300 rounded-md bg-white p-2 w-1/16" />

                    <div className="flex flex-row">
                        <Button 
                            icon={<FileX className="mr-2" />} 
                            label="Export" 
                            className="p-button-success ring-0 text-primary border border-primary rounded-md bg-transparent p-2 mr-1 w-1/16" />
                        
                        <Button 
                            label="+ Add New" 
                            onClick={showDialog} 
                            className="p-button-success ring-0 text-white bg-gradient-to-r from-secondary to-primary ml-1 p-2" />
                    </div>
                </div>
            </div>

            {/* table */}
                <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                    <div className="flex-grow overflow-auto bg-white">
                        <DataTable 
                            value={warehouseData}
                            scrollable
                            scrollHeight="flex"
                            scrollDirection="both"
                            className="p-datatable-sm px-5 pt-5"
                            filters={filters}
                            globalFilterFields={['id', 'warehouseName', 'location', 'status']}
                            emptyMessage="No inventory found."
                            paginator
                            paginatorClassName="border-t-2 border-gray-300"
                            rows={30}
                        >
                            <Column field="id" header="ID"/>
                            <Column field="warehouseName" header="Warehouse Name" className="pl-6"/>
                            <Column field="location" header="Location" className="pl-2"/>
                            <Column field="capacity" header="Capacity (mt)" className="pl-10"/>
                            <Column field="currentStock" header="Current Stock (mt)" className="pl-14"/>
                            <Column field="status" header="Status" body={statusBodyTemplate} className="w-1" headerClassName="pl-5"/>
                            <Column body={actionBodyTemplate} exportable={false} />
                        </DataTable>
                    </div>
                </div>

            <WarehouseRegister visible={displayWarehouseRegister} onHide={hideRegisterDialog} onWarehouseRegistered={handleWarehouseRegistered} />
            {selectedWarehouse && (
                <WarehouseUpdate 
                    visible={displayWarehouseUpdate} 
                    onHide={hideUpdateDialog} 
                    selectedWarehouse={selectedWarehouse} 
                    onUpdateWarehouse={handleWarehouseUpdated} 
                />
            )}
        </div>
    );
}

export default Warehouse;
