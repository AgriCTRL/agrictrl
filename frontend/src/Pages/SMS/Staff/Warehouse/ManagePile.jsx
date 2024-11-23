import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';

const ManagePile = ({ visible, onHide, selectedItem, onUpdateSuccess, user, refreshData }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form states
    const [price, setPrice] = useState(selectedItem?.price || 0);
    const [forSale, setForSale] = useState(selectedItem?.forSale || false);
    const [description, setDescription] = useState(selectedItem?.description || '');

    const handleUpdatePile = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/piles/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedItem.id,
                    forSale: forSale,
                    price: price,
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to update pile');
            }
    
            onUpdateSuccess();
            onHide();
            
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Pile successfully updated',
                life: 3000
            });
            refreshData();
        } catch (error) {
            console.error('Error updating pile:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update pile',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const dialogHeader = (
        <div className="flex justify-between items-center gap-2">
            <h1>Manage Pile</h1>
            <div className="flex items-center gap-2 mr-10">
                <label htmlFor="forSale" className="font-medium">For Sale</label>
                <InputSwitch
                    id="forSale"
                    checked={forSale}
                    onChange={(e) => setForSale(e.value)}
                />
            </div>
        </div>
    );

    // Reset form when dialog is opened with new selected item
    React.useEffect(() => {
        if (selectedItem) {
            setPrice(selectedItem.price || 0);
            setForSale(selectedItem.forSale || false);
            setDescription(selectedItem.description || '');
        }
    }, [selectedItem]);

    const handlePriceChange = (e) => {
        setPrice(e.value);
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog 
                header={dialogHeader} 
                visible={visible} 
                onHide={isLoading ? null : onHide} 
                className="w-1/2"
            >
                <div className="flex flex-col gap-4">
                    {/* Pile Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="pileNumber" className="font-medium">Pile Number</label>
                            <InputText
                                id="pileNumber"
                                value={`Pile #${selectedItem?.pileNumber || ''}`}
                                disabled
                                className="p-inputtext-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="type" className="font-medium">Type</label>
                            <InputText
                                id="type"
                                value={selectedItem?.type || ''}
                                disabled
                                className="p-inputtext-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="currentQuantity" className="font-medium">Current Quantity (bags)</label>
                            <InputNumber
                                id="currentQuantity"
                                value={selectedItem?.currentQuantity || 0}
                                disabled
                                className="p-inputtext-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="maxCapacity" className="font-medium">Maximum Capacity (bags)</label>
                            <InputNumber
                                id="maxCapacity"
                                value={selectedItem?.maxCapacity || 0}
                                disabled
                                className="p-inputtext-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="price" className="font-medium">Price per Bag</label>
                            <InputNumber
                                id="price"
                                value={price}
                                onChange={handlePriceChange}
                                mode="currency"
                                currency="PHP"
                                locale="en-US"
                                className="p-inputtext-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="status" className="font-medium">Status</label>
                            <InputText
                                id="status"
                                value={selectedItem?.status || ''}
                                disabled
                                className="p-inputtext-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button 
                            label="Cancel" 
                            className="p-button-text" 
                            onClick={onHide} 
                            disabled={isLoading}
                        />
                        <Button 
                            label="Update" 
                            className="bg-primary" 
                            onClick={handleUpdatePile} 
                            loading={isLoading}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ManagePile;