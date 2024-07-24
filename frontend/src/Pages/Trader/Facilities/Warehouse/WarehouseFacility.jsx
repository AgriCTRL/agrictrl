import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search } from 'lucide-react';

import WarehouseRegister from './WarehouseRegister';
import WarehouseUpdate from './WarehouseUpdate';

function Warehouse() {
    const [warehouseData, setWarehouseData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [displayWarehouseRegister, setDisplayWarehouseRegister] = useState(false);
    const [displayWarehouseUpdate, setDisplayWarehouseUpdate] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    useEffect(() => {
        setFilters({
            global: { value: globalFilterValue, matchMode: 'contains' },
        });
    }, [globalFilterValue]);

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

    const header = (
        <div className="p-grid p-nogutter">
            <div className="px-3 flex items-center">
                <span className="p-input-icon-left ">
                    <Search className="ml-4 -translate-y-1"/>
                    <input 
                        value={globalFilterValue} 
                        onChange={(e) => setGlobalFilterValue(e.target.value)} 
                        placeholder="Search" 
                        className="p-inputtext p-component ml-2 pl-10 p-2"
                    />
                </span>
                <div className="flex-grow"></div>
                <div className="justify-end items-center">
                    <Button label="+ Add New" onClick={showDialog} className="p-button-success bg-white p-2" />
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <DataTable 
                value={warehouseData} 
                paginator 
                rows={3} 
                header={header}
                filters={filters}
                globalFilterFields={['warehouseName', 'capacity', 'location', 'status']}
                emptyMessage="No warehouses found."
            >
                <Column field="warehouseName" header="Warehouse Name" sortable />
                <Column field="capacity" header="Capacity" sortable />
                <Column field="location" header="Location" sortable />
                <Column field="status" header="Status" sortable />
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '4rem' }} />
            </DataTable>

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
