import React, { useState, useEffect } from 'react';
import PrivateMillerLayout from '../../../Layouts/PrivateMillerLayout';
import { Search, Box, Factory, RotateCcw, CheckCircle } from "lucide-react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

function MillingTransactions() {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [inventoryData, setInventoryData] = useState([
        { id: 1, dryer: 'Manheim', dryingMethod: 'machine', dateSent: '2/11/12', qualityType: 'Fresh', status: 'To receive'},
        { id: 2, dryer: 'Pune', dryingMethod: 'sun', dateSent: '7/11/19', qualityType: 'Dry', status: 'To return'},
        { id: 3, dryer: 'Augusta', dryingMethod: 'machine', dateSent: '4/21/12', qualityType: 'Dry', status: 'To mill'},
        { id: 4, dryer: 'Augusta', dryingMethod: 'sun', dateSent: '10/28/12', qualityType: 'Fresh', status: 'To receive'},
        { id: 5, dryer: 'Augusta', dryingMethod: 'sun', dateSent: '12/10/13', qualityType: 'Dry', status: 'To receive'},
        { id: 6, dryer: 'Augusta', dryingMethod: 'sun', dateSent: '12/10/13', qualityType: 'Dry', status: 'To return'},
        { id: 7, dryer: 'Berlin', dryingMethod: 'machine', dateSent: '3/15/14', qualityType: 'Fresh', status: 'To mill'},
        { id: 8, dryer: 'Tokyo', dryingMethod: 'sun', dateSent: '5/20/14', qualityType: 'Dry', status: 'To receive'},
        { id: 9, dryer: 'Paris', dryingMethod: 'machine', dateSent: '6/30/14', qualityType: 'Fresh', status: 'To mill'},
        { id: 10, dryer: 'London', dryingMethod: 'sun', dateSent: '8/5/14', qualityType: 'Dry', status: 'To return'},
    ]);

    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showReceiveDialog, setShowReceiveDialog] = useState(false);
    const [showMillDialog, setShowMillDialog] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'to receive': return 'warning';
            case 'to mill': return 'info';
            case 'to return': return 'success';
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

    const actionBodyTemplate = (rowData) => {
        const actionText = rowData.status.split(' ')[1];
        return (
            <Button 
                label={actionText.charAt(0).toUpperCase() + actionText.slice(1)} 
                className="p-button-text p-button-sm text-primary" 
                onClick={() => handleActionClick(rowData.status)}
            />
        );
    };
    
    const handleActionClick = (status) => {
        switch (status.toLowerCase()) {
            case 'to receive':
                setShowReceiveDialog(true);
                break;
            case 'to mill':
                setShowMillDialog(true);
                break;
            case 'to return':
                setShowReturnDialog(true);
                break;
        }
    };

    const filteredData = inventoryData.filter(item => 
        selectedFilter === 'all' || item.status.toLowerCase() === selectedFilter.toLowerCase()
    );

    const getFilterCount = (filter) => {
        return inventoryData.filter(item => item.status.toLowerCase() === filter.toLowerCase()).length;
    };


    const FilterButton = ({ label, icon, filter }) => (
        <Button 
            label={label} 
            icon={icon} 
            className={`p-button-sm ring-0 border-none rounded-full ${selectedFilter === filter ? 'p-button-outlined bg-primary text-white' : 'p-button-text text-primary'} flex items-center`} 
            onClick={() => setSelectedFilter(filter)}
        >
            <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">
                {getFilterCount(filter)}
            </span>
        </Button>
    );

    return (
        <PrivateMillerLayout activePage="Milling Transactions">
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl h-full text-white font-bold mb-2">Mill Palay</h1>
                    <span className="p-input-icon-left w-1/2 mr-4">
                        <Search className="text-white ml-2 -translate-y-1"/>
                        <InputText 
                            type="search"
                            value={globalFilterValue} 
                            onChange={(e) => setGlobalFilterValue(e.target.value)} 
                            placeholder="Tap to Search" 
                            className="w-full pl-10 pr-4 py-2 rounded-full text-white bg-transparent border border-white placeholder:text-white"
                        />
                    </span>
                </div>

                {/* Buttons & Filters */}
                <div className="flex justify-start mb-4 space-x-2">
                    <Button 
                        label="All" 
                        className={`p-button-sm border-none ring-0  ${selectedFilter === 'all' ? 'p-button-raised bg-primary text-white' : 'p-button-outlined bg-white text-primary'}`} 
                        onClick={() => setSelectedFilter('all')} 
                    />
                    <div className="flex bg-white rounded-full gap-2">
                        <FilterButton label="To receive" icon={<Box className="mr-2" size={16} />} filter="to receive" />
                        <FilterButton label="To mill" icon={<Factory className="mr-2" size={16} />} filter="to mill" />
                        <FilterButton label="To return" icon={<RotateCcw className="mr-2" size={16} />} filter="to return" />
                    </div>
                    
                </div>

                {/* Data Table */}
                <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                    <div className="flex-grow overflow-hidden bg-white">
                    <DataTable 
                        value={filteredData}
                        scrollable
                        scrollHeight="flex"
                        scrollDirection="both"
                        className="p-datatable-sm pt-5" 
                        filters={filters}
                        globalFilterFields={['dryer', 'dryingMethod', 'dateSent', 'qualityType', 'status']}
                        emptyMessage="No inventory found."
                        paginator
                        rows={10}
                    > 
                        <Column field="id" header="ID" className="text-center" headerClassName="text-center" />
                        <Column field="dryer" header="Dryer" className="text-center" headerClassName="text-center" />
                        <Column field="dryingMethod" header="Drying Method" className="text-center" headerClassName="text-center" />
                        <Column field="dateSent" header="Date Sent" className="text-center" headerClassName="text-center" />
                        <Column field="qualityType" header="Quality Type" className="text-center" headerClassName="text-center" />
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column header="Action" body={actionBodyTemplate} className="text-center" headerClassName="text-center"/>
                    </DataTable>
                    </div>
                </div>
            </div>

            {/* Receive Palay Dialog */}
            <Dialog header="Receive palay" visible={showReceiveDialog} onHide={() => setShowReceiveDialog(false)} className="w-1/3">
                <div className="flex flex-col items-center">
                    <CheckCircle size={45} className="text-primary mb-6"/>
                    <p className="mb-10">Are you sure you want receive this palay?</p>
                    <div className="flex justify-between w-full gap-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowReceiveDialog(false)} />
                        <Button label="Confirm Receive" className="w-1/2 bg-primary hover:border-none" onClick={() => setShowReceiveDialog(false)} />
                    </div>
                </div>
            </Dialog>

            {/* Mill Palay Dialog */}
            <Dialog header="Set milling data" visible={showMillDialog} onHide={() => setShowMillDialog(false)} className="w-1/3">
                <div className="flex flex-col">
                    <div className="mb-4">
                        <label className="block mb-2">Date Milled</label>
                        <Calendar className="w-full" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Palay Quantity (kg)</label>
                        <InputText type="number" className="w-full ring-0" />
                    </div>
                    <div className="flex justify-between w-full gap-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowMillDialog(false)} />
                        <Button label="Mill" className="w-1/2 bg-primary hover:border-none" onClick={() => setShowMillDialog(false)} />
                    </div>
                </div>
            </Dialog>

            {/* Return Palay Dialog */}
            <Dialog header="Return palay" visible={showReturnDialog} onHide={() => setShowReturnDialog(false)} className="w-1/3">
                <div className="flex flex-col w-full gap-4">
                    <div className="flex w-full gap-4">
                        <div className="w-1/2">
                            <label className="block mb-2">Date Returned</label>
                            <Calendar className="w-full" />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-2">Rice Quantity (kg)</label>
                            <InputText type="number" className="w-full" />
                        </div>
                    </div>
                    
                    <div className="flex w-full gap-4">
                        <div className="w-1/2">
                            <label className="block mb-2">Warehouse</label>
                            <Dropdown className="w-full" options={['Warehouse A', 'Warehouse B', 'Warehouse C']} placeholder="Select a warehouse" />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-2">Milling Efficiency</label>
                            <InputText type="number" className="w-full" />
                        </div>
                    </div>
                    
                    <div className="flex justify-between gap-4 mt-10">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowReturnDialog(false)} />
                        <Button label="Confirm Return" className="w-1/2 bg-primary hover:border-none" onClick={() => setShowReturnDialog(false)} />
                    </div>
                </div>
            </Dialog>
        </PrivateMillerLayout>
    );
}

export default MillingTransactions;