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
import { InputTextarea } from 'primereact/inputtextarea';

function MillingTransactions() {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [inventoryData, setInventoryData] = useState([
        { id: 1, batchId: '001', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Farm 001', location: 'Warehouse 003', millerType: 'Private', requestDate: '2/11/12', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'Bills Trucking Inc.', status: 'To Be Mill', millingStatus: 'In Progress'},
        { id: 2, batchId: '002', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Pune', location: 'Warehouse 002', millerType: 'In House', requestDate: '7/11/19', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'Mobilis Services', status: 'To Be Mill', millingStatus: 'In Progress'},
        { id: 3, batchId: '003', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 002', millerType: 'Private', requestDate: '4/21/12', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'NFA Trucking', status: 'In Milling', millingStatus: 'In Progress'},
        { id: 4, batchId: '004', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 004', millerType: 'In House', requestDate: '10/28/12', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'N/A', status: 'In Milling', millingStatus: 'In Progress'},
        { id: 5, batchId: '005', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 004', millerType: 'In House', requestDate: '12/10/13', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'N/A', status: 'Milled', millingStatus: 'In Progress'},
        { id: 6, batchId: '006', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 004', millerType: 'In House', requestDate: '12/10/13', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'Zaragoza Trucks', status: 'Milled', millingStatus: 'In Progress'}
    ]);

    const [selectedFilter, setSelectedFilter] = useState('to be mill');
    const [showReceiveDialog, setShowReceiveDialog] = useState(false);
    const [showMillDialog, setShowMillDialog] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);

    const [receiveFormData, setReceiveFormData] = useState({
        // You can add more fields as needed
        dateReceived: null,
    });

    const [millFormData, setMillFormData] = useState({
        dateMilled: null,
        palayQuantity: '',
    });

    const [returnFormData, setReturnFormData] = useState({
        dateReturned: null,
        riceQuantity: '',
        warehouse: '',
        millingEfficiency: '',
        transportedBy: '',
        description: '',
    });

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'to be mill': return 'info';
            case 'in milling': return 'warning';
            case 'milled': return 'success';
            default: return 'secondary';
        }
    };

    const getMillingStatusSeverity = (millingStatus) => {
        switch (millingStatus.toLowerCase()) {
            case 'in progress': return 'warning';
            case 'milled': return 'success';
            default: return 'info';
        }
    };

    const millingStatusBodyTemplate = (rowData) => (
        <Tag 
            value={rowData.millingStatus} 
            severity={getMillingStatusSeverity(rowData.millingStatus)} 
            style={{ minWidth: '80px', textAlign: 'center' }}
            className="text-sm px-2 rounded-md"
        />
    );
    
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
            case 'in drying':
            case 'in milling':
                actionText = 'Done';
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
            case 'to be mill':
                setShowReceiveDialog(true);
                break;
            case 'in milling':
                setShowMillDialog(true);
                break;
            case 'milled':
                setShowReturnDialog(true);
                break;
        }
    };

    const handleMillInputChange = (e) => {
        const { name, value } = e.target;
        setMillFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReturnInputChange = (e) => {
        const { name, value } = e.target;
        setReturnFormData(prev => ({ ...prev, [name]: value }));
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
                <div className="flex justify-start mb-4 space-x-2 py-2">
                    <div className="flex bg-white rounded-full gap-2">
                        <FilterButton label="Request" icon={<Box className="mr-2" size={16} />} filter="to be mill" />
                        <FilterButton label="In milling" icon={<Factory className="mr-2" size={16} />} filter="in milling" />
                        <FilterButton label="To return" icon={<RotateCcw className="mr-2" size={16} />} filter="milled" />
                    </div>
                    
                </div>

                {/* Data Table */}
                <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                    <div className="flex-grow overflow-hidden bg-white">
                    <DataTable 
                        value={filteredData}
                        scrollable
                        scrollHeight="flex"
                        scrolldirection="both"
                        className="p-datatable-sm pt-5" 
                        filters={filters}
                        globalFilterFields={['dryer', 'dryingMethod', 'dateSent', 'qualityType', 'status']}
                        emptyMessage="No inventory found."
                        paginator
                        rows={10}
                    > 
                        {selectedFilter !== 'request' && (
                            <Column field="id" header="Milling Batch ID"className="text-center" headerClassName="text-center" />
                        )}
                        <Column field="quantityInBags" header="Quantity In Bags" className="text-center" headerClassName="text-center" />
                        <Column field="grossWeight" header="Gross Weight" className="text-center" headerClassName="text-center" />
                        <Column field="preNetWeight" header="Net Weight" className="text-center" headerClassName="text-center" />
                        <Column field="from" header="From" className="text-center" headerClassName="text-center" />
                        <Column field="location" header={selectedFilter === 'to be mill' ? 'To be Milled at' : selectedFilter === 'in milling' ? 'Milling at': 'Milled at'}
                                className="text-center" headerClassName="text-center"/>
                        <Column field="millerType" header="Miller Type" className="text-center" headerClassName="text-center" />
                        {selectedFilter === 'milled' && (
                            <Column field='startDate' header='Start Date' className="text-center" headerClassName="text-center" />
                        )}
                        <Column 
                            field={selectedFilter === 'to be mill' ? 'requestDate' : (selectedFilter === 'in milling' ? 'startDate' : 'endDate')} 
                            header={selectedFilter === 'to be mill' ? 'Request Date' : (selectedFilter === 'in milling' ? 'Start Date' : 'End Date')} 
                            className="text-center" 
                            headerClassName="text-center" 
                        />
                        <Column field="transportedBy" header="Transported By" className="text-center" headerClassName="text-center" />
                        {(selectedFilter === 'to be mill') && (
                            <Column field="status" header="Rice Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center" />
                        )}
                        {selectedFilter !== 'receive' && (
                            <Column 
                                field="millingStatus" 
                                header="Milling Status" 
                                body={millingStatusBodyTemplate} 
                                className="text-center" headerClassName="text-center" frozen alignFrozen="right"
                            />
                        )}
                        <Column header="Action" body={actionBodyTemplate} className="text-center" headerClassName="text-center" frozen alignFrozen="right"/>   
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
                        <Button 
                            label="Confirm Receive" 
                            className="w-1/2 bg-primary hover:border-none" 
                            onClick={() => {
                                const currentDate = new Date();
                                setReceiveFormData(prev => ({
                                    ...prev,
                                    dateReceived: currentDate
                                }));
                                console.log({...receiveFormData, dateReceived: currentDate});
                                setShowReceiveDialog(false);
                            }} 
                        />
                    </div>
                </div>
            </Dialog>

            {/* Mill Palay Dialog */}
            <Dialog header="Set milling data" visible={showMillDialog} onHide={() => setShowMillDialog(false)} className="w-1/3">
                <div className="flex flex-col">
                    <div className="mb-4">
                        <label className="block mb-2">Date Milled</label>
                        <Calendar 
                            name="dateMilled"
                            value={millFormData.dateMilled}
                            onChange={handleMillInputChange}
                            className="w-full" 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Palay Quantity (kg)</label>
                        <InputText 
                            type="number" 
                            name="palayQuantity"
                            value={millFormData.palayQuantity}
                            onChange={handleMillInputChange}
                            className="w-full ring-0" 
                        />
                    </div>
                    <div className="flex justify-between w-full gap-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowMillDialog(false)} />
                        <Button label="Mill" className="w-1/2 bg-primary hover:border-none" onClick={() => {
                            console.log(millFormData);
                            setShowMillDialog(false);
                        }} />
                    </div>
                </div>
            </Dialog>

            {/* Return Palay Dialog */}
            <Dialog header="Return palay" visible={showReturnDialog} onHide={() => setShowReturnDialog(false)} className="w-1/3">
                <div className="flex flex-col w-full gap-4">
                    <div className="flex w-full gap-4">
                        <div className="w-1/2">
                            <label className="block mb-2">Date Returned</label>
                            <Calendar 
                                name="dateReturned"
                                value={returnFormData.dateReturned}
                                onChange={handleReturnInputChange}
                                className="w-full ring-0" 
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-2">Rice Quantity (kg)</label>
                            <InputText 
                                type="number" 
                                name="riceQuantity"
                                value={returnFormData.riceQuantity}
                                onChange={handleReturnInputChange}
                                className="w-full ring-0" 
                            />
                        </div>
                    </div>
                    
                    <div className="flex w-full gap-4">
                        <div className="w-1/2">
                            <label className="block mb-2">Warehouse</label>
                            <Dropdown 
                                name="warehouse"
                                value={returnFormData.warehouse}
                                options={['Warehouse A', 'Warehouse B', 'Warehouse C']} 
                                onChange={handleReturnInputChange}
                                placeholder="Select a warehouse" 
                                className="w-full ring-0" 
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-2">Milling Efficiency</label>
                            <InputText 
                                type="number" 
                                name="millingEfficiency"
                                value={returnFormData.millingEfficiency}
                                onChange={handleReturnInputChange}
                                className="w-full ring-0" 
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label htmlFor="transportedBy" className="block text-sm font-medium text-gray-700 mb-1">Transported by</label>
                        <InputText 
                            name="transportedBy"
                            value={returnFormData.transportedBy}
                            onChange={handleReturnInputChange}
                            className="w-full ring-0" 
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <InputTextarea 
                            name="description"
                            value={returnFormData.description}
                            onChange={handleReturnInputChange}
                            className="w-full ring-0" 
                        />
                    </div>
                    
                    <div className="flex justify-between gap-4 mt-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowReturnDialog(false)} />
                        <Button label="Confirm Return" className="w-1/2 bg-primary hover:border-none" onClick={() => {
                            console.log(returnFormData);
                            setShowReturnDialog(false);
                        }} />
                    </div>
                </div>
            </Dialog>
        </PrivateMillerLayout>
    );
}

export default MillingTransactions;