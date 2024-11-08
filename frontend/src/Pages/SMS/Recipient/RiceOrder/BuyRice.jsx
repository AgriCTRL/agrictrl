import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Wheat } from 'lucide-react';
import { InputTextarea } from 'primereact/inputtextarea';
import { useAuth } from '../../../Authentication/Login/AuthContext';
import { Toast } from 'primereact/toast';

const initialFormData = {
    riceType: 'NFA Rice',
    quantity: '',
    description: '',
    date: null,
    ricePrice: '30',
    weightInKilo: '',
    totalPrice: '₱0',
    dropOffLocation: ''
};

function BuyRice({ visible, onHide, onRiceOrdered }) {
    
    const { user } = useAuth();
    const toast = useRef(null);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [formData, setFormData] = useState(initialFormData);
    const [riceBatchData, setRiceBatchData] = useState([]);
    const [totalAvailableQuantity, setTotalAvailableQuantity] = useState(0);
    const [averagePrice, setAveragePrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (visible) {
            fetchRiceBatchData();
            setFormData(initialFormData);
            setErrors({});
        }
    }, [visible]);


    const fetchRiceBatchData = async () => {
        try {
            const res = await fetch(`${apiUrl}/ricebatches`);
            if (!res.ok) {
                throw new Error('Failed to fetch rice batch data');
            }
            const data = await res.json();
            
            // Filter for ricebatches that are for sale
            const forSaleRiceBatches = data.filter(batch => batch.forSale === true);
            setRiceBatchData(forSaleRiceBatches);

            // Calculate total available quantity
            const totalQuantity = forSaleRiceBatches.reduce((sum, batch) => sum + batch.currentCapacity, 0);
            setTotalAvailableQuantity(totalQuantity);

            // Calculate average price
            const avgPrice = forSaleRiceBatches.reduce((sum, batch) => sum + batch.price, 0) / forSaleRiceBatches.length;
            setAveragePrice(avgPrice || 0);

            // Update form data with new average price
            setFormData(prev => ({
                ...prev,
                ricePrice: avgPrice.toFixed(2)
            }));
        } catch (error) {
            console.log(error.message);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to fetch rice batch data', 
                life: 3000 
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'quantity') {
            if (value && !/^\d*$/.test(value)) {
                return;
            }

            // Check if quantity exceeds available amount
            const numValue = parseInt(value) || 0;
            if (numValue > totalAvailableQuantity) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Invalid Quantity',
                    detail: `Maximum available quantity is ${totalAvailableQuantity} bags. Value has been adjusted.`,
                    life: 3000
                });
                
                // Set the value to maximum available quantity
                setFormData(prevState => ({
                    ...prevState,
                    quantity: totalAvailableQuantity.toString()
                }));
                updateWeightAndPrice(totalAvailableQuantity.toString());
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
        
        const totalPrice = weightInKilo * averagePrice;

        setFormData(prevState => ({
            ...prevState,
            weightInKilo: `${weightInKilo} kg`,
            totalPrice: `₱${totalPrice.toLocaleString()}`
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
    
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const riceOrder = {
            riceRecipientId: user.id,
            dropOffLocation: formData.dropOffLocation,
            riceQuantityBags: formData.quantity,
            description: formData.description,
            totalCost: formData.totalPrice,
            preferredDeliveryDate: formData.date
        }

        try {
            const res = await fetch(`${apiUrl}/riceorders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(riceOrder)
            })
            if(!res.ok) {
                throw new Error('failed rice order')
            }
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Placed order successfully!',
                life: 3000
            });
            onRiceOrdered();
        } catch (error) {
            console.error(error.message);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to place rice order. Please try again.',
                life: 3000
            });
        } finally {
            setIsLoading(false);
            onHide();
            setFormData(initialFormData);
        }
    };

    const handleClose = () => {
        setFormData(initialFormData);
        onHide();
    };

    const validateForm = () => {
        let newErrors = {};

        // Quantity validation
        if (!formData.quantity.trim()) {
            newErrors.quantity = "Quantity in bags is required";
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Quantity in bags is required',
                life: 5000
            });
        } else if (parseInt(formData.quantity) <= 0) {
            newErrors.quantity = "Quantity must be greater than 0";
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Quantity must be greater than 0',
                life: 5000
            });
        }

        // Date validation
        if (!formData.date) {
            newErrors.date = "Delivery date is required";
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Delivery date is required',
                life: 5000
            });
        }

        // Drop-off location validation
        if (!formData.dropOffLocation.trim()) {
            newErrors.dropOffLocation = "Drop-off location is required";
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Drop-off location is required',
                life: 5000
            });
        }

        //Description validation
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Drop-off location is required',
                life: 5000
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const DialogHeader = (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
                <Wheat size={22} className="text-black" />
                <h3 className="text-md font-bold text-black">Order Rice</h3>
            </div>
            <div className="text-3xl text-gray-600 mr-10">
                Rice For Sale: {totalAvailableQuantity} Bags
            </div>
        </div>
    );

    return (
        <>
            <Toast ref={toast}/>
            <Dialog 
                visible={visible} 
                onHide={isLoading ? null : onHide}
                header={DialogHeader} 
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
                                    keyfilter="alphanum"
                                    maxLength={50}
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
                                    className="w-full focus:ring-0"
                                    keyfilter="int"
                                />
                                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
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
                                    className="ring-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                                    minDate={new Date()}
                                />
                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
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
                                    keyfilter="int"
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
                                    keyfilter="int"
                                />
                            </div>

                            <div className="border-b-2 border-black mt-2"></div>

                            <div className="w-full">
                                <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700 mb-1">Estimated Total Cost</label>
                                <InputText
                                    id="totalPrice"
                                    name="totalPrice"
                                    disabled
                                    value={formData.totalPrice}
                                    className='w-full focus:ring-0 text-center'
                                    keyfilter="int"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <label htmlFor="dropOffLocation" className="block text-sm font-medium text-gray-700 mb-1">
                            Drop-off Location <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            id="dropOffLocation"
                            name="dropOffLocation"
                            value={formData.dropOffLocation}
                            onChange={handleInputChange}
                            placeholder="Enter location"
                            className="w-full ring-0"
                            maxLength={250}
                        />
                        {errors.dropOffLocation && <p className="text-red-500 text-xs mt-1">{errors.dropOffLocation}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Order Description</label>
                        <InputTextarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter description"
                            className="w-full ring-0"
                            maxLength={250}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default BuyRice;