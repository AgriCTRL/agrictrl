import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';

import PalayRegister from './PalayRegister';
import PalayUpdate from './PalayUpdate';
import UserLayout from '@/Layouts/UserLayout';

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
            case 'palay': return 'info';
            case 'drying': return 'success';
            case 'milling': return 'warning';
            case 'rice': return 'danger';
            default: return null;
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

    const handlePalayUpdated = (updatedPalay) => {
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
                <div className="flex flex-grow"></div>
                <Button label="+ Add New" onClick={() => setDisplayPalayRegister(true)} className="p-button-success" />
            </div>
        </div>
    );

    return (
        <UserLayout activePage="Inventory">
            <DataTable 
                value={inventoryData} 
                paginator 
                rows={5} 
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
                    onUpdatePalay={handlePalayUpdated} 
                />
            )}
        </UserLayout>
    );
}

export default Inventory;
