import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search } from 'lucide-react';

import DryerRegister from './DryerRegister';
import DryerUpdate from './DryerUpdate';

function DryerFacility() {
    const [dryerData, setDryerData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [displayDryerRegister, setDisplayDryerRegister] = useState(false);
    const [displayDryerUpdate, setDisplayDryerUpdate] = useState(false);
    const [selectedDryer, setSelectedDryer] = useState(null);

    useEffect(() => {
        setFilters({
            global: { value: globalFilterValue, matchMode: 'contains' },
        });
    }, [globalFilterValue]);

    const handleDryerRegistered = (newDryer) => {
        setDryerData([...dryerData, newDryer]);
        setDisplayDryerRegister(false);
    };

    const handleDryerUpdated = (updatedDryer) => {
        const updatedData = dryerData.map(dryer => dryer.id === updatedDryer.id ? updatedDryer : dryer);
        setDryerData(updatedData);
        setDisplayDryerUpdate(false);
    };

    const showDialog = () => {
        setDisplayDryerRegister(true);
    };

    const hideRegisterDialog = () => {
        setDisplayDryerRegister(false);
    };

    const hideUpdateDialog = () => {
        setDisplayDryerUpdate(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button 
                icon="pi pi-pencil" 
                rounded 
                text 
                severity="info" 
                onClick={() => {
                    setSelectedDryer(rowData);
                    setDisplayDryerUpdate(true);
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
                value={dryerData} 
                paginator 
                rows={3} 
                header={header}
                filters={filters}
                globalFilterFields={['dryerName', 'capacity', 'location', 'status']}
                emptyMessage="No dryers found."
            >
                <Column field="dryerName" header="Dryer Name" sortable />
                <Column field="capacity" header="Capacity" sortable />
                <Column field="location" header="Location" sortable />
                <Column field="status" header="Status" sortable />
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '4rem' }} />
            </DataTable>

            <DryerRegister visible={displayDryerRegister} onHide={hideRegisterDialog} onDryerRegistered={handleDryerRegistered} />
            {selectedDryer && (
                <DryerUpdate 
                    visible={displayDryerUpdate} 
                    onHide={hideUpdateDialog} 
                    selectedDryer={selectedDryer} 
                    onUpdateDryer={handleDryerUpdated} 
                />
            )}
        </div>
    );
}

export default DryerFacility;
