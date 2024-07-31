import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import InputComponent from '@/Components/Form/InputComponent';
import { Factory } from 'lucide-react';

function MillerUpdate({ visible, onHide, selectedMiller, onUpdateMiller }) {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [status, setStatus] = useState(null);

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    useEffect(() => {
        if (selectedMiller) {
            setName(selectedMiller.name);
            setCapacity(selectedMiller.capacity);
            setLocation(selectedMiller.location);
            setContactInfo(selectedMiller.contactInfo);
            setStatus(selectedMiller.status);
        }
    }, [selectedMiller]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedMiller = {
            ...selectedMiller,
            name,
            capacity,
            location,
            contactInfo,
            status
        };

        try {
            const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millers', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMiller)
            });
            if (!res.ok) {
                throw new Error('Error adding data');
            }
        } catch (error) {
            console.log(error.message);
        }

        onUpdateMiller(updatedMiller);

        setName('');
        setCapacity('');
        setLocation('');
        setContactInfo('');
        setStatus(null);

        onHide();
    };

    const renderInputField = (label, name, type, value, placeholder, onChange) => (
        <div className="sm:col-span-3 mb-3">
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="mt-2">
                <InputComponent
                    inputIcon={<Factory size={20} />}
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
        <Dialog visible={visible} onHide={onHide} header="Update Miller" modal style={{ width: '40vw' }}>
            <div className="p-grid p-nogutter">
                <form onSubmit={handleUpdate} className="p-col-12 p-2">
                    {renderInputField('Miller Name', 'name', 'text', name, 'Enter miller name', (e) => setName(e.target.value))}
                    {renderInputField('Capacity', 'capacity', 'number', capacity, 'Enter capacity', (e) => setCapacity(e.target.value))}
                    {renderInputField('Location', 'location', 'text', location, 'Enter location', (e) => setLocation(e.target.value))}
                    {renderInputField('Contact Info', 'contactInfo', 'text', contactInfo, 'Enter contact info', (e) => setContactInfo(e.target.value))}
                    {renderDropdownField('Status', 'status', status, statusOptions, 'Select status', (e) => setStatus(e.value))}

                    <div className="flex justify-center mt-4">
                        <Button label="Update" className="p-button-success border p-2 px-5 text-white font-bold bg-gradient-to-r from-[#00C261] to-[#005155]" />
                    </div>
                </form>
            </div>
        </Dialog>
    );
}

export default MillerUpdate;