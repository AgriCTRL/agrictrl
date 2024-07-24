import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import WarehouseRegister from './WarehouseRegister';
import WarehouseUpdate from './WarehouseUpdate';
import UserLayout from '../../../../Layouts/UserLayout';

function Warehouse() {
    const [warehouseData, setWarehouseData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [displayWarehouseRegister, setDisplayWarehouseRegister] = useState(false);
    const [displayWarehouseUpdate, setDisplayWarehouseUpdate] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

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
            <div className="p-col-6 flex items-center">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <input 
                        value={globalFilterValue} 
                        onChange={(e) => setGlobalFilterValue(e.target.value)} 
                        placeholder="Search" 
                        className="p-inputtext p-component ml-2"
                    />
                </span>
            </div>
            <div className="p-col-6 flex justify-end items-center">
                <Button label="+ Add New" onClick={showDialog} className="p-button-success" />
            </div>
        </div>
    );

    return (
        <UserLayout activePage="Warehouse">
            <div className='bg-white p-4 rounded'>Warehouse</div>

            <DataTable 
                value={warehouseData} 
                paginator 
                rows={5} 
                header={header}
                filters={filters}
                globalFilterFields={['warehouseName', 'capacity', 'location']}
                emptyMessage="No warehouses found."
            >
                <Column field="warehouseName" header="Warehouse Name" sortable />
                <Column field="capacity" header="Capacity" sortable />
                <Column field="location" header="Location" sortable />
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
        </UserLayout>
    );
}

export default Warehouse;
