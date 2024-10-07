import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Wheat } from 'lucide-react';

function WarehouseUpdate({ visible, onHide, selectedWarehouse, onUpdateWarehouse }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [warehouseName, setWarehouseName] = useState('');
    const [branch, setBranch] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    useEffect(() => {
        if (selectedWarehouse) {
            setWarehouseName(selectedWarehouse.warehouseName);
            setBranch(selectedWarehouse.branch);
            setCapacity(selectedWarehouse.capacity);
            setLocation(selectedWarehouse.location);
            setContactNumber(selectedWarehouse.contactNumber);
            setEmail(selectedWarehouse.email);
            setStatus(selectedWarehouse.status);
        }
    }, [selectedWarehouse]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!warehouseName || !branch || !capacity || !location || !contactNumber || !email || !status) {
            alert('All fields are required.');
            return;
        }

        setIsSubmitting(true);
        const updatedWarehouse = {
            ...selectedWarehouse,
            warehouseName,
            branch,
            capacity,
            location,
            contactNumber,
            email,
            status
        };

        try {
            const res = await fetch(`${apiUrl}/warehouses/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedWarehouse)
            });
            if (!res.ok) {
                throw new Error('Error updating data');
            }
        } catch (error) {
            console.log(error.message);
        }

        onUpdateWarehouse(updatedWarehouse);

        // Clear input fields
        setWarehouseName('');
        setBranch('');
        setCapacity('');
        setLocation('');
        setContactNumber('');
        setEmail('');
        setStatus(null);

        setIsSubmitting(false);
        onHide();
    };

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-5 w-1/3 shadow-lg relative">
                {/* Close button */}
                <button onClick={onHide} className="absolute top-5 right-5 text-gray-600 hover:text-gray-800">
                    ✕
                </button>

                {/* Header */}
                <div className="flex items-center mb-4">
                    <Wheat className="w-6 h-6 mr-2 text-black" />
                    <span className="text-md font-semibold">Update Warehouse</span>
                </div>

                {/* Form Content */}
                <form onSubmit={handleUpdate}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="warehouseName" className="block text-sm font-medium text-gray-700">Warehouse Name</label>
                            <InputText
                                id="warehouseName"
                                value={warehouseName}
                                onChange={(e) => setWarehouseName(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
                            />
                        </div>

                        <div>
                            <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
                            <InputText
                                id="branch"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
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

export default WarehouseUpdate;
