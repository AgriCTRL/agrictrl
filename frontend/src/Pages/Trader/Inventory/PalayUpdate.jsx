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

    const updatePalayBatch = async (updatedPalay) => {
        try {
            setLoading(true);
            const response = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/palaybatches/${updatedPalay.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPalay),
            });
            if (!response.ok) {
                throw new Error('Failed to update palay batch');
            }
            const result = await response.json();
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Palay batch updated successfully' });
            onUpdatePalay(result);
            onHide();
        } catch (error) {
            console.error('Error updating palay batch:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update palay batch' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        const updatedPalay = {
            ...selectedPalay,
            ...formData,
            status,
            warehouseId: selectedWarehouse ? selectedWarehouse.value : formData.warehouseId
        };

        if (status === 'Palay') {
            updatePalayBatch(updatedPalay);
        } else {
            onUpdatePalay(updatedPalay);
            onHide();
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
                        {renderDropdownField("Dryer Name", "dryerName", selectedDryer, dryers, "Select Dryer", (e) => setSelectedDryer(e.value))}
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
                        {renderDropdownField("Miller Name", "millerName", selectedMiller, millers, "Select Miller", (e) => setSelectedMiller(e.value))}
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
                        {renderDropdownField("Warehouse", "warehouseId", selectedWarehouse, warehouses, "Select Warehouse", (e) => setSelectedWarehouse(e.value))}
                        {renderInputField("Driver Name", "driverName", "text", "Driver Name")}
                        {renderInputField("Type of Transpo", "typeOfTranspo", "text", "Type of Transpo")}
                        {renderInputField("Plate Number", "plateNumber", "text", "Plate Number")}
                    </>
                );
            case 'Palay':
                return (
                    <>
                        {renderDropdownField("Warehouse", "warehouseName", selectedWarehouse, warehouses, "Select Warehouse", (e) => setSelectedWarehouse(e.value))}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Update Palay" modal style={{ width: '40vw' }}>
            <section className='Palay Information flex flex-col gap-2'>
                <p className='text-xl text-black font-semibold'>Update Palay Information</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-3">
                        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
                        <div className="mt-2">
                            <Dropdown
                                value={status}
                                options={statusOptions}
                                onChange={(e) => setStatus(e.value)}
                                placeholder="Select Status"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {renderForm()}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                    <Button label="Update" icon="pi pi-check" onClick={handleUpdate} autoFocus />
                </div>
            </section>
        </Dialog>
    );
}

export default PalayUpdate;
