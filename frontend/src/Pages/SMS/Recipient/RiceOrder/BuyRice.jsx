import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Wheat } from 'lucide-react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';
import { useAuth } from '../../../Authentication/Login/AuthContext';
import { Toast } from 'primereact/toast';

const initialFormData = {
    riceType: 'NFA Rice',
    quantity: '',
    description: '',
    date: null,
    ricePrice: '30',
    weightInKilo: '',
    totalPrice: '₱ 0'
};

function BuyRice({ visible, onHide, onRiceOrdered }) {
    const [formData, setFormData] = useState(initialFormData);
    const { user } = useAuth();
    const toast = useRef(null);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            setFormData(initialFormData);
        }
    }, [visible]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'quantity') {
            if (value && !/^\d*$/.test(value)) {
                return;
            }
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
            updateWeightAndPrice(value);
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const updateWeightAndPrice = (quantity) => {
        const bags = parseInt(quantity) || 0;
        const weightInKilo = bags * 50;
        
        let pricePerKilo = 30;

        const totalPrice = weightInKilo * pricePerKilo;

        setFormData(prevState => ({
            ...prevState,
            weightInKilo: `${weightInKilo} kg`,
            totalPrice: `₱ ${totalPrice.toLocaleString()}`
        }));
    };

    const handleDateChange = (e) => {
        const selectedDate = e.value;
        if (selectedDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Invalid Date',
                    detail: 'Please select a future date',
                    life: 3000
                });
                return;
            }

            const offset = selectedDate.getTimezoneOffset();
            const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
            const formattedDate = adjustedDate.toISOString().split('T')[0];
            
            setFormData(prevState => ({
                ...prevState,
                date: formattedDate
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                date: null
            }));
        }
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.quantity) {
            errors.push('Please enter quantity of bags');
        }

        if (!formData.date) {
            errors.push('Please select a delivery date');
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Required Field',
                    detail: error,
                    life: 3000
                });
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const riceOrder = {
            riceRecipientId: user.id,
            dropOffLocation: '',
            riceQuantityBags: formData.quantity,
            description: formData.description,
            totalCost: formData.totalPrice,
            preferredDeliveryDate: formData.date
        }

        try {
            const res = await fetch(`${apiUrl}/riceorders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': `${apiKey}`
                },
                body: JSON.stringify(riceOrder)
            })
            if(!res.ok) {
                throw new Error('failed rice order')
            }
            setIsLoading(false);
            onHide();
            onRiceOrdered();
            setFormData(initialFormData);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Placed order successfully!',
                life: 3000
            });
        }
        catch(error) {
            console.error(error.message);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to place rice order. Please try again.',
                life: 3000
            });
        }
    };

    const handleClose = () => {
        setFormData(initialFormData);
        onHide();
    };

    const customDialogHeader = (
        <div className="flex items-center space-x-2">
            <Wheat size={22} className="text-black" />
            <h3 className="text-md font-bold text-black">Order Rice</h3>
        </div>
    );

    return (
        <>
            <Toast ref={toast}/>
            <Dialog 
                visible={visible} 
                onHide={isLoading ? null : onHide}
                header={customDialogHeader} 
                modal 
                style={{ minWidth: '60vw', maxWidth: '60vw' }}
                footer={
                    <div className="flex justify-between">
                        <Button 
                            label="Cancel" 
                            onClick={handleClose} 
                            className="py-2 px-14 bg-primary"
                            disabled={isLoading}
                        />
                        <Button 
                            label="Submit Order" 
                            onClick={handleSubmit} 
                            className="py-2 px-14 bg-primary"
                            disabled={isLoading}
                        />
                    </div>
                }
            >
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex w-full gap-4">
                        <div className="flex flex-col gap-2 w-full">
                            <div className="w-full">
                                <label htmlFor="riceType" className="block text-sm font-medium text-gray-700 mb-1">Rice Type</label>
                                <InputText
                                    id="riceType"
                                    name="riceType"
                                    value={formData.riceType}
                                    className="ring-0 w-full placeholder:text-gray-400"
                                    disabled
                                />
                            </div>

                            <div className="w-full">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity in Bags (50kg per bag) <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Enter quantity"
                                    className='w-full focus:ring-0'
                                />
                            </div>

                            <div className="w-full mt-4">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Preferred Date of Delivery <span className="text-red-500">*</span>
                                </label>
                                <Calendar
                                    id="date"
                                    name="date"
                                    value={formData.date ? new Date(formData.date) : null}
                                    onChange={handleDateChange}
                                    placeholder="Select date"
                                    className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                                    minDate={new Date()}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-1/3">
                            <div className="w-full">
                                <label htmlFor="ricePrice" className="block text-sm font-medium text-gray-700 mb-1">Price Per Kilo</label>
                                <InputText
                                    id="ricePrice"
                                    name="ricePrice"
                                    disabled
                                    value={formData.ricePrice}
                                    className='w-full focus:ring-0 text-center'
                                />
                            </div>

                            <div className="w-full">
                                <label htmlFor="weightInKilo" className="block text-sm font-medium text-gray-700 mb-1">Weight in Kilo</label>
                                <InputText
                                    id="weightInKilo"
                                    name="weightInKilo"
                                    disabled
                                    value={formData.weightInKilo}
                                    className='w-full focus:ring-0 text-center'
                                />
                            </div>

                            <div className="border-b-2 border-black mt-2"></div>

                            <div className="w-full">
                                <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
                                <InputText
                                    id="totalPrice"
                                    name="totalPrice"
                                    disabled
                                    value={formData.totalPrice}
                                    className='w-full focus:ring-0 text-center'
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <InputTextarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter description"
                            className="w-full ring-0"
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default BuyRice;