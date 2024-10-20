import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

import { Wheat } from 'lucide-react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';

const initialFormData = {
    riceType: '',
    quantity: '',
    description: '',
    date: null,
    ricePrice: '',
    weightInKilo: '',
    totalPrice: '₱ 0'
};

function PalayRegister({ visible, onHide, onPalayRegistered }) {
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (visible) {
            setFormData(initialFormData);
        }
    }, [visible]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'riceType') {
            updateRicePrice(value);
        } else if (name === 'quantity') {
            updateWeightAndPrice(value, formData.riceType);
        }
    };

    const updateRicePrice = (riceType) => {
        let pricePerKilo = 0;
        if (riceType === 'sinandomeng') {
            pricePerKilo = 30;
        } else if (riceType === 'angelica') {
            pricePerKilo = 40;
        } else if (riceType === 'jasmine') {
            pricePerKilo = 50;
        }
        
        setFormData(prevState => ({
            ...prevState,
            ricePrice: `₱ ${pricePerKilo}`
        }));

        updateWeightAndPrice(formData.quantity, riceType);
    };

    const updateWeightAndPrice = (quantity, riceType) => {
        const bags = parseInt(quantity) || 0;
        const weightInKilo = bags * 50;
        
        let pricePerKilo = 0;
        if (riceType === 'sinandomeng') pricePerKilo = 30;
        else if (riceType === 'angelica') pricePerKilo = 40;
        else if (riceType === 'jasmine') pricePerKilo = 50;

        const totalPrice = weightInKilo * pricePerKilo;

        setFormData(prevState => ({
            ...prevState,
            weightInKilo: `${weightInKilo} kg`,
            totalPrice: `₱ ${totalPrice.toLocaleString()}`
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
                <div className="flex justify-between">
                    <Button 
                        label="Cancel" 
                        onClick={handleClose} 
                        className="py-2 px-14 bg-primary"
                    />
                    <Button 
                        label="Submit Order" 
                        onClick={handleSubmit} 
                        className="py-2 px-14 bg-primary"
                    />
                </div>
            }
        >
            <div className="flex flex-col gap-4 h-full">
                <div className="flex w-full gap-4">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="w-full">
                            <label htmlFor="riceType" className="block text-sm font-medium text-gray-700 mb-1">Rice Type</label>
                            <Dropdown
                                id="riceType"
                                name="riceType"
                                value={formData.riceType}
                                options={[{ label: 'Sinandomeng', value: 'sinandomeng' }, { label: 'Angelica', value: 'angelica' }, { label: 'Jasmine', value: 'jasmine' }]}
                                onChange={handleInputChange}
                                placeholder="Select rice type"
                                className="ring-0 w-full placeholder:text-gray-400"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity in Bags (50kg per bag)</label>
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
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date of Delivery</label>
                            <Calendar
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                placeholder="Select date"
                                className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
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

                <div className="w-full flex mb-1 space-x-2">
                    
                </div>
            </div>
        </Dialog>
    );
}

export default PalayRegister;
