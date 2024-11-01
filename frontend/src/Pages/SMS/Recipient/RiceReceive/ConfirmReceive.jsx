import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { Wheat, CheckCircle } from 'lucide-react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

function ConfirmReceive({ visible, onHide, data, user, onConfirmReceive }) {
    const [formData, setFormData] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            setFormData({
                riceType: 'NFA Rice',
                orderId: data.id,
                quantity: data.riceQuantityBags,
                date: new Date(data.orderDate).toISOString().split('T')[0],
                price: data.totalCost,
                dropOffLocation: data.dropOffLocation,
                description: data.description
            });
        }
    }, [visible, data]);

    const handleSubmit = () => {
        setShowConfirmation(true);
    };

    const handleClose = () => {
        setShowConfirmation(false);
        onHide();
    };

    const confirmReceive = async () => {
        const riceOrderBody = {
            id: data.id,
            status: 'Received'
        };
    
        setIsLoading(true);
    
        try {
            const getTransactionRes = await fetch(`${apiUrl}/transactions?toLocationId=${user.id}&toLocationType=Distribution&status=Pending`);
    
            // Check if the response is ok
            if (!getTransactionRes.ok) {
                const errorData = await getTransactionRes.json();
                console.error('Error fetching transactions:', errorData);
                throw new Error('Failed to fetch transactions');
            }
            
            const transactionData = await getTransactionRes.json();
            console.log('Transaction Data:', transactionData);
            
            // Check if transactionData is an array
            if (!Array.isArray(transactionData) || transactionData.length === 0) {
                throw new Error('No transactions found');
            }

            // Sort transactions by sendDateTime
            const sortedTransactions = transactionData.sort((a, b) => {
                return new Date(a.sendDateTime) - new Date(b.sendDateTime);
            });

            // Get the oldest transaction
            const oldestTransaction = sortedTransactions[0];
            
            if (!oldestTransaction || !oldestTransaction.id) {
                throw new Error('Oldest transaction ID is undefined');
            }

            const transactionId = oldestTransaction.id;
            console.log('Oldest Transaction ID:', transactionId);
    
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 8);
    
            const transactionBody = {
                id: transactionId,
                status: 'Received',
                receiveDateTime: currentDate.toISOString()
            };

            console.log(transactionBody);
    
            const transactionRes = await fetch(`${apiUrl}/transactions/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionBody)
            });
    
            const riceOrderRes = await fetch(`${apiUrl}/riceorders/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(riceOrderBody)
            });
    
            if (!riceOrderRes.ok && !transactionRes.ok && !getTransactionRes.ok) {
                throw new Error('Failed to update rice order status');
            }
    
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Received rice successfully!',
                life: 3000
            });
            onConfirmReceive();
        } catch (error) {
            console.error(error.message);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed, Please try again.',
                life: 3000
            });
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
            onHide();
        }
    };

    const customDialogHeader = (
        <div className="flex items-center space-x-2">
            <Wheat size={22} className="text-black" />
            <h3 className="text-md font-bold text-black">Rice Order</h3>
        </div>
    );

    const customDialogHeader2 = (
        <div className="flex items-center space-x-2">
            <Wheat size={22} className="text-black" />
            <h3 className="text-base font-bold text-black">Receive Rice</h3>
        </div>
    );

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog 
                visible={visible} 
                onHide={onHide} 
                header={customDialogHeader} 
                modal 
                style={{ minWidth: '60vw', maxWidth: '60vw' }}
                footer={
                    <div className="flex justify-between">
                        <Button 
                            label="Cancel" 
                            onClick={handleClose} 
                            className="py-2 px-14 bg-primary"
                        />
                        <Button 
                            label="Receive Rice" 
                            onClick={handleSubmit} 
                            className="py-2 px-14 bg-primary"
                        />
                    </div>
                }
            >
                <div className="flex flex-col h-full gap-3">
                    <div className="flex gap-4 w-full">
                        <div className="w-1/2">
                            <label htmlFor="riceType" className="block text-sm font-medium text-gray-700 mb-1">Rice Type</label>
                            <InputText
                                id="riceType"
                                name="riceType"
                                value={formData.riceType}
                                disabled
                                className='w-full focus:ring-0'
                                keyfilter="alphanum"
                                maxLength={50}
                            />
                        </div>

                        <div className="w-1/2">
                            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                            <InputText
                                id="orderId"
                                name="orderId"
                                value={formData.orderId}
                                disabled
                                className='w-full focus:ring-0'
                                keyfilter="alphanum"
                                maxLength={25}
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity in Bags</label>
                        <InputText
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            disabled
                            className='w-full focus:ring-0'
                            keyfilter="int"
                        />
                    </div>



                    <div className="w-full flex mb-1 space-x-2">
                        <div className="w-1/2">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date Ordered</label>
                            <InputText
                                id="date"
                                name="date"
                                value={formatDate(formData.date)}
                                disabled
                                className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                                maxLength={25}
                            />
                        </div>

                        <div className="w-1/2">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <InputText
                                id="price"
                                name="price"
                                disabled
                                value={formData.price}
                                className='w-full focus:ring-0'
                                keyfilter="int"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label htmlFor="dropOffLocation" className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location</label>
                        <InputText
                            id="dropOffLocation"
                            name="dropOffLocation"
                            value={formData.dropOffLocation}
                            disabled
                            className="w-full"
                            maxLength={100}
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <InputTextarea
                            id="description"
                            name="description"
                            value={formData.description}
                            disabled
                            className="w-full"
                            maxLength={250}
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog
                visible={showConfirmation}
                onHide={isLoading ? null : () => setShowConfirmation(false)}
                header={customDialogHeader2}
                modal
                footer={
                    <div className="flex justify-center">
                        <Button 
                            label="Confirm Receive" 
                            onClick={confirmReceive} 
                            className="py-2 px-4 bg-green-500 text-white"
                            disabled={isLoading}
                        />
                    </div>
                }
            >
                <div className="flex flex-col justify-center items-center gap-4">
                    <CheckCircle size={32} className="text-primary"/>
                    <p>Are you sure you want to receive this Rice?</p>
                </div>
                
            </Dialog>
        </>
    );
}

export default ConfirmReceive;
