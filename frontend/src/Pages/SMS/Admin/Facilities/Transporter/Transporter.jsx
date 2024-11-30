import React, { useState, useEffect, useRef } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import { Search, Plus } from 'lucide-react';

import TransporterRegister from './TransporterRegister';
import TransporterUpdate from './TransporterUpdate';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import EmptyRecord from '../../../../../Components/EmptyRecord';

function Transporter() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);

    const [transporterData, setTransporterData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [displayTransporterRegister, setDisplayTransporterRegister] = useState(false);
    const [displayTransporterUpdate, setDisplayTransporterUpdate] = useState(false);
    const [selectedTransporter, setSelectedTransporter] = useState(null);

    useEffect(() => {
        fetchTransporterData();
    }, []);

    const fetchTransporterData = async () => {
        try {
            const res = await fetch(`${apiUrl}/transporters/type/In House`);
            if (!res.ok) {
                throw new Error('Failed to fetch transporters data');
            }
            const data = await res.json();
            setTransporterData(data);
        } catch (error) {
            console.log(error.message);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch transporter data', life: 3000 });
        }
    };

    const handleTransporterRegistered = (newTransporter) => {
        setTransporterData([...transporterData, newTransporter]);
        setDisplayTransporterRegister(false);
        toast.current.show({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Transporter registered successfully', 
            life: 5000 
        });
    };

    const handleTransporterUpdated = (updatedTransporter) => {
        const updatedData = transporterData.map(transporter => 
            transporter.id === updatedTransporter.id ? updatedTransporter : transporter
        );
        setTransporterData(updatedData);
        setDisplayTransporterUpdate(false);
        toast.current.show({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Transporter updated successfully', 
            life: 5000 
        });
    };

    const showDialog = () => {
        setDisplayTransporterRegister(true);
    };

    const hideRegisterDialog = () => {
        setDisplayTransporterRegister(false);
    };

    const hideUpdateDialog = () => {
        setDisplayTransporterUpdate(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button 
                icon="pi pi-pencil" 
                rounded 
                text 
                severity="info" 
                onClick={() => {
                    setSelectedTransporter(rowData);
                    setDisplayTransporterUpdate(true);
                }}
            />
        );
    };

    const filterByGlobal = (value) => {
        setFilters({
            global: { value: value, matchMode: 'contains' },
        });
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
                            filterByGlobal(e.target.value);
                        }}
                        className='w-full ring-0 hover:border-primary focus:border-primary placeholder:text-light-grey' 
                    />
                </IconField>
                
                <div className="flex justify-end w-1/2">
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

            <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                <div className="flex-grow overflow-auto bg-white">
                    <DataTable 
                        value={transporterData}
                        scrollable
                        scrollHeight="flex"
                        scrolldirection="both"
                        className="p-datatable-sm px-5 pt-5"
                        filters={filters}
                        globalFilterFields={['id', 'transporterName', 'transporterType']}
                        emptyMessage={<EmptyRecord label="No transporters found" />}
                        paginator
                        paginatorClassName="border-t-2 border-gray-300"
                        rows={30}
                    >
                        <Column field="id" header="ID" className="text-center" headerClassName="text-center"/>
                        <Column field="transporterType" header="Transporter Type" className="text-center" headerClassName="text-center"/>
                        <Column field="transporterName" header="Transporter Name" className="text-center" headerClassName="text-center"/>
                        <Column field="plateNumber" header="Plate Number" className="text-center" headerClassName="text-center"/>
                        <Column field="description" header="Description" className="text-center" headerClassName="text-center"/>
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column body={actionBodyTemplate} exportable={false} className="text-center" headerClassName="text-center"/>
                    </DataTable>
                </div>
            </div>
            
            <TransporterRegister 
                visible={displayTransporterRegister} 
                onHide={hideRegisterDialog} 
                onTransporterRegistered={handleTransporterRegistered} 
            />
            
            {selectedTransporter && (
                <TransporterUpdate 
                    visible={displayTransporterUpdate} 
                    onHide={hideUpdateDialog} 
                    selectedTransporter={selectedTransporter} 
                    onUpdateTransporter={handleTransporterUpdated} 
                />
            )}
        </div>
    );
}

export default Transporter;