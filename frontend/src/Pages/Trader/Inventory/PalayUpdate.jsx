import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import InputComponent from '@/Components/Form/InputComponent';
import { Wheat } from 'lucide-react';

const warehouses = [
    { label: 'Warehouse A', value: 'warehouse-a' },
    { label: 'Warehouse B', value: 'warehouse-b' },
    { label: 'Warehouse C', value: 'warehouse-c' },
];

const dryers = [
    { label: 'Dryer X', value: 'dryer-x' },
    { label: 'Dryer Y', value: 'dryer-y' },
    { label: 'Dryer Z', value: 'dryer-z' },
];

const millers = [
    { label: 'Miller 1', value: 'miller-1' },
    { label: 'Miller 2', value: 'miller-2' },
    { label: 'Miller 3', value: 'miller-3' },
];

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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        const updatedPalay = {
            ...selectedPalay,
            ...formData,
            status,
            warehouseId: selectedWarehouse ? selectedWarehouse.value : formData.warehouseId,
            dryerId: selectedDryer ? selectedDryer.value : formData.dryerId,
            millerId: selectedMiller ? selectedMiller.value : formData.millerId
        };

        onUpdatePalay(updatedPalay);
        onHide();
    };

    const renderForm = () => {
        switch (status) {
            case 'Drying':
                return (
                    <>
                        <div className="sm:col-span-3">
                            <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">Type</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.type || ''}
                                    name="type"
                                    placeholder="Type"
                                    aria-label="type"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="dryerName" className="block text-sm font-medium leading-6 text-gray-900">Dryer Name</label>
                            <div className="mt-2">
                                <Dropdown
                                    value={selectedDryer}
                                    options={dryers}
                                    onChange={(e) => setSelectedDryer(e.value)}
                                    placeholder="Select Dryer"
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="dateSent" className="block text-sm font-medium leading-6 text-gray-900">Date Sent</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.dateSent || ''}
                                    name="dateSent"
                                    type="date"
                                    placeholder="Date Sent"
                                    aria-label="dateSent"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="dateReturned" className="block text-sm font-medium leading-6 text-gray-900">Date Returned</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.dateReturned || ''}
                                    name="dateReturned"
                                    type="date"
                                    placeholder="Date Returned"
                                    aria-label="dateReturned"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="palayQuantitySent" className="block text-sm font-medium leading-6 text-gray-900">Palay Quantity Sent</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.palayQuantitySent || ''}
                                    name="palayQuantitySent"
                                    type="number"
                                    placeholder="Palay Quantity Sent"
                                    aria-label="palayQuantitySent"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="palayQuantityReturned" className="block text-sm font-medium leading-6 text-gray-900">Palay Quantity Returned</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.palayQuantityReturned || ''}
                                    name="palayQuantityReturned"
                                    type="number"
                                    placeholder="Palay Quantity Returned"
                                    aria-label="palayQuantityReturned"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'Milling':
                return (
                    <>
                        <div className="sm:col-span-3">
                            <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">Type</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.type || ''}
                                    name="type"
                                    placeholder="Type"
                                    aria-label="type"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="millerName" className="block text-sm font-medium leading-6 text-gray-900">Miller Name</label>
                            <div className="mt-2">
                                <Dropdown
                                    value={selectedMiller}
                                    options={millers}
                                    onChange={(e) => setSelectedMiller(e.value)}
                                    placeholder="Select Miller"
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="dateSent" className="block text-sm font-medium leading-6 text-gray-900">Date Sent</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.dateSent || ''}
                                    name="dateSent"
                                    type="date"
                                    placeholder="Date Sent"
                                    aria-label="dateSent"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="dateReturned" className="block text-sm font-medium leading-6 text-gray-900">Date Returned</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.dateReturned || ''}
                                    name="dateReturned"
                                    type="date"
                                    placeholder="Date Returned"
                                    aria-label="dateReturned"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="palayQuantitySent" className="block text-sm font-medium leading-6 text-gray-900">Palay Quantity Sent</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.palayQuantitySent || ''}
                                    name="palayQuantitySent"
                                    type="number"
                                    placeholder="Palay Quantity Sent"
                                    aria-label="palayQuantitySent"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="palayQuantityReturned" className="block text-sm font-medium leading-6 text-gray-900">Palay Quantity Returned</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.palayQuantityReturned || ''}
                                    name="palayQuantityReturned"
                                    type="number"
                                    placeholder="Palay Quantity Returned"
                                    aria-label="palayQuantityReturned"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="efficiency" className="block text-sm font-medium leading-6 text-gray-900">Efficiency</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.efficiency || ''}
                                    name="efficiency"
                                    placeholder="efficiency"
                                    aria-label="efficiency"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'Rice':
                return (
                    <>
                        <div className="sm:col-span-3">
                            <label htmlFor="date_received" className="block text-sm font-medium leading-6 text-gray-900">Date Received</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.dateReceived || ''}
                                    name="dateReceived"
                                    type="date"
                                    placeholder="Date Received"
                                    aria-label="date_received"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">Quantity</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.quantity || ''}
                                    name="quantity"
                                    type="number"
                                    placeholder="Quantity"
                                    aria-label="quantity"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="quality_type" className="block text-sm font-medium leading-6 text-gray-900">Quality Type</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.qualityType || ''}
                                    name="qualityType"
                                    placeholder="Quality Type"
                                    aria-label="quality_type"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="recipient_id" className="block text-sm font-medium leading-6 text-gray-900">Recipient ID</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.recipientId || ''}
                                    name="recipientId"
                                    placeholder="Recipient ID"
                                    aria-label="recipient_id"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="warehouse" className="block text-sm font-medium leading-6 text-gray-900">Warehouse</label>
                            <div className="mt-2">
                                <Dropdown
                                    value={selectedWarehouse}
                                    options={warehouses}
                                    onChange={(e) => setSelectedWarehouse(e.value)}
                                    placeholder="Select Warehouse"
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="driver_name" className="block text-sm font-medium leading-6 text-gray-900">Driver Name</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.driverName || ''}
                                    name="driverName"
                                    placeholder="Driver Name"
                                    aria-label="driver_name"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="type_of_transpo" className="block text-sm font-medium leading-6 text-gray-900">Type of Transpo</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.typeOfTranspo || ''}
                                    name="typeOfTranspo"
                                    placeholder="Type of Transpo"
                                    aria-label="type_of_transpo"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900">Plate Number</label>
                            <div className="mt-2">
                                <InputComponent
                                    inputIcon={<Wheat size={20} />}
                                    onChange={handleInputChange}
                                    value={formData.plateNumber || ''}
                                    name="plateNumber"
                                    placeholder="Plate Number"
                                    aria-label="plate_number"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'Palay':
                return (
                    <>
                        <div className="sm:col-span-3">
                            <label htmlFor="warehouseName" className="block text-sm font-medium leading-6 text-gray-900">Warehouse</label>
                            <div className="mt-2">
                                <Dropdown
                                    value={selectedWarehouse}
                                    options={warehouses}
                                    onChange={(e) => setSelectedWarehouse(e.value)}
                                    placeholder="Select Warehouse"
                                    className="w-full"
                                />
                            </div>
                        </div>
                        {/* Other fields remain the same */}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Update Palay" modal style={{ width: '60vw' }}>
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