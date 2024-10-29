import React, { useRef, useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

const initialRiceAcceptData = {
    riceBatchName: '',
    riceType: 'NFA Rice',
    price: '',
    currentCapacity: '',
    maxCapacity: '50'
};

const AcceptRice = ({ visible, onHide, selectedItem, onAcceptSuccess, user }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const toast = useRef(null);
    
    const [riceBatches, setRiceBatches] = useState([]);
    const [batchInputs, setBatchInputs] = useState([]);

    useEffect(() => {
        if (visible) {
            fetchRiceBatches();
        }
    }, [visible]);

    const fetchRiceBatches = async () => {
        try {
            const response = await fetch(`${apiUrl}/ricebatches?currentCapacity_lt=50&isFull=false`, {
                headers: { 'API-Key': apiKey }
            });
            if (!response.ok) throw new Error('Failed to fetch rice batches');
            const data = await response.json();
            setRiceBatches(data);

            if (data.length === 0 || data.every(batch => batch.currentCapacity === 50)) {
                setBatchInputs([{ riceBatchName: '', price: '', bagsToStore: 0 }]);
            } else {
                setBatchInputs(data);
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch rice batches',
                life: 3000
            });
        }
    };

	const handleReceive = async () => {
		try {
			const totalBagsToStore = batchInputs.reduce((sum, batch) => sum + (batch.bagsToStore || 0), 0);
			if (totalBagsToStore === 0) {
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: 'Please enter the number of bags to store',
					life: 3000
				});
				return;
			}
			
			// Prepare batches for processing
			let remainingBags = totalBagsToStore;
	
			// Calculate weights per bag
			const weightPerBag = {
				gross: selectedItem.grossWeight / selectedItem.quantityBags,
				net: selectedItem.netWeight / selectedItem.quantityBags
			};
	
			for (const batch of batchInputs) {
				if (remainingBags <= 0) break;
	
				let newBatchId;
				let bagsForThisBatch;
	
				if (batch.id) {
					// Update existing batch
					const availableSpace = 50 - batch.currentCapacity;
					const bagsToAdd = Math.min(remainingBags, availableSpace);
	
					if (bagsToAdd > 0) {
						// First, check if a junction record already exists
						const existingJunction = await fetch(
							`${apiUrl}/ricemillingbatches/byRiceBatch/${batch.id}`,
							{
								headers: { 'API-Key': apiKey }
							}
						);
						const junctionData = await existingJunction.json();
						
						// Update the rice batch
						const updateResponse = await fetch(`${apiUrl}/ricebatches/update?id=${batch.id}`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'API-Key': apiKey
							},
							body: JSON.stringify({
								id: batch.id,
								currentCapacity: batch.currentCapacity + bagsToAdd,
								maxCapacity: 50,
								isFull: (batch.currentCapacity + bagsToAdd >= 50)
							})
						});
	
						if (!updateResponse.ok) {
							throw new Error('Failed to update existing batch');
						}
	
						// If junction exists, update it. Otherwise, create new one
						const existingJunctionRecord = junctionData.find(
							j => j.millingBatchId === selectedItem.millingBatchId
						);
	
						if (existingJunctionRecord) {
							// Update existing junction record
							await fetch(`${apiUrl}/ricemillingbatches/update`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									'API-Key': apiKey
								},
								body: JSON.stringify({
									id: existingJunctionRecord.id,
									riceQuantityBags: existingJunctionRecord.riceQuantityBags + bagsToAdd,
									riceGrossWeight: existingJunctionRecord.riceGrossWeight + (weightPerBag.gross * bagsToAdd),
									riceNetWeight: existingJunctionRecord.riceNetWeight + (weightPerBag.net * bagsToAdd)
								})
							});
						} else {
							// Create new junction record for existing batch
							await fetch(`${apiUrl}/ricemillingbatches`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									'API-Key': apiKey
								},
								body: JSON.stringify({
									riceBatchId: batch.id,
									millingBatchId: selectedItem.millingBatchId,
									riceQuantityBags: bagsToAdd,
									riceGrossWeight: weightPerBag.gross * bagsToAdd,
									riceNetWeight: weightPerBag.net * bagsToAdd
								})
							});
						}
	
						newBatchId = batch.id;
						bagsForThisBatch = bagsToAdd;
						remainingBags -= bagsToAdd;
					}
				} else {
					// Create new batch
					bagsForThisBatch = Math.min(remainingBags, 50);
					
					const createResponse = await fetch(`${apiUrl}/ricebatches`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'API-Key': apiKey
						},
						body: JSON.stringify({
							name: batch.riceBatchName,
							dateReceived: new Date().toISOString(),
							riceType: 'NFA Rice',
							warehouseId: selectedItem.toLocationId,
							price: batch.price,
							currentCapacity: bagsForThisBatch,
							maxCapacity: 50,
							isFull: bagsForThisBatch >= 50
						})
					});
	
					if (!createResponse.ok) {
						throw new Error('Failed to create new batch');
					}
	
					const newBatch = await createResponse.json();
					newBatchId = newBatch.id;
	
					// Create junction record for new batch
					await fetch(`${apiUrl}/ricemillingbatches`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'API-Key': apiKey
						},
						body: JSON.stringify({
							riceBatchId: newBatchId,
							millingBatchId: selectedItem.millingBatchId,
							riceQuantityBags: bagsForThisBatch,
							riceGrossWeight: weightPerBag.gross * bagsForThisBatch,
							riceNetWeight: weightPerBag.net * bagsForThisBatch
						})
					});
	
					remainingBags -= bagsForThisBatch;
				}
			}
	
			// Update transaction status
			await fetch(`${apiUrl}/transactions/update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'API-Key': apiKey
				},
				body: JSON.stringify({
					id: selectedItem.transactionId,
					status: 'Received',
					receiveDateTime: new Date().toISOString(),
					receiverId: user.id
				})
			});
	
			toast.current.show({
				severity: 'success',
				summary: 'Success',
				detail: 'Rice batches processed successfully',
				life: 3000
			});
	
			onAcceptSuccess();
			onHide();
		} catch (error) {
			console.error('Error in handleReceive:', error);
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Failed to process rice batches',
				life: 3000
			});
		}
	};
	
	const handleInputChange = (batchIndex, field, value) => {
		const updatedInputs = [...batchInputs];
		const currentBatch = updatedInputs[batchIndex];
	
		// Update the specified field
		updatedInputs[batchIndex][field] = value;
	
		if (field === 'bagsToStore') {
			let remainingBags = value;
	
			// Check if the new bags exceed the capacity of the current batch
			const availableSpace = 50 - currentBatch.currentCapacity;
	
			// If exceeding capacity, handle the overflow
			if (remainingBags > availableSpace) {
				// Update current batch to the max capacity
				updatedInputs[batchIndex].bagsToStore = availableSpace;
	
				// Calculate how many bags are left after filling the current batch
				remainingBags -= availableSpace;
	
				// Create a new batch for the remaining bags
				let newBatchName = `Rice Batch ${updatedInputs.length + 1}`; // Generate new batch name
				while (updatedInputs.find(batch => batch.riceBatchName === newBatchName)) {
					newBatchName = `Rice Batch ${parseInt(newBatchName.split(' ')[2]) + 1}`;
				}
	
				updatedInputs.push({
					riceBatchName: newBatchName,
					price: currentBatch.price,
					bagsToStore: remainingBags
				});
			}
		}
	
		setBatchInputs(updatedInputs);
	};
	
    const handleClose = () => {
        setBatchInputs([{ riceBatchName: `Rice Batch 1`, price: '', bagsToStore: 0 }]);
        onHide();
    };

    const dialogFooter = (
        <div className="flex justify-end gap-2">
            <Button label="Cancel" icon="pi pi-times" onClick={handleClose} className="p-button-text" />
            <Button label="Accept Rice" icon="pi pi-check" onClick={handleReceive} autoFocus />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header="Accept Rice Delivery"
            modal
            className="w-full max-w-2xl"
            closeOnEscape
            footer={dialogFooter}
        >
            <Toast ref={toast} />

            <div className="flex flex-col gap-4">
                {batchInputs.map((batch, index) => (
                    <div key={batch.id || index} className="flex flex-col gap-2 p-4 border rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Rice Batch Name</label>
                                <InputText
                                    value={batch.name}
                                    disabled={!!batch.id}
                                    onChange={(e) => handleInputChange(index, 'riceBatchName', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Price</label>
                                <InputText
                                    value={batch.price}
                                    disabled={!!batch.id}
                                    onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        
                        {batch.id && (
							<div className='w-full'>
                                <label className="text-sm font-medium text-gray-700">Current Capacity</label>
                                <InputText
                                    value={batch.currentCapacity + ' / 50'}
                                    disabled={!!batch.id}
                                    onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        )}
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700">Bags to Store</label>
                            <InputNumber
                                value={batch.bagsToStore}
                                onChange={(e) => handleInputChange(index, 'bagsToStore', e.value)}
                                min={0}
                                max={batch.id ? 50 - batch.currentCapacity : 50}
                                className="w-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Dialog>
    );
};

export default AcceptRice;
