import React, { useEffect, useState } from 'react';
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
        { id: 1, batchId: '001', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Farm 001', location: 'Warehouse 003', dryingMethod: 'Machine', requestDate: '0/0/0', startDate: '1/1/1', endDate: '2/2/2', moistureContent: '10', transportedBy: 'Bills Trucking Inc.', status: 'To Be Dry', dryingStatus: 'In Progress'},
        { id: 2, batchId: '002', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Pune', location: 'Warehouse 002', dryingMethod: 'Machine', requestDate: '7/11/19', startDate: '2/11/12', endDate: '2/11/12', moistureContent: '10', transportedBy: 'Mobilis Services', status: 'To Be Dry', dryingStatus: 'In Progress'},
        { id: 3, batchId: '003', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 002', dryingMethod: 'Machine', requestDate: '4/21/12', startDate: '1/1/1', endDate: '1/1/1', moistureContent: '10', transportedBy: 'NFA Trucking', status: 'In Drying', dryingStatus: 'In Progress'},
        { id: 4, batchId: '004', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 004', dryingMethod: 'Machine', requestDate: '10/28/12', startDate: '2/11/12', endDate: '2/11/12', moistureContent: '10', transportedBy: 'N/A', status: 'In Drying', dryingStatus: 'In Progress'},
        { id: 5, batchId: '005', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 004', dryingMethod: 'Machine', requestDate: '12/10/13', startDate: '2/11/12', endDate: '2/2/2', moistureContent: '10', transportedBy: 'N/A', status: 'Dried', dryingStatus: 'Dried'},
        { id: 6, batchId: '006', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 004', dryingMethod: 'Machine', requestDate: '12/10/13', startDate: '2/11/12', endDate: '2/11/12', moistureContent: '10', transportedBy: 'Zaragoza Trucks', status: 'Dried', dryingStatus: 'Dried'},
    ]);

    const [millingData, setMillingData] = useState([
        { id: 1, batchId: '001', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Farm 001', location: 'Warehouse 003', millerType: 'Private', requestDate: '2/11/12', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'Bills Trucking Inc.', status: 'To Be Mill', millingStatus: 'In Progress'},
        { id: 2, batchId: '002', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Pune', location: 'Warehouse 002', millerType: 'In House', requestDate: '7/11/19', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'Mobilis Services', status: 'To Be Mill', millingStatus: 'In Progress'},
        { id: 3, batchId: '003', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 002', millerType: 'Private', requestDate: '4/21/12', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'NFA Trucking', status: 'In Milling', millingStatus: 'In Progress'},
        { id: 4, batchId: '004', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 004', millerType: 'In House', requestDate: '10/28/12', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'N/A', status: 'In Milling', millingStatus: 'In Progress'},
        { id: 5, batchId: '005', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 004', millerType: 'In House', requestDate: '12/10/13', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'N/A', status: 'Milled', millingStatus: 'Milled'},
        { id: 6, batchId: '006', quantityInBags: '100', grossWeight: '10', preNetWeight: '100', postNetWeight: '100', from: 'Augusta', location: 'Warehouse 004', millerType: 'In House', requestDate: '12/10/13', startDate: '1/1/1', endDate: '2/2/2', transportedBy: 'Zaragoza Trucks', status: 'Milled', millingStatus: 'Milled'}
    ]);

    const [formData, setFormData] = useState({
        dateProcessed: null,
        method: '',
        type: '',
        moistureContent: '',
        quantityInBags: '',
        grossWeight: '',
        netWeight: '',
        facility: '',
        efficiency: '',
        transportedBy: '',
        description: '',
        remarks: ''
    });

    useEffect(() => {
        const today = new Date();
        setFormData((prevFormData) => ({
            ...prevFormData,
            dateProcessed: today
        }));
    }, []);

    const getDryingStatusSeverity = (dryingStatus) => {
        switch (dryingStatus.toLowerCase()) {
            case 'in progress': return 'warning';
            case 'dried': return 'success';
            default: return 'info';
        }
    };

    const getMillingStatusSeverity = (millingStatus) => {
        switch (millingStatus.toLowerCase()) {
            case 'in progress': return 'warning';
            case 'milled': return 'success';
            default: return 'info';
        }
    };

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'to be dry':
            case 'to be mill': return 'info';
            case 'in drying':
            case 'in milling': return 'warning';
            case 'dried':
            case 'milled': return 'success';
            default: return 'secondary';
        }
    };

    const dryingStatusBodyTemplate = (rowData) => (
        <Tag 
            value={rowData.dryingStatus} 
            severity={getDryingStatusSeverity(rowData.dryingStatus)} 
            style={{ minWidth: '80px', textAlign: 'center' }}
            className="text-sm px-2 rounded-md"
        />
    );

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
            case 'to be dry':
            case 'to be mill':
                setShowAcceptDialog(true);
                break;
            case 'in drying':
            case 'in milling':
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
                return dataToFilter.filter(item => item.status.toLowerCase() === `in ${viewMode === 'drying' ? 'drying' : 'milling'}`);
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
                return dataToFilter.filter(item => item.status.toLowerCase() === `in ${viewMode === 'drying' ? 'drying' : 'milling'}`).length;
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
                        <FilterButton label={viewMode === 'milling' ? 'In Milling' : 'In Drying'} icon={<Sun className="mr-2" size={16} />} filter="process" />
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
                            scrolldirection="both"
                            className="p-datatable-sm pt-5" 
                            filters={filters}
                            globalFilterFields={['from', 'toBeDryAt', 'requestDate', 'startDate', 'endDate', 'transportedBy', 'status', 'dryingStatus']}
                            emptyMessage="No data found."
                            paginator
                            rows={10}
                            // tableStyle={{ minWidth: '2200px' }}
                        > 
                            {selectedFilter !== 'request' && (
                                <Column field="id" header={viewMode === 'drying' ? "Drying Batch ID" : "Milling Batch ID"} className="text-center" headerClassName="text-center" />
                            )}
                            <Column field="batchId" header="Palay Batch ID" className="text-center" headerClassName="text-center" />
                            <Column field="quantityInBags" header="Quantity In Bags" className="text-center" headerClassName="text-center" />
                            <Column field="grossWeight" header="Gross Weight" className="text-center" headerClassName="text-center" />
                            <Column field="preNetWeight" header="Net Weight" className="text-center" headerClassName="text-center" />
                            {selectedFilter === 'return' && (
                                <Column field="postNetWeight" header="Post-Net Weight" className="text-center" headerClassName="text-center" />
                            )}
                            <Column field="from" header="From" className="text-center" headerClassName="text-center" />
                            <Column field="location" 
                                    header={viewMode === 'drying' 
                                        ? (selectedFilter === 'request' ? 'To be Dry at' 
                                        : selectedFilter === 'process' ? 'Drying at' 
                                        : 'Dried at') 
                                        : (selectedFilter === 'request' ? 'To be Milled at' 
                                        : selectedFilter === 'process' ? 'Milling at' 
                                        : 'Milled at')}
                                    className="text-center" headerClassName="text-center" />
                            {viewMode === 'drying' && (
                                <Column field="dryingMethod" header="Drying Method" className="text-center" headerClassName="text-center" />
                            )}
                            {viewMode === 'milling' && (
                                <Column field="millerType" header="Miller Type" className="text-center" headerClassName="text-center" />
                            )}
                            {/* <Column 
                                field={viewMode === 'drying' ? 'dryerType' : 'millerType'}
                                header={viewMode === 'drying' ? 'Dryer Type' : 'Miller Type'}
                                className="text-center" headerClassName="text-center" /> */}
                            {selectedFilter === 'return' && (
                                <Column field='startDate' header='Start Date' className="text-center" headerClassName="text-center" />
                            )}
                            <Column 
                                field={selectedFilter === 'request' ? 'requestDate' : (selectedFilter === 'process' ? 'startDate' : 'endDate')} 
                                header={selectedFilter === 'request' ? 'Request Date' : (selectedFilter === 'process' ? 'Start Date' : 'End Date')} 
                                className="text-center" 
                                headerClassName="text-center" 
                            />
                            {viewMode === 'drying' && (selectedFilter === 'return') && (
                               <Column field="moistureContent" header="Moisture Content" className="text-center" headerClassName="text-center" />
                            )}  
                            <Column field="transportedBy" header="Transported By" className="text-center" headerClassName="text-center" />
                            {(selectedFilter === 'request') && (
                                <Column field="status" header={viewMode === 'milling' ? 'Rice Status' : 'Palay Status'} body={statusBodyTemplate} className="text-center" headerClassName="text-center" />
                            )}
                            {selectedFilter !== 'receive' && (
                                <Column 
                                    field={viewMode === 'drying' ? "dryingStatus" : "millingStatus"} 
                                    header={viewMode === 'drying' ? "Drying Status" : "Milling Status"} 
                                    body={viewMode === 'drying' ? dryingStatusBodyTemplate : millingStatusBodyTemplate} 
                                    className="text-center" headerClassName="text-center" frozen alignFrozen="right"
                                />
                            )}
                            <Column header="Action" body={actionBodyTemplate} className="text-center" headerClassName="text-center" frozen alignFrozen="right"/>
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

            {/* Post Drying/Milling Dialog */}
            <Dialog header={`Post ${viewMode} data`} visible={showSetDataDialog} onHide={() => setShowSetDataDialog(false)} className="w-1/3">
                <div className="flex flex-col gap-2">
                    <div className="flex w-full gap-2">
                        <div className="w-full">
                            <label className="block mb-2">
                                Date {viewMode === 'drying' ? 'Dried' : 'Milled'}
                            </label>
                            <Calendar 
                                name="dateProcessed"
                                value={formData.dateProcessed}
                                className="w-full"
                                disabled
                                readOnlyInput
                            />
                        </div>
                        
                        {viewMode === 'drying' && (
                            <div className="w-full">
                                <label className="block mb-2">
                                    {viewMode === 'drying' ? 'Drying' : 'Milling'} Method
                                </label>
                                <Dropdown 
                                    name="method"
                                    value={formData.method}
                                    options={['Sun', 'Machine']}
                                    onChange={handleInputChange}
                                    placeholder="Select a method" 
                                    className="w-full ring-0" 
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex w-full gap-2">
                        
                        {viewMode === 'drying' && (
                            <div className="w-full">
                                <label className="block mb-2">Moisture Content</label>
                                <InputText 
                                    type="number" 
                                    name="moistureContent"
                                    value={formData.moistureContent}
                                    onChange={handleInputChange}
                                    className="w-full ring-0" 
                                />
                            </div>
                        )}
                        <div className="w-full">
                            <label className="block mb-2">Quantity in Bags</label>
                            <InputText 
                                type="number" 
                                name="quantityInBags"
                                value={formData.quantityInBags}
                                onChange={handleInputChange}
                                className="w-full ring-0" 
                            />
                        </div>
                    </div>

                    <div className="flex w-full gap-2">
                        <div className="w-full">
                            <label className="block mb-2">Gross Weight</label>
                            <InputText 
                                type="number" 
                                name="grossWeight"
                                value={formData.grossWeight}
                                onChange={handleInputChange}
                                className="w-full ring-0" 
                            />
                        </div>

                        <div className="w-full">
                            <label className="block mb-2">Net Weight</label>
                            <InputText 
                                type="number" 
                                name="netWeight"
                                value={formData.netWeight}
                                onChange={handleInputChange}
                                className="w-full ring-0" 
                            />
                        </div>
                    </div>
                    

                    <div className="flex justify-between w-full gap-4 mt-5">
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
                        <div className="w-full">
                            <label className="block mb-2">Date Returned</label>
                            <Calendar 
                                name="dateProcessed"
                                value={formData.dateProcessed}
                                onChange={handleInputChange}
                                className="w-full ring-0" 
                                disabled
                                readOnlyInput
                            />
                        </div>
                        {/* <div className="w-1/2">
                            <label className="block mb-2">{viewMode === 'drying' ? 'Palay' : 'Rice'} Quantity (kg)</label>
                            <InputText 
                                type="number" 
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full ring-0" 
                            />
                        </div> */}
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
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Transport Description</label>
                        <InputTextarea 
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full ring-0" 
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                        <InputTextarea 
                            name="remarks"
                            value={formData.remarks}
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