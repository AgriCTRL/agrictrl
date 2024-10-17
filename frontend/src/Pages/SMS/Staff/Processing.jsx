import React, { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Search, Box, Sun, RotateCcw } from "lucide-react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

function Processing() {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [viewMode, setViewMode] = useState('drying');
    const [selectedFilter, setSelectedFilter] = useState('request');
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showSetDataDialog, setShowSetDataDialog] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);

    const [dryingData, setDryingData] = useState([
        { id: 1, from: 'Farm 001', toBeDryAt: 'Warehouse 003', requestDate: '2/11/12', transportedBy: 'Bills Trucking Inc.', status: 'To Be Dry'},
        { id: 2, from: 'Pune', toBeDryAt: 'Warehouse 002', requestDate: '7/11/19', transportedBy: 'Mobilis Services', status: 'To Be Dry'},
        { id: 3, from: 'Augusta', toBeDryAt: 'Warehouse 002', requestDate: '4/21/12', transportedBy: 'NFA Trucking', status: 'To Dry'},
        { id: 4, from: 'Augusta', toBeDryAt: 'Warehouse 004', requestDate: '10/28/12', transportedBy: 'N/A', status: 'To Dry'},
        { id: 5, from: 'Augusta', toBeDryAt: 'Warehouse 004', requestDate: '12/10/13', transportedBy: 'N/A', status: 'Dried'},
        { id: 6, from: 'Augusta', toBeDryAt: 'Warehouse 004', requestDate: '12/10/13', transportedBy: 'Zaragoza Trucks', status: 'Dried'},
    ]);

    const [millingData, setMillingData] = useState([
        { id: 1, from: 'Farm 001', toBeDryAt: 'Warehouse 003', requestDate: '2/11/12', transportedBy: 'Bills Trucking Inc.', status: 'To Be Mill'},
        { id: 2, from: 'Pune', toBeDryAt: 'Warehouse 002', requestDate: '7/11/19', transportedBy: 'Mobilis Services', status: 'To Be Mill'},
        { id: 3, from: 'Augusta', toBeDryAt: 'Warehouse 002', requestDate: '4/21/12', transportedBy: 'NFA Trucking', status: 'To Mill'},
        { id: 4, from: 'Augusta', toBeDryAt: 'Warehouse 004', requestDate: '10/28/12', transportedBy: 'N/A', status: 'To Mill'},
        { id: 5, from: 'Augusta', toBeDryAt: 'Warehouse 004', requestDate: '12/10/13', transportedBy: 'N/A', status: 'Milled'},
        { id: 6, from: 'Augusta', toBeDryAt: 'Warehouse 004', requestDate: '12/10/13', transportedBy: 'Zaragoza Trucks', status: 'Milled'},
    ]);

    const [formData, setFormData] = useState({
        dateProcessed: null,
        quantity: '',
        facility: '',
        efficiency: '',
        transportedBy: '',
        description: ''
    });

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'to be dry':
            case 'to be mill': return 'info';
            case 'to dry':
            case 'to mill': return 'warning';
            case 'dried':
            case 'milled': return 'success';
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
        let actionText;
        switch (rowData.status.toLowerCase()) {
            case 'to be dry':
            case 'to be mill':
                actionText = 'Accept';
                break;
            case 'to dry':
            case 'to mill':
                actionText = 'Process';
                break;
            case 'dried':
            case 'milled':
                actionText = 'Return';
                break;
            default:
                actionText = 'Action';
        }
        return (
            <Button 
                label={actionText} 
                className="p-button-text p-button-sm text-primary ring-0" 
                onClick={() => handleActionClick(rowData.status)}
            />
        );
    };
    
    const handleActionClick = (status) => {
        switch (status.toLowerCase()) {
            case 'to be dry':
            case 'to be mill':
                setShowAcceptDialog(true);
                break;
            case 'to dry':
            case 'to mill':
                setShowSetDataDialog(true);
                break;
            case 'dried':
            case 'milled':
                setShowReturnDialog(true);
                break;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getFilteredData = () => {
        const dataToFilter = viewMode === 'drying' ? dryingData : millingData;
        switch (selectedFilter) {
            case 'request':
                return dataToFilter.filter(item => item.status.toLowerCase() === `to be ${viewMode === 'drying' ? 'dry' : 'mill'}`);
            case 'process':
                return dataToFilter.filter(item => item.status.toLowerCase() === `to ${viewMode === 'drying' ? 'dry' : 'mill'}`);
            case 'return':
                return dataToFilter.filter(item => item.status.toLowerCase() === (viewMode === 'drying' ? 'dried' : 'milled'));
            default:
                return dataToFilter;
        }
    };

    const getFilterCount = (filter) => {
        const dataToFilter = viewMode === 'drying' ? dryingData : millingData;
        switch (filter) {
            case 'request':
                return dataToFilter.filter(item => item.status.toLowerCase() === `to be ${viewMode === 'drying' ? 'dry' : 'mill'}`).length;
            case 'process':
                return dataToFilter.filter(item => item.status.toLowerCase() === `to ${viewMode === 'drying' ? 'dry' : 'mill'}`).length;
            case 'return':
                return dataToFilter.filter(item => item.status.toLowerCase() === (viewMode === 'drying' ? 'dried' : 'milled')).length;
            default:
                return 0;
        }
    };

    const FilterButton = ({ label, icon, filter }) => (
        <Button 
            label={label} 
            icon={icon} 
            className={`p-button-sm ring-0 border-none rounded-full ${selectedFilter === filter ? 'p-button-outlined bg-primary text-white' : 'p-button-text text-primary'} flex items-center`} 
            onClick={() => setSelectedFilter(filter)}
        >
            <span className={`ring-0 border-none rounded-full ml-2 px-1 ${selectedFilter === filter ? 'p-button-outlined bg-gray-200 text-primary' : 'p-button-text text-white bg-primary'} flex items-center`}>
                {getFilterCount(filter)}
            </span>
        </Button>
    );

    return (
        <StaffLayout activePage="Processing">
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl text-white font-bold mb-2">Palay Processing</h1>
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
                            label="Drying" 
                            className={`p-button-sm ring-0 ${viewMode === 'drying' ? 'bg-white text-primary' : 'bg-transparent text-white border-white'}`} 
                            onClick={() => {
                                setViewMode('drying');
                                setSelectedFilter('request');
                            }} 
                        />
                        <Button 
                            label="Milling" 
                            className={`p-button-sm ring-0 ${viewMode === 'milling' ? 'bg-white text-primary' : 'bg-transparent text-white border-white'}`} 
                            onClick={() => {
                                setViewMode('milling');
                                setSelectedFilter('request');
                            }} 
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-start mb-4 space-x-2 py-2">
                    <div className="flex bg-white rounded-full gap-2">
                        <FilterButton label="Request" icon={<Box className="mr-2" size={16} />} filter="request" />
                        <FilterButton label="Process" icon={<Sun className="mr-2" size={16} />} filter="process" />
                        <FilterButton label="Return" icon={<RotateCcw className="mr-2" size={16} />} filter="return" />
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                    <div className="flex-grow overflow-hidden bg-white">
                    <DataTable 
                        value={getFilteredData()}
                        scrollable
                        scrollHeight="flex"
                        scrollDirection="both"
                        className="p-datatable-sm pt-5" 
                        filters={filters}
                        globalFilterFields={['from', 'toBeDryAt', 'requestDate', 'transportedBy', 'status']}
                        emptyMessage="No data found."
                        paginator
                        rows={10}
                    > 
                        <Column field="id" header="Batch ID" className="text-center" headerClassName="text-center" />
                        <Column field="from" header="From" className="text-center" headerClassName="text-center" />
                        <Column field="toBeDryAt" header="To Be Dry At" className="text-center" headerClassName="text-center" />
                        <Column field="requestDate" header="Request Date" className="text-center" headerClassName="text-center" />
                        <Column field="transportedBy" header="Transported By" className="text-center" headerClassName="text-center" />
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column header="Action" body={actionBodyTemplate} className="text-center" headerClassName="text-center"/>
                    </DataTable>
                    </div>
                </div>
            </div>

            {/* Accept Dialog */}
            <Dialog header={`Receive ${viewMode}`} visible={showAcceptDialog} onHide={() => setShowAcceptDialog(false)} className="w-1/3">
                <div className="flex flex-col items-center">
                    <p className="mb-10">Are you sure you want to receive this request?</p>
                    <div className="flex justify-between w-full gap-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowAcceptDialog(false)} />
                        <Button 
                            label="Confirm Receive" 
                            className="w-1/2 bg-primary hover:border-none" 
                            onClick={() => {
                                console.log("Receive confirmed");
                                setShowAcceptDialog(false);
                            }} 
                        />
                    </div>
                </div>
            </Dialog>

            {/* Set Data Dialog */}
            <Dialog header={`Set ${viewMode} data`} visible={showSetDataDialog} onHide={() => setShowSetDataDialog(false)} className="w-1/3">
                <div className="flex flex-col">
                    <div className="mb-4">
                        <label className="block mb-2">Date {viewMode === 'drying' ? 'Dried' : 'Milled'}</label>
                        <Calendar 
                            name="dateProcessed"
                            value={formData.dateProcessed}
                            onChange={handleInputChange}
                            className="w-full" 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">{viewMode === 'drying' ? 'Palay' : 'Rice'} Quantity (kg)</label>
                        <InputText 
                            type="number" 
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className="w-full ring-0" 
                        />
                    </div>
                    <div className="flex justify-between w-full gap-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowSetDataDialog(false)} />
                        <Button label="Confirm" className="w-1/2 bg-primary hover:border-none" onClick={() => {
                            console.log(formData);
                            setShowSetDataDialog(false);
                        }} />
                    </div>
                </div>
            </Dialog>

            {/* Return Dialog */}
            <Dialog header={`Return ${viewMode === 'drying' ? 'Palay' : 'Rice'}`} visible={showReturnDialog} onHide={() => setShowReturnDialog(false)} className="w-1/3">
                <div className="flex flex-col w-full gap-4">
                    <div className="flex w-full gap-4">
                    <div className="w-1/2">
                            <label className="block mb-2">Date Returned</label>
                            <Calendar 
                                name="dateProcessed"
                                value={formData.dateProcessed}
                                onChange={handleInputChange}
                                className="w-full ring-0" 
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-2">{viewMode === 'drying' ? 'Palay' : 'Rice'} Quantity (kg)</label>
                            <InputText 
                                type="number" 
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full ring-0" 
                            />
                        </div>
                    </div>

                    <div className="flex w-full gap-4">
                        <div className="w-full">
                            <label className="block mb-2">Facility</label>
                            <Dropdown 
                                name="facility"
                                value={formData.facility}
                                options={['Warehouse A', 'Warehouse B', 'Warehouse C']} 
                                onChange={handleInputChange}
                                placeholder="Select a facility" 
                                className="w-full ring-0" 
                            />
                        </div>
                        {viewMode === 'milling' && (
                            <div className="w-full">
                                <label className="block mb-2">Milling Efficiency</label>
                                <InputText 
                                    type="number" 
                                    name="efficiency"
                                    value={formData.efficiency}
                                    onChange={handleInputChange}
                                    className="w-full ring-0" 
                                />
                            </div>
                        )}
                    </div>

                    <div className="w-full">
                        <label htmlFor="transportedBy" className="block text-sm font-medium text-gray-700 mb-1">Transported by</label>
                        <InputText 
                            name="transportedBy"
                            value={formData.transportedBy}
                            onChange={handleInputChange}
                            className="w-full ring-0" 
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <InputTextarea 
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full ring-0" 
                        />
                    </div>
                    
                    <div className="flex justify-between gap-4 mt-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowReturnDialog(false)} />
                        <Button label="Confirm Return" className="w-1/2 bg-primary hover:border-none" onClick={() => {
                            console.log(formData);
                            setShowReturnDialog(false);
                        }} />
                    </div>
                </div>
            </Dialog>
        </StaffLayout>
    );
}

export default Processing;