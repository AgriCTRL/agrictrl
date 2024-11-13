import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { Wheat } from 'lucide-react';
import { InputTextarea } from 'primereact/inputtextarea';

function DeclinedDetails({ visible, onHide, data }) {
    const [formData, setFormData] = useState([]);

    useEffect(() => {
        if (visible) {
            setFormData({
                riceType: 'NFA Rice',
                orderId: data.id,
                quantity: data.riceQuantityBags,
                reason: data.remarks,
                date: new Date(data.orderDate).toISOString().split('T')[0]
            });
            console.log(formData);
        }
    }, [visible]);


    const handleClose = () => {
        onHide();
    };

    const customDialogHeader = (
        <div className="flex items-center space-x-2">
            <Wheat size={22} className="text-black" />
            <h3 className="text-md font-bold text-black">Order Details</h3>
        </div>
    );

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <Dialog 
            visible={visible} 
            onHide={onHide} 
            header={customDialogHeader} 
            modal 
            className="w-1/3"
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
            <div className="flex flex-col h-full gap-4">
                <div className="flex gap-4 w-full">
                    <div className="w-1/2">
                        <label htmlFor="riceType" className="block text-sm font-medium text-gray-700 mb-1">Rice Type</label>
                        <InputText
                            id="riceType"
                            name="riceType"
                            value={formData.riceType}
                            disabled
                            className='w-full focus:ring-0'
                            keyfilter="alphanum"
                            maxLength={50}
                        />
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                        <InputText
                            id="orderId"
                            name="orderId"
                            value={formData.orderId}
                            disabled
                            className='w-full focus:ring-0'
                            keyfilter="alphanum"
                            maxLength={10}
                        />
                    </div>
                </div>

                <div className="flex flex-row w-full gap-4">
                    <div className="w-1/2">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity in Bags</label>
                        <InputText
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            disabled
                            className='w-full focus:ring-0'
                            keyfilter="int"
                        />
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date Ordered</label>
                        <InputText
                            id="date"
                            name="date"
                            value={formatDate(formData.date)}
                            disabled
                            className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                            maxLength={25}
                        />
                    </div>
                </div>
                

                <div className="w-full">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <InputTextarea
                        id="description"
                        name="description"
                        value={formData.reason}
                        disabled
                        className="w-full"
                        maxLength={250}
                    />
                </div>
            </div>
        </Dialog>
    );
}

export default DeclinedDetails;
