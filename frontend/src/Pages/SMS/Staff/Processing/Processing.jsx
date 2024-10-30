import React, { useEffect, useState, useRef } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Search, Box, Sun, RotateCcw, RotateCw } from "lucide-react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

import { useAuth } from '../../../Authentication/Login/AuthContext';
import AcceptDialog from './AcceptDialog';
import ProcessDialog from './ProcessDialog';
import ReturnDialog from './ReturnDialog';

const initialDryingData = {
    palayBatchId: '',
    dryingMethod: '',
    dryerId : '',
    startDateTime: '',
    endDateTime: '',
    driedQuantityBags: '',
    driedGrossWeight: '',
    driedNetWeight: '',
    moistureContent: '',
    status: 'In Progress',
};

const initialMillingData = {
    dryingBatchId: '',
    palayBatchId: '',
    millerId: '',
    millerType: '',
    startDateTime: '',
    endDateTime: '',
    milledQuantityBags: '',
    milledGrossWeight: '',
    milledNetWeight: '',
    millingEfficiency: '',
    status: 'In Progress',
};

const initialTransactionData = {
    item: '',
    itemId: '',
    senderId: '',
    fromLocationType: '',
    fromLocationId: 0,
    transporterName: '',
    transporterDesc: '',
    receiverId: '',
    receiveDateTime: '0',
    toLocationType: '',
    toLocationId: '',
    toLocationName: '',
    status: 'Pending',
    remarks: ''
};

const Processing = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const { user } = useAuth();

    // States for UI controls
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [viewMode, setViewMode] = useState('drying');
    const [selectedFilter, setSelectedFilter] = useState('request');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Dialog states
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showProcessDialog, setProcessDialog] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);

    // Data states
    const [combinedData, setCombinedData] = useState([]);
    const [dryerData, setDryerData] = useState([]);
    const [millerData, setMillerData] = useState([]);

    const [warehouses, setWarehouses] = useState([]);

    const [newDryingData, setNewDryingData] = useState(initialDryingData);
    const [newMillingData, setNewMillingData] = useState(initialMillingData);
    const [newTransactionData, setNewTransactionData] = useState(initialMillingData);

    const [formData, setFormData] = useState({
        dateProcessed: new Date(),
        method: '',
        type: '',
        moistureContent: '',
        palayQuantityBags: '',
        grossWeight: '',
        netWeight: '',
        facility: '',
        efficiency: '',
        transportedBy: '',
        description: '',
        remarks: ''
    });

    useEffect(() => {
        fetchData();
        fetchActiveWarehouses();
    }, [viewMode, selectedFilter]);

    useEffect(() => {
        const newFilters = {
            global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
        };
        setFilters(newFilters);
    }, [globalFilterValue]);

    const refreshData = () => {
        fetchData();
    }

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const fetchData = async () => {
        try {
            // Determine processing type and location based on viewMode
            const processType = viewMode === 'drying' ? 'dryer' : 'miller';
            const locationType = viewMode === 'drying' ? 'Dryer' : 'Miller';
            const status = selectedFilter === 'request' ? 'Pending' : 'Received';
            const batchType = viewMode === 'drying' ? 'drying' : 'milling';
            const millerType = 'In House';
            
            // Fetch all required data in parallel
            const [
                facilitiesRes,
                inventoryRes,
                warehousesRes
            ] = await Promise.all([
                fetch(`${apiUrl}/${processType}s`),
                fetch(`${apiUrl}/inventory?toLocationType=${locationType}&status=${status}&batchType=${batchType}&millerType=${millerType}`),
                fetch(`${apiUrl}/warehouses`)
            ]);
    
            if (!facilitiesRes.ok || !inventoryRes.ok || !warehousesRes.ok) {
                throw new Error('Failed to fetch data');
            }
    
            const [facilities, inventory, warehouses] = await Promise.all([
                facilitiesRes.json(),
                inventoryRes.json(),
                warehousesRes.json()
            ]);
    
            // Update facility states based on viewMode
            if (viewMode === 'drying') {
                setDryerData(facilities);
            } else {
                setMillerData(facilities);
            }
    
            // Combine and structure the data based on the backend associations
            const transformedData = inventory.map(item => {
                const millerType = facilities.find(f => f.id === item.transaction.toLocationId)?.type || null;

                return {
                    palayBatchId: item.palayBatch.id,
                    transactionId: item.transaction.id,
                    processingBatchId: item.processingBatch?.id,
                    palayQuantityBags: item.palayBatch.quantityBags,
                    grossWeight: item.palayBatch.grossWeight,
                    netWeight: item.palayBatch.netWeight,
                    from: warehouses.find(w => w.id === item.transaction.fromLocationId)?.facilityName || 'Unknown Warehouse',
                    location: facilities.find(f => f.id === item.transaction.toLocationId)?.[`${processType}Name`] || 'Unknown Facility',
                    toLocationId: item.transaction.toLocationId, // Adjust based on response structure
                    millerType: millerType,
                    dryingMethod: item.processingBatch?.dryingMethod || null,
                    requestDate: item.transaction.sendDateTime ? new Date(item.transaction.sendDateTime).toLocaleDateString() : '',
                    startDate: item.processingBatch?.startDateTime ? new Date(item.processingBatch.startDateTime).toLocaleDateString() : '',
                    endDate: item.processingBatch?.endDateTime ? new Date(item.processingBatch.endDateTime).toLocaleDateString() : '',
                    moistureContent: item.palayBatch.qualitySpec?.moistureContent || '',
                    transportedBy: item.transaction.transporterName,
                    palayStatus: item.palayBatch.status,
                    transactionStatus: item.transaction.status,
                    processingStatus: item.processingBatch?.status || null,
                    batchQuantityBags: item.processingBatch?.milledQuantityBags || item.processingBatch?.driedQuantityBags || null,
                };
            });
    
            setCombinedData(transformedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch data',
                life: 3000
            });
        }
    };

    const fetchActiveWarehouses = async () => {
        try {
            const response = await fetch(`${apiUrl}/warehouses?status=Active`);

            if (!response.ok) {
                throw new Error('Failed to fetch warehouses');
            }

            const data = await response.json();
            const formattedWarehouses = data.map(warehouse => ({
                label: warehouse.facilityName,
                value: warehouse.id
            }));
            setWarehouses(formattedWarehouses);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch warehouses',
                life: 3000
            });
        }
    };
    
    const handleActionClick = (rowData) => {
        setSelectedItem(rowData);
    
        switch (rowData.transactionStatus?.toLowerCase()) {
            case 'pending':
                setShowAcceptDialog(true);
                break;
            case 'received':
                if (rowData.processingStatus?.toLowerCase() === 'in progress') {
                    // Reset the form data for the specific process
                    if (viewMode === 'drying') {
                        setNewDryingData(initialDryingData);
                    } else {
                        setNewMillingData(initialMillingData);
                    }
                    setProcessDialog(true);
                } else if (rowData.processingStatus?.toLowerCase() === 'done') {
                    setNewTransactionData(initialTransactionData); // Reset the form data
                    setShowReturnDialog(true);
                }
                break;
        }
    };

    const handleAccept = async () => {
        if (!selectedItem) {
            return;
        }
    
        setIsLoading(true);
        try {
            // 1. Update transaction status to "Received"
            const transactionResponse = await fetch(`${apiUrl}/transactions/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedItem.transactionId,
                    status: "Received",
                    receiveDateTime: new Date().toISOString(),
                    receiverId: user.id
                })
            });
    
            if (!transactionResponse.ok) {
                throw new Error('Failed to update transaction');
            }
    
            // 2. Update palay batch status
            const newPalayStatus = viewMode === 'drying' ? 'In Drying' : 'In Milling';
            const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedItem.palayBatchId,
                    status: newPalayStatus
                })
            });
    
            if (!palayResponse.ok) {
                throw new Error('Failed to update palay batch status');
            }
    
            // 3. Create new processing batch with correct data
            if (viewMode === 'drying') {
                const dryingBatchData = {
                    palayBatchId: selectedItem.palayBatchId,
                    dryerId: selectedItem.toLocationId,
                    startDateTime: '',
                    endDateTime: '',
                    dryingMethod: '',
                    driedQuantityBags: '',
                    driedGrossWeight: '',
                    driedNetWeight: '',
                    moistureContent: '',
                    status: 'In Progress'
                };
                
                const dryingResponse = await fetch(`${apiUrl}/dryingbatches`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dryingBatchData)
                });

                if (!dryingResponse.ok) {
                    throw new Error('Failed to create drying batch');
                }
            } else {
                const millingBatchData = {
                    dryingBatchId: '',
                    palayBatchId: selectedItem.palayBatchId,
                    millerId: selectedItem.toLocationId,
                    millerType: '',
                    startDateTime: '',
                    endDateTime: '',
                    milledQuantityBags: '',
                    milledNetWeight: '',
                    millingEfficiency: '',
                    status: 'In Progress'
                };
                
                const millingResponse = await fetch(`${apiUrl}/millingbatches`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(millingBatchData)
                });

                if (!millingResponse.ok) {
                    throw new Error('Failed to create milling batch');
                }
            }
    
            // 4. Refresh data and close dialog
            await fetchData();
            setShowAcceptDialog(false);
            
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: `${viewMode === 'drying' ? 'Drying' : 'Milling'} process started successfully`,
                life: 3000
            });
            refreshData();
        } catch (error) {
            console.error('Error in handleAccept:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to process acceptance: ${error.message}`,
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleProcess = async () => {
        if (!selectedItem) {
            return;
        }
    
        setIsLoading(true);
        try {
            let updateData;
            let endpoint;
            
            if (viewMode === 'drying') {
                updateData = {
                    id: selectedItem.processingBatchId,
                    dryerId: selectedItem.toLocationId,
                    dryingMethod: newDryingData.dryingMethod,
                    endDateTime: new Date().toISOString(),
                    driedQuantityBags: parseInt(newDryingData.driedQuantityBags),
                    driedGrossWeight: parseFloat(newDryingData.driedGrossWeight),
                    driedNetWeight: parseFloat(newDryingData.driedNetWeight),
                    moistureContent: parseFloat(newDryingData.moistureContent),
                    status: 'Done'
                };
                endpoint = 'dryingbatches';
            } else {
                updateData = {
                    id: selectedItem.processingBatchId,
                    dryingBatchId: '0',
                    palayBatchId: selectedItem.palayBatchId,
                    millerId: selectedItem.toLocationId,
                    millerType: selectedItem.millerType,
                    endDateTime: new Date().toISOString(),
                    milledGrossWeight: parseFloat(newMillingData.milledGrossWeight),
                    milledQuantityBags: parseInt(newMillingData.milledQuantityBags),
                    milledNetWeight: parseFloat(newMillingData.milledNetWeight),
                    millingEfficiency: parseFloat(newMillingData.millingEfficiency),
                    status: 'Done'
                };
                endpoint = 'millingbatches';
            }
    
            const response = await fetch(`${apiUrl}/${endpoint}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
    
            if (!response.ok) {
                throw new Error(`Failed to update ${viewMode} batch`);
            }
    
            // Update palay batch status
            const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedItem.palayBatchId,
                    status: viewMode === 'drying' ? 'To be Mill' : 'Milled'
                })
            });
    
            if (!palayResponse.ok) {
                throw new Error('Failed to update palay batch status');
            }
    
            await fetchData();
            setProcessDialog(false);
            
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: `${viewMode === 'drying' ? 'Drying' : 'Milling'} process completed successfully`,
                life: 3000
            });
            refreshData();
        } catch (error) {
            console.error('Error in handleProcess:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to complete process: ${error.message}`,
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturn = async () => {
        if (!selectedItem || !newTransactionData.toLocationId) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a warehouse',
                life: 3000
            });
            return;
        }

        setIsLoading(true);
        try {
            // 1. Update current transaction to Completed
            const updateTransactionResponse = await fetch(`${apiUrl}/transactions/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedItem.transactionId,
                    status: 'Completed'
                })
            });

            if (!updateTransactionResponse.ok) {
                throw new Error('Failed to update current transaction');
            }

            // 2. Update palay batch with new status
            const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedItem.palayBatchId,
                    currentlyAt: newTransactionData.toLocationName
                })
            });

            if (!palayResponse.ok) {
                throw new Error('Failed to update palay batch');
            }

            // 3. Create new transaction for return
            const newTransaction = {
                ...newTransactionData,
                item: viewMode === 'drying' ? 'Palay' : 'Rice',
                itemId: selectedItem.palayBatchId,
                fromLocationType: viewMode === 'drying' ? 'Dryer' : 'Miller',
                fromLocationId: selectedItem.toLocationId,
                toLocationType: 'Warehouse',
                senderId: user.id,
                receiverId: null,
                status: 'Pending',
                receiveDateTime: null,
            };

            const createTransactionResponse = await fetch(`${apiUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTransaction)
            });

            if (!createTransactionResponse.ok) {
                throw new Error('Failed to create return transaction');
            }

            await fetchData();
            setShowReturnDialog(false);
            setNewTransactionData(initialTransactionData);
            
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Return process initiated successfully',
                life: 3000
            });
            refreshData();
        } catch (error) {
            console.error('Error in handleReturn:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to process return: ${error.message}`,
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const getSeverity = (status, type) => {
        const statusLower = status?.toLowerCase();
        
        // Processing status severities
        if (statusLower === 'in progress') return 'warning';
        if (statusLower === 'done') return 'success';
        
        // Transaction status severities
        if (statusLower === 'pending') return 'warning';
        if (statusLower === 'received') return 'success';
        
        // Palay/Processing status severities
        if (statusLower === 'to be dry' || statusLower === 'to be mill') return 'info';
        if (statusLower === 'in drying' || statusLower === 'in milling') return 'warning';
        if (statusLower === 'dried' || statusLower === 'milled') return 'success';
        
        return 'secondary'; // default severity
    };
    
    const statusBodyTemplate = (rowData, options) => {
        const { field } = options;
        const status = rowData[field];
        
        return (
            <Tag 
                value={status} 
                severity={getSeverity(status, field)}
                className="text-sm px-2 rounded-md"
            />
        );
    };

    const actionBodyTemplate = (rowData) => {
        let actionText = 'Action';
        switch (rowData.transactionStatus?.toLowerCase()) {
            case 'pending':
                actionText = 'Accept';
                break;
            case 'received':
                if (rowData.processingStatus?.toLowerCase() === 'in progress') {
                    actionText = 'Done';
                } else if (rowData.processingStatus?.toLowerCase() === 'done') {
                    actionText = 'Return';
                }
                break;
        }
        
        return (
            <Button 
                label={actionText} 
                className="p-button-text p-button-sm text-primary ring-0" 
                onClick={() => handleActionClick(rowData)}
            />
        );
    };

    const filteredData = combinedData.filter(item => {
        if (viewMode === 'drying') {
            switch (selectedFilter) {
                case 'request':
                    return item.transactionStatus === 'Pending';
                case 'process':
                    return item.transactionStatus === 'Received' && 
                           item.palayStatus === 'In Drying' && 
                           item.processingStatus === 'In Progress';
                case 'return':
                    return item.transactionStatus === 'Received' && 
                           item.processingStatus === 'Done';
                default:
                    return true;
            }
        } else {
            switch (selectedFilter) {
                case 'request':
                    return item.transactionStatus === 'Pending';
                case 'process':
                    return item.transactionStatus === 'Received' && 
                           item.palayStatus === 'In Milling' && 
                           item.processingStatus === 'In Progress';
                case 'return':
                    return item.transactionStatus === 'Received' && 
                           item.processingStatus === 'Done';
                default:
                    return true;
            }
        }
    });

    const getFilterCount = (filterType) => {
        return combinedData.filter(item => {
            if (viewMode === 'drying') {
                switch (filterType) {
                    case 'request':
                        return item.transactionStatus === 'Pending';
                    case 'process':
                        return item.transactionStatus === 'Received' && 
                               item.palayStatus === 'In Drying' && 
                               item.processingStatus === 'In Progress';
                    case 'return':
                        return item.transactionStatus === 'Received' && 
                               item.processingStatus === 'Done';
                    default:
                        return false;
                }
            } else {
                switch (filterType) {
                    case 'request':
                        return item.transactionStatus === 'Pending';
                    case 'process':
                        return item.transactionStatus === 'Received' && 
                               item.palayStatus === 'In Milling' && 
                               item.processingStatus === 'In Progress';
                    case 'return':
                        return item.transactionStatus === 'Received' && 
                               item.processingStatus === 'Done';
                    default:
                        return false;
                }
            }
        }).length;
    };
    
    const FilterButton = ({ label, icon, filter }) => (
        <Button 
            label={label} 
            icon={icon} 
            className={`p-button-sm ring-0 border-none rounded-full ${selectedFilter === filter ? 'p-button-outlined bg-primary text-white' : 'p-button-text text-primary'} flex items-center`} 
            onClick={() => setSelectedFilter(filter)}
        >
           
        </Button>
    );
    
    return (
        <StaffLayout activePage="Processing" user={user}>
            <Toast ref={toast} />
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl text-white font-bold mb-2">Palay Processing</h1>
                    <span className="p-input-icon-left w-1/2 mr-4 mb-4">
                        <Search className="text-white ml-2 -translate-y-1"/>
                        <InputText 
                            type="search"
                            value={globalFilterValue} 
                            onChange={onGlobalFilterChange} 
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
                    <div className="flex items-center justify-center">
                        <RotateCw 
                            className="w-6 h-6 text-primary cursor-pointer hover:text-secondary transition-colors" 
                            onClick={fetchData}
                            title="Refresh data"
                        />
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
                            globalFilterFields={['processingBatchId', 'palayBatchId', 'transactionStatus', 'processingStatus']}
                            emptyMessage="No data found."
                            paginator
                            rows={10}
                            // tableStyle={{ minWidth: '2200px' }}
                        > 
                            {selectedFilter !== 'request' && (
                                <Column field="processingBatchId" header={viewMode === 'drying' ? "Drying Batch ID" : "Milling Batch ID"} className="text-center" headerClassName="text-center" />
                            )}
                            <Column field="palayBatchId" header="Palay Batch ID" className="text-center" headerClassName="text-center" />
                            <Column 
                                field="quantity" header="Quantity in Bags" 
                                body={(rowData) => rowData.batchQuantityBags ?? rowData.palayQuantityBags}
                                className="text-center" headerClassName="text-center" 
                            />
                            <Column field="grossWeight" header="Gross Weight" className="text-center" headerClassName="text-center" />
                            <Column field="netWeight" header="Net Weight" className="text-center" headerClassName="text-center" />
                            {viewMode === 'drying' && (selectedFilter === 'return') && (
                               <Column field="moistureContent" header="Moisture Content" className="text-center" headerClassName="text-center" />
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
                            {viewMode === 'drying' && selectedFilter === 'return' && (
                                <Column field="dryingMethod" header="Drying Method" className="text-center" headerClassName="text-center" />
                            )}
                            {viewMode === 'milling' && selectedFilter === 'return' && (
                                <Column field="millerType" header="Miller Type" className="text-center" headerClassName="text-center" />
                            )}
                            {selectedFilter === 'return' && (
                                <Column field='startDate' header='Start Date' className="text-center" headerClassName="text-center" />
                            )}
                            <Column 
                                field={selectedFilter === 'request' ? 'requestDate' : (selectedFilter === 'process' ? 'startDate' : 'endDate')} 
                                header={selectedFilter === 'request' ? 'Request Date' : (selectedFilter === 'process' ? 'Start Date' : 'End Date')} 
                                className="text-center" 
                                headerClassName="text-center" 
                            />
                            <Column field="transportedBy" header="Transported By" className="text-center" headerClassName="text-center" />
                            {(selectedFilter === 'request') && (    
                                <Column 
                                    field="transactionStatus" 
                                    header='Status'
                                    body={(rowData) => statusBodyTemplate(rowData, { field: 'transactionStatus' })}
                                    className="text-center" 
                                    headerClassName="text-center" 
                                />
                            )}
                            {selectedFilter !== 'request' && (
                                <Column 
                                    field="processingStatus" 
                                    header={viewMode === 'drying' ? "Drying Status" : "Milling Status"} 
                                    className="text-center" headerClassName="text-center" frozen alignFrozen="right"
                                    body={(rowData) => statusBodyTemplate(rowData, { field: 'processingStatus' })}
                                />
                            )}
                            <Column header="Action" body={actionBodyTemplate} className="text-center" headerClassName="text-center" frozen alignFrozen="right"/>
                        </DataTable>
                    </div>
                </div>
            </div>

            <AcceptDialog
                visible={showAcceptDialog}
                onAccept={handleAccept}
                viewMode={viewMode}
                onCancel={() => setShowAcceptDialog(false)}
                isLoading={isLoading}
                selectedItem={selectedItem}
            />

            <ProcessDialog
                visible={showProcessDialog}
                viewMode={viewMode}
                newDryingData={newDryingData}
                newMillingData={newMillingData}
                onProcessComplete={handleProcess}
                onCancel={() => setProcessDialog(false)}
                isLoading={isLoading}
                setNewDryingData={setNewDryingData}
                setNewMillingData={setNewMillingData}
                selectedItem={selectedItem}
            />

            <ReturnDialog
                visible={showReturnDialog}
                viewMode={viewMode}
                newTransactionData={newTransactionData}
                onReturn={handleReturn}
                onCancel={() => setShowReturnDialog(false)}
                isLoading={isLoading}
                setNewTransactionData={setNewTransactionData}
                warehouses={warehouses}
                selectedItem={selectedItem}
            />
        </StaffLayout>
    );
}

export default Processing;