import React, { useState, useEffect, useRef } from 'react';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { ThermometerSun } from 'lucide-react';

function DryerUpdate({ visible, onHide, selectedDryer, onUpdateDryer }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);

    const [dryerName, setDryerName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    useEffect(() => {
        if (selectedDryer) {
            setDryerName(selectedDryer.dryerName);
            setCapacity(selectedDryer.capacity);
            setLocation(selectedDryer.location);
            setContactNumber(selectedDryer.contactNumber);
            setEmail(selectedDryer.email);
            setStatus(selectedDryer.status);
        }
    }, [selectedDryer]);

    const handleUpdate = async (e) => {
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
        const updatedDryer = {
            ...selectedDryer,
            dryerName,
            location,
            capacity,
            contactNumber,
            email,
            status
        };

        try {
            const res = await fetch(`${apiUrl}/dryers/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDryer)
            });
            
            if (!res.ok) {
                throw new Error('Error updating data');
            }
            
            const data = await res.json();
            onUpdateDryer(data);
            onHide();
            
        } catch (error) {
            console.log(error.message);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to update dryer. Please try again.', 
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
                    <span className="text-md font-semibold">Update Dryer</span>
                </div>

                {/* Form Content */}
                <form onSubmit={handleUpdate}>
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

                        {/* Cancel Button */}
                        <Button
                            label="Cancel"
                            onClick={onHide}
                            className="col-start-1 row-start-7 bg-transparent border border-primary text-primary py-2 rounded-md ring-0"
                        />

                        {/* Update Button */}
                        <Button
                            label="Update"
                            disabled={isSubmitting}
                            className="col-start-2 row-start-7 bg-primary text-white py-2 rounded-md ring-0"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DryerUpdate;
