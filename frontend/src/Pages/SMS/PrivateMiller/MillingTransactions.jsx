import React, { useState, useEffect, useRef } from 'react';
import PrivateMillerLayout from '../../../Layouts/PrivateMillerLayout';
import { Search, Box, Factory, RotateCcw, RotateCw } from "lucide-react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../Authentication/Login/AuthContext';

const initialMillingData = {
    palayBatchId: '',
    millerId: '',
    millerType: 'Private',
    startDateTime: '',
    endDateTime: '',
    milledQuantityBags: '',
    milledGrossWeight: '',
    milledNetWeight: '',
    millingEfficiency: '',
    status: 'In Progress',
};

const initialTransactionData = {
    item: 'Rice',
    itemId: '',
    senderId: '',
    fromLocationType: 'Miller',
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

const MillingTransactions = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const toast = useRef(null);
    const { user } = useAuth();

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [selectedFilter, setSelectedFilter] = useState('request');
    const [selectedItem, setSelectedItem] = useState(null);
    
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showProcessDialog, setProcessDialog] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);

    const [combinedData, setCombinedData] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [newMillingData, setNewMillingData] = useState(initialMillingData);
    const [newTransactionData, setNewTransactionData] = useState(initialTransactionData);

    useEffect(() => {
        fetchData();
        fetchActiveWarehouses();
    }, [selectedFilter]);

    useEffect(() => {
        const newFilters = {
            global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
        };
        setFilters(newFilters);
    }, [globalFilterValue]);

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const fetchData = async () => {
        try {
            const processType = 'miller';
            const locationType = 'Miller';
            const status = selectedFilter === 'request' ? 'Pending' : 'Received';
            const batchType = 'milling';
            const millerType = 'Private';
            
            const [facilitiesRes, inventoryRes, warehousesRes] = await Promise.all([
                fetch(`${apiUrl}/millers`, { headers: { 'API-Key': apiKey } }),
                fetch(`${apiUrl}/inventory?toLocationType=${locationType}&status=${status}&batchType=${batchType}&millerType=${millerType}&userId=${user.id}`, 
                      { headers: { 'API-Key': apiKey } }),
                fetch(`${apiUrl}/warehouses`, { headers: { 'API-Key': apiKey } })
            ]);

            if (!facilitiesRes.ok || !inventoryRes.ok || !warehousesRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const [facilities, inventory, warehouses] = await Promise.all([
                facilitiesRes.json(),
                inventoryRes.json(),
                warehousesRes.json()
            ]);

            const transformedData = inventory.map(item => ({
                palayBatchId: item.palayBatch?.id,
                transactionId: item.transaction?.id,
                processingBatchId: item.processingBatch?.id,
                quantityInBags: item.palayBatch?.quantityBags || 0,
                grossWeight: item.palayBatch?.grossWeight || 0,
                netWeight: item.palayBatch?.netWeight || 0,
                from: warehouses.find(w => w.id === item.transaction?.fromLocationId)?.facilityName || 'Unknown',
                location: facilities.find(f => f.id === item.transaction?.toLocationId)?.[`${processType}Name`] || 'Unknown',
                toLocationId: item.transaction?.toLocationId,
                millerType: 'Private',
                requestDate: item.transaction?.sendDateTime ? new Date(item.transaction.sendDateTime).toLocaleDateString() : '',
                startDate: item.processingBatch?.startDateTime ? new Date(item.processingBatch.startDateTime).toLocaleDateString() : '',
                endDate: item.processingBatch?.endDateTime ? new Date(item.processingBatch.endDateTime).toLocaleDateString() : '',
                transportedBy: item.transaction?.transporterName || '',
                palayStatus: item.palayBatch?.status || '',
                transactionStatus: item.transaction?.status || '',
                processingStatus: item.processingBatch?.status || null
            }));

            setCombinedData(transformedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to fetch data: ${error.message}`,
                life: 3000
            });
        }
    };

    const fetchActiveWarehouses = async () => {
        try {
            const response = await fetch(`${apiUrl}/warehouses?status=Active`, {
                headers: {
                    'API-Key': apiKey
                }
            });

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
                    setNewMillingData(initialMillingData);
                    
                    setProcessDialog(true);
                } else if (rowData.processingStatus?.toLowerCase() === 'done') {
                    setShowReturnDialog(true);
                }
                break;
        }
    };

    const handleAccept = async () => {
        if (!selectedItem) {
            console.error('No item selected');
            return;
        }
    
        try {
            // Update transaction status to "Received"
            const transactionResponse = await fetch(`${apiUrl}/transactions/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
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
    
            // Update palay batch status
            const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
                },
                body: JSON.stringify({
                    id: selectedItem.palayBatchId,
                    status: 'In Milling'
                })
            });
    
            if (!palayResponse.ok) {
                throw new Error('Failed to update palay batch status');
            }
    
            // Create new milling batch
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
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
                },
                body: JSON.stringify(millingBatchData)
            });

            if (!millingResponse.ok) {
                throw new Error('Failed to create milling batch');
            }
    
            await fetchData();
            setShowAcceptDialog(false);
            
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Milling process started successfully',
                life: 3000
            });
    
        } catch (error) {
            console.error('Error in handleAccept:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to process acceptance: ${error.message}`,
                life: 3000
            });
        }
    };

    const handleProcess = async () => {
        if (!selectedItem) {
            console.error('No item selected');
            return;
        }
    
        try {
            const updateData = {
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

            const response = await fetch(`${apiUrl}/millingbatches/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
                },
                body: JSON.stringify(updateData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to update milling batch');
            }
    
            // Update palay batch status
            const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
                },
                body: JSON.stringify({
                    id: selectedItem.palayBatchId,
                    status: 'Milled'
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
                detail: 'Milling process completed successfully',
                life: 3000
            });
    
        } catch (error) {
            console.error('Error in handleProcess:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to complete process: ${error.message}`,
                life: 3000
            });
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

        try {
            // Update current transaction to Completed
            const updateTransactionResponse = await fetch(`${apiUrl}/transactions/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
                },
                body: JSON.stringify({
                    id: selectedItem.transactionId,
                    status: 'Completed'
                })
            });

            if (!updateTransactionResponse.ok) {
                throw new Error('Failed to update current transaction');
            }

            // Update palay batch location
            const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
                },
                body: JSON.stringify({
                    id: selectedItem.palayBatchId,
                    currentlyAt: newTransactionData.toLocationName
                })
            });

            if (!palayResponse.ok) {
                throw new Error('Failed to update palay batch');
            }

            // Create new transaction for return
            const newTransaction = {
                ...newTransactionData,
                item: 'Rice',
                itemId: selectedItem.palayBatchId,
                fromLocationType: 'Miller',
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
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
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

        } catch (error) {
            console.error('Error in handleReturn:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to process return: ${error.message}`,
                life: 3000
            });
        }
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

    const filteredData = combinedData.filter(item => {
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
    });

    const FilterButton = ({ label, icon, filter }) => (
        <Button 
            label={label} 
            icon={icon} 
            className={`p-button-sm ring-0 border-none rounded-full ${
                selectedFilter === filter ? 'p-button-outlined bg-primary text-white' : 'p-button-text text-primary'
            } flex items-center`} 
            onClick={() => setSelectedFilter(filter)}
        />
    );

    return (
        <PrivateMillerLayout activePage="Milling Transactions" user={user}>
        <Toast ref={toast} />
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl h-full text-white font-bold mb-2">Mill Palay</h1>
                    <span className="p-input-icon-left w-1/2 mr-4">
                        <Search className="text-white ml-2 -translate-y-1"/>
                        <InputText 
                            type="search"
                            value={globalFilterValue} 
                            onChange={onGlobalFilterChange} 
                            placeholder="Tap to Search" 
                            className="w-full pl-10 pr-4 py-2 rounded-full text-white bg-transparent border border-white placeholder:text-white"
                        />
                    </span>
                </div>

                {/* Buttons & Filters */}
                <div className="flex justify-start mb-4 space-x-2 py-2">
                    <div className="flex bg-white rounded-full gap-2">
                        <FilterButton label="Request" icon={<Box className="mr-2" size={16} />} filter="request" />
                        <FilterButton label="In milling" icon={<Factory className="mr-2" size={16} />} filter="process" />
                        <FilterButton label="To return" icon={<RotateCcw className="mr-2" size={16} />} filter="return" />
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
                        emptyMessage="No inventory found."
                        paginator
                        rows={10}
                    >
                        {selectedFilter !== 'request' && (
                            <Column field="processingBatchId" header="Milling Batch ID" className="text-center" headerClassName="text-center" />
                        )}
                        <Column field="palayBatchId" header="Palay Batch ID" className="text-center" headerClassName="text-center" />
                        <Column field="quantityInBags" header="Quantity In Bags" className="text-center" headerClassName="text-center" />
                        <Column field="grossWeight" header="Gross Weight" className="text-center" headerClassName="text-center" />
                        <Column field="netWeight" header="Net Weight" className="text-center" headerClassName="text-center" />
                        <Column field="from" header="From" className="text-center" headerClassName="text-center" />
                        <Column 
                            field="location" 
                            header={selectedFilter === 'request' 
                                ? 'To be Milled at' 
                                : selectedFilter === 'process' 
                                ? 'Milling at' 
                                : 'Milled at'} 
                            className="text-center" 
                            headerClassName="text-center" 
                        />
                        {(selectedFilter === 'return') && (    
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
                        {(selectedFilter !== 'request') && (    
                            <Column 
                                field="processingStatus" 
                                header="Milling Status" 
                                className="text-center" 
                                headerClassName="text-center"
                                body={(rowData) => statusBodyTemplate(rowData, { field: 'processingStatus' })}
                            />
                        )}
                        
                        <Column header="Action" body={actionBodyTemplate} className="text-center" headerClassName="text-center" frozen alignFrozen="right"/>
                    </DataTable>
                    </div>
                </div>

            </div>

            {/* Accept Dialog */}
            <Dialog header={`Receive Palay`} visible={showAcceptDialog} onHide={() => setShowAcceptDialog(false)} className="w-1/3">
                <div className="flex flex-col items-center">
                    <p className="mb-10">Are you sure you want to receive this request?</p>
                    <div className="flex justify-between w-full gap-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setShowAcceptDialog(false)} />
                        <Button 
                            label="Confirm Receive" 
                            className="w-1/2 bg-primary hover:border-none" 
                            onClick={handleAccept}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Process Dialog */}
            <Dialog header={`Complete Milling Process`} visible={showProcessDialog} onHide={() => setProcessDialog(false)} className="w-1/3">
                <div className="flex flex-col gap-4">
                    <div className="w-full">
                        <label className="block mb-2">Quantity in Bags</label>
                        <InputText 
                            type="number"
                            value={newMillingData.milledQuantityBags}
                            onChange={(e) => setNewMillingData(prev => ({...prev, milledQuantityBags: e.target.value}))}
                            className="w-full ring-0"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block mb-2">Gross Weight</label>
                        <InputText 
                            type="number"
                            value={newMillingData.milledGrossWeight}
                            onChange={(e) => setNewMillingData(prev => ({...prev, milledGrossWeight: e.target.value}))}
                            className="w-full ring-0"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block mb-2">Net Weight</label>
                        <InputText 
                            type="number"
                            value={newMillingData.milledNetWeight}
                            onChange={(e) => setNewMillingData(prev => ({...prev, milledNetWeight: e.target.value}))}
                            className="w-full ring-0"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block mb-2">Milling Efficiency</label>
                        <InputText 
                            type="number"
                            value={newMillingData.millingEfficiency}
                            onChange={(e) => setNewMillingData(prev => ({...prev, millingEfficiency: e.target.value}))}
                            className="w-full ring-0"
                        />
                    </div>
                    
                    <div className="flex justify-between gap-4 mt-4">
                        <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={() => setProcessDialog(false)} />
                        <Button label="Complete Process" className="w-1/2 bg-primary hover:border-none" onClick={handleProcess} />
                    </div>
                </div>
            </Dialog>

            {/* Return Dialog */}
            <Dialog header={`Return Rice`} visible={showReturnDialog} onHide={() => {setShowReturnDialog(false); }} className="w-1/3">
                <div className="flex flex-col w-full gap-4">
                    <div className="w-full">
                        <label className="block mb-2">Warehouse</label>
                        <Dropdown 
                            value={newTransactionData.toLocationId}
                            options={warehouses} 
                            onChange={(e) => setNewTransactionData(prev => ({
                                ...prev,
                                toLocationId: e.value,
                                toLocationName: warehouses.find(w => w.value === e.value)?.label
                            }))}
                            placeholder="Select a warehouse" 
                            className="w-full ring-0" 
                        />
                    </div>

                    <div className="w-full">
                        <label className="block mb-2">Transported By</label>
                        <InputText 
                            value={newTransactionData.transporterName}
                            onChange={(e) => setNewTransactionData(prev => ({
                                ...prev,
                                transporterName: e.target.value
                            }))}
                            className="w-full ring-0" 
                        />
                    </div>

                    <div className="w-full">
                        <label className="block mb-2">Transport Description</label>
                        <InputTextarea 
                            value={newTransactionData.transporterDesc}
                            onChange={(e) => setNewTransactionData(prev => ({
                                ...prev,
                                transporterDesc: e.target.value
                            }))}
                            className="w-full ring-0" 
                            rows={3}
                        />
                    </div>

                    <div className="w-full">
                        <label className="block mb-2">Remarks</label>
                        <InputTextarea 
                            value={newTransactionData.remarks}
                            onChange={(e) => setNewTransactionData(prev => ({
                                ...prev,
                                remarks: e.target.value
                            }))}
                            className="w-full ring-0" 
                            rows={3}
                        />
                    </div>
                    
                    <div className="flex justify-between gap-4 mt-4">
                        <Button 
                            label="Cancel" 
                            className="w-1/2 bg-transparent text-primary border-primary" 
                            onClick={() => {
                                setShowReturnDialog(false);
                                setNewTransactionData(initialTransactionData);
                            }} 
                        />
                        <Button 
                            label="Confirm Return" 
                            className="w-1/2 bg-primary hover:border-none" 
                            onClick={handleReturn}
                        />
                    </div>
                </div>
            </Dialog>
        </PrivateMillerLayout>
    );
}

export default MillingTransactions;