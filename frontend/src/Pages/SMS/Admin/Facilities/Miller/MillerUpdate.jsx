import React, { useState, useEffect, useRef } from 'react';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { Factory } from 'lucide-react';

function MillerUpdate({ visible, onHide, selectedMiller, onUpdateMiller }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    
    const [millerName, setMillerName] = useState('');
    const [userId, setUserId] = useState('0');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('active');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    const categoryOptions = [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' }
    ];

    useEffect(() => {
        if (selectedMiller) {
            setMillerName(selectedMiller.millerName);
            setCategory(selectedMiller.category);
            setCapacity(selectedMiller.capacity);
            setLocation(selectedMiller.location);
            setContactNumber(selectedMiller.contactNumber);
            setEmail(selectedMiller.email);
            setStatus(selectedMiller.status);
        }
    }, [selectedMiller]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!millerName || !category || !capacity || !location || !contactNumber || !email) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'All fields are required.', 
                life: 3000 
            });
            return;
        }

        setIsSubmitting(true);
        const updatedMiller = {
            ...selectedMiller,
            millerName,
            category,
            location,
            capacity,
            contactNumber,
            email,
            status
        };

        try {
            const res = await fetch(`${apiUrl}/millers/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMiller)
            });
            if (!res.ok) {
                throw new Error('Error updating data');
            }

            const data = await res.json();
            onUpdateMiller(data);
            onHide();
        } catch (error) {
            console.log(error.message);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to update warehouse. Please try again.', 
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
                <button onClick={onHide} className="absolute top-5 right-5 text-gray-600 hover:text-gray-800">
                    ✕
                </button>

                {/* Header */}
                <div className="flex items-center mb-4">
                    <Factory className="w-6 h-6 mr-2 text-black" />
                    <span className="text-md font-semibold">Update Miller</span>
                </div>

                {/* Form Content */}
                <form onSubmit={handleUpdate}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="millerName" className="block text-sm font-medium text-gray-700">Miller Name</label>
                            <InputText
                                id="millerName"
                                value={millerName}
                                onChange={(e) => setMillerName(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <Dropdown
                                id="category"
                                value={category}
                                options={categoryOptions}
                                onChange={(e) => setCategory(e.value)}
                                className="w-full rounded-md border border-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                            <InputText
                                id="capacity"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <InputText
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
                            />
                        </div>

                        <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <InputText
                                id="contactNumber"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
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
                                className="w-full rounded-md border border-gray-300"
                            />
                        </div>

                        {/* Cancel Button */}
                        <Button
                            label="Cancel"
                            onClick={onHide}
                            className="col-start-1 row-start-7 bg-transparent border border-primary text-primary py-2 rounded-md"
                        />

                        {/* Update Button */}
                        <Button
                            label="Update"
                            disabled={isSubmitting}
                            className="col-start-2 row-start-7 bg-primary text-white py-2 rounded-md"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MillerUpdate;
