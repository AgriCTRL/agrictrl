import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search } from 'lucide-react';
import { InputText } from 'primereact/inputtext';

import MillerRegister from './MillerRegister';
import MillerUpdate from './MillerUpdate';

function MillerFacility() {
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millers', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setMillerData(data);
            }
            catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, [millerData]);


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
                value={millerData} 
                scrollable={true}
                scrollHeight="45vh"
                header={header}
                filters={filters}
                globalFilterFields={['name', 'capacity', 'location']}
                emptyMessage="No millers found."
            >
                <Column field="name" header="Miller Name"/>
                <Column field="capacity" header="Capacity"/>
                <Column field="location" header="Location"/>
                <Column field="status" header="Status"/>
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

export default MillerFacility;
