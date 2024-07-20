import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';

import PalayRegister from './PalayRegister';
import PalayUpdate from './PalayUpdate';
import UserLayout from '../../Layouts/UserLayout';

function Inventory() {
    const [inventoryData, setInventoryData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [displayPalayRegister, setDisplayPalayRegister] = useState(false);
    const [displayPalayUpdate, setDisplayPalayUpdate] = useState(false);
    const [selectedPalay, setSelectedPalay] = useState(null);

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'palay':
                return 'info';
            case 'drying':
                return 'success';
            case 'milling':
                return 'warning';
            case 'rice':
                return 'danger';
            default:
                return null;
        }
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
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
    };

    const handlePalayRegistered = (newPalay) => {
        setInventoryData([...inventoryData, newPalay]);
        setDisplayPalayRegister(false);
    };

    const handlePalayUpdated = (updatedPalay) => {
        const updatedData = inventoryData.map(palay => palay.id === updatedPalay.id ? updatedPalay : palay);
        setInventoryData(updatedData);
        setDisplayPalayUpdate(false);
    };

    const showDialog = () => {
        setDisplayPalayRegister(true);
    };

    const hideRegisterDialog = () => {
        setDisplayPalayRegister(false);
    };

    const hideUpdateDialog = () => {
        setDisplayPalayUpdate(false);
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
        <UserLayout activePage="Inventory">
            <div className='bg-white p-4 rounded'>Inventory</div>

            <DataTable 
                value={inventoryData} 
                paginator 
                rows={5} 
                header={header}
                filters={filters}
                globalFilterFields={['trackingId', 'variety', 'status']}
                emptyMessage="No inventory found."
            >
                <Column field="id" header="Tracking ID" sortable />
                <Column field="variety" header="Variety" sortable />
                <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                <Column field="inventory" header="Inventory" sortable />
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '4rem' }} />
            </DataTable>

            <PalayRegister visible={displayPalayRegister} onHide={hideRegisterDialog} onPalayRegistered={handlePalayRegistered} />
            {selectedPalay && (
                <PalayUpdate 
                    visible={displayPalayUpdate} 
                    onHide={hideUpdateDialog} 
                    selectedPalay={selectedPalay} 
                    onUpdatePalay={handlePalayUpdated} 
                />
            )}
        </UserLayout>
    );
}

export default Inventory;
