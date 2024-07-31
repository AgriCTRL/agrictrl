import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import InputComponent from '@/Components/Form/InputComponent';
import { Warehouse } from 'lucide-react';

function WarehouseRegister({ visible, onHide, onWarehouseRegistered }) {
    const [facilityName, setFacilityName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [status, setStatus] = useState('Active');

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'facilityName':
                setFacilityName(value);
                break;
            case 'capacity':
                setCapacity(value);
                break;
            case 'location':
                setLocation(value);
                break;
            case 'contactInfo':
                setContactInfo(value);
                break;
            default:
                break;
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const newWarehouse = {
            facilityName,
            capacity,
            location,
            contactInfo,
            status
        };

        try {
            const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/warehouses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWarehouse)
            });
            if (!res.ok) {
                throw new Error('Error adding data');
            }
        } catch (error) {
            console.log(error.message);
        }

        onWarehouseRegistered(newWarehouse);

        setFacilityName('');
        setCapacity('');
        setLocation('');
        setContactInfo('');
        setStatus('Active');

        onHide();
    };

    const renderInputField = (label, name, type, value, placeholder) => (
        <div className="sm:col-span-3 mb-3">
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="mt-2">
                <InputComponent
                    inputIcon={<Warehouse size={20} />}
                    onChange={handleInputChange}
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
        <Dialog visible={visible} onHide={onHide} header="Register Warehouse" modal style={{ width: '40vw' }}>
            <div className="p-grid p-nogutter">
                <form onSubmit={handleRegister} className="p-col-12 p-2">
                    {renderInputField("Warehouse Name", "facilityName", "text", facilityName, "Enter warehouse name")}
                    {renderInputField("Capacity", "capacity", "number", capacity, "Enter capacity")}
                    {renderInputField("Location", "location", "text", location, "Enter location")}
                    {renderInputField("Contact", "contactInfo", "text", contactInfo, "Enter contact info")}
                    {renderDropdownField("Status", "status", status, statusOptions, "Select status", (e) => setStatus(e.value))}

                    <div className="flex justify-center mt-4">
                        <Button label="Register" className="p-button-success border p-2 px-5 text-white font-bold bg-gradient-to-r from-[#00C261] to-[#005155] " />
                    </div>
                </form>
            </div>
        </Dialog>
    );
}

export default WarehouseRegister;
