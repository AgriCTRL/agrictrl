import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search } from 'lucide-react';

import MillerRegister from './MillerRegister';
import MillerUpdate from './MillerUpdate';

function Miller() {
    const [millerData, setMillerData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [displayMillerRegister, setDisplayMillerRegister] = useState(false);
    const [displayMillerUpdate, setDisplayMillerUpdate] = useState(false);
    const [selectedMiller, setSelectedMiller] = useState(null);

    useEffect(() => {
        setFilters({
            global: { value: globalFilterValue, matchMode: 'contains' },
        });
    }, [globalFilterValue]);

    const handleMillerRegistered = (newMiller) => {
        setMillerData([...millerData, newMiller]);
        setDisplayMillerRegister(false);
    };

    const handleMillerUpdated = (updatedMiller) => {
        const updatedData = millerData.map(miller => miller.id === updatedMiller.id ? updatedMiller : miller);
        setMillerData(updatedData);
        setDisplayMillerUpdate(false);
    };

    const showDialog = () => {
        setDisplayMillerRegister(true);
    };

    const hideRegisterDialog = () => {
        setDisplayMillerRegister(false);
    };

    const hideUpdateDialog = () => {
        setDisplayMillerUpdate(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button 
                icon="pi pi-pencil" 
                rounded 
                text 
                severity="info" 
                onClick={() => {
                    setSelectedMiller(rowData);
                    setDisplayMillerUpdate(true);
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
                value={millerData} 
                paginator 
                rows={3} 
                header={header}
                filters={filters}
                globalFilterFields={['millerName', 'capacity', 'location', 'status']}
                emptyMessage="No millers found."
            >
                <Column field="millerName" header="Miller Name" sortable />
                <Column field="capacity" header="Capacity" sortable />
                <Column field="location" header="Location" sortable />
                <Column field="status" header="Status" sortable />
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '4rem' }} />
            </DataTable>

            <MillerRegister visible={displayMillerRegister} onHide={hideRegisterDialog} onMillerRegistered={handleMillerRegistered} />
            {selectedMiller && (
                <MillerUpdate 
                    visible={displayMillerUpdate} 
                    onHide={hideUpdateDialog} 
                    selectedMiller={selectedMiller} 
                    onUpdateMiller={handleMillerUpdated} 
                />
            )}
        </div>
    );
}

export default Miller;