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
    const toast = useRef(null);

    useEffect(() => {
        if (selectedPalay) {
            setStatus(selectedPalay.status);
            setFormData(selectedPalay);
            if (selectedPalay.warehouseId) {
                setSelectedWarehouse({ label: selectedPalay.warehouseId, value: selectedPalay.warehouseId });
            }
            if (selectedPalay.dryerId) {
                setSelectedDryer({ label: selectedPalay.dryerId, value: selectedPalay.dryerId });
            }
            if (selectedPalay.millerId) {
                setSelectedMiller({ label: selectedPalay.millerId, value: selectedPalay.millerId });
            }
        }
    }, [selectedPalay]);

    useEffect(() => {
        fetchWarehouses();
        fetchDryers();
        fetchMillers();
    }, []);

    const fetchWarehouses = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/warehouses');
            const data = await response.json();
            setWarehouses(data.map(warehouse => ({ label: warehouse.facilityName, value: warehouse.id })));
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            setError('Error fetching warehouses');
        } finally {
            setLoading(false);
        }
    };

    const fetchDryers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/dryers');
            const data = await response.json();
            setDryers(data.map(dryer => ({ label: dryer.name, value: dryer.id })));
        } catch (error) {
            console.error('Error fetching dryers:', error);
            setError('Error fetching dryers');
        } finally {
            setLoading(false);
        }
    };

    const fetchMillers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millers');
            const data = await response.json();
            setMillers(data.map(miller => ({ label: miller.name, value: miller.id })));
        } catch (error) {
            console.error('Error fetching millers:', error);
            setError('Error fetching millers');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWarehouseChange = (e) => {
        setSelectedWarehouse(e.value);
        console.log('Selected Warehouse ID:', e.value);
    };

    const handleUpdatePalay = async () => {
        console.log('Selected Warehouse ID in handleUpdatePalay:', selectedWarehouse); // Log the ID directly

        // Base payload with status
        const updatePayload = {
            id: selectedPalay.id,
            status: status, // Always include status
        };

        // Conditionally add warehouseId if status is 'Palay'
        if (status === 'Palay' && selectedWarehouse) {
            updatePayload.warehouseId = selectedWarehouse;
        }

        try {
            // Update the Palay batch status
            const response = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/palaybatches', {
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
                onHide(); // Hide the dialog after successful update
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error updating palay:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update Palay' });
        }
    };

    // Function to handle Drying update
    const handleDryingUpdate = async () => {
        try {
            // Check if drying process data exists
            const response = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/dryingprocesses/${selectedPalay.id}`);
            const existingData = await response.json();

            let requestBody;

            if (existingData && existingData.id) {
                // Update existing drying process data
                requestBody = {
                    ...existingData, // Preserve existing fields
                    type: formData.type,
                    dryerId: selectedDryer,
                    dateSent: formData.dateSent,
                    dateReturned: formData.dateReturned,
                    palayQuantitySent: formData.palayQuantitySent,
                    palayQuantityReturned: formData.palayQuantityReturned,
                };

                console.log('Update Request Body:', JSON.stringify(requestBody, null, 2)); // Log the body for update

                const updateResponse = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/dryingprocesses', {
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

                console.log('Create Request Body:', JSON.stringify(requestBody, null, 2)); // Log the body for create

                const createResponse = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/dryingprocesses', {
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
        }
    };

    // Function to handle Milling update
    const handleMillingUpdate = async () => {
        try {
            // Check if milling process data exists
            const response = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millingprocesses/${selectedPalay.id}`);
            const existingData = await response.json();

            let requestBody;

            if (existingData && existingData.id) {
                // Update existing milling process data
                requestBody = {
                    ...existingData, // Preserve existing fields
                    type: formData.type,
                    millerId: selectedMiller,
                    dateSent: formData.dateSent,
                    dateReturned: formData.dateReturned,
                    palayQuantitySent: formData.palayQuantitySent,
                    palayQuantityReturned: formData.palayQuantityReturned,
                    efficiency: formData.efficiency,
                };

                console.log('Update Request Body:', JSON.stringify(requestBody, null, 2)); // Log the body for update

                const updateResponse = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millingprocesses', {
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

                console.log('Create Request Body:', JSON.stringify(requestBody, null, 2)); // Log the body for create

                const createResponse = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millingprocesses', {
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
        }
    };

    const handleRiceUpdate = async () => {
        try {
            // Check if rice batch data exists
            const response = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/ricebatches/${selectedPalay.id}`);
            const existingData = await response.json();

            let requestBody;

            if (existingData && existingData.id) {
                // Update existing rice batch data
                requestBody = {
                    ...existingData,
                    dateReceived: formData.dateReceived,
                    quantity: formData.quantity,
                    qualityType: formData.qualityType,
                    recipientId: formData.recipientId,
                    warehouseId: selectedWarehouse,
                    driverName: formData.driverName,
                    typeOfTranspo: formData.typeOfTranspo,
                    plateNumber: formData.plateNumber,
                };

                const updateResponse = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/ricebatches', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!updateResponse.ok) throw new Error('Update failed');
            } else {
                // Create new rice batch data
                requestBody = {
                    palayBatchId: selectedPalay.id,
                    dateReceived: formData.dateReceived,
                    quantity: formData.quantity,
                    qualityType: formData.qualityType,
                    recipientId: formData.recipientId,
                    warehouseId: selectedWarehouse,
                    driverName: formData.driverName,
                    typeOfTranspo: formData.typeOfTranspo,
                    plateNumber: formData.plateNumber,
                };

                const createResponse = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/ricebatches', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!createResponse.ok) throw new Error('Creation failed');
            }
        } catch (error) {
            console.error('Error handling rice update:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update or create Rice Batch' });
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
                    value={value}
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
                        {renderDropdownField("Dryer Name", "dryerId", selectedDryer, dryers, "Select Dryer", (e) => setSelectedDryer(e.value))}
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
                        {renderDropdownField("Miller Name", "millerId", selectedMiller, millers, "Select Miller", (e) => setSelectedMiller(e.value))}
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
                        {renderInputField("Recipient ID", "recipientId", "text", "Recipient ID")}
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
                <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                <Button label="Update" icon="pi pi-check" onClick={handleUpdatePalay} />
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
