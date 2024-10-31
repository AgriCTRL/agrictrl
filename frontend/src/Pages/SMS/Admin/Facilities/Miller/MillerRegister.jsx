import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { Factory } from 'lucide-react';

function MillerRegister({ visible, onHide, onMillerRegistered }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = React.useRef(null);

    const [millerName, setMillerName] = useState('');
    const [userId, setUserId] = useState('0');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('In House');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState('');
    const [processing, setProcessing] = useState('0');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('active');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    const categoryOptions = [
        { label: 'Small', value: 'Small' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Large', value: 'Large' }
    ];

    const resetForm = () => {
        setMillerName('');
        setCategory('');
        setLocation('0');
        setCapacity('');
        setContactNumber('');
        setEmail('');
        setStatus('active');
    };

    const handleRegister = async (e) => {
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

        const newMiller = {
            millerName,
            userId,
            category,
            type,
            location,
            capacity,
            processing,
            contactNumber,
            email,
            status
        };

        try {
            const res = await fetch(`${apiUrl}/millers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMiller)
            });
            if (!res.ok) {
                throw new Error('Error adding data');
            }

            const data = await res.json();
            resetForm();
            onMillerRegistered(data);
            onHide();
        } catch (error) {
            console.error(error.message);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to register miller. Please try again.', 
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
                    <Factory className="w-6 h-6 mr-2 text-black" />
                    <span className="text-md font-semibold">Miller Details</span>
                </div>

                {/* Form Content */}
                <form onSubmit={handleRegister}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="millerName" className="block text-sm font-medium text-gray-700">Miller Name</label>
                            <InputText
                                id="millerName"
                                value={millerName}
                                onChange={(e) => setMillerName(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <Dropdown
                                id="category"
                                value={category}
                                options={categoryOptions}
                                onChange={(e) => setCategory(e.value)}
                                className="w-full rounded-md border border-gray-300 ring-0"
                            />
                        </div>

                        <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                            <InputText
                                id="capacity"
                                type='number'
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                                keyfilter="int"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <InputText
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <InputText
                                id="contactNumber"
                                type='number'
                                value={contactNumber}
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
                                maxLength={50}
                                keyfilter="email"
                            />
                        </div>

                        <div className='col-span-2'>
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
                            label="Register" 
                            disabled={isSubmitting} 
                            className="col-start-2 row-start-7 bg-primary text-white py-2 rounded-md ring-0"
                        />
                        
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MillerRegister;
