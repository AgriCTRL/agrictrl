import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search, Settings2, FileX } from 'lucide-react';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';

import MillerRegister from './MillerRegister';
import MillerUpdate from './MillerUpdate';

function MillerFacility() {
    const [millerData, setMillerData] = useState([
        { id: 1, millerName: 'Miller A', location: 'San Pedro', capacity: 1000, processing: 750, type:'In house', status: 'Active' },
        { id: 2, millerName: 'Miller B', location: 'Biñan', capacity: 1500, processing: 1200, type:'Private', status: 'Active' },
        { id: 3, millerName: 'Miller C', location: 'Sta. Rosa', capacity: 2000, processing: 1800, type:'In house', status: 'Inactive' },
        { id: 4, millerName: 'Miller D', location: 'Cabuyao', capacity: 1800, processing: 900, type:'In house', status: 'Active' },
        { id: 5, millerName: 'Miller E', location: 'Calamba', capacity: 2200, processing: 1100, type:'Private', status: 'Inactive' },
        { id: 1, millerName: 'Miller A', location: 'San Pedro', capacity: 1000, processing: 750, type:'Private', status: 'Active' },
        { id: 2, millerName: 'Miller B', location: 'Biñan', capacity: 1500, processing: 1200, type:'In house', status: 'Active' },
        { id: 3, millerName: 'Miller C', location: 'Sta. Rosa', capacity: 2000, processing: 1800, type:'In house', status: 'Inactive' },
        { id: 4, millerName: 'Miller D', location: 'Cabuyao', capacity: 1800, processing: 900, type:'Private', status: 'Active' },
        { id: 5, millerName: 'Miller E', location: 'Calamba', capacity: 2200, processing: 1100, type:'Private', status: 'Inactive' },
    ]);

    // const apiUrl = import.meta.env.VITE_API_BASE_URL;
    // const [millerData, setMillerData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [displayMillerRegister, setDisplayMillerRegister] = useState(false);
    const [displayMillerUpdate, setDisplayMillerUpdate] = useState(false);
    const [selectedMiller, setSelectedMiller] = useState(null);

    // useEffect(() => {
    //     setFilters({
    //         global: { value: globalFilterValue, matchMode: 'contains' },
    //     });
    // }, [globalFilterValue]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await fetch(`${apiUrl}/millers`, {
    //                 method: 'GET',
    //                 headers: {'Content-Type': 'application/json'}
    //             });
    //             const data = await res.json();
    //             setMillerData(data);
    //         }
    //         catch (error) {
    //             console.log(error.message);
    //         }
    //     };
    //     fetchData();
    // }, []);

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
                        className="w-full pl-10 pr-4 py-2 rounded-lg placeholder-primary text-primary border border-gray-300 ring-0"
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
                            value={millerData}
                            scrollable
                            scrollHeight="flex"
                            scrollDirection="both"
                            className="p-datatable-sm px-5 pt-5"
                            filters={filters}
                            globalFilterFields={['id', 'millerName', 'location', 'status']}
                            emptyMessage="No inventory found."
                            paginator
                            rows={30}
                        >
                            <Column field="id" header="ID"/>
                            <Column field="millerName" header="Warehouse Name" className="pl-6"/>
                            <Column field="location" header="Location" className="pl-2"/>
                            <Column field="capacity" header="Capacity (mt)" className="pl-10"/>
                            <Column field="processing" header="Processing" className="pl-7"/>
                            <Column field="type" header="Type" className="pl-1"/>
                            <Column field="status" header="Status" body={statusBodyTemplate} className="w-1" headerClassName="pl-5"/>
                            <Column body={actionBodyTemplate} exportable={false} />
                        </DataTable>
                    </div>
                </div>

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

export default MillerFacility;
