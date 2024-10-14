import React, { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Search, Wheat } from "lucide-react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

function Warehouse() {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [viewMode, setViewMode] = useState('inWarehouse');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showSendToDialog, setShowSendToDialog] = useState(false);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);

    const [selectedDrying, setSelectedDrying] = useState(null);
    const [selectedDryer, setSelectedDryer] = useState(null);

    const inWarehouseData = [
        { id: 1, from: 'Farm 001', currentlyAt: 'Warehouse 003', receivedOn: '2/11/12', transportedBy: 'Bills Trucking Inc.', status: 'To Mill' },
        { id: 2, from: 'Pune', currentlyAt: 'Warehouse 002', receivedOn: '7/11/19', transportedBy: 'Mobilis Services', status: 'Rice' },
        { id: 3, from: 'Augusta', currentlyAt: 'Warehouse 002', receivedOn: '4/21/12', transportedBy: 'NFA Trucking', status: 'To Dry' },
        { id: 4, from: 'Augusta', currentlyAt: 'Warehouse 004', receivedOn: '10/28/12', transportedBy: 'N/A', status: 'Rice' },
        { id: 5, from: 'Augusta', currentlyAt: 'Warehouse 004', receivedOn: '12/10/13', transportedBy: 'N/A', status: 'Rice' },
        { id: 6, from: 'Augusta', currentlyAt: 'Warehouse 004', receivedOn: '12/10/13', transportedBy: 'Zaragoza Trucks', status: 'To Mill' },
    ];

    const requestData = [
        { id: 1, from: 'Farm 001', toBeStoreAt: 'Warehouse 003', dateRequest: '2/11/12', transportedBy: 'Bills Trucking Inc.', status: 'To Mill' },
        { id: 2, from: 'Pune', toBeStoreAt: 'Warehouse 002', dateRequest: '7/11/19', transportedBy: 'Mobilis Services', status: 'To Dry' },
        { id: 3, from: 'Augusta', toBeStoreAt: 'Warehouse 002', dateRequest: '4/21/12', transportedBy: 'NFA Trucking', status: 'To Mill' },
        { id: 4, from: 'Cebu', toBeStoreAt: 'Warehouse 005', dateRequest: '5/15/12', transportedBy: 'Fast Logistics', status: 'Rice' },
    ];

    const [formData, setFormData] = useState({
        sendTo: '',
        facility: '',
        transportedBy: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
            facility: name === 'sendTo' ? '' : prevState.facility
        }));
    };

    const handleSendTo = () => {
        console.log("Send To form data:", formData);
        setShowSendToDialog(false);
        // Reset form data
        setFormData({
            sendTo: '',
            facility: '',
            transportedBy: '',
            description: '',
            receiveDate: null
        });
    };

    const handleConfirmReceive = () => {
        const currentDate = new Date().toISOString();
        setFormData(prevState => ({
            ...prevState,
            receiveDate: currentDate
        }));
        console.log("Confirmed Receive. Date:", currentDate);
        setShowAcceptDialog(false);
    };

    const sendToOptions = [
        { label: 'Dryer', value: 'dryer' },
        { label: 'Miller', value: 'miller' }
    ];

    const facilityOptions = {
        dryer: [
            { label: 'Dryer 1', value: 'dryer1' },
            { label: 'Dryer 2', value: 'dryer2' },
            { label: 'Dryer 3', value: 'dryer3' }
        ],
        miller: [
            { label: 'Miller 1', value: 'miller1' },
            { label: 'Miller 2', value: 'miller2' },
            { label: 'Miller 3', value: 'miller3' }
        ],
        '': []
    };
    

    const getSeverity = (status) => {
        switch (status) {
            case 'To Mill':
            case 'To Dry':
                return 'warning';
            case 'Rice':
                return 'success';
            default:
                return 'info';
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
        if (viewMode === 'inWarehouse' && rowData.status === 'Rice') {
            return null;
        }
        const actionText = viewMode === 'inWarehouse' ? 'Send to' : 'Accept';
        return (
            <Button 
                label={actionText} 
                className="p-button-text p-button-sm text-primary ring-0" 
                onClick={() => handleActionClick(rowData.status)}
            />
        );
    };
    
    const handleActionClick = (status) => {
        if (viewMode === 'inWarehouse') {
            setShowSendToDialog(true);
        } else {
            setShowAcceptDialog(true);
        }
    };

    const filteredData = (viewMode === 'inWarehouse' ? inWarehouseData : requestData).filter(item => 
        selectedFilter === 'all' || 
        (selectedFilter === 'palay' && (item.status === 'To Mill' || item.status === 'To Dry')) ||
        (selectedFilter === 'rice' && item.status === 'Rice')
    );

    const getFilterCount = (filter) => {
        const dataToFilter = viewMode === 'inWarehouse' ? inWarehouseData : requestData;
        if (filter === 'palay') {
            return dataToFilter.filter(item => item.status === 'To Mill' || item.status === 'To Dry').length;
        } else if (filter === 'rice') {
            return dataToFilter.filter(item => item.status === 'Rice').length;
        }
        return dataToFilter.length;
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
        <StaffLayout activePage="Warehouse">
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl text-white font-bold mb-2">Stocks Storage</h1>
                    <span className="p-input-icon-left w-1/2 mr-4 mb-4">
                        <Search className="text-white ml-2 -translate-y-1"/>
                        <InputText 
                            type="search"
                            value={globalFilterValue} 
                            onChange={(e) => setGlobalFilterValue(e.target.value)} 
                            placeholder="Tap to Search" 
                            className="w-full pl-10 pr-4 py-2 rounded-full text-white bg-transparent border border-white placeholder:text-white"
                        />
                    </span>
                    <div className="flex justify-center space-x-4 w-full">
                        <Button 
                            label="In Warehouse" 
                            className={`p-button-sm ring-0 ${viewMode === 'inWarehouse' ? 'bg-white text-primary' : 'bg-transparent text-white border-white'}`} 
                            onClick={() => setViewMode('inWarehouse')} 
                        />
                        <Button 
                            label="Requests" 
                            className={`p-button-sm ring-0 ${viewMode === 'requests' ? 'bg-white text-primary' : 'bg-transparent text-white border-white'}`} 
                            onClick={() => setViewMode('requests')} 
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-start mb-4 space-x-2 py-2">
                    <Button 
                        label="All" 
                        className={`p-button-sm border-none ring-0 ${selectedFilter === 'all' ? 'p-button-raised bg-primary text-white' : 'p-button-outlined bg-white text-primary'}`} 
                        onClick={() => setSelectedFilter('all')} 
                    />
                    <div className="flex bg-white rounded-full gap-2">
                        <FilterButton label="Palay" icon={<Wheat className="mr-2" size={16} />} filter="palay" />
                        <FilterButton label="Rice" icon={<Wheat className="mr-2" size={16} />} filter="rice" />
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
                        globalFilterFields={viewMode === 'inWarehouse' ? 
                            ['from', 'currentlyAt', 'receivedOn', 'transportedBy', 'status'] : 
                            ['from', 'toBeStoreAt', 'dateRequest', 'transportedBy', 'status']}
                        emptyMessage="No inventory found."
                        paginator
                        rows={10}
                    > 
                        <Column field="id" header="Batch ID" className="text-center" headerClassName="text-center" />
                        <Column field="from" header="From" className="text-center" headerClassName="text-center" />
                        <Column field={viewMode === 'inWarehouse' ? "currentlyAt" : "toBeStoreAt"} 
                                header={viewMode === 'inWarehouse' ? "Currently At" : "To Be Store At"} 
                                className="text-center" headerClassName="text-center" />
                        <Column field={viewMode === 'inWarehouse' ? "receivedOn" : "dateRequest"} 
                                header={viewMode === 'inWarehouse' ? "Received On" : "Date Request"} 
                                className="text-center" headerClassName="text-center" />
                        <Column field="transportedBy" header="Transported By" className="text-center" headerClassName="text-center" />
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column header="Action" body={actionBodyTemplate} className="text-center" headerClassName="text-center"/>
                    </DataTable>
                    </div>
                </div>
            </div>

            {/* Send To Dialog */}
            <Dialog header="Send To" visible={showSendToDialog} onHide={() => setShowSendToDialog(false)} className="w-1/3">
                <div className="flex flex-col">
                    <div className="mb-4">
                        <label className="block mb-2">Send To</label>
                        <Dropdown 
                            className="w-full ring-0" 
                            value={formData.sendTo} 
                            options={sendToOptions} 
                            onChange={(e) => handleInputChange({ target: { name: 'sendTo', value: e.value } })} 
                            placeholder="Select an option" 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Facility</label>
                        <Dropdown 
                            className="w-full ring-0" 
                            value={formData.facility} 
                            options={facilityOptions[formData.sendTo] || []} 
                            onChange={(e) => handleInputChange({ target: { name: 'facility', value: e.value } })} 
                            placeholder="Select a facility" 
                            disabled={!formData.sendTo}
                        />
                    </div>

                    <div className="w-full mb-4">
                        <label htmlFor="transportedBy" className="block text-sm font-medium text-gray-700 mb-1">Transported by</label>
                        <InputText 
                            name="transportedBy"
                            value={formData.transportedBy}
                            onChange={handleInputChange}
                            className="w-full ring-0" 
                        />
                    </div>

                    <div className="w-full mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <InputTextarea 
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full ring-0" 
                        />
                    </div>
                    <div className="flex justify-between w-full gap-4 mt-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowSendToDialog(false)} />
                        <Button label="Send Request" className="w-1/2 bg-primary hover:border-none" onClick={handleSendTo} />
                    </div>
                </div>
            </Dialog>

            {/* Accept Dialog */}
            <Dialog header="Receive palay" visible={showAcceptDialog} onHide={() => setShowAcceptDialog(false)} className="w-1/3">
                <div className="flex flex-col items-center">
                    <p className="mb-10">Click Confirm Receive to accept request to warehouse</p>
                    <div className="flex justify-between w-full">
                        <Button 
                            label="Confirm Receive" 
                            className="w-full bg-primary hover:border-none" 
                            onClick={handleConfirmReceive} 
                        />
                    </div>
                </div>
            </Dialog>
        </StaffLayout>
    );
}

export default Warehouse;