import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { CheckCircle } from "lucide-react";

const ReceivePalay = ({ visible, onHide, selectedItem, onAcceptSuccess, user, userWarehouse }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [availablePiles, setAvailablePiles] = useState([]);
    const [selectedPile, setSelectedPile] = useState(null);

    // Fetch available piles when the dialog opens
    useEffect(() => {
        const fetchAvailablePiles = async () => {
            if (!visible) return;

            try {
                // Fetch all piles
                const pilesResponse = await fetch(`${apiUrl}/piles/warehouse/${userWarehouse.id}`);
                const pilesData = await pilesResponse.json();

                // Filter piles that can accommodate the current batch
                const compatiblePiles = pilesData.data.filter(pile => 
                    pile.status === "Active" && 
                    pile.maxCapacity - pile.currentQuantity >= selectedItem.quantityBags
                );


                setAvailablePiles(compatiblePiles);
                setSelectedPile(null);
            } catch (error) {
                console.error('Error fetching available piles:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch available piles',
                    life: 3000
                });
            }
        };

        fetchAvailablePiles();
    }, [visible, selectedItem]);

    const handleReceivePalay = async () => {
        if (!selectedPile) {
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select a pile',
                life: 3000
            });
            return;
        }

        setIsLoading(true);
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 8);

        try {
            // Update transaction status
            const transactionResponse = await fetch(`${apiUrl}/transactions/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedItem.transactionId,
                    status: 'Received',
                    receiveDateTime: currentDate.toISOString(),
                    receiverId: user.id
                })
            });
    
            if (!transactionResponse.ok) {
                throw new Error('Failed to update transaction');
            }

            const pileTransactionBody ={
                palayBatchId: selectedItem.id,
                pileId: selectedPile.id,
                transactionType: 'IN',
                quantityBags: selectedItem.quantityBags,
                performedBy: user.id,
                notes: `Received from transaction ${selectedItem.transactionId}`
            }

            // Create Pile Transaction
            const pileTransactionResponse = await fetch(`${apiUrl}/piletransactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pileTransactionBody)
            });

            if (!pileTransactionResponse.ok) {
                throw new Error('Failed to create pile transaction');
            }
    
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Transaction and pile transaction successfully updated',
                life: 3000
            });

            onAcceptSuccess();
            onHide();
        } catch (error) {
            console.error('Error processing transaction:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to process transaction',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const pileOptionTemplate = (option) => {
        const availableBags = option.maxCapacity - option.currentQuantity;
        return (
            <div className="flex justify-between gap-4">
                <span>{`Pile ${option.pileNumber}`}</span>
                <span className="text-gray-500">{`(available: ${availableBags} bags)`}</span>
            </div>
        );
    };
    

    return (
        <>
            <Toast ref={toast} />
            <Dialog 
                header="Receive Palay" 
                visible={visible} 
                onHide={isLoading ? null : onHide} 
                className="w-1/3"
            >
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle size={32} className="text-primary"/>
                    <p>Receive {selectedItem ? selectedItem.quantityBags: '0' } bags of Palay</p>
                    
                    <div className="w-full">
                        <label className="block mb-2">Select Pile</label>
                        <Dropdown 
                            value={selectedPile} 
                            options={availablePiles}
                            onChange={(e) => setSelectedPile(e.value)}
                            optionLabel="pileNumber"
                            placeholder="Select a Pile"
                            className="w-full"
                            itemTemplate={pileOptionTemplate}
                        />
                    </div>
                    
                    <div className="flex justify-between w-full mt-5">
                        <Button 
                            label="Confirm Receive" 
                            className="w-full bg-primary hover:border-none" 
                            onClick={handleReceivePalay} 
                            disabled={isLoading || !selectedPile}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ReceivePalay;