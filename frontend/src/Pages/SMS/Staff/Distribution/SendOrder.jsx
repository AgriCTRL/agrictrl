import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

const SendOrder = ({ visible, onHide, riceBatchesData, selectedOrder, user, onUpdate }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const [selectedBatches, setSelectedBatches] = useState([]);
    const [batchQuantities, setBatchQuantities] = useState([]);

    useEffect(() => {
        if (selectedOrder && riceBatchesData.length > 0) {
            const requiredQuantity = selectedOrder.riceQuantityBags;
            const batches = [];
            const quantities = [];
            let remainingQuantity = requiredQuantity;

            for (const batch of riceBatchesData) {
                if (remainingQuantity <= 0) break;

                const quantityFromBatch = Math.min(batch.currentCapacity, remainingQuantity);
                if (quantityFromBatch > 0) {
                    batches.push(batch);
                    quantities.push(quantityFromBatch);
                    remainingQuantity -= quantityFromBatch;
                }
            }

            setSelectedBatches(batches);
            setBatchQuantities(quantities);

            // Update sendOrderData with the first batch
            if (batches.length > 0) {
                setSendOrderData(prev => ({
                    ...prev,
                    riceBatchId: batches[0].id
                }));
            }
        }
    }, [selectedOrder, riceBatchesData]);
    
    const [sendOrderData, setSendOrderData] = useState({
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

    const renderBatchesInfo = () => {
        return selectedBatches.map((batch, index) => (
            <div key={batch.id} className="mb-2 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">{batch.name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Batch ID: {batch.id}</div>
                    <div>Quantity to Sell: {batchQuantities[index]} bags</div>
                    <div>Warehouse ID: {batch.warehouseId}</div>
                    <div>Available Bags: {batch.currentCapacity} bags</div>
                </div>
            </div>
        ));
    };

    const handleInputChange = (e) => {
        const value = e.target?.value ?? e;
        const name = e.target?.name;
        
        setSendOrderData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleConfirmSend = async () => {
        if (!validateForm()) return;
        setIsLoading(true);
    
        try {
            const warehousesResponse = await fetch(`${apiUrl}/warehouses`);
            if (!warehousesResponse.ok) {
                throw new Error('Failed to fetch warehouses');
            }
            const warehouses = await warehousesResponse.json();
            // console.log('Selected Order:', selectedOrder);
            // console.log('Selected Batches:', selectedBatches);
            // console.log('Batch Quantities:', batchQuantities);
    
            if (!selectedBatches.length) {
                throw new Error('No rice batches selected');
            }
            if (!selectedOrder) {
                throw new Error('No order selected');
            }
            if (!user || !user.id) {
                throw new Error('User information is missing');
            }
    
            // Create a single transaction body for the entire order
            const transactionBody = {
                item: 'Rice',
                riceBatchId: selectedBatches[0].id,
                senderId: user.id,
                sendDateTime: new Date().toISOString(),
                fromLocationType: 'Warehouse',
                fromLocationId: selectedBatches[0].warehouseId,
                transporterName: sendOrderData.transportedBy,
                transporterDesc: sendOrderData.transporterDescription,
                receiverId: selectedOrder.riceRecipientId,
                receiveDateTime: '0',
                toLocationType: 'Distribution',
                toLocationId: selectedOrder.riceRecipientId,
                status: 'Pending',
                remarks: `Sending ${selectedBatches.length} batches: ${sendOrderData.remarks || ''}`
            };    

            // Log transaction body
            // console.log('Transaction Body:', transactionBody);
    
            const promises = [
                // Send the single transaction creation request
                fetch(`${apiUrl}/transactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(transactionBody)
                })
            ];
    
            // Create update requests for each batch
            selectedBatches.forEach((batch, index) => {
                // Find the warehouse for this batch
                const warehouse = warehouses.find(w => w.id === batch.warehouseId);
                if (!warehouse) {
                    throw new Error(`Warehouse not found for batch ${batch.id}`);
                }

                // Update warehouse stock
                const warehouseBody = {
                    id: batch.warehouseId,
                    currentStock: warehouse.currentStock - batchQuantities[index]
                };

                promises.push(
                    fetch(`${apiUrl}/warehouses/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(warehouseBody)
                    })
                );

                const riceBatchBody = {
                    currentCapacity: batch.currentCapacity - batchQuantities[index]
                };
    
                // Log each rice batch update
                // console.log(`Rice Batch Update Body for Batch ${index + 1}:`, riceBatchBody);
    
                promises.push(
                    fetch(`${apiUrl}/ricebatches/update?id=${batch.id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(riceBatchBody)
                    })
                );
            });
    
            // Update rice order status
            const riceOrderBody = {
                id: selectedOrder.id,
                status: 'In Transit',
                riceBatchId: selectedBatches.map(b => b.id).join(',')
            };
    
            // console.log('Rice Order Update Body:', riceOrderBody);
    
            promises.push(
                fetch(`${apiUrl}/riceorders/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(riceOrderBody)
                })
            );

            // Wait for all requests to complete
            const results = await Promise.all(promises);

            const failedRequests = results.filter(response => !response.ok);
            if (failedRequests.length > 0) {
                throw new Error('One or more requests failed');
            }

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Rice order sent successfully!',
                life: 3000
            });
    
            onUpdate();
            handleClose();
        } catch (error) {
            console.error('Error in handleConfirmSend:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to process rice order: ${error.message}`,
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClose = () => {
        resetSendOrderData();
        onHide();
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

    const validateForm = () => {
        const errors = [];
    
        if (!sendOrderData.riceBatchId) {
            errors.push('Please select a rice batch');
        }
    
        if (!sendOrderData.transportedBy) {
            errors.push('Please enter transporter name');
        }
    
        if (!sendOrderData.transporterDescription) {
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
            return false;
        }
    
        return true;
    };

    // Set initial data when selectedOrder changes
    React.useEffect(() => {
        if (selectedOrder) {
            setSendOrderData(prev => ({
                ...prev,
                riceQuantityBags: selectedOrder.riceQuantityBags,
                dropOffLocation: selectedOrder.dropOffLocation,
                description: selectedOrder.description || '',
                riceOrderId: selectedOrder.id,
                riceRecipientId: selectedOrder.riceRecipientId
            }));
        }
    }, [selectedOrder]);

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header="Send Rice"
                visible={visible}
                className="w-1/3"
                onHide={isLoading ? null : handleClose}
            >
                <div className="flex flex-col gap-2 h-full">
                    <div className="">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selected Rice Batches</label>
                        {renderBatchesInfo()}
                    </div>

                    <div className="w-full">
                        <label htmlFor="quantityInBags" className="block text-sm font-medium text-gray-700 mb-1">
                            Total Quantity to Send
                        </label>
                        <InputText
                            id="quantityInBags"
                            value={selectedOrder?.riceQuantityBags || ''}
                            disabled
                            className="w-full focus:ring-0 bg-gray-50"
                            keyfilter="num"
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location</label>
                        <InputText
                            id="location"
                            value={sendOrderData.dropOffLocation}
                            disabled
                            className="w-full focus:ring-0 bg-gray-50"
                            maxLength={50}
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Order Description</label>
                        <InputTextarea
                            id="description"
                            value={sendOrderData.description}
                            disabled
                            className="w-full ring-0 bg-gray-50"
                            maxLength={250}
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
                            onChange={handleInputChange}
                            placeholder="Enter transporter name"
                            className="w-full focus:ring-0"
                            maxLength={50}
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="transporterDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Transporter Description <span className="text-red-500">*</span>
                        </label>
                        <InputTextarea
                            id="transporterDescription"
                            name="transporterDescription"
                            value={sendOrderData.transporterDescription}
                            onChange={handleInputChange}
                            placeholder="Enter transporter description"
                            className="w-full ring-0"
                            maxLength={250}
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                        <InputTextarea
                            id="remarks"
                            name="remarks"
                            value={sendOrderData.remarks}
                            onChange={handleInputChange}
                            placeholder="Enter remarks"
                            className="w-full ring-0"
                            maxLength={250}
                        />
                    </div>

                    <div className="flex justify-between w-full gap-4 mt-5">
                        <Button 
                            label="Cancel" 
                            icon="pi pi-times" 
                            onClick={handleClose} 
                            className="w-1/2 bg-transparent text-primary border-primary" 
                            disabled={isLoading}
                        />
                        <Button 
                            label="Send Rice" 
                            icon="pi pi-check" 
                            onClick={handleConfirmSend} 
                            className="w-1/2 bg-primary hover:border-none" 
                            disabled={isLoading} 
                            loading={isLoading}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default SendOrder;