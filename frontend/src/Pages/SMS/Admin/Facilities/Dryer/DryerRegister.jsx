import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { ThermometerSun } from 'lucide-react';

function DryerRegister({ visible, onHide, onDryerRegistered }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = React.useRef(null);

    const [dryerName, setDryerName] = useState('');
    const [userId, setUserId] = useState('0');
    const [capacity, setCapacity] = useState('');
    const [processing, setProcessing] = useState('0');
    const [location, setLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('active');
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    const resetForm = () => {
        setDryerName('');
        setCapacity('');
        setLocation('');
        setContactNumber('');
        setEmail('');
        setStatus('active');
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!dryerName || !capacity || !location || !contactNumber || !email) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'All fields are required.', 
                life: 3000 
            });
            return;
        }

        setIsSubmitting(true);

        const newDryer = {
            dryerName,
            userId,
            location,
            capacity,
            processing,
            contactNumber,
            email,
            status
        };

        try {
            const res = await fetch(`${apiUrl}/dryers`, {
                method: 'POST',
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify(newDryer)
            });
            
            if (!res.ok) {
                throw new Error('Error adding data');
            }
            
            const data = await res.json();
            resetForm();
            onDryerRegistered(data);
            onHide();
        } catch (error) {
            console.log(error.message);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to register warehouse. Please try again.', 
                life: 3000 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Toast ref={toast} />
            <div className="bg-white rounded-lg p-5 w-1/3 shadow-lg relative">
                {/* Close button */}
                <button onClick={onHide} className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 ring-0">
                    ✕
                </button>

                {/* Header */}
                <div className="flex items-center mb-4">
                    <ThermometerSun className="w-6 h-6 mr-2 text-black" />
                    <span className="text-md font-semibold">Dryer Details</span>
                </div>

                {/* Form Content */}
                <form onSubmit={handleRegister}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dryerName" className="block text-sm font-medium text-gray-700">Dryer Name</label>
                            <InputText
                                id="dryerName"
                                value={dryerName}
                                onChange={(e) => setDryerName(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                            />
                        </div>

                        <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                            <InputText
                                id="capacity"
                                value={capacity}
                                type='number'
                                onChange={(e) => setCapacity(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <InputText
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                            />
                        </div>

                        <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <InputText
                                id="contactNumber"
                                value={contactNumber}
                                type='number'
                                onChange={(e) => setContactNumber(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <Dropdown
                                id="status"
                                value={status}
                                options={statusOptions}
                                onChange={(e) => setStatus(e.value)}
                                placeholder="Select Status"
                                className="w-full rounded-md border border-gray-300 ring-0"
                            />
                        </div>

                        <Button
                            label="Add New"
                            disabled={isSubmitting}
                            className="col-start-2 row-start-7 bg-primary text-white py-2 rounded-md ring-0"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DryerRegister;
