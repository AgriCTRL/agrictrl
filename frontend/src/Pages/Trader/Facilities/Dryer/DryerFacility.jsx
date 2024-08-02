import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search } from 'lucide-react';
import { InputText } from 'primereact/inputtext';

import DryerRegister from './DryerRegister';
import DryerUpdate from './DryerUpdate';

function DryerFacility() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${apiUrl}/dryers`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setDryerData(data);
            }
            catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, [dryerData]);


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
        <div className="px-3 flex items-center">
            <span className="p-input-icon-left ">
                <Search className="ml-3 -translate-y-1 text-[#00C261]"/>
                <InputText 
                    type="search"
                    value={globalFilterValue} 
                    onChange={(e) => setGlobalFilterValue(e.target.value)} 
                    placeholder="Search" 
                    className="w-full pl-10 pr-4 py-2 rounded-lg placeholder-[#00C261] text-[#00C261] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </span>
            <div className="flex-grow"></div>
                <div className="justify-end items-center">
                    <Button label="+ Add New" onClick={showDialog} className="p-button-success text-white bg-gradient-to-r from-[#005155] to-[#00C261] p-2" />
                </div>
        </div>
    );

    return (
        <div>
            <DataTable 
                value={dryerData} 
                scrollable={true}
                scrollHeight="45vh"
                header={header}
                filters={filters}
                globalFilterFields={['name', 'capacity', 'location']}
                emptyMessage="No dryers found."
            >
                <Column field="name" header="Dryer Name"/>
                <Column field="capacity" header="Capacity"/>
                <Column field="location" header="Location"/>
                <Column field="status" header="Status"/>
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
