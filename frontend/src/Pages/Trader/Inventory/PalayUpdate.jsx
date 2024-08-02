import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import InputComponent from '@/Components/Form/InputComponent';
import { Wheat } from 'lucide-react';
import { Toast } from 'primereact/toast';

const statusOptions = [
    { label: 'Palay', value: 'Palay' },
    { label: 'Drying', value: 'Drying' },
    { label: 'Milling', value: 'Milling' },
    { label: 'Rice', value: 'Rice' }
];

function PalayUpdate({ visible, onHide, selectedPalay, onUpdatePalay }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [status, setStatus] = useState('');
    const [formData, setFormData] = useState({});
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedDryer, setSelectedDryer] = useState(null);
    const [selectedMiller, setSelectedMiller] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const [dryers, setDryers] = useState([]);
    const [millers, setMillers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useRef(null);

    
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                fetchFacilities('warehouses', setWarehouses),
                fetchFacilities('dryers', setDryers),
                fetchFacilities('millers', setMillers)
            ]);
            if (selectedPalay) {
                setStatus(selectedPalay.status);
                await fetchDataForStatus(selectedPalay.id, selectedPalay.status);
            }
        };
        fetchData();
    }, [selectedPalay]);

    //use effect for resetting the form when the status changes
    useEffect(() => {
        if (status !== selectedPalay.status) {
            setFormData({});
            setSelectedWarehouse(null);
            setSelectedDryer(null);
            setSelectedMiller(null);
        }
    }, [status]);

    const fetchFacilities = async (facilityType, setFacilityState) => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/${facilityType}`);
            const data = await response.json();
            // Filter active facilities
            const activeFacilities = data.filter(facility => facility.status === 'Active');
            const formattedData = activeFacilities.map(item => ({ label: item.name || item.facilityName, value: item.id }));
            setFacilityState(formattedData);
        } catch (error) {
            console.error(`Error fetching ${facilityType}:`, error);
            setError(`Error fetching ${facilityType}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataForStatus = async (id, status) => {
        try {
            let response;
            let data;

            switch (status) {
                case 'Drying':
                    response = await fetch(`${apiUrl}/dryingprocesses/${id}`);
                    data = await response.json();
                    setFormData({
                        type: data.type || '',
                        dateSent: formatDate(data.dateSent) || '',
                        dateReturned: formatDate(data.dateReturned) || '',
                        palayQuantitySent: data.palayQuantitySent || '',
                        palayQuantityReturned: data.palayQuantityReturned || ''
                    });
                    if (!selectedDryer) {
                        setSelectedDryer(dryers.find(d => d.value === data.dryerId) || null);
                    }
                    break;

                case 'Milling':
                    response = await fetch(`${apiUrl}/millingprocesses/${id}`);
                    data = await response.json();
                    setFormData({
                        type: data.type || '',
                        dateSent: formatDate(data.dateSent) || '',
                        dateReturned: formatDate(data.dateReturned) || '',
                        palayQuantitySent: data.palayQuantitySent || '',
                        palayQuantityReturned: data.palayQuantityReturned || '',
                        efficiency: data.efficiency || ''
                    });
                    if (!selectedMiller) {
                        setSelectedMiller(millers.find(m => m.value === data.millerId) || null);
                    }
                    break;

                case 'Rice':
                    response = await fetch(`${apiUrl}/ricebatches/${id}`);
                    data = await response.json();

                    // Fetch rice delivery details
                    let deliveryResponse = await fetch(`${apiUrl}/ricedeliveries/${data.riceDeliveryId}`);
                    let deliveryData = await deliveryResponse.json();

                    setFormData({
                        dateReceived: formatDate(data.dateReceived) || '',
                        quantity: data.quantity || '',
                        qualityType: data.qualityType || '',
                        recipientId: data.recipientId || '',
                        driverName: deliveryData.driverName || '',
                        typeOfTranspo: deliveryData.typeOfTranspo || '',
                        plateNumber: deliveryData.plateNumber || ''
                    });
                    if (!selectedWarehouse) {
                        setSelectedWarehouse(warehouses.find(w => w.value === data.warehouseId) || null);
                    }
                    break;

                case 'Palay':
                    setFormData({});
                    if (!selectedWarehouse) {
                        setSelectedWarehouse(warehouses.find(w => w.value === data.warehouseId) || null);
                    }
                    break;

                default:
                    setFormData({});
            }
        } catch (error) {
            console.error(`Error fetching data for ${status}:`, error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to fetch ${status} data` });
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWarehouseChange = (e) => {
        setSelectedWarehouse(e.value);
    };

    const handleDryerChange = (e) => {
        setSelectedDryer(e.value);
    };

    const handleMillerChange = (e) => {
        setSelectedMiller(e.value);
    };

    const handleUpdatePalay = async () => {
        // Base payload with status
        setIsSubmitting(true);
        const updatePayload = {
            id: selectedPalay.id,
            status: status,
        };

        // Conditionally add warehouseId if status is 'Palay'
        if (status === 'Palay' && selectedWarehouse) {
            updatePayload.warehouseId = selectedWarehouse;
        }

        try {
            // Update the Palay batch status
            const response = await fetch(`${apiUrl}/palaybatches`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatePayload),
            });

            if (response.ok) {
                // Handle special cases based on status
                switch (status) {
                    case 'Drying':
                        await handleDryingUpdate();
                        break;
                    case 'Milling':
                        await handleMillingUpdate();
                        break;
                    case 'Rice':
                        await handleRiceUpdate();
                        break;
                }

                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Palay updated successfully' });
                onHide();
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error updating palay:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update Palay' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to handle Drying update
    const handleDryingUpdate = async () => {
        try {
            setIsSubmitting(true);
            // Check if drying process data exists
            const response = await fetch(`${apiUrl}/dryingprocesses/${selectedPalay.id}`);
            const existingData = await response.json();

            let requestBody;

            if (existingData && existingData.id) {
                // Update existing drying process data
                requestBody = {
                    ...existingData,
                    type: formData.type,
                    dryerId: selectedDryer,
                    dateSent: formData.dateSent,
                    dateReturned: formData.dateReturned,
                    palayQuantitySent: formData.palayQuantitySent,
                    palayQuantityReturned: formData.palayQuantityReturned,
                };

                const updateResponse = await fetch(`${apiUrl}/dryingprocesses`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!updateResponse.ok) throw new Error('Update failed');
            } else {
                // Create new drying process data
                requestBody = {
                    palayBatchId: selectedPalay.id,
                    type: formData.type,
                    dryerId: selectedDryer,
                    dateSent: formData.dateSent,
                    dateReturned: formData.dateReturned,
                    palayQuantitySent: formData.palayQuantitySent,
                    palayQuantityReturned: formData.palayQuantityReturned,
                    warehouseId: 2
                };

                const createResponse = await fetch(`${apiUrl}/dryingprocesses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!createResponse.ok) throw new Error('Creation failed');
            }
        } catch (error) {
            console.error('Error handling drying update:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update or create Drying Process' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to handle Milling update
    const handleMillingUpdate = async () => {
        try {
            setIsSubmitting(true);
            // Check if milling process data exists
            const response = await fetch(`${apiUrl}/millingprocesses/${selectedPalay.id}`);
            const existingData = await response.json();

            let requestBody;

            if (existingData && existingData.id) {
                // Update existing milling process data
                requestBody = {
                    ...existingData,
                    type: formData.type,
                    millerId: selectedMiller,
                    dateSent: formData.dateSent,
                    dateReturned: formData.dateReturned,
                    palayQuantitySent: formData.palayQuantitySent,
                    palayQuantityReturned: formData.palayQuantityReturned,
                    efficiency: formData.efficiency,
                };

                const updateResponse = await fetch(`${apiUrl}/millingprocesses`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!updateResponse.ok) throw new Error('Update failed');
            } else {
                // Create new milling process data
                requestBody = {
                    palayBatchId: selectedPalay.id,
                    type: formData.type,
                    millerId: selectedMiller,
                    dateSent: formData.dateSent,
                    dateReturned: formData.dateReturned,
                    palayQuantitySent: formData.palayQuantitySent,
                    palayQuantityReturned: formData.palayQuantityReturned,
                    efficiency: formData.efficiency,
                    warehouseId: 2
                };

                const createResponse = await fetch(`${apiUrl}/millingprocesses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!createResponse.ok) throw new Error('Creation failed');
            }
        } catch (error) {
            console.error('Error handling milling update:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update or create Milling Process' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRiceUpdate = async () => {
        try {
            setIsSubmitting(true);
            // Check if rice batch data exists
            const response = await fetch(`${apiUrl}/ricebatches/${selectedPalay.id}`);
            const existingData = await response.json();

            let riceBatchBody;
            let riceDeliveryBody;

            if (existingData && existingData.id) {
                // Update existing rice batch data
                riceBatchBody = {
                    ...existingData,
                    dateReceived: formData.dateReceived,
                    quantity: formData.quantity,
                    qualityType: formData.qualityType,
                    recipientId: 1,
                    // recipientId: formData.recipientId,
                    warehouseId: selectedWarehouse,
                };

                // Update existing rice delivery data
                riceDeliveryBody = {
                    id: existingData.riceDeliveryId,
                    driverName: formData.driverName,
                    typeOfTranspo: formData.typeOfTranspo,
                    plateNumber: formData.plateNumber,
                };

                // Update rice batch
                const updateRiceBatchResponse = await fetch(`${apiUrl}/ricebatches`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(riceBatchBody),
                });

                if (!updateRiceBatchResponse.ok) throw new Error('Rice batch update failed');

                // Update rice delivery
                const updateRiceDeliveryResponse = await fetch(`${apiUrl}/ricedeliveries`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(riceDeliveryBody),
                });

                if (!updateRiceDeliveryResponse.ok) throw new Error('Rice delivery update failed');
            } else {
                // Create new rice batch data
                riceBatchBody = {
                    palayBatchId: selectedPalay.id,
                    dateReceived: formData.dateReceived,
                    quantity: formData.quantity,
                    qualityType: formData.qualityType,
                    recipientId: formData.recipientId,
                    warehouseId: selectedWarehouse,
                };

                // Create new rice delivery data
                riceDeliveryBody = {
                    driverName: formData.driverName,
                    typeOfTranspo: formData.typeOfTranspo,
                    plateNumber: formData.plateNumber,
                };

                // Create rice delivery first
                const createRiceDeliveryResponse = await fetch(`${apiUrl}/ricedeliveries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(riceDeliveryBody),
                });

                if (!createRiceDeliveryResponse.ok) throw new Error('Rice delivery creation failed');

                const newRiceDelivery = await createRiceDeliveryResponse.json();

                // Add the new rice delivery ID to the rice batch data
                riceBatchBody.riceDeliveryId = newRiceDelivery.id;

                // Create rice batch
                const createRiceBatchResponse = await fetch(`${apiUrl}/ricebatches`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(riceBatchBody),
                });

                if (!createRiceBatchResponse.ok) throw new Error('Rice batch creation failed');
            }

            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Rice batch and delivery updated successfully' });
        } catch (error) {
            console.error('Error handling rice update:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update or create Rice Batch and Delivery' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderInputField = (label, name, type = "text", placeholder) => (
        <div className="sm:col-span-3">
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="mt-2">
                <InputComponent
                    inputIcon={<Wheat size={20} />}
                    onChange={handleInputChange}
                    value={formData[name] || ''}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    aria-label={name}
                />
            </div>
        </div>
    );

    const renderDropdownField = (label, name, value, options, placeholder, onChange) => (
        <div className="sm:col-span-3">
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="mt-2">
                <Dropdown
                    id={name}
                    name={name}
                    value={value || null}
                    options={options}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full"
                />
            </div>
        </div>
    );

    const renderForm = () => {
        switch (status) {
            case 'Drying':
                return (
                    <>
                        {renderInputField("Type", "type", "text", "Type")}
                        {renderDropdownField("Dryer Name", "dryerId", selectedDryer, dryers, "Select Dryer", handleDryerChange)}
                        {renderInputField("Date Sent", "dateSent", "date", "Date Sent")}
                        {renderInputField("Date Returned", "dateReturned", "date", "Date Returned")}
                        {renderInputField("Palay Quantity Sent", "palayQuantitySent", "number", "Palay Quantity Sent")}
                        {renderInputField("Palay Quantity Returned", "palayQuantityReturned", "number", "Palay Quantity Returned")}
                    </>
                );
            case 'Milling':
                return (
                    <>
                        {renderInputField("Type", "type", "text", "Type")}
                        {renderDropdownField("Miller Name", "millerId", selectedMiller, millers, "Select Miller", handleMillerChange)}
                        {renderInputField("Date Sent", "dateSent", "date", "Date Sent")}
                        {renderInputField("Date Returned", "dateReturned", "date", "Date Returned")}
                        {renderInputField("Palay Quantity Sent", "palayQuantitySent", "number", "Palay Quantity Sent")}
                        {renderInputField("Palay Quantity Returned", "palayQuantityReturned", "number", "Palay Quantity Returned")}
                        {renderInputField("Efficiency", "efficiency", "text", "Efficiency")}
                    </>
                );
            case 'Rice':
                return (
                    <>
                        {renderInputField("Date Received", "dateReceived", "date", "Date Received")}
                        {renderInputField("Quantity", "quantity", "number", "Quantity")}
                        {renderInputField("Quality Type", "qualityType", "text", "Quality Type")}
                        {/* {renderInputField("Recipient ID", "recipientId", "text", "Recipient ID")} */}
                        {renderDropdownField("Warehouse", "warehouseId", selectedWarehouse, warehouses, "Select Warehouse", handleWarehouseChange)}
                        {renderInputField("Driver Name", "driverName", "text", "Driver Name")}
                        {renderInputField("Type of Transpo", "typeOfTranspo", "text", "Type of Transpo")}
                        {renderInputField("Plate Number", "plateNumber", "text", "Plate Number")}
                    </>
                );
            case 'Palay':
                return (
                    <>
                        {renderDropdownField("Warehouse", "warehouseId", selectedWarehouse, warehouses, "Select Warehouse", handleWarehouseChange)}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog header="Update Palay" visible={visible} onHide={onHide} footer={
            <div className="flex gap-2">
                <Button label="Cancel" disabled={isSubmitting} icon="pi pi-times" onClick={onHide} className="p-button-text" />
                <Button label="Update" disabled={isSubmitting} icon="pi pi-check" onClick={handleUpdatePalay} />
            </div>
        }>
            <Toast ref={toast} />
            <div className="grid grid-cols-1 gap-4">
                {renderDropdownField("Status", "status", status, statusOptions, "Select Status", (e) => setStatus(e.value))}
                {renderForm()}
            </div>
        </Dialog>
    );
}

export default PalayUpdate;
