import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Plus, Download } from 'lucide-react';
import DryerRegister from './DryerRegister';
import DryerUpdate from './DryerUpdate';

function DryerFacility() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);

    const [dryerData, setDryerData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [displayDryerRegister, setDisplayDryerRegister] = useState(false);
    const [displayDryerUpdate, setDisplayDryerUpdate] = useState(false);
    const [selectedDryer, setSelectedDryer] = useState(null);

    useEffect(() => {
        fetchDryerData();
    }, []);

    const fetchDryerData = async () => {
        try {
            const res = await fetch(`${apiUrl}/dryers`);
            if (!res.ok) {
                throw new Error('Failed to fetch dryers data');
            }
            const data = await res.json();
            setDryerData(data);
        } catch (error) {
            console.log(error.message);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch dryers data', life: 3000 });
        }
    };

    const handleDryerRegistered = (newDryer) => {
        setDryerData([...dryerData, newDryer]);
        setDisplayDryerRegister(false);
        toast.current.show({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Dryer registered successfully', 
            life: 5000 
        });
    };

    const handleDryerUpdated = (updatedDryer) => {
        const updatedData = dryerData.map(dryer => dryer.id === updatedDryer.id ? updatedDryer : dryer);
        setDryerData(updatedData);
        setDisplayDryerUpdate(false);
        toast.current.show({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Dryer updated successfully', 
            life: 5000 
        });
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

    // Set filters for searching by ID, name, and status
    const filterByGlobal = (value) => {
        setFilters({
            global: { value: value, matchMode: 'equals' },
        });
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <Toast ref={toast} />
            <div className="w-full flex items-center justify-between gap-4">
                <IconField iconPosition="left" className="w-1/2">
                    <InputIcon className="pi pi-search text-light-grey"></InputIcon>
                    <InputText
                        placeholder="Tap to Search" 
                        type="search"
                        value={globalFilterValue} 
                        onChange={(e) => {
                            setGlobalFilterValue(e.target.value);
                            filterByGlobal(e.target.value); // Update filters on input change
                        }}
                        className='w-full ring-0 hover:border-primary focus:border-primary placeholder:text-light-grey' 
                    />
                </IconField>
                <div className="flex justify-end w-1/2">
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

            <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                <div className="flex-grow overflow-auto bg-white">
                    <DataTable 
                        value={dryerData}
                        scrollable
                        scrollHeight="flex"
                        scrolldirection="both"
                        className="p-datatable-sm px-5 pt-5"
                        filters={filters} // Pass filters here
                        globalFilterFields={['id', 'dryerName', 'status']}
                        emptyMessage="No inventory found."
                        paginator
                        paginatorClassName="border-t-2 border-gray-300"
                        rows={30}
                    >
                        <Column field="id" header="ID" className="text-center" headerClassName="text-center"/>
                        <Column field="dryerName" header="Dryer Name" className="text-center" headerClassName="text-center"/>
                        <Column field="location" header="Location" className="text-center" headerClassName="text-center"/>
                        <Column field="capacity" header="Capacity (bags)" className="text-center" headerClassName="text-center"/>
                        <Column field="processing" header="Processing" className="text-center" headerClassName="text-center"/>
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column body={actionBodyTemplate} exportable={false} className="text-center" headerClassName="text-center"/>
                    </DataTable>
                </div>
            </div>

            <DryerRegister 
                visible={displayDryerRegister} 
                onHide={hideRegisterDialog} 
                onDryerRegistered={handleDryerRegistered} 
            />
            
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
