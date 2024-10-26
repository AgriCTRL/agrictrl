import React, { useEffect, useState, useRef } from 'react';
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

import { useAuth } from '../../Authentication/Login/AuthContext';

function Processing() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
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
    
    // Dialog states
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showSetDataDialog, setShowSetDataDialog] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);

    // Data states
    const [palayBatches, setPalayBatches] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [dryingbatches, setDryingBatches] = useState([]);
    const [millingbatches, setMillingBatches] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    

    const [formData, setFormData] = useState({
        dateProcessed: new Date(),
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

    // useEffect(() => {
    //     const today = new Date();
    //     setFormData((prevFormData) => ({
    //         ...prevFormData,
    //         dateProcessed: today
    //     }));
    // }, []);

    useEffect(() => {
        fetchPalayBatches();
    }, []);

    useEffect(() => {
        if (viewMode === 'drying') {
            if (selectedFilter === 'request') {
                fetchPendingTransactions();
            } else {
                fetchAcceptedTransactions();
            }
            fetchDryingBatches();
        } else {
            if (selectedFilter === 'request') {
                fetchPendingTransactions();
            } else {
                fetchAcceptedTransactions();
            }
            fetchMillingBatches();
        }
    }, [viewMode, selectedFilter]);

    useEffect(() => {
        if (palayBatches.length > 0 && transactions.length > 0) {
            processCombinedData();
        }
    }, [palayBatches, transactions, dryingbatches, millingbatches]);

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
            const locationType = viewMode === 'drying' ? 'Dryer' : 'Miller';
            const response = await fetch(`${apiUrl}/transactions?toLocationType=${locationType}&status=Accepted`, {
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
            const locationType = viewMode === 'drying' ? 'Dryer' : 'Miller';
            const response = await fetch(`${apiUrl}/transactions?toLocationType=${locationType}&status=Pending`, {
                headers: { 'API-Key': apiKey }
            });
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching pending transactions:', error);
        }
    };

    const fetchDryingBatches = async () => {
        try {
            const response = await fetch(`${apiUrl}/dryingbatches`, {
                headers: { 'API-Key': apiKey }
            });
            const data = await response.json();
            setDryingBatches(data);
        } catch (error) {
            console.error('Error fetching drying batches:', error);
        }
    };

    const fetchMillingBatches = async () => {
        try {
            const response = await fetch(`${apiUrl}/millingbatches`, {
                headers: { 'API-Key': apiKey }
            });
            const data = await response.json();
            setMillingBatches(data);
        } catch (error) {
            console.error('Error fetching milling batches:', error);
        }
    };

    const processCombinedData = () => {
        const combined = palayBatches.map(batch => {
            const relatedTransaction = transactions.find(t => t.id === batch.currentTransaction);
            const relatedDryingBatch = dryingbatches.find(d => d.palayBatchId === batch.id);
            const relatedMillingBatch = millingbatches.find(m => m.palayBatchId === batch.id);
            
            if (relatedTransaction) {
                return {
                    dryingId: relatedDryingBatch?.id || null,
                    millingId: relatedMillingBatch?.id || null,
                    batchId: batch.id,
                    quantityInBags: batch.quantityBags,
                    grossWeight: batch.grossWeight,
                    preNetWeight: batch.netWeight,
                    postNetWeight: batch.processedNetWeight,
                    from: batch.buyingStationLoc,
                    location: batch.currentlyAt,
                    dryingMethod: batch.dryingMethod,
                    millerType: batch.millerType,
                    requestDate: new Date(relatedTransaction.sendDateTime).toLocaleDateString(),
                    startDate: batch.processStartDate ? new Date(batch.processStartDate).toLocaleDateString() : '',
                    endDate: batch.processEndDate ? new Date(batch.processEndDate).toLocaleDateString() : '',
                    moistureContent: batch.moistureContent,
                    transportedBy: relatedTransaction.transporterName,
                    palayStatus: batch.status,
                    transactionStatus: relatedTransaction.status,
                    currentTransaction: relatedTransaction.id,
                    dryingStatus: relatedDryingBatch?.status || null,
                    millingStatus: relatedMillingBatch?.status || null
                };
            }
            return null;
        }).filter(Boolean);
        setCombinedData(combined);
    };

    const getDryingStatusSeverity = (status) => {
        switch (status?.toLowerCase()) {
            case 'in progress': return 'warning';
            case 'dried': return 'success';
            default: return 'info';
        }
    };

    const getMillingStatusSeverity = (status) => {
        switch (status?.toLowerCase()) {
            case 'in progress': return 'warning';
            case 'milled': return 'success';
            default: return 'info';
        }
    };

    const getSeverity = (status) => {
        switch (status?.toLowerCase()) {
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
            className="text-sm px-2 rounded-md"
        />
    );

    const millingStatusBodyTemplate = (rowData) => (
        <Tag 
            value={rowData.millingStatus} 
            severity={getMillingStatusSeverity(rowData.millingStatus)} 
            className="text-sm px-2 rounded-md"
        />
    );
    
    const statusBodyTemplate = (rowData) => (
        <Tag 
            value={rowData.status} 
            severity={getSeverity(rowData.status)} 
            className="text-sm px-2 rounded-md"
        />
    );

    const actionBodyTemplate = (rowData) => {
        let actionText;
        switch (rowData.status?.toLowerCase()) {
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
    
    const handleActionClick = (status, rowData) => {
        setSelectedItem(rowData);
        
        switch (selectedFilter) {
            case 'request':
                setShowAcceptDialog(true);
                break;
                
            case 'process':
                setShowSetDataDialog(true);
                break;
                
            case 'return':
                setShowReturnDialog(true);
                break;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmReceive = async () => {
        try {
            const response = await fetch(`${apiUrl}/transactions/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': apiKey
                },
                body: JSON.stringify({
                    id: selectedItem.id,
                    status: 'Accepted',
                    receiveDateTime: new Date().toISOString(),
                    receiverId: user.id
                })
            });
    
            if (!response.ok) throw new Error('Failed to update transaction');
            
            // Refresh data after successful update
            await Promise.all([fetchPendingTransactions(), fetchPalayBatches()]);
            setShowAcceptDialog(false);
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    const handleAccept = async (item) => {
        try {
          const transaction = transactions.find(t => t.itemId === item.batchId);
          if (!transaction) return;
      
          // Update transaction status
          const transactionResponse = await fetch(`${apiUrl}/transactions/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'API-Key': apiKey
            },
            body: JSON.stringify({
              ...transaction,
              status: 'Accepted',
              receiveDateTime: new Date().toISOString(),
              receiverId: user.id
            })
          });
      
          if (transactionResponse.ok) {
            await Promise.all([fetchPendingTransactions(), fetchPalayBatches()]);
            setShowAcceptDialog(false);
          }
        } catch (error) {
          console.error('Error accepting request:', error);
        }
    };

    const handleDone = async (item) => {
        try {
          const newStatus = viewMode === 'drying' ? 'To be Mill' : 'Milled';
          const response = await fetch(`${apiUrl}/palaybatches/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'API-Key': apiKey
            },
            body: JSON.stringify({
              id: item.batchId,
              status: newStatus,
              processEndDate: new Date().toISOString(),
              ...formData
            })
          });
      
          if (response.ok) {
            await fetchPalayBatches();
            setShowSetDataDialog(false);
          }
        } catch (error) {
          console.error('Error updating process status:', error);
        }
    };

    const handleReturn = async (item) => {
        try {
          // Create new transaction for return
          const newTransaction = {
            itemId: item.batchId,
            senderId: user.id,
            receiverId: null, // Will be set by warehouse
            status: 'Pending',
            sendDateTime: new Date().toISOString(),
            receiveDateTime: null,
            transporterName: formData.transportedBy,
            description: formData.description,
            remarks: formData.remarks
          };
      
          const response = await fetch(`${apiUrl}/transactions/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'API-Key': apiKey
            },
            body: JSON.stringify(newTransaction)
          });
      
          if (response.ok) {
            await Promise.all([fetchPendingTransactions(), fetchPalayBatches()]);
            setShowReturnDialog(false);
          }
        } catch (error) {
          console.error('Error returning item:', error);
        }
    };

    const filteredData = combinedData.filter(item => {
        if (viewMode === 'drying') {
            switch (selectedFilter) {
                case 'request':
                    return item.transactionStatus === 'Pending' && 
                           ['To be Dry', 'In Drying'].includes(item.palayStatus);
                case 'process':
                    return item.transactionStatus === 'Accepted' && 
                           item.palayStatus === 'In Drying';
                case 'return':
                    return item.transactionStatus === 'Accepted' && 
                           item.palayStatus === 'Dried';
                default:
                    return true;
            }
        } else { // milling viewMode
            switch (selectedFilter) {
                case 'request':
                    return item.transactionStatus === 'Pending' && 
                           ['To be Mill', 'In Milling'].includes(item.palayStatus);
                case 'process':
                    return item.transactionStatus === 'Accepted' && 
                           item.palayStatus === 'In Milling';
                case 'return':
                    return item.transactionStatus === 'Accepted' && 
                           item.palayStatus === 'Milled';
                default:
                    return true;
            }
        }
    });

    const getFilterCount = (filter) => {
        return combinedData.filter(item => {
            if (viewMode === 'drying') {
                switch (filter) {
                    case 'request':
                        return item.transactionStatus === 'Pending' && 
                               ['To be Dry', 'In Drying'].includes(item.palayStatus);
                    case 'process':
                        return item.transactionStatus === 'Accepted' && 
                               item.palayStatus === 'In Drying';
                    case 'return':
                        return item.transactionStatus === 'Accepted' && 
                               item.palayStatus === 'Dried';
                    default:
                        return true;
                }
            } else {
                switch (filter) {
                    case 'request':
                        return item.transactionStatus === 'Pending' && 
                               ['To be Mill', 'In Milling'].includes(item.palayStatus);
                    case 'process':
                        return item.transactionStatus === 'Accepted' && 
                               item.palayStatus === 'In Milling';
                    case 'return':
                        return item.transactionStatus === 'Accepted' && 
                               item.palayStatus === 'Milled';
                    default:
                        return true;
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
                            value={filteredData}
                            scrollable
                            scrollHeight="flex"
                            scrolldirection="both"
                            className="p-datatable-sm pt-5" 
                            filters={filters}
                            globalFilterFields={[
                                'batchId',
                                'from',
                                'location',
                                'requestDate',
                                'startDate',
                                'endDate',
                                'transportedBy',
                                'status',
                                viewMode === 'drying' ? 'dryingStatus' : 'millingStatus'
                            ]}
                            emptyMessage="No data found."
                            paginator
                            rows={10}
                        >
                            {selectedFilter !== 'request' && (
                                <Column 
                                    field={viewMode === 'drying' ? "dryingId" : "millingId"} 
                                    header={viewMode === 'drying' ? "Drying Batch ID" : "Milling Batch ID"} 
                                    className="text-center" 
                                    headerClassName="text-center" 
                                />
                            )}
                            <Column field="batchId" header="Palay Batch ID" className="text-center" headerClassName="text-center" />
                            <Column field="quantityInBags" header="Quantity In Bags" className="text-center" headerClassName="text-center" />
                            <Column field="location" 
                                header={viewMode === 'drying' 
                                    ? (selectedFilter === 'request' ? 'To be Dry at' 
                                        : selectedFilter === 'process' ? 'Drying at' 
                                        : 'Dried at') 
                                    : (selectedFilter === 'request' ? 'To be Milled at' 
                                        : selectedFilter === 'process' ? 'Milling at' 
                                        : 'Milled at')}
                                className="text-center" 
                                headerClassName="text-center" 
                            />
                            <Column 
                                field={selectedFilter === 'request' ? 'requestDate' : (selectedFilter === 'process' ? 'startDate' : 'endDate')} 
                                header={selectedFilter === 'request' ? 'Request Date' : (selectedFilter === 'process' ? 'Start Date' : 'End Date')} 
                                className="text-center" 
                                headerClassName="text-center" 
                            />
                            <Column field="transportedBy" header="Transported By" className="text-center" headerClassName="text-center" />
                            {selectedFilter !== 'request' && (
                                <Column 
                                    field={viewMode === 'drying' ? "dryingStatus" : "millingStatus"} 
                                    header={viewMode === 'drying' ? "Drying Status" : "Milling Status"} 
                                    body={viewMode === 'drying' ? dryingStatusBodyTemplate : millingStatusBodyTemplate} 
                                    className="text-center" 
                                    headerClassName="text-center" 
                                    frozen 
                                    alignFrozen="right"
                                />
                            )}
                            {selectedFilter === 'request' && (
                                <Column field="transactionStatus" header="Status" className="text-center" headerClassName="text-center" />
                            )}
                            <Column 
                                header="Action" 
                                body={actionBodyTemplate} 
                                className="text-center" 
                                headerClassName="text-center" 
                                frozen 
                                alignFrozen="right"
                            />
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
                            onClick={handleConfirmReceive}
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