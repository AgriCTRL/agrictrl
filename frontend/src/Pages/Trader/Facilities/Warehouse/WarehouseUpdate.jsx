import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import InputComponent from '@/Components/Form/InputComponent';
import { Warehouse } from 'lucide-react';

function WarehouseUpdate({ visible, onHide, selectedWarehouse, onUpdateWarehouse }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [facilityName, setFacilityName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    useEffect(() => {
        if (selectedWarehouse) {
            setFacilityName(selectedWarehouse.facilityName);
            setCapacity(selectedWarehouse.capacity);
            setLocation(selectedWarehouse.location);
            setContactInfo(selectedWarehouse.contactInfo);
            setStatus(selectedWarehouse.status);
        }
    }, [selectedWarehouse]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const updatedWarehouse = {
            ...selectedWarehouse,
            facilityName,
            capacity,
            location,
            contactInfo,
            status
        };

        try {
            const res = await fetch(`${apiUrl}/warehouses`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedWarehouse)
            });
            if (!res.ok) {
                throw new Error('Error adding data');
            }
        } catch (error) {
            console.log(error.message);
        }

        onUpdateWarehouse(updatedWarehouse);

        setFacilityName('');
        setCapacity('');
        setLocation('');
        setContactInfo('');
        setStatus(null);

        setIsSubmitting(false);
        onHide();
    };

    const renderInputField = (label, name, type, value, placeholder, onChange) => (
        <div className="sm:col-span-3 mb-3">
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="mt-2">
                <InputComponent
                    inputIcon={<Warehouse size={20} />}
                    onChange={onChange}
                    value={value}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    aria-label={name}
                />
            </div>
        </div>
    );

    const renderDropdownField = (label, name, value, options, placeholder, onChange) => (
        <div className="sm:col-span-3 mb-3">
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

    return (
        <Dialog visible={visible} onHide={onHide} header="Update Warehouse" modal style={{ width: '40vw' }}>
            <div className="p-grid p-nogutter">
                <form onSubmit={handleUpdate} className="p-col-12 p-2">
                    {renderInputField('Warehouse Name', 'facilityName', 'text', facilityName, 'Enter warehouse name', (e) => setFacilityName(e.target.value))}
                    {renderInputField('Capacity', 'capacity', 'number', capacity, 'Enter capacity', (e) => setCapacity(e.target.value))}
                    {renderInputField('Location', 'location', 'text', location, 'Enter location', (e) => setLocation(e.target.value))}
                    {renderInputField('Contact Info', 'contactInfo', 'text', contactInfo, 'Enter contact info', (e) => setContactInfo(e.target.value))}
                    {renderDropdownField('Status', 'status', status, statusOptions, 'Select status', (e) => setStatus(e.value))}

                    <div className="flex justify-center mt-4">
                        <Button label="Update" disabled={isSubmitting} className="p-button-success border p-2 px-5 text-white font-bold bg-gradient-to-r from-[#00C261] to-[#005155] " />
                    </div>
                </form>
            </div>
        </Dialog>
    );
}

export default WarehouseUpdate;
