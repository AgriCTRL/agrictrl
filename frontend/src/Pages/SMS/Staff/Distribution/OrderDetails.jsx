import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

const OrderDetails = ({
    visible,
    onHide,
    isLoading,
    orderDetails,
    formatDate
}) => {
    return (
        <Dialog
            header="Order Details"
            visible={visible}
            className="w-1/3"
            onHide={onHide}
        >
            <div className="flex flex-col gap-4">
                <div className="field">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                    <InputText
                        value={`0304-${orderDetails.orderID}`}
                        disabled
                        className="w-full bg-gray-50"
                        keyfilter="alphanum"
                        maxLength={25}
                    />
                </div>
                
                <div className="field">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Bags</label>
                    <InputText
                        value={orderDetails.quantity}
                        disabled
                        className="w-full bg-gray-50"
                        keyfilter="num"
                    />
                </div>

                <div className="field">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <InputTextarea
                        value={orderDetails.description}
                        disabled
                        className="w-full bg-gray-50"
                        rows={3}
                    />
                </div>

                <div className="field">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Ordered</label>
                    <InputText
                        value={formatDate(orderDetails.orderDate)}
                        disabled
                        className="w-full bg-gray-50"
                    />
                </div>

                <div className="field">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <InputText
                        value={orderDetails.status}
                        disabled
                        className="w-full bg-gray-50"
                    />
                </div>

                <div className="flex justify-center w-full gap-4 mt-5">
                    <Button 
                        label="Close" 
                        icon="pi pi-times" 
                        onClick={onHide} 
                        className="w-1/2 bg-transparent text-primary border-primary" 
                        disabled={isLoading}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default OrderDetails;