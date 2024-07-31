import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import InputComponent from '@/Components/Form/InputComponent';
import { Factory } from 'lucide-react';

function MillerRegister({ visible, onHide, onMillerRegistered }) {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [status, setStatus] = useState('Active');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                setName(value);
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
        setIsSubmitting(true);

        const newMiller = {
            name,
            capacity,
            location,
            contactInfo,
            status
        };

        try {
            const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMiller)
            });
            if (!res.ok) {
                throw new Error('Error adding data');
            }
        } catch (error) {
            console.log(error.message);
        }

        onMillerRegistered(newMiller);

        setName('');
        setCapacity('');
        setLocation('');
        setContactInfo('');
        setStatus('Active');

        setIsSubmitting(false);
        onHide();
    };

    const renderInputField = (label, name, type, value, placeholder) => (
        <div className="sm:col-span-3 mb-3">
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="mt-2">
                <InputComponent
                    inputIcon={<Factory size={20} />}
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
        <Dialog visible={visible} onHide={onHide} header="Register Miller" modal style={{ width: '40vw' }}>
            <div className="p-grid p-nogutter">
                <form onSubmit={handleRegister} className="p-col-12 p-2">
                    {renderInputField("Miller Name", "name", "text", name, "Enter miller name")}
                    {renderInputField("Capacity", "capacity", "number", capacity, "Enter capacity")}
                    {renderInputField("Location", "location", "text", location, "Enter location")}
                    {renderInputField("Contact Info", "contactInfo", "text", contactInfo, "Enter contact info")}
                    {renderDropdownField("Status", "status", status, statusOptions, "Select status", (e) => setStatus(e.value))}

                    <div className="flex justify-center mt-4">
                        <Button label="Register" disabled={isSubmitting} className="p-button-success border p-2 px-5 text-white font-bold bg-gradient-to-r from-[#00C261] to-[#005155]" />
                    </div>
                </form>
            </div>
        </Dialog>
    );
}

export default MillerRegister;