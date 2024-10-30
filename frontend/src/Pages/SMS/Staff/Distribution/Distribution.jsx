import React, { useState, useEffect, useRef } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Search, ShoppingCart, ThumbsUp, ThumbsDown, RotateCw } from "lucide-react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../../Authentication/Login/AuthContext';

import AcceptOrder from './AcceptOrder';
import DeclineOrder from './DeclineOrder';
import SendOrder from './SendOrder';
import DeclineDetails from './DeclineDetails';

function Distribution() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('request');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [showDeclinedDetailsDialog, setShowDeclinedDetailsDialog] = useState(false);

    const [ordersData, setOrdersData] = useState([]);
    const [recipients, setRecipients] = useState({});

    const [riceBatchData, setRiceBatchData] = useState([]);
    const [totalAvailableQuantity, setTotalAvailableQuantity] = useState(0);
   
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [declineReason, setDeclineReason] = useState('');
    const [declinedDetails, setDeclinedDetails] = useState({});

    const [sendOrderData, setSendOrderData] = useState({});
    

    const ACTION_TYPES = {
        ACCEPT: 'accept',
        DECLINE: 'decline',
        SEND: 'send',
        VIEW_DETAILS: 'view_details'
    };

    useEffect(() => {
        fetchRecipients();
        fetchRiceBatchData();
    }, [selectedFilter]);

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
            console.log(data)
        } catch (error) {
            console.error(error.message);
        }
    };

    const onUpdate = () => {
        fetchRecipients();
        if (Object.keys(recipients).length > 0) {
            fetchOrders();
        }
        fetchRiceBatchData();
    }

    const fetchRiceBatchData = async () => {
        try {
            const res = await fetch(`${apiUrl}/ricebatches`);
            if (!res.ok) {
                throw new Error('Failed to fetch rice batch data');
            }
            const data = await res.json();
            
            // Filter and sort rice batches that are for sale by creation date
            const forSaleRiceBatches = data
                .filter(batch => batch.forSale === true)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            // Store full rice batch data
            setRiceBatchData(forSaleRiceBatches);

            // Calculate total available quantity
            const totalQuantity = forSaleRiceBatches.reduce((sum, batch) => sum + batch.currentCapacity, 0);
            setTotalAvailableQuantity(totalQuantity);
        } catch (error) {
            console.log(error.message);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to fetch rice batch data', 
                life: 3000 
            });
        }
    };

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
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

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    const handleActionClick = (actionType, rowData) => {
        setSelectedOrder(rowData);
        
        switch (actionType) {
            case ACTION_TYPES.ACCEPT:
                setShowAcceptDialog(true);
                break;
            
            case ACTION_TYPES.DECLINE:
                setShowDeclineDialog(true);
                break;
            
                case ACTION_TYPES.SEND:
                    if (totalAvailableQuantity < rowData.riceQuantityBags) {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Insufficient Rice Bags',
                            detail: `Cannot send order. Available bags (${totalAvailableQuantity}) is less than required bags (${rowData.riceQuantityBags}).`,
                            life: 3000
                        });
                        return;
                    }
                    setSendOrderData({
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
                    console.log("row data: ", selectedOrder)
                    break;
            
            case ACTION_TYPES.VIEW_DETAILS:
                setDeclinedDetails({
                    orderID: rowData.id,
                    quantity: rowData.riceQuantityBags,
                    description: rowData.description,
                    orderDate: new Date(rowData.orderDate).toISOString().split('T')[0]
                });
                setShowDeclinedDetailsDialog(true);
                break;
            
            default:
                console.warn('Unknown action type:', actionType);
        }
    };

    const actionBodyTemplate = (rowData) => {
        switch (rowData.status) {
            case 'For Approval':
                return (
                    <div className="flex justify-center space-x-2">
                        <Button 
                            label="Accept"
                            className="p-button-success p-button-sm" 
                            onClick={() => handleActionClick(ACTION_TYPES.ACCEPT, rowData)} 
                        />
                        <Button 
                            label="Decline"
                            className="p-button-danger p-button-sm ring-0" 
                            onClick={() => handleActionClick(ACTION_TYPES.DECLINE, rowData)} 
                        />
                    </div>
                );
            case 'Accepted':
                return (
                    <Button 
                        label="Send"
                        className="p-button-primary p-button-sm ring-0" 
                        onClick={() => handleActionClick(ACTION_TYPES.SEND, rowData)}
                        disabled={totalAvailableQuantity < rowData.riceQuantityBags}
                        tooltip={totalAvailableQuantity < rowData.riceQuantityBags ? 
                            "Insufficient rice bags available" : undefined}
                    />
                );
            case 'Declined':
                return (
                    <Button 
                        label="View Details"
                        className="p-button-primary p-button-sm ring-0"
                        onClick={() => handleActionClick(ACTION_TYPES.VIEW_DETAILS, rowData)} 
                    />
                );
            default:
                return null;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
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

    const buttonStyle = (isSelected) => isSelected
        ? 'bg-primary text-white'
        : 'bg-white text-primary border border-gray-300';

    return (
        <StaffLayout activePage="Distribution" user={user}>
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

                    <div className="text-xl text-white p-3 rounded-lg bg-primary">
                        Total Rice Bags Available: {totalAvailableQuantity} Bags
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
                        <Column field="riceQuantityBags" header="Bags to Deliver" className="text-center" headerClassName="text-center" />
                        <Column field="orderDate" header="Date Ordered" body={(rowData) => dateBodyTemplate(rowData, 'orderDate')} className="text-center" headerClassName="text-center" />
                        <Column field="orderedBy" header="Ordered By" className="text-center" headerClassName="text-center" />
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column body={actionBodyTemplate} header="Action" className="text-center" headerClassName="text-center"/>
                    </DataTable>
                    </div>
                </div>
            </div>

            <AcceptOrder 
                visible={showAcceptDialog}
                onHide={() => setShowAcceptDialog(false)}
                selectedOrder={selectedOrder}
                onUpdate={onUpdate}
            />

            <DeclineOrder 
                visible={showDeclineDialog}
                onHide={() => setShowDeclineDialog(false)}
                onConfirm={handleConfirmDecline}
                isLoading={isLoading}
                declineReason={declineReason}
                onReasonChange={setDeclineReason}
                selectedOrder={selectedOrder}
                onUpdate={onUpdate}
            />

            <SendOrder 
                visible={showSendDialog}
                onHide={() => setShowSendDialog(false)}
                riceBatchesData={riceBatchData}  // Pass the full rice batch data
                selectedOrder={selectedOrder}
                user={user}
                toast={toast}
                onUpdate={onUpdate}
                sendOrderData={sendOrderData}
            />

            <DeclineDetails 
                visible={showDeclinedDetailsDialog}
                onHide={() => setShowDeclinedDetailsDialog(false)}
                isLoading={isLoading}
                declinedDetails={declinedDetails}
                formatDate={formatDate}
                selectedOrder={selectedOrder}
                onUpdate={onUpdate}
            />

        </StaffLayout> 
    );
}

export default Distribution;