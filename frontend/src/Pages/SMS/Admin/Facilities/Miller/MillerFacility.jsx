import React, { useState, useEffect, useRef } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import { Search, Settings2, FileX, Filter, Download, Plus } from 'lucide-react';

import MillerRegister from './MillerRegister';
import MillerUpdate from './MillerUpdate';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

function MillerFacility() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);

    const [millerData, setMillerData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [displayMillerRegister, setDisplayMillerRegister] = useState(false);
    const [displayMillerUpdate, setDisplayMillerUpdate] = useState(false);
    const [selectedMiller, setSelectedMiller] = useState(null);

    useEffect(() => {
        fetchMillerData();
    }, []);

    const fetchMillerData = async () => {
        try {
            const res = await fetch(`${apiUrl}/millers`);
            if (!res.ok) {
                throw new Error('Failed to fetch millers data');
            }
            const data = await res.json();
            setMillerData(data);
        } catch (error) {
            console.log(error.message);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch warehouse data', life: 3000 });
        }
    };

    const handleMillerRegistered = (newMiller) => {
        setMillerData([...millerData, newMiller]);
        setDisplayMillerRegister(false);
        toast.current.show({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Miller registered successfully', 
            life: 5000 
        });
    };

    const handleMillerUpdated = (updatedMiller) => {
        const updatedData = millerData.map(miller => miller.id === updatedMiller.id ? updatedMiller : miller);
        setMillerData(updatedData);
        setDisplayMillerUpdate(false);
        toast.current.show({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Miller updated successfully', 
            life: 5000 
        });
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

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'danger';
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

    const filterByGlobal = (value) => {
        setFilters({
            global: { value: value, matchMode: 'equals' },
        });
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <Toast ref={toast} />
            {/* top buttons */}
            <div className="w-full flex items-center justify-between gap-4">
                <IconField iconPosition="left" className="w-1/2">
                    <InputIcon className="pi pi-search text-light-grey"></InputIcon>
                    <InputText
                        placeholder="Tap to Search" 
                        type="search"
                        value={globalFilterValue} 
                        onChange={(e) => {
                            setGlobalFilterValue(e.target.value);
                            filterByGlobal(e.target.value);
                        }}
                        className='w-full ring-0 hover:border-primary focus:border-primary placeholder:text-light-grey' 
                    />
                </IconField>
                <div className="flex justify-end w-1/2">
                    {/* <Button 
                        type="button"
                        className="flex flex-center items-center gap-4 text-primary bg-white hover:bg-white/35 border border-lightest-grey ring-0"
                    >
                        <Filter size={20} />
                        <p className="font-semibold">Filters</p>
                    </Button> */}

                    <div className='flex gap-4'>
                        {/* <Button 
                            type="button"
                            className="flex flex-center items-center gap-4 bg-primary hover:bg-primaryHover border ring-0"
                        >
                            <Download size={20} />
                            <p className="font-semibold">Export</p>
                        </Button> */}

                        <Button 
                            type="button"
                            className="flex flex-center items-center gap-4 bg-primary hover:bg-primaryHover border-0 ring-0"
                            onClick={showDialog}
                        >
                            <Plus size={20} />
                            <p className="font-semibold">Add New</p>
                        </Button>
                    </div>
                </div>
            </div>

            {/* table */}
            <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                <div className="flex-grow overflow-auto bg-white">
                    <DataTable 
                        value={millerData}
                        scrollable
                        scrollHeight="flex"
                        scrolldirection="both"
                        className="p-datatable-sm px-5 pt-5"
                        filters={filters}
                        globalFilterFields={['id', 'millerName', 'status']}
                        emptyMessage="No inventory found."
                        paginator
                        paginatorClassName="border-t-2 border-gray-300"
                        rows={30}
                    >
                        <Column field="id" header="ID" className="text-center" headerClassName="text-center"/>
                        <Column field="millerName" header="Miller Name" className="text-center" headerClassName="text-center"/>
                        <Column field="location" header="Location" className="text-center" headerClassName="text-center"/>
                        <Column field="capacity" header="Capacity (bags)" className="text-center" headerClassName="text-center"/>
                        <Column field="processing" header="Processing" className="text-center" headerClassName="text-center"/>
                        <Column field="category" header="Category" className="text-center" headerClassName="text-center"/>
                        <Column field="type" header="Type" className="text-center" headerClassName="text-center"/>
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column body={actionBodyTemplate} exportable={false} className="text-center" headerClassName="text-center"/>
                    </DataTable>
                </div>
            </div>
            
            <MillerRegister 
                visible={displayMillerRegister} 
                onHide={hideRegisterDialog} 
                onMillerRegistered={handleMillerRegistered} 
            />
            
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

export default MillerFacility;
