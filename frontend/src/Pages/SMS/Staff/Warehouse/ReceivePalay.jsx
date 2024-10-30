import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { CheckCircle } from "lucide-react";

const ReceivePalay = ({ visible, onHide, selectedItem, onAcceptSuccess, user, refreshData }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleReceivePalay = async () => {
        setIsLoading(true);
        try {
            const transactionResponse = await fetch(`${apiUrl}/transactions/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedItem.transactionId,
                    status: 'Received',
                    receiveDateTime: new Date().toISOString(),
                    receiverId: user.id
                })
            });
    
            if (!transactionResponse.ok) {
                throw new Error('Failed to update transaction');
            }
    
            onAcceptSuccess();
            onHide();
            
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Transaction successfully updated',
                life: 3000
            });

            refreshData();
        } catch (error) {
            console.error('Error updating transaction:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update transaction',
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
                header="Receive palay" 
                visible={visible} 
                onHide={isLoading ? null : onHide} 
                className="w-1/3"
            >
                <div className="flex flex-col items-center gap-2">
                    <CheckCircle size={32} className="text-primary"/>
                    <p>Are you sure you want to receive this Palay?</p>
                    
                    <div className="flex justify-between w-full mt-5">
                        <Button 
                            label="Confirm Receive" 
                            className="w-full bg-primary hover:border-none" 
                            onClick={handleReceivePalay} 
                            disabled={isLoading}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ReceivePalay;