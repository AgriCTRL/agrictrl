import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

import { Truck } from 'lucide-react';

function TransporterRegister({ visible, onHide, onTransporterRegistered }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = React.useRef(null);

    const [transporterType, setTransporterType] = useState('In House');
    const [transporterName, setTransporterName] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('active');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    const transporterTypeOptions = [
        { label: 'Private', value: 'Private' },
        { label: 'In House', value: 'In House' }
    ];

    const resetForm = () => {
        setTransporterType('');
        setTransporterName('');
        setPlateNumber('');
        setDescription('');
        setStatus('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!transporterType || !transporterName || !plateNumber) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Transporter Type, Name, and Plate Number are required.', 
                life: 3000 
            });
            return;
        }

        setIsSubmitting(true);

        const newTransporter = {
            transporterType,
            transporterName,
            plateNumber,
            description,
            status
        };

        try {
            const res = await fetch(`${apiUrl}/transporters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTransporter)
            });
            
            if (!res.ok) {
                throw new Error('Error adding transporter');
            }

            const data = await res.json();
            resetForm();
            onTransporterRegistered(data);
            onHide();
        } catch (error) {
            console.error(error.message);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to register transporter. Please try again.', 
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
                <button onClick={onHide} className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 ring-0">
                    ✕ 
                </button>

                <div className="flex items-center mb-4">
                    <Truck className="w-6 h-6 mr-2 text-black" />
                    <span className="text-md font-semibold">Transporter Details</span>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="transporterType" className="block text-sm font-medium text-gray-700">Transporter Type</label>
                            <Dropdown
                                id="transporterType"
                                value={transporterType}
                                options={transporterTypeOptions}
                                onChange={(e) => setTransporterType(e.value)}
                                placeholder="Select Transporter Type"
                                className="w-full rounded-md border border-gray-300 ring-0"
                                disabled
                            />
                        </div>

                        <div>
                            <label htmlFor="transporterName" className="block text-sm font-medium text-gray-700">Transporter Name</label>
                            <InputText
                                id="transporterName"
                                value={transporterName}
                                onChange={(e) => setTransporterName(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">Plate Number</label>
                            <InputText
                                id="plateNumber"
                                value={plateNumber}
                                onChange={(e) => setPlateNumber(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                                maxLength={20}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <InputText
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                                maxLength={200}
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
                            type="submit"
                            disabled={isSubmitting} 
                            className="bg-primary text-white py-2 rounded-md ring-0 col-span-2"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TransporterRegister;