import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

import { Wheat } from 'lucide-react';
import { InputTextarea } from 'primereact/inputtextarea';

const initialFormData = {
    riceType: '',
    quantity: '',
    description: '',
    date: null,
    price: '₱ 0'
};

function DeclinedDetails({ visible, onHide, data }) {
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (visible) {
            setFormData({
                riceType: data.riceType || '',
                orderId: data.id || '',
                quantity: data.quantity || '',
                description: data.description || '',
                date: data.dateBought || null,
                price: data.price || '₱ 0'
            });
        }
    }, [visible]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'riceType' || name === 'quantity') {
            calculatePrice(name === 'quantity' ? value : formData.quantity, name === 'riceType' ? value : formData.riceType);
        }
    };

    const calculatePrice = (quantity, riceType) => {
        let pricePerKilo = 0;

        if (riceType === 'sinandomeng') {
            pricePerKilo = 30;
        } else if (riceType === 'angelica') {
            pricePerKilo = 40;
        } else if (riceType === 'jasmine') {
            pricePerKilo = 50;
        }

        const calculatedPrice = quantity ? `₱ ${(pricePerKilo * parseInt(quantity) || 0).toLocaleString()}` : '₱ 0';
        setFormData(prevState => ({
            ...prevState,
            price: calculatedPrice
        }));
    };

    const handleSubmit = () => {
        console.log(formData);
        onPalayRegistered(formData);
        setFormData(initialFormData);
        onHide();
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
        <Dialog 
            visible={visible} 
            onHide={onHide} 
            header={customDialogHeader} 
            modal 
            style={{ minWidth: '60vw', maxWidth: '60vw' }}
            footer={
                <div className="flex justify-center">
                    <Button 
                        label="Close" 
                        onClick={handleClose} 
                        className="py-2 px-14 bg-primary"
                    />
                </div>
            }
        >
            <div className="flex flex-col h-full">
                <div className="flex gap-4 w-full">
                    <div className="w-1/2">
                        <label htmlFor="riceType" className="block text-sm font-medium text-gray-700 mb-1">Rice Type</label>
                        <InputText
                            id="riceType"
                            name="riceType"
                            value={formData.riceType}
                            onChange={handleInputChange}
                            disabled
                            className='w-full focus:ring-0'
                        />
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                        <InputText
                            id="orderId"
                            name="orderId"
                            value={formData.orderId}
                            onChange={handleInputChange}
                            disabled
                            className='w-full focus:ring-0'
                        />
                    </div>
                </div>
                <div className="w-1/2">
                    <label htmlFor="riceType" className="block text-sm font-medium text-gray-700 mb-1">Rice Type</label>
                    <InputText
                        id="riceType"
                        name="riceType"
                        value={formData.riceType}
                        onChange={handleInputChange}
                        disabled
                        className='w-full focus:ring-0'
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity (in kilos)</label>
                    <InputText
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        disabled
                        className='w-full focus:ring-0'
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <InputTextarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        disabled
                        className="w-full"
                    />
                </div>

                <div className="w-full flex mb-1 space-x-2">
                    <div className="w-1/2">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                        <Calendar
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            disabled
                            dateFormat="yy-mm-dd"
                            className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                        />
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Estimated Price</label>
                        <InputText
                            id="price"
                            name="price"
                            disabled
                            value={formData.price}
                            className='w-full focus:ring-0'
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default DeclinedDetails;
