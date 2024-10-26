import React, { useEffect, useState, useRef  } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

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

import { Search, Wheat, CheckCircle } from "lucide-react";

import { useAuth } from '../../Authentication/Login/AuthContext';

const initialTransactionData = {
    item: 'Palay',
    itemId: '',
    senderId: '',
    fromLocationType: 'Procurement',
    fromLocationId: 0,
    transporterName: '',
    transporterDesc: '',
    receiverId: '',
    receiveDateTime: '0',
    toLocationType: 'Warehouse',
    toLocationId: '',
    toLocationName: '',
    status: 'Pending',
    remarks: ''
};

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
    dryingBatchId: '0',
    palayBatchId: '',
    millerId: '',
    millerType: '',
    startDateTime: '',
    endDateTime: '',
    milledQuantityBags: '',
    milledNetWeight: '',
    millingEfficiency: '',
    status: 'In Progress',
};

function Warehouse() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const toast = useRef(null);
    const { user } = useAuth();
    
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [loading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [viewMode, setViewMode] = useState('requests');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);

    const [showSendToDialog, setShowSendToDialog] = useState(false);
    const [showRiceAcceptDialog, setShowRiceAcceptDialog] = useState(false);
    const [showPalayAcceptDialog, setShowPalayAcceptDialog] = useState(false);

    const [palayBatches, setPalayBatches] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [combinedData, setCombinedData] = useState([]);

    const [millerData, setMillerData] = useState([]);
    const [dryerData, setDryerData] = useState([]);

    const [newTransactionData, setNewTransactionData] = useState({
        item: '',
        itemId: '',
        senderId: '',
        fromLocationType: 'Warehouse',
        fromLocationId: '',
        transporterName: '',
        transporterDesc: '',
        receiverId: '',
        receiveDateTime: '0',
        toLocationType: '',
        toLocationId: '',
        toLocationName: '',
        status: 'Pending',
        remarks: ''
    });
    const [newDryingData, setNewDryingData] = useState({
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
    });
    const [newMillingData, setNewMillingData] = useState({
        dryingBatchId: '0',
        palayBatchId: '',
        millerId: '',
        millerType: '',
        startDateTime: '',
        endDateTime: '',
        milledQuantityBags: '',
        milledNetWeight: '',
        millingEfficiency: '',
        status: 'In Progress',
    });
    const [acceptFormData, setAcceptFormData] = useState({
        riceBatchName: '',
        riceType: '',
        price: ''
    });

    const getAvailableFacilities = () => {
        if (!selectedItem) return [];
        
        if (selectedItem.palayStatus === 'To be Dry') {
            return dryerData
                .filter(dryer => dryer.status === 'active')
                .map(dryer => ({
                    label: dryer.dryerName.toString(),
                    value: dryer.id,
                    name: dryer.dryerName.toString()
                }));  
        }
        
        if (selectedItem.palayStatus === 'To be Mill') {
            console.log()
            return millerData
                .filter(miller => miller.status === 'active')
                .map(miller => ({
                    label: miller.millerName.toString(),
                    value: miller.id,
                    name: miller.millerName.toString()
                }));
        }
        
        return [];
    };

    useEffect(() => {
        fetchPalayBatches();
        fetchDryerData();
        fetchMillerData();
    }, []);

    useEffect(() => {
        if (viewMode === 'requests') {
            fetchPendingTransactions();
        } else {
            fetchAcceptedTransactions();
        }
    }, [viewMode]);

    useEffect(() => {
        if (palayBatches.length && transactions.length) {
            processCombinedData();
        }
    }, [palayBatches, transactions]);
    
    const fetchPalayBatches = async () => {
        try {
            const response = await fetch(`${apiUrl}/palaybatches`, {
                headers: { 'API-Key': apiKey }
            });
            const data = await response.json();
            setPalayBatches(data);
        } catch (error) {
            console.error('Error fetching palay batches:', error);
        }
    };

    const fetchAcceptedTransactions = async () => {
        try {
            const response = await fetch(`${apiUrl}/transactions?toLocationType=Warehouse&status=Accepted`, {
                headers: { 'API-Key': apiKey }
            });
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching accepted transactions:', error);
        }
    };

    const fetchPendingTransactions = async () => {
        try {
            const response = await fetch(`${apiUrl}/transactions?toLocationType=Warehouse&status=Pending`, {
                headers: { 'API-Key': apiKey }
            });
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchDryerData = async () => {
        try {
            const res = await fetch(`${apiUrl}/dryers`, {
                headers: { 'API-Key': `${apiKey}` }
            });
            if (!res.ok) {
                throw new Error('Failed to fetch dryer data');
            }
            const data = await res.json();
            setDryerData(data);
        } catch (error) {
            console.log(error.message);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch dryer data', life: 3000 });
        }
    };

    const fetchMillerData = async () => {
        try {
            const res = await fetch(`${apiUrl}/millers`, {
                headers: { 'API-Key': `${apiKey}` }
            });
            if (!res.ok) {
                throw new Error('Failed to fetch miller data');
            }
            const data = await res.json();
            setMillerData(data);
        } catch (error) {
            console.log(error.message);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch miller data', life: 3000 });
        }
    };

    const processCombinedData = () => {
        // Since transactions are already filtered for pending status and warehouse location
        const combined = palayBatches.map(batch => {
            // Find transaction where transaction's itemId matches batch id
            const relatedTransaction = transactions.find(t => t.itemId === batch.id);
            
            if (relatedTransaction) {
                return {
                    id: batch.id,
                    quantityInBags: batch.quantityBags,
                    from: batch.buyingStationLoc,
                    toBeStoreAt: batch.currentlyAt,
                    currentlyAt: batch.currentlyAt,
                    dateRequest: new Date(relatedTransaction.sendDateTime).toLocaleDateString(),
                    receivedOn: new Date(relatedTransaction.receiveDateTime).toLocaleDateString(),
                    transportedBy: relatedTransaction.transporterName,
                    transactionStatus: relatedTransaction.status,
                    palayStatus: batch.status,
                    transactionId: relatedTransaction.id,
                    item: relatedTransaction.item,
                    qualityType: batch.qualityType,
                    currentTransaction: batch.currentTransaction
                };
            }
            return null;
        }).filter(Boolean);
    
        setCombinedData(combined);
    };

    const handleInputChange = (e) => {  
    };

    const handleSendTo = async () => {
        if (!validateForm()) {
            return;
        }
    
        try {
            const newStatus = selectedItem.palayStatus === 'To be Dry' ? 'In Drying' : 'In Milling';
            
            // Create new transaction first
            const transactionResponse = await fetch(`${apiUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
                },
                body: JSON.stringify(newTransactionData)
            });
    
            if (!transactionResponse.ok) {
                throw new Error('Failed to create transaction');
            }
    
            const transactionResult = await transactionResponse.json();
            const transactionResultId = transactionResult.id;
            
            // Update palay batch with new status and new transaction ID
            const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
                },
                body: JSON.stringify({
                    id: selectedItem.id,
                    status: newStatus,
                    currentlyAt: newTransactionData.toLocationName,
                    currentTransaction: transactionResultId
                })
            });
    
            if (!palayResponse.ok) {
                throw new Error('Failed to update palay batch');
            }
    
            // Submit other data (drying/milling)
            if (selectedItem.palayStatus === 'To be Dry') {
                await newDryingSubmit();
            } else if (selectedItem.palayStatus === 'To be Mill') {
                await newMillingSubmit();
            }
    
            await fetchPalayBatches();
            setShowSendToDialog(false);
            setNewTransactionData(initialTransactionData);
    
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: `Palay batch status updated to ${newStatus}`,
                life: 3000
            });
    
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to complete the process',
                life: 3000
            });
        }
    };

    const handleConfirmReceive = async () => {
        try {
            // Find transaction using currentTransaction field
            const transactionToUpdate = transactions.find(t => t.id === selectedItem.currentTransaction);
    
            if (transactionToUpdate) {
                // Update transaction
                const transactionResponse = await fetch(`${apiUrl}/transactions/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'API-Key': apiKey
                    },
                    body: JSON.stringify({
                        ...transactionToUpdate,
                        status: 'Accepted',
                        receiveDateTime: new Date().toISOString(),
                        receiverId: user.id
                    })
                });
    
                if (!transactionResponse.ok) {
                    throw new Error('Failed to update transaction');
                }
    
                await fetchAcceptedTransactions();
                setShowPalayAcceptDialog(false);
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update transaction',
                life: 3000
            });
        }
    };

    const handleActionClick = (item, rowData) => {
        if (viewMode === 'requests') {
            console.log("rowData is ", rowData)
            setSelectedItem(rowData);
            if (item === 'Palay') {
                setShowPalayAcceptDialog(true);
            } else if (item === 'Rice') {
                setShowRiceAcceptDialog(true);
            }
        } else if (viewMode === 'inWarehouse') {
            setSelectedItem(rowData);
            // Find the current transaction using currentTransaction field
            const currentTransaction = transactions.find(t => t.id === rowData.currentTransaction);

            const toLocationType = rowData.palayStatus === 'To be Dry' ? 'Dryer' : 
                                 rowData.palayStatus === 'To be Mill' ? 'Miller' : '';
            
            const newTransaction = {
                ...initialTransactionData,
                item: rowData.item,
                itemId: rowData.id,
                senderId: user.id,
                fromLocationType: 'Warehouse',
                fromLocationId: currentTransaction?.toLocationId, // Use current transaction's location
                receiverId: 0,
                receiveDateTime: '0',
                toLocationType: toLocationType,
                status: 'Pending'
            };
            
            setNewTransactionData(newTransaction);
    
            if (rowData.palayStatus === 'To be Dry') {
                setNewDryingData({
                    ...initialDryingData,
                    palayBatchId: rowData.id,
                });
            } else if (rowData.palayStatus === 'To be Mill') {
                setNewMillingData({
                    ...initialMillingData,
                    palayBatchId: rowData.id,
                });
            }
            
            setShowSendToDialog(true);
        }
    };

    // const newTransactionSubmit = async () => {
    //     const transformedData = {
    //         ...newTransactionData
    //     };

    //     console.log(transformedData)
    
    //     try {
    //         const response = await fetch(`${apiUrl}/transactions`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'API-Key': `${apiKey}`
    //             },
    //             body: JSON.stringify(transformedData)
    //         });
    
    //         if (!response.ok) {
    //             throw new Error('Failed to submit transaction data');
    //         }
    
    //         const result = await response.json();

    //         toast.current.show({
    //             severity: 'success',
    //             summary: 'Success',
    //             detail: 'Transaction record successfully created',
    //             life: 3000
    //         });
    
    //         setNewTransactionData(initialTransactionData);
    
    //     } catch (error) {
    //         console.error('Error:', error);
    //         toast.current.show({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Failed to create transaction record',
    //             life: 3000
    //         });
    //     }
    // };

    const newDryingSubmit = async () => {
        const transformedData = {
            ...newDryingData
        };

        console.log(transformedData)
    
        try {
            const response = await fetch(`${apiUrl}/dryingbatches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': `${apiKey}`
                },
                body: JSON.stringify(transformedData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit drying batches data');
            }
    
            const result = await response.json();

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'drying batches successfully created',
                life: 3000
            });
    
            setNewDryingData(initialDryingData);
    
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create drying batches record',
                life: 3000
            });
        }
    };

    const newMillingSubmit = async () => {
        const transformedData = {
            ...newMillingData
        };

        console.log(transformedData)
    
        try {
            const response = await fetch(`${apiUrl}/millingbatches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': `${apiKey}`
                },
                body: JSON.stringify(transformedData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit milling batches data');
            }
    
            const result = await response.json();

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'milling batches successfully created',
                life: 3000
            });
    
            setNewMillingData(initialMillingData);
    
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create milling batches record',
                life: 3000
            });
        }
    };
    
    const getSeverity = (status, viewMode) => {
        // Handle transaction statuses
        if (viewMode === 'requests') {
            switch (status) {
                case 'Pending':
                    return 'warning';
                case 'Accepted':
                    return 'success';
                default:
                    return 'info';
            }
        }
        
        // Handle palay batch statuses
        switch (status) {
            case 'To be Dry':
            case 'To be Mill':
                return 'warning';
            case 'In Drying':
            case 'In Milling':
                return 'info';
            case 'Milled':
                return 'success';
            default:
                return 'info';
        }
    };
    
    const statusBodyTemplate = (rowData) => {
        const status = viewMode === 'requests' ? rowData.transactionStatus : rowData.palayStatus;
        
        return (
            <Tag 
                value={status} 
                severity={getSeverity(status, viewMode)} 
                style={{ minWidth: '80px', textAlign: 'center' }}
                className="text-sm px-2 rounded-md"
            />
        );
    };

    const actionBodyTemplate = (rowData) => {
        if (viewMode === 'inWarehouse' && rowData.status === 'Rice') {
            return null;
        }
        const actionText = viewMode === 'inWarehouse' ? 'Send to' : 'Accept';
        return (
            <Button 
                label={actionText} 
                className="p-button-text p-button-sm text-primary ring-0" 
                onClick={() => handleActionClick(rowData.item, rowData)}
            />
        );
    };
    
    const filteredData = viewMode === 'requests' 
    ? combinedData.filter(item => {
        const isPending = item.transactionStatus === 'Pending';
        if (!isPending) return false;

        switch (selectedFilter) {
            case 'palay':
                return item.item === 'Palay';
            case 'rice':
                return item.item === 'Rice';
            default:
                return true;
        }
    })
    : combinedData.filter(item => {
        const isAccepted = item.transactionStatus === 'Accepted';
        if (!isAccepted) return false;
        
        const allowedStatuses = ['To be Mill', 'To be Dry', 'Milled'];
        if (!allowedStatuses.includes(item.palayStatus)) return false;
        
        if (['In Milling', 'In Drying'].includes(item.palayStatus)) return false;
        
        switch (selectedFilter) {
            case 'palay':
                return item.item === 'Palay';
            case 'rice':
                return item.item === 'Rice';
            default:
                return true;
        }
    });

    const getFilterCount = (filter) => {
        const excludedStatuses = ['In Milling', 'In Drying'];
        
        const baseData = viewMode === 'requests' 
            ? combinedData.filter(item => item.transactionStatus === 'Pending')
            : combinedData.filter(item => {
                return item.transactionStatus === 'Accepted' && 
                       !excludedStatuses.includes(item.palayStatus);
            });

        switch (filter) {
            case 'palay':
                return baseData.filter(item => item.item === 'Palay').length;
            case 'rice':
                return baseData.filter(item => item.item === 'Rice').length;
            default:
                return baseData.length;
        }
    };

    const FilterButton = ({ label, icon, filter }) => (
        <Button 
            label={label} 
            icon={icon} 
            className={`p-button-sm ring-0 border-none rounded-full ${
                selectedFilter === filter 
                    ? 'p-button-outlined bg-primary text-white' 
                    : 'p-button-text text-primary'
            } flex items-center`} 
            onClick={() => setSelectedFilter(filter)}
        >
            <span className={`ring-0 border-none rounded-full ml-2 px-1 ${
                selectedFilter === filter 
                    ? 'p-button-outlined bg-gray-200 text-primary' 
                    : 'p-button-text text-white bg-primary'
            } flex items-center`}>
                {getFilterCount(filter)}
            </span>
        </Button>
    );

    const validateForm = () => {
        let newErrors = {};
        
        if (!newTransactionData.toLocationId) {
            newErrors.toLocationId = "Please select a facility";
            toast.current.show({severity:'error', summary: 'Error', detail:'Please select a facility', life: 3000});
        }
        
        if (!newTransactionData.transporterName.trim()) {
            newErrors.transporterName = "Transporter name is required";
            toast.current.show({severity:'error', summary: 'Error', detail:'Transporter name is required', life: 3000});
        }
        
        if (!newTransactionData.transporterDesc.trim()) {
            newErrors.transporterDesc = "Transport description is required";
            toast.current.show({severity:'error', summary: 'Error', detail:'Transport description is required', life: 3000});
        }
        
        if (!newTransactionData.remarks.trim()) {
            newErrors.remarks = "Remarks are required";
            toast.current.show({severity:'error', summary: 'Error', detail:'Remarks are required', life: 3000});
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <StaffLayout activePage="Warehouse">
            <Toast ref={toast} />
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
                            label="Requests" 
                            className={`p-button-sm ring-0 ${viewMode === 'requests' ? 'bg-white text-primary' : 'bg-transparent text-white border-white'}`} 
                            onClick={() => {
                                setViewMode('requests');
                                setSelectedFilter('all');
                            }} 
                        />
                        <Button 
                            label="In Warehouse" 
                            className={`p-button-sm ring-0 ${viewMode === 'inWarehouse' ? 'bg-white text-primary' : 'bg-transparent text-white border-white'}`} 
                            onClick={() => {
                                setViewMode('inWarehouse');
                                setSelectedFilter('all');
                            }} 
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-start mb-4 space-x-2 py-2">
                    <Button 
                        label="All" 
                        className={`p-button-sm border-none ring-0 ${
                            selectedFilter === 'all' 
                                ? 'p-button-raised bg-primary text-white' 
                                : 'p-button-outlined bg-white text-primary'
                        }`} 
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
                        scrolldirection="both"
                        className="p-datatable-sm pt-5" 
                        filters={filters}
                        globalFilterFields={viewMode === 'inWarehouse' ? 
                            ['from', 'currentlyAt', 'receivedOn', 'transportedBy', 'status'] : 
                            ['from', 'toBeStoreAt', 'dateRequest', 'transportedBy', 'status']}
                        emptyMessage="No inventory found."
                        paginator
                        rows={10}
                    > 
                        <Column 
                            field="id" 
                            header={selectedFilter === 'all' ? 'Batch ID' : (selectedFilter === 'rice' ? 'Rice Batch ID' : 'Palay Batch ID')} 
                            className="text-center" headerClassName="text-center" />
                        <Column field="quantityInBags" header="Quantity In Bags" className="text-center" headerClassName="text-center" />
                        <Column field="from" header="From" className="text-center" headerClassName="text-center" />
                        <Column 
                            field={viewMode === 'inWarehouse' ? "currentlyAt" : "toBeStoreAt"} 
                            header={viewMode === 'inWarehouse' ? "Currently at" : "To be Store at"} 
                            className="text-center" headerClassName="text-center" />
                        <Column 
                            field={viewMode === 'inWarehouse' ? "receivedOn" : "dateRequest"} 
                            header={viewMode === 'inWarehouse' ? "Received On" : "Date Request"} 
                            className="text-center" headerClassName="text-center" />
                        <Column field="transportedBy" header="Transported By" className="text-center" headerClassName="text-center" />
                        <Column field="item" header="Item Type" className="text-center" headerClassName="text-center" />
                        {/* <Column field="qualityType" header="Quality Type" className="text-center" headerClassName="text-center" /> */}
                        <Column 
                            field={viewMode === 'requests' ? 'transactionStatus' : 'palayStatus'} 
                            header="Status" 
                            body={statusBodyTemplate} 
                            className="text-center" 
                            headerClassName="text-center"
                        />
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
                        <InputText
                            value={selectedItem?.palayStatus === 'To be Dry' ? 'Dryer' : 'Miller'}
                            disabled
                            className="w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Facility</label>
                        <Dropdown 
                            value={newTransactionData.toLocationId}
                            options={getAvailableFacilities()}
                            onChange={(e) => {
                                const selectedOption = getAvailableFacilities().find(opt => opt.value === e.value);
                                if (selectedOption) {
                                    setNewTransactionData(prev => ({
                                        ...prev,
                                        toLocationId: selectedOption.value,
                                        toLocationName: selectedOption.label
                                    }));
                                    setNewDryingData(prev => ({
                                        ...prev,
                                        dryerId: selectedOption.value,
                                    }));
                                    setNewMillingData(prev => ({
                                        ...prev,
                                        millerId: selectedOption.value,
                                    }));
                                    setErrors(prev => ({...prev, toLocationId: ''}));
                                }
                            }}
                            placeholder="Select a facility"
                            className={`w-full ${errors.toLocationId ? 'p-invalid' : ''}`}
                        />
                        {errors.toLocationId && <p className="text-red-500 text-xs mt-1">{errors.toLocationId}</p>}
                    </div>

                    <div className="w-full mb-4">
                        <label htmlFor="transportedBy" className="block text-sm font-medium text-gray-700 mb-1">Transported by</label>
                        <InputText 
                            value={newTransactionData.transporterName}
                            onChange={(e) => {
                                setNewTransactionData(prev => ({ ...prev, transporterName: e.target.value }));
                                setErrors(prev => ({...prev, transporterName: ''}));
                            }}
                            className={`w-full ring-0 ${errors.transporterName ? 'p-invalid' : ''}`}
                        />
                        {errors.transporterName && <p className="text-red-500 text-xs mt-1">{errors.transporterName}</p>}
                    </div>

                    <div className="w-full mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Transport Description</label>
                        <InputTextarea 
                            value={newTransactionData.transporterDesc}
                            onChange={(e) => {
                                setNewTransactionData(prev => ({ ...prev, transporterDesc: e.target.value }));
                                setErrors(prev => ({...prev, transporterDesc: ''}));
                            }}
                            className={`w-full ring-0 ${errors.transporterDesc ? 'p-invalid' : ''}`}
                        />
                        {errors.transporterDesc && <p className="text-red-500 text-xs mt-1">{errors.transporterDesc}</p>}
                    </div>

                    <div className="w-full mb-4">
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                        <InputTextarea 
                            value={newTransactionData.remarks}
                            onChange={(e) => {
                                setNewTransactionData(prev => ({ ...prev, remarks: e.target.value }));
                                setErrors(prev => ({...prev, remarks: ''}));
                            }}
                            className={`w-full ring-0 ${errors.remarks ? 'p-invalid' : ''}`}
                        />
                        {errors.remarks && <p className="text-red-500 text-xs mt-1">{errors.remarks}</p>}
                    </div>

                    <div className="flex justify-between w-full gap-4 mt-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowSendToDialog(false)} />
                        <Button label="Send Request" className="w-1/2 bg-primary hover:border-none" onClick={handleSendTo} />
                    </div>
                </div>
            </Dialog>

            {/* Accept Rice Dialog */}
            <Dialog header="Receive palay" visible={showRiceAcceptDialog} onHide={() => setShowRiceAcceptDialog(false)} className="w-1/3">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-full">
                        <label htmlFor="riceBatchName" className="block text-sm font-medium text-gray-700 mb-1">Rice Batch Name</label>
                        <InputText 
                            name="riceBatchName"
                            value={acceptFormData.riceBatchName}
                            onChange={handleInputChange}
                            className="w-full ring-0" 
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="riceType" className="block text-sm font-medium text-gray-700 mb-1">Rice Type</label>
                        <InputText 
                            name="riceType"
                            value={acceptFormData.riceType}
                            onChange={handleInputChange}
                            className="w-full ring-0" 
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <InputText 
                            name="price"
                            value={acceptFormData.price}
                            onChange={handleInputChange}
                            className="w-full ring-0" 
                        />
                    </div>
                    
                    <div className="flex justify-between w-full mt-5">
                        <Button 
                            label="Confirm Receive" 
                            className="w-full bg-primary hover:border-none" 
                            onClick={handleConfirmReceive} 
                        />
                    </div>
                </div>
            </Dialog>

            {/* Accept Palay Dialog */}
            <Dialog header="Receive palay" visible={showPalayAcceptDialog} onHide={() => setShowPalayAcceptDialog(false)} className="w-1/3">
                <div className="flex flex-col items-center gap-2">
                    <CheckCircle size={32} className="text-primary"/>
                    <p>Are you sure you want to receive this Palay?</p>
                    
                    <div className="flex justify-between w-full mt-5">
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