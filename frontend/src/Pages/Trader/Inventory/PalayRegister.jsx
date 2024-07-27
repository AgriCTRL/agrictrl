import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import InputComponent from '@/Components/Form/InputComponent';
import { Wheat } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';

function PalayRegister({ visible, onHide, onPalayRegistered }) {
    const [formData, setFormData] = useState({
        dateReceived: '',
        quantity: '',
        qualityType: '',
        price: '',
        moistureContent: '',
        purity: '',
        damaged: '',
        driverName: '',
        typeOfTranspo: '',
        plateNumber: '',
        selectedWarehouse: null
    });

    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const response = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/warehouses');
            const data = await response.json();
            setWarehouses(data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDropdownChange = (e, name) => {
        setFormData(prevState => ({ ...prevState, [name]: e.value }));
    };

    const handleRegister = async () => {
        try {
            // Post to qualitySpecs table
            const qualitySpecResponse = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/qualityspecs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    moistureContent: parseFloat(formData.moistureContent),
                    purity: parseFloat(formData.purity),
                    damaged: parseFloat(formData.damaged),
                }),
            });
            const qualitySpecData = await qualitySpecResponse.json();

            // Post to palayDeliveries table
            const palayDeliveryResponse = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/palaydeliveries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    driverName: formData.driverName,
                    typeOfTranspo: formData.typeOfTranspo,
                    plateNumber: formData.plateNumber,
                }),
            });
            const palayDeliveryData = await palayDeliveryResponse.json();

            // Post to palayBatches table
            const newPalay = {
                ...formData,
                status: 'Palay',
                qualitySpecId: qualitySpecData.id,
                palayDeliveryId: palayDeliveryData.id,
                supplierId: 1, // Dummy data
                nfaPersonnelId: 1, // Dummy data
                warehouseId: formData.selectedWarehouse ? formData.selectedWarehouse.id : null,
            };

            const palayBatchResponse = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/palaybatches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPalay),
            });

            if (!palayBatchResponse.ok) {
                throw new Error(`HTTP error! status: ${palayBatchResponse.status}`);
            }

            const palayBatchData = await palayBatchResponse.json();

            onPalayRegistered(palayBatchData);

            // Reset all fields
            setFormData({
                dateReceived: '',
                quantity: '',
                qualityType: '',
                price: '',
                moistureContent: '',
                purity: '',
                damaged: '',
                driverName: '',
                typeOfTranspo: '',
                plateNumber: '',
                selectedWarehouse: null
            });

            onHide();
        } catch (error) {
            console.error('Error registering palay:', error);
        }
    };

    const renderInputField = (label, name, type = "text", placeholder) => (
        <div className="mb-4">
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

    const renderDropdownField = (label, name, value, options, placeholder) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-xl text-black font-semibold">{label}</label>
            <div className="mt-2">
                <Dropdown
                    value={value}
                    options={options}
                    onChange={(e) => handleDropdownChange(e, name)}
                    placeholder={placeholder}
                    optionLabel="facilityName"
                    optionValue="id"
                    className="w-full p-3 bg-neutral-200"
                />
            </div>
        </div>
    );

    return (
        <Dialog visible={visible} onHide={onHide} header="Register Palay" modal style={{ width: '60vw' }}>
            <section className='Palay Information flex flex-col gap-4'>
                <p className='text-xl text-black font-semibold'>Palay Information</p>
                <div className="flex flex-row gap-2 bg-neutral-200 rounded-sm p-2">
                    {renderInputField("Date Received", "dateReceived", "date", "Date Received")}
                    {renderInputField("Quantity (KG)", "quantity", "number", "Quantity (KG)")}
                    {renderInputField("Quality Type", "qualityType", "text", "Quality Type")}
                    {renderInputField("Price", "price", "number", "Price")}
                </div>

                <div className="flex flex-col gap-2">
                    <div>
                        <label htmlFor="moistureContent" className="block text-xl text-black font-semibold">Quality Specifications</label>
                        <div className="grid grid-cols-1 p-2 gap-4 mt-2 sm:grid-cols-3 bg-neutral-200 rounded-sm">
                            {renderInputField("Moisture Content", "moistureContent", "number", "Moisture Content")}
                            {renderInputField("Purity", "purity", "number", "Purity")}
                            {renderInputField("Damaged", "damaged", "number", "Damaged")}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="driverName" className="block text-xl text-black font-semibold">Delivery Details</label>
                        <div className="grid grid-cols-1 p-2 gap-4 mt-2 sm:grid-cols-3 bg-neutral-200 rounded-sm">
                            {renderInputField("Driver Name", "driverName", "text", "Driver Name")}
                            {renderInputField("Type of Transport", "typeOfTranspo", "text", "Type of Transport")}
                            {renderInputField("Plate Number", "plateNumber", "text", "Plate Number")}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    {renderDropdownField("Warehouse", "selectedWarehouse", formData.selectedWarehouse, warehouses, "Select a Warehouse")}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="bg-primary p-2 font-bold text-white" />
                    <Button label="Register" icon="pi pi-check" onClick={handleRegister} className="bg-primary p-2 font-bold text-white"  />
                </div>
            </section>
        </Dialog>
    );
}

export default PalayRegister;
