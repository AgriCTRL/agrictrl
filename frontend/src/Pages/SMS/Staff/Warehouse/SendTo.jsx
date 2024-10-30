import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

const initialNewTransactionData = {
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

const SendTo = ({ visible, onHide, selectedItem, onSendSuccess, user, dryerData, millerData, refreshData }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [newTransactionData, setNewTransactionData] = useState(initialNewTransactionData);

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

    const handleSendTo = async () => {
        if (!validateForm()) {
            return;
        }
    
        setIsLoading(true);
        try {
            // Create new transaction first
            const toLocationType = selectedItem.palayStatus === 'To be Dry' ? 'Dryer' :  selectedItem.palayStatus === 'To be Mill' ? 'Miller' : '';
            const transactionResponse = await fetch(`${apiUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...newTransactionData,
                    item: selectedItem.item,
                    itemId: selectedItem.id,
                    senderId: user.id,
                    fromLocationType: 'Warehouse',
                    fromLocationId: selectedItem.toLocationId,
                    receiverId: 0,
                    receiveDateTime: '0',
                    toLocationType: toLocationType,
                    status: 'Pending'
                })
            });
    
            if (!transactionResponse.ok) {
                throw new Error('Failed to create transaction');
            }
    
            const transactionResult = await transactionResponse.json();
            
            // Update palay batch with new status
            const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedItem.id,
                    currentlyAt: newTransactionData.toLocationName
                })
            });

            if (!palayResponse.ok) {
                throw new Error('Failed to update palay batch');
            }

            //update old transaction to status = completed
            const oldTransactionResponse = await fetch(`${apiUrl}/transactions/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedItem.transactionId,
                    status: 'Completed'
                })
            });

            if (!oldTransactionResponse.ok) {
                throw new Error('Failed to update Old transaction');
            }
    
            onSendSuccess();
            onHide();
            setNewTransactionData(initialNewTransactionData);
    
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Palay batch status updated successfully',
                life: 3000
            });
            refreshData();
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to complete the process',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog 
                header="Send To" 
                visible={visible} 
                onHide={isLoading ? null : onHide} 
                className="w-1/3"
            >
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
                                    setErrors(prev => ({...prev, toLocationId: ''}));
                                }
                            }}
                            placeholder="Select a facility"
                            className={`w-full ${errors.toLocationId ? 'p-invalid' : ''}`}
                        />
                        {errors.toLocationId && <p className="text-red-500 text-xs mt-1">{errors.toLocationId}</p>}
                    </div>

                    <div className="w-full mb-4">
                        <label htmlFor="transportedBy" className="block text-sm font-medium text-gray-700 mb-1">
                            Transported by
                        </label>
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
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Transport Description
                        </label>
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
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks
                        </label>
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
                        <Button 
                            label="Cancel" 
                            className="w-1/2 bg-transparent text-primary border-primary" 
                            onClick={onHide} 
                            disabled={isLoading} 
                        />
                        <Button 
                            label="Send Request" 
                            className="w-1/2 bg-primary hover:border-none" 
                            onClick={handleSendTo} 
                            disabled={isLoading}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default SendTo;