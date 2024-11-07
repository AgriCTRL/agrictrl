import React, { useRef, useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

const AcceptRice = ({ visible, onHide, selectedItem = {}, onAcceptSuccess, user, refreshData }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [maxBatchCapacity, setMaxBatchCapacity] = useState(500);
    const [riceBatches, setRiceBatches] = useState([]);
    const [batchInputs, setBatchInputs] = useState([]);
    const [totalBagsEntered, setTotalBagsEntered] = useState(0);

    useEffect(() => {
        if (visible) {
            fetchRiceBatches();
        }
    }, [visible]);

    useEffect(() => {
        const total = batchInputs.reduce((sum, batch) => sum + (batch.bagsToStore || 0), 0);
        setTotalBagsEntered(total);
    }, [batchInputs]);

    const fetchRiceBatches = async () => {
        try {
            const response = await fetch(`${apiUrl}/ricebatches?currentCapacity_lt=${maxBatchCapacity}&isFull=false`);
            if (!response.ok) throw new Error('Failed to fetch rice batches');
            const data = await response.json();
            setRiceBatches(data);

            if (data.length === 0 || data.every(batch => batch.currentCapacity === maxBatchCapacity)) {
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

    const handleReceiveRice = async () => {
        setIsLoading(true);
        try {
            if (totalBagsEntered === 0) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please enter the number of bags to store',
                    life: 3000
                });
                return;
            }

            const requiredBags = selectedItem?.quantityBags || 0;
            if (totalBagsEntered !== requiredBags) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Total bags must equal ${requiredBags}`,
                    life: 3000
                });
                return;
            }

            // Calculate weights per bag
            const weightPerBag = {
                gross: selectedItem?.grossWeight ? selectedItem.grossWeight / selectedItem.quantityBags : 0,
                net: selectedItem?.netWeight ? selectedItem.netWeight / selectedItem.quantityBags : 0
            };

            // Process each batch
            let remainingBags = totalBagsEntered;
            for (const batch of batchInputs) {
                if (remainingBags <= 0) break;

                if (batch.id) {
                    // Update existing batch
                    const availableSpace = maxBatchCapacity - batch.currentCapacity;
                    const bagsToAdd = Math.min(remainingBags, availableSpace);

                    if (bagsToAdd > 0) {
                        await fetch(`${apiUrl}/ricebatches/update?id=${batch.id}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id: batch.id,
                                currentCapacity: batch.currentCapacity + bagsToAdd,
                                maxCapacity: maxBatchCapacity,
                                isFull: (batch.currentCapacity + bagsToAdd >= maxBatchCapacity)
                            })
                        });

                        await fetch(`${apiUrl}/ricemillingbatches`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                riceBatchId: batch.id,
                                millingBatchId: selectedItem?.millingBatchId,
                                riceQuantityBags: bagsToAdd,
                                riceGrossWeight: weightPerBag.gross * bagsToAdd,
                                riceNetWeight: weightPerBag.net * bagsToAdd
                            })
                        });

                        remainingBags -= bagsToAdd;
                    }
                } else {
                    // Create new batch
                    const bagsForThisBatch = Math.min(remainingBags, maxBatchCapacity);
                    const createResponse = await fetch(`${apiUrl}/ricebatches`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: batch.riceBatchName,
                            dateReceived: new Date().toISOString(),
                            riceType: 'NFA Rice',
                            warehouseId: selectedItem?.toLocationId,
                            price: batch.price,
                            currentCapacity: bagsForThisBatch,
                            maxCapacity: maxBatchCapacity,
                            isFull: bagsForThisBatch >= maxBatchCapacity
                        })
                    });

                    const newBatch = await createResponse.json();
                    await fetch(`${apiUrl}/ricemillingbatches`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            riceBatchId: newBatch.id,
                            millingBatchId: selectedItem?.millingBatchId,
                            riceQuantityBags: bagsForThisBatch,
                            riceGrossWeight: weightPerBag.gross * bagsForThisBatch,
                            riceNetWeight: weightPerBag.net * bagsForThisBatch
                        })
                    });

                    remainingBags -= bagsForThisBatch;
                }
            }

            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours()+8);

            // Update transaction status
            if (selectedItem?.transactionId) {
                await fetch(`${apiUrl}/transactions/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: selectedItem.transactionId,
                        status: 'Received',
                        receiveDateTime: currentDate.toISOString(),
                        receiverId: user?.id
                    })
                });
            }

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Rice batches processed successfully',
                life: 3000
            });

            onAcceptSuccess();
            onHide();
            refreshData();
        } catch (error) {
            console.error('Error in handleReceiveRice:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to process rice batches',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (batchIndex, field, value) => {
        const updatedInputs = [...batchInputs];
        const currentBatch = updatedInputs[batchIndex];
        const totalQuantityBags = selectedItem?.quantityBags || 0;
        const remainingTotalBags = totalQuantityBags - (totalBagsEntered - (currentBatch.bagsToStore || 0));

        if (field === 'bagsToStore') {
            // Ensure the new value doesn't exceed the remaining total bags
            if (value > remainingTotalBags) {
                value = remainingTotalBags;
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: `Cannot exceed total quantity of ${totalQuantityBags} bags`,
                    life: 3000
                });
            }

            // Check batch capacity constraints
            if (currentBatch.id) {
                const availableSpace = maxBatchCapacity - currentBatch.currentCapacity;
                if (value > availableSpace) {
                    const remainingBags = value - availableSpace;
                    updatedInputs[batchIndex].bagsToStore = availableSpace;

                    // Create a new batch for remaining bags if needed
                    if (remainingBags > 0) {
                        let newBatchName = `Rice Batch ${updatedInputs.length + 1}`;
                        while (updatedInputs.find(batch => batch.riceBatchName === newBatchName)) {
                            newBatchName = `Rice Batch ${parseInt(newBatchName.split(' ')[2]) + 1}`;
                        }

                        updatedInputs.push({
                            riceBatchName: newBatchName,
                            price: currentBatch.price,
                            bagsToStore: remainingBags
                        });
                    }
                } else {
                    updatedInputs[batchIndex].bagsToStore = value;
                }
            } else {
                if (value > maxBatchCapacity) {
                    const remainingBags = value - maxBatchCapacity;
                    updatedInputs[batchIndex].bagsToStore = maxBatchCapacity;

                    let newBatchName = `Rice Batch ${updatedInputs.length + 1}`;
                    while (updatedInputs.find(batch => batch.riceBatchName === newBatchName)) {
                        newBatchName = `Rice Batch ${parseInt(newBatchName.split(' ')[2]) + 1}`;
                    }

                    updatedInputs.push({
                        riceBatchName: newBatchName,
                        price: currentBatch.price,
                        bagsToStore: remainingBags
                    });
                } else {
                    updatedInputs[batchIndex].bagsToStore = value;
                }
            }
        } else {
            updatedInputs[batchIndex][field] = value;
        }

        setBatchInputs(updatedInputs);
    };

    const handleClose = () => {
        setBatchInputs([{ riceBatchName: `Rice Batch 1`, price: '', bagsToStore: 0 }]);
        setTotalBagsEntered(0);
        onHide();
    };

    const dialogHeader = (
        <div className="flex justify-between items-center gap-2">
            <h1>Accept Rice Delivery</h1>
            <div className="flex items-center gap-2">
                <span className="font-medium">Bags of Rice to Store:</span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                    {totalBagsEntered} / {selectedItem?.quantityBags || 0}
                </span>
            </div>
        </div>
    );

    const dialogFooter = (
        <div className="flex justify-end gap-2">
            <Button label="Cancel" icon="pi pi-times" onClick={handleClose} className="p-button-text" disabled={isLoading}/>
            <Button label="Accept Rice" icon="pi pi-check" onClick={handleReceiveRice} autoFocus disabled={isLoading} loading={isLoading}/>
        </div>
    );

    return (
        <Dialog
            visible={visible}
            onHide={isLoading ? null : onHide}
            header={dialogHeader}
            modal
            className="w-full max-w-2xl"
            closeOnEscape
            footer={dialogFooter}
        >
            <Toast ref={toast} />

            <div className="flex flex-col gap-4">
                {batchInputs.map((batch, index) => (
                    <div key={batch.id} className="flex flex-col gap-2 p-4 border rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Rice Batch Name</label>
                                <InputText
                                    value={batch.name}
                                    disabled={!!batch.id}
                                    onChange={(e) => handleInputChange(index, 'riceBatchName', e.target.value)}
                                    className="w-full"
                                    maxLength={50}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Price</label>
                                <InputText
                                    value={batch.price}
                                    disabled={!!batch.id}
                                    onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                    className="w-full"
                                    keyfilter="money"
                                />
                            </div>
                        </div>
                        
                        {batch.id && (
                            <div className='w-full'>
                                <label className="text-sm font-medium text-gray-700">Current Capacity</label>
                                <InputText
                                    value={`${batch.currentCapacity} / ${maxBatchCapacity}`}
                                    disabled={!!batch.id}
                                    className="w-full"
                                    keyfilter="alphanum"
                                    maxLength={50}
                                />
                            </div>
                        )}
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700">Bags of rice to Store</label>
                            <InputNumber
                                value={batch.bagsToStore}
                                onChange={(e) => handleInputChange(index, 'bagsToStore', e.value)}
                                min={0}
                                max={Math.min(
                                    batch.id ? maxBatchCapacity - batch.currentCapacity : maxBatchCapacity,
                                    (selectedItem?.quantityBags || 0) - (totalBagsEntered - (batch.bagsToStore || 0))
                                )}
                                disabled={
                                    batch.bagsToStore >=
                                    (batch.id ? maxBatchCapacity - batch.currentCapacity : maxBatchCapacity)
                                }
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