import React, { useState, useEffect, useRef } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Search, ShoppingCart, ThumbsUp, ThumbsDown, SendHorizontal, DollarSign, RotateCw } from "lucide-react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { useAuth } from '../../Authentication/Login/AuthContext';

function Orders() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef();
    const { user } = useAuth();

    const [ordersData, setOrdersData] = useState([]);
    const [recipients, setRecipients] = useState({});
    const [riceBatches, setRiceBatches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('request');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const fetchRecipients = async () => {
        try {
            const res = await fetch(`${apiUrl}/users?userType=Rice%20Recipient`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error('failed to fetch rice recipients');
            }
            const recipientMap = data.reduce((acc, recipient) => {
                acc[recipient.id] = `${recipient.firstName} ${recipient.lastName}`;
                return acc;
            }, {});
            setRecipients(recipientMap);
        } catch (error) {
            console.error(error.message);
        }
    };
    
    const fetchOrders = async () => {
        try {
            const res = await fetch(`${apiUrl}/riceorders`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error('failed to fetch rice orders');
            }
            const ordersWithRecipients = data.map(order => ({
                ...order,
                orderedBy: recipients[order.riceRecipientId] || 'Unknown'
            }));
            setOrdersData(ordersWithRecipients);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchRiceBatches = async () => {
        try {
            const res = await fetch(`${apiUrl}/ricebatches?isFull=true`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error('failed to fetch rice batches');
            }
            const batchOptions = data.map(batch => ({
                label: `Batch ${batch.id}`,
                value: batch.id,
                warehouseId: batch.warehouseId
            }));
            setRiceBatches(batchOptions);
        } catch (error) {
            console.error('Error fetching rice batches:', error.message);
        }
    };

    useEffect(() => {
        fetchRecipients();
        fetchRiceBatches();
    }, []);

    useEffect(() => {
        if (Object.keys(recipients).length > 0) {
            fetchOrders();
        }
    }, [recipients]);

    useEffect(() => {
        const newFilters = {
            global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
        };
        setFilters(newFilters);
    }, [globalFilterValue]);

    const onUpdate = () => {
        fetchRecipients();
        if (Object.keys(recipients).length > 0) {
            fetchOrders();
        }
    }

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [showDeclinedDetailsDialog, setShowDeclinedDetailsDialog] = useState(false);
   
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [declineReason, setDeclineReason] = useState('');
    const [declinedDetails, setDeclinedDetails] = useState({});

    const [sendOrderData, setSendOrderData] = useState({});

    const handleInputChange = (e, formType) => {
        const value = e.target?.value ?? e;
        const name = e.target?.name;
    
        switch (formType) {
            case 'decline':
                setDeclineReason(prevState => ({
                    ...prevState,
                    [name]: value
                }));
                break;
            case 'request':
                setRequestOrderData(prevState => ({
                    ...prevState,
                    [name]: value
                }));
                break;
            case 'send':
                setSendOrderData(prevState => ({
                    ...prevState,
                    [name]: value
                }));
                break;
        }
    };

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'for approval': return 'warning';
            case 'accepted': return 'success';
            case 'declined': return 'danger';
            default: return 'info';
        }
    };
    
    const statusBodyTemplate = (rowData) => (
        <Tag 
            value={rowData.status} 
            severity={getSeverity(rowData.status)} 
            className="text-sm px-3 py-1 rounded-lg"
        />
    );

    const dateBodyTemplate = (rowData, field) => {
        const date = new Date(rowData[field]).toISOString().split('T')[0];

        return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
        });
    };
    
    const actionBodyTemplate = (rowData) => {
        switch (rowData.status) {
            case 'For Approval':
                return (
                    <div className="flex justify-center space-x-2">
                        <Button 
                            label="Accept"
                            className="p-button-success p-button-sm" 
                            onClick={() => handleAcceptClick(rowData)} 
                        />
                        <Button 
                            label="Decline"
                            className="p-button-danger p-button-sm ring-0" 
                            onClick={() => handleDeclineClick(rowData)} 
                        />
                    </div>
                );
            case 'Accepted':
                return (
                    <Button 
                        label="Send"
                        className="p-button-primary p-button-sm ring-0" 
                        onClick={() => handleSendClick(rowData)} 
                    />
                );
            case 'Declined':
                return (
                    <Button 
                        label="View Details"
                        className="p-button-primary p-button-sm ring-0"
                        onClick={() => handleViewDeclinedDetails(rowData)} 
                    />
                );
            default:
                return null;
        }
    };

    const handleAcceptClick = (rowData) => {
        setSelectedOrder(rowData);
        setShowAcceptDialog(true);
    };

    const handleDeclineClick = (rowData) => {
        setSelectedOrder(rowData);
        setShowDeclineDialog(true);
    };

    const handleConfirmAccept = async () => {
        setIsLoading(true);
        const order = {
            id: selectedOrder.id,
            status: 'Accepted',
            isAccepted: true
        }
        try {
            const res = await fetch(`${apiUrl}/riceorders/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });
            if (!res.ok) {
                throw new Error('failed to update rice order status')
            }
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Order accepted successfully!',
                life: 3000
            });
            onUpdate();
        } catch (error) {
            console.error(error.message);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to accept order. Please try again.',
                life: 3000
            });
        } finally {
            setShowAcceptDialog(false);
            setIsLoading(false);
        }
    };

    const handleConfirmDecline = async () => {
        if (!declineReason.trim()) {
            toast.current.show({
                severity: 'warn',
                summary: 'Required field',
                detail: 'Please enter a reason for declining',
                life: 3000
            });
            return;
        }

        setIsLoading(true);
        const order = {
            id: selectedOrder.id,
            status: 'Declined',
            remarks: declineReason
        }
        try {
            const res = await fetch(`${apiUrl}/riceorders/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });
            if (!res.ok) {
                throw new Error('failed to update rice order status')
            }
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Order declined successfully!',
                life: 3000
            });
            onUpdate();
        } catch (error) {
            console.error(error.message);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to decline order. Please try again.',
                life: 3000
            });
        } finally {
            setShowDeclineDialog(false);
            setIsLoading(false);
        }
    };

    const resetSendOrderData = () => {
        setSendOrderData({
            warehouseId: null,
            riceQuantityBags: '',
            dropOffLocation: '',
            description: '',
            transportedBy: '',
            transporterDescription: '',
            remarks: '',
            riceOrderId: null,
            riceRecipientId: null,
            riceBatchId: null
        });
    };

    const handleSendClick = (rowData) => {
        setSelectedOrder(rowData);
        setSendOrderData({
            ...sendOrderData,
            warehouseId: null,
            riceQuantityBags: rowData.riceQuantityBags,
            dropOffLocation: rowData.dropOffLocation,
            description: rowData.description || '',
            transportedBy: '',
            transporterDescription: '',
            remarks: '',
            riceOrderId: rowData.id,
            riceRecipientId: rowData.riceRecipientId
        });
        setShowSendDialog(true);
    };

    const validateForm = () => {
        const errors = [];

        if (!sendOrderData.riceBatchId) {
            errors.push('Please select a rice batch');
        }

        if (!sendOrderData.transportedBy) {
            errors.push('Please enter transporter name');
        }

        if(!sendOrderData.transporterDescription) {
            errors.push('Please enter transporter description');
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Required Field',
                    detail: error,
                    life: 3000
                });
            });
            return;
        }

        return true;
    };

    const handleConfirmSend = async () => {
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        const selectedBatch = riceBatches.find(batch => batch.value === sendOrderData.riceBatchId);
        const transactionBody = {
            item: 'Rice',
            itemId: sendOrderData.riceBatchId,
            senderId: user.id,
            fromLocationType: 'Warehouse',
            fromLocationId: selectedBatch.warehouseId,
            transporterName: sendOrderData.transportedBy,
            transporterDesc: sendOrderData.transporterDescription,
            receiverId: sendOrderData.riceRecipientId,
            toLocationType: 'Distribution',
            toLocationId: sendOrderData.riceOrderId,
            remarks: sendOrderData.remarks
        };

        const riceOrderBody = {
            id: sendOrderData.riceOrderId,
            status: 'In Transit',
            riceBatchId: sendOrderData.riceBatchId
        }

        try {
            const transactionRes = await fetch(`${apiUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionBody)
            })
            const riceOrderRes = await fetch(`${apiUrl}/riceorders/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(riceOrderBody)
            })
            if(!transactionRes.ok && !riceOrderRes.ok) {
                throw new Error('failed to send rice')
            }
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Sent rice successfully!',
                life: 3000
            });
            onUpdate();
        } catch (error) {
            console.error(error.message);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to send rice order. Please try again.',
                life: 3000
            });
        } finally {
            setShowSendDialog(false);
            resetSendOrderData();
            setIsLoading(false);
        }
    };

    const handleCloseSendDialog = () => {
        resetSendOrderData();
        setShowSendDialog(false);
    };

    const handleViewDeclinedDetails = (rowData) => {
        setDeclinedDetails({
            orderID: rowData.id,
            quantity: rowData.riceQuantityBags, // You can modify this based on your actual data
            description: rowData.description, // You can modify this based on your actual data
            orderDate: new Date(rowData.orderDate).toISOString().split('T')[0]
        });
        setShowDeclinedDetailsDialog(true);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    const filteredData = ordersData.filter(item => {
        switch(selectedFilter) {
            case 'request':
                return item.status === 'For Approval';
            case 'accepted':
                return item.status === 'Accepted';
            case 'declined':
                return item.status === 'Declined';
            default:
                return true;
        }
    });

    const getFilterCount = (filter) => {
        switch (filter) {
            case 'request':
                return ordersData.filter(item => ['For Request', 'Requested'].includes(item.status)).length;
            case 'toSend':
                return ordersData.filter(item => item.status === 'To Send').length;
            default:
                return 0;
        }
    };

    const handleCancelDecline = () => {
        setShowDeclineDialog(false);
        setDeclineReason('');
    }

    const buttonStyle = (isSelected) => isSelected
        ? 'bg-primary text-white'
        : 'bg-white text-primary border border-gray-300';

    return (
        <StaffLayout activePage="Orders" user={user}>
            <Toast ref={toast} />
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl h-full text-white font-bold mb-2">Manage Orders</h1>
                    <span className="p-input-icon-left w-1/2 mr-4">
                        <Search className="text-primary ml-2 -translate-y-1"/>
                        <InputText 
                            type="search"
                            value={globalFilterValue} 
                            onChange={onGlobalFilterChange} 
                            placeholder="Tap to Search" 
                            className="w-full pl-10 pr-4 py-2 rounded-full text-primary border border-gray-300 ring-0 placeholder:text-primary"
                        />
                    </span>
                </div>

                {/* Buttons & Search bar */}
                <div className="flex items-center space-x-2 justify-between mb-2 py-2">
                    <div className="flex space-x-2 items-center w-1/2 drop-shadow-md">
                        <Button 
                            icon={<ShoppingCart size={16} className="mr-2" />} 
                            label="Request" 
                            className={`p-button-success p-2 w-1/16 ring-0 rounded-full ${buttonStyle(selectedFilter === 'request')}`} 
                            onClick={() => handleFilterChange('request')}
                        />
                        <Button 
                            icon={<ThumbsUp size={16} className="mr-2" />}
                            label="Accepted" 
                            className={`p-button-success p-2 w-1/16 ring-0 rounded-full ${buttonStyle(selectedFilter === 'accepted')}`} 
                            onClick={() => handleFilterChange('accepted')}
                        />
                        <Button 
                            icon={<ThumbsDown size={16} className="mr-2" />}
                            label="Declined" 
                            className={`p-button-success p-2 w-1/16 ring-0 rounded-full ${buttonStyle(selectedFilter === 'declined')}`} 
                            onClick={() => handleFilterChange('declined')}
                        />

                        <RotateCw 
                            className="w-6 h-6 text-primary cursor-pointer hover:text-secondary transition-colors" 
                            onClick={onUpdate}
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
                        scrolldirection="both"
                        className="p-datatable-sm pt-5" 
                        filters={filters}
                        globalFilterFields={['id', 'status']}
                        emptyMessage="No orders found."
                        paginator
                        rows={10}
                    > 
                        <Column field="id" header="Order ID" className="text-center" headerClassName="text-center" />
                        <Column field="dropOffLocation" header="To Be Deliver At" className="text-center" headerClassName="text-center" />
                        <Column field="orderDate" header="Date Ordered" body={(rowData) => dateBodyTemplate(rowData, 'orderDate')} className="text-center" headerClassName="text-center" />
                        <Column field="orderedBy" header="Ordered By" className="text-center" headerClassName="text-center" />
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column body={actionBodyTemplate} header="Action" className="text-center" headerClassName="text-center"/>
                    </DataTable>
                    </div>
                </div>
            </div>

            {/* Accept Order Dialog */}
            <Dialog
                header="Accept Order"
                visible={showAcceptDialog}
                className='w-1/3'
                onHide={isLoading ? null : () => setShowAcceptDialog(false)}
            >
                <div className="flex flex-col items-center">
                    <p className="mb-10">Are you sure you want to receive this request?</p>
                    <div className="flex justify-between w-full gap-4">
                        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAcceptDialog(false)} className="w-1/2 bg-transparent text-primary border-primary" disabled={isLoading}/>
                        <Button label="Confirm Accept" icon="pi pi-check" onClick={handleConfirmAccept} className="w-1/2 bg-primary hover:border-none" disabled={isLoading}/>
                    </div>
                </div>
            </Dialog>

            {/* Decline Order Dialog */}
            <Dialog
                header="Decline Order"
                visible={showDeclineDialog}
                className='w-1/3'
                onHide={isLoading ? null : handleCancelDecline}
            >
                <div className="flex flex-col items-center gap-5">
                    <p className="">Are you sure you want to decline this request?</p>
                    <div className="w-full ">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                            Reason <span className="text-red-500">*</span></label>
                        <InputTextarea 
                            id="reason"
                            name="reason"
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="w-full ring-0" 
                        />
                    </div>
                    <div className="flex justify-between w-full gap-4">
                        <Button label="Cancel" icon="pi pi-times" onClick={handleCancelDecline} className="w-1/2 bg-transparent text-primary border-primary" disabled={isLoading}/>
                        <Button label="Confirm Decline" icon="pi pi-check" onClick={handleConfirmDecline} className="w-1/2 bg-primary hover:border-none" disabled={isLoading}/>
                    </div>
                </div>
            </Dialog>

            {/* Send Order Dialog */}
            <Dialog
                header="Send Rice"
                visible={showSendDialog}
                className='w-1/3'
                onHide={isLoading ? null : handleCloseSendDialog}
            >
                <div className="flex flex-col gap-2 h-full">
                    <div className="w-full">
                        <label htmlFor="riceBatchId" className="block text-sm font-medium text-gray-700 mb-1">Rice Batch</label>
                        <Dropdown
                            id="riceBatchId"
                            name="riceBatchId"
                            value={sendOrderData.riceBatchId}
                            options={riceBatches}
                            onChange={(e) => handleInputChange(e, 'send')}
                            placeholder="Select Rice Batch"
                            className="ring-0 w-full placeholder:text-gray-400"
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="quantityInBags" className="block text-sm font-medium text-gray-700 mb-1">Quantity in Bags</label>
                        <InputText
                            id="quantityInBags"
                            value={sendOrderData.riceQuantityBags}
                            disabled
                            className='w-full focus:ring-0 bg-gray-50'
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location</label>
                        <InputText
                            id="location"
                            value={sendOrderData.dropOffLocation}
                            disabled
                            className='w-full focus:ring-0 bg-gray-50'
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Order Description</label>
                        <InputTextarea
                            id="description"
                            value={sendOrderData.description}
                            disabled
                            className="w-full ring-0 bg-gray-50"
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="transportedBy" className="block text-sm font-medium text-gray-700 mb-1">
                            Transported By <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            id="transportedBy"
                            name="transportedBy"
                            value={sendOrderData.transportedBy}
                            onChange={(e) => handleInputChange(e, 'send')}
                            placeholder="Enter transporter name"
                            className='w-full focus:ring-0'
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="transporterDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Transporter Description <span className="text-red-500">*</span></label>
                        <InputTextarea
                            id="transporterDescription"
                            name="transporterDescription"
                            value={sendOrderData.transporterDescription}
                            onChange={(e) => handleInputChange(e, 'send')}
                            placeholder="Enter transporter description"
                            className="w-full ring-0"
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                        <InputTextarea
                            id="remarks"
                            name="remarks"
                            value={sendOrderData.remarks}
                            onChange={(e) => handleInputChange(e, 'send')}
                            placeholder="Enter remarks"
                            className="w-full ring-0"
                        />
                    </div>

                    <div className="flex justify-between w-full gap-4 mt-5">
                        <Button label="Cancel" icon="pi pi-times" onClick={handleCloseSendDialog} className="w-1/2 bg-transparent text-primary border-primary" disabled={isLoading}/>
                        <Button label="Send Rice" icon="pi pi-check" onClick={handleConfirmSend} className="w-1/2 bg-primary hover:border-none" disabled={isLoading}/>
                    </div>

                </div>
            </Dialog>

            {/* Decline Details Dialog */}
            <Dialog
                header="Declined Order Details"
                visible={showDeclinedDetailsDialog}
                className='w-1/3'
                onHide={() => setShowDeclinedDetailsDialog(false)}
            >
                <div className="flex flex-col gap-4">
                    <div className="field">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                        <InputText
                            value={declinedDetails.orderID}
                            disabled
                            className="w-full bg-gray-50"
                        />
                    </div>
                    
                    <div className="field">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Bags</label>
                        <InputText
                            value={declinedDetails.quantity}
                            disabled
                            className="w-full bg-gray-50"
                        />
                    </div>

                    <div className="field">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <InputTextarea
                            value={declinedDetails.description}
                            disabled
                            className="w-full bg-gray-50"
                            rows={3}
                        />
                    </div>

                    <div className="field">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Ordered</label>
                        <InputText
                            value={formatDate(declinedDetails.orderDate)}
                            disabled
                            className="w-full bg-gray-50"
                        />
                    </div>

                    <div className="flex justify-center w-full gap-4 mt-5">
                        <Button label="Close" icon="pi pi-times" onClick={() => setShowDeclinedDetailsDialog(false)} className="w-1/2 bg-transparent text-primary border-primary" />
                    </div>
                </div>
            </Dialog>

        </StaffLayout> 
    );
}

export default Orders;