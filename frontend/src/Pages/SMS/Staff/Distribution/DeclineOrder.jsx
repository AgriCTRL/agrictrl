import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';

const DeclineOrder = ({
    visible,
    onHide,
    onConfirm,
    isLoading,
    declineReason,
    onReasonChange
}) => {
    const handleCancel = () => {
        onHide();
    };

    return (
        <Dialog
            header="Decline Order"
            visible={visible}
            className="w-1/3"
            onHide={isLoading ? null : handleCancel}
        >
            <div className="flex flex-col items-center gap-5">
                <p>Are you sure you want to decline this request?</p>
                <div className="w-full">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        Reason <span className="text-red-500">*</span>
                    </label>
                    <InputTextarea
                        id="reason"
                        name="reason"
                        value={declineReason}
                        onChange={(e) => onReasonChange(e.target.value)}
                        className="w-full ring-0"
                        maxLength={250}
                    />
                </div>
                <div className="flex justify-between w-full gap-4">
                    <Button 
                        label="Cancel" 
                        icon="pi pi-times" 
                        onClick={handleCancel} 
                        className="w-1/2 bg-transparent text-primary border-primary" 
                        disabled={isLoading}
                    />
                    <Button 
                        label="Confirm Decline" 
                        icon="pi pi-check" 
                        onClick={onConfirm} 
                        className="w-1/2 bg-primary hover:border-none" 
                        disabled={isLoading} 
                        loading={isLoading}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default DeclineOrder;