import React, { useState, useEffect } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Search, ShoppingCart, ThumbsUp, ThumbsDown, SendHorizontal, DollarSign } from "lucide-react";

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

function Orders() {
    const [ordersData, setOrdersData] = useState([
        { id: 1, orderID: '001', toBeDeliverAt: 'Rizal', orderDate: '2/11/12', orderedBy: 'Mark Johanes', status: 'For Approval' },
        { id: 2, orderID: '002', toBeDeliverAt: 'Cubao', orderDate: '7/11/19', orderedBy: 'Athena Don', status: 'For Approval' },
        { id: 3, orderID: '003', toBeDeliverAt: 'Pasig', orderDate: '4/21/12', orderedBy: 'Mark Josh', status: 'For Approval' },
        { id: 4, orderID: '004', toBeDeliverAt: 'Balintawak', orderDate: '10/28/12', orderedBy: 'Pordi Hums', status: 'For Approval' },
        { id: 5, orderID: '005', toBeDeliverAt: 'Sta. Mesa', orderDate: '12/10/13', orderedBy: 'Ravel Finch', status: 'For Approval' },
        { id: 6, orderID: '006', toBeDeliverAt: 'Ananas', orderDate: '12/10/13', orderedBy: 'Edward Newgate', status: 'For Approval' },
        { id: 7, orderID: '007', toBeDeliverAt: 'Rizal', orderDate: '2/11/12', orderedBy: 'Mark Johanes', status: 'Accepted' },
        { id: 8, orderID: '008', toBeDeliverAt: 'Cubao', orderDate: '7/11/19', orderedBy: 'Athena Don', status: 'Accepted' },
        { id: 9, orderID: '009', toBeDeliverAt: 'Pasig', orderDate: '4/21/12', orderedBy: 'Mark Josh', status: 'Accepted' },
        { id: 10, orderID: '010', toBeDeliverAt: 'Balintawak', orderDate: '10/28/12', orderedBy: 'Pordi Hums', status: 'Declined' },
        { id: 11, orderID: '011', toBeDeliverAt: 'Sta. Mesa', orderDate: '12/10/13', orderedBy: 'Ravel Finch', status: 'Declined' },
        { id: 12, orderID: '012', toBeDeliverAt: 'Ananas', orderDate: '12/10/13', orderedBy: 'Edward Newgate', status: 'Declined' },
        { id: 13, orderID: '013', toBeDeliverAt: 'Makati', orderDate: '1/15/14', orderedBy: 'John Doe', status: 'Accepted' },
        { id: 14, orderID: '014', toBeDeliverAt: 'Taguig', orderDate: '2/20/14', orderedBy: 'Jane Smith', status: 'Accepted' },
        { id: 15, orderID: '015', toBeDeliverAt: 'Quezon City', orderDate: '3/25/14', orderedBy: 'Bob Johnson', status: 'Accepted' },
    ]);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [selectedFilter, setSelectedFilter] = useState('request');

    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [showDeclinedDetailsDialog, setShowDeclinedDetailsDialog] = useState(false);
   
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [declineReason, setDeclineReason] = useState('');
    const [declinedDetails, setDeclinedDetails] = useState({
        orderID: '',
        quantity: '',
        description: '',
        orderDate: '',
    });

    const [sendOrderData, setSendOrderData] = useState({
        riceBatchId: '',
        date: '',
        quantityInBags: '',
        location: '',
        transpo: '',
        orderDescription: '',
        remarks: '',
    });

    useEffect(() => {
        const today = new Date();
        setSendOrderData((prevFormData) => ({
            ...prevFormData,
            date: today
        }));
    }, []);

    const handleInputChange = (e, formType) => {
        const value = e.target?.value ?? e;
        const name = e.target?.name ?? 'date';
    
        switch (formType) {
            case 'decline':
                setDeclineOrderData(prevState => ({
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

    const handleConfirmAccept = () => {
        const updatedOrders = ordersData.map(order => {
            if (order.id === selectedOrder.id) {
                return { ...order, status: 'Accepted' };
            }
            return order;
        });
        setOrdersData(updatedOrders);
        setShowAcceptDialog(false);
    };

    const handleConfirmDecline = () => {
        const updatedOrders = ordersData.map(order => {
            if (order.id === selectedOrder.id) {
                return { ...order, status: 'Declined' };
            }
            return order;
        });
        setOrdersData(updatedOrders);
        setShowDeclineDialog(false);
        setDeclineReason('');
        setDeclineOrderData({
            riceType: '',
            quantity: '',
            description: '',
            date: '',
            price: ''
        });
    };

    const handleSendClick = (rowData) => {
        setSelectedOrder(rowData);
        setShowSendDialog(true);
    };

    const handleConfirmSend = () => {
        const updatedOrders = ordersData.map(order => {
            if (order.id === selectedOrder.id) {
                return { ...order, status: 'Sent' };
            }
            return order;
        });
        setOrdersData(updatedOrders);
        setShowSendDialog(false);
        setSendOrderData({
            riceType: '',
            quantity: '',
            description: '',
            date: '',
            price: ''
        });
    };

    const handleViewDeclinedDetails = (rowData) => {
        setDeclinedDetails({
            orderID: rowData.orderID,
            quantity: '1000 kg', // You can modify this based on your actual data
            description: 'Insufficient Stock', // You can modify this based on your actual data
            orderDate: rowData.orderDate,
        });
        setShowDeclinedDetailsDialog(true);
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

    const buttonStyle = (isSelected) => isSelected
        ? 'bg-primary text-white'
        : 'bg-white text-primary border border-gray-300';

    return (
        <StaffLayout activePage="Orders">
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl h-full text-white font-bold mb-2">Manage Orders</h1>
                    <span className="p-input-icon-left w-1/2 mr-4">
                        <Search className="text-primary ml-2 -translate-y-1"/>
                        <InputText 
                            type="search"
                            value={globalFilterValue} 
                            onChange={(e) => setGlobalFilterValue(e.target.value)} 
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
                        globalFilterFields={['orderID', 'toBeDeliverAt', 'orderDate', 'orderedBy', 'status']}
                        emptyMessage="No orders found."
                        paginator
                        rows={10}
                    > 
                        <Column field="orderID" header="Order ID" className="text-center" headerClassName="text-center" />
                        <Column field="toBeDeliverAt" header="To Be Deliver At" className="text-center" headerClassName="text-center" />
                        <Column field="orderDate" header="Order Date" className="text-center" headerClassName="text-center" />
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
                onHide={() => setShowAcceptDialog(false)}
            >
                <div className="flex flex-col items-center">
                    <p className="mb-10">Are you sure you want to receive this request?</p>
                    <div className="flex justify-between w-full gap-4">
                        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAcceptDialog(false)} className="w-1/2 bg-transparent text-primary border-primary" />
                        <Button label="Confirm Accept" icon="pi pi-check" onClick={handleConfirmAccept} className="w-1/2 bg-primary hover:border-none" />
                    </div>
                </div>
            </Dialog>

            {/* Decline Order Dialog */}
            <Dialog
                header="Decline Order"
                visible={showDeclineDialog}
                className='w-1/3'
                onHide={() => setShowDeclineDialog(false)}
            >
                <div className="flex flex-col items-center gap-5">
                    <p className="">Are you sure you want to decline this request?</p>
                    <div className="w-full ">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <InputTextarea 
                            id="reason"
                            name="reason"
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="w-full ring-0" 
                        />
                    </div>
                    <div className="flex justify-between w-full gap-4">
                        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowDeclineDialog(false)} className="w-1/2 bg-transparent text-primary border-primary" />
                        <Button label="Confirm Decline" icon="pi pi-check" onClick={handleConfirmDecline} className="w-1/2 bg-primary hover:border-none" />
                    </div>
                </div>
            </Dialog>

            {/* Send Order Dialog */}
            <Dialog
                header="Send Rice"
                visible={showSendDialog}
                className='w-1/3'
                onHide={() => setShowSendDialog(false)}
            >
                <div className="flex flex-col gap-2 h-full">
                    <div className="w-full">
                        <label className="block mb-2">Date Sent</label>
                        <Calendar 
                            name="dateProcessed"
                            value={sendOrderData.date}
                            className="w-full"
                            disabled
                            readOnlyInput
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="riceBatchId" className="block text-sm font-medium text-gray-700 mb-1">Rice Batch</label>
                        <Dropdown
                            id="riceBatchId"
                            name="riceBatchId"
                            value={sendOrderData.riceBatchId}
                            options={[{ label: 'Batch 001', value: 'batch1' }, { label: 'Batch 002', value: 'batch2' }, { label: 'Batch 003', value: 'batch3' }]}
                            onChange={(e) => handleInputChange(e, 'send')}
                            placeholder="Select Rice Batch"
                            className="ring-0 w-full placeholder:text-gray-400"
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="quantityInBags" className="block text-sm font-medium text-gray-700 mb-1">Quantity in Bags</label>
                        <InputText
                            id="quantityInBags"
                            name="quantityInBags"
                            value={sendOrderData.quantityInBags}
                            onChange={(e) => handleInputChange(e, 'send')}
                            placeholder="Enter quantity"
                            className='w-full focus:ring-0'
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location</label>
                        <InputText
                            id="location"
                            name="location"
                            value={sendOrderData.location}
                            onChange={(e) => handleInputChange(e, 'send')}
                            placeholder="Enter location"
                            className='w-full focus:ring-0'
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Transported by</label>
                        <InputText
                            id="transpo"
                            name="transpo"
                            value={sendOrderData.transpo}
                            onChange={(e) => handleInputChange(e, 'send')}
                            placeholder="Enter Transportation"
                            className='w-full focus:ring-0'
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Order Description</label>
                        <InputTextarea
                            id="description"
                            name="description"
                            value={sendOrderData.description}
                            onChange={(e) => handleInputChange(e, 'send')}
                            placeholder="Enter description"
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
                        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowSendDialog(false)} className="w-1/2 bg-transparent text-primary border-primary" />
                        <Button label="Send Rice" icon="pi pi-check" onClick={handleConfirmSend} className="w-1/2 bg-primary hover:border-none" />
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                        <InputText
                            value={declinedDetails.orderDate}
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