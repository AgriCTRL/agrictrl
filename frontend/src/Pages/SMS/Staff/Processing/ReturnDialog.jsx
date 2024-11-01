import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

const initialTransactionData = {
  item: '',
  itemId: '',
  senderId: '',
  fromLocationType: '',
  fromLocationId: 0,
  transporterName: '',
  transporterDesc: '',
  receiverId: '',
  receiveDateTime: '0',
  toLocationType: '',
  toLocationId: '',
  toLocationName: '',
  status: 'Pending',
  remarks: ''
};

const ReturnDialog = ({ visible, viewMode, newTransactionData, onReturn, onCancel, isLoading, setNewTransactionData, warehouses }) => {
  // Function to reset data and close the dialog
  const handleHide = () => {
    if (!isLoading) {
      setNewTransactionData(initialTransactionData);
      onCancel();
    }
  };

  return (
    <Dialog 
      header={`Return ${viewMode === 'drying' ? 'Palay' : 'Rice'}`} 
      visible={visible} 
      onHide={handleHide} 
      className="w-1/3"
    >
      <div className="flex flex-col w-full gap-4">
        <div className="w-full">
          <label className="block mb-2">Warehouse</label>
          <Dropdown 
            value={newTransactionData.toLocationId} 
            options={warehouses} 
            onChange={(e) => setNewTransactionData(prev => ({ ...prev, toLocationId: e.value, toLocationName: warehouses.find(w => w.value === e.value)?.label }))}
            placeholder="Select a warehouse" 
            className="w-full ring-0" 
          />
        </div>

        <div className="w-full">
          <label className="block mb-2">Transported By</label>
          <InputText 
            value={newTransactionData.transporterName} 
            onChange={(e) => setNewTransactionData(prev => ({ ...prev, transporterName: e.target.value }))}
            className="w-full ring-0"
            maxLength={50}
          />
        </div>

        <div className="w-full">
          <label className="block mb-2">Transport Description</label>
          <InputTextarea 
            value={newTransactionData.transporterDesc} 
            onChange={(e) => setNewTransactionData(prev => ({ ...prev, transporterDesc: e.target.value }))}
            className="w-full ring-0" 
            rows={3} 
            maxLength={250}
          />
        </div>

        <div className="w-full">
          <label className="block mb-2">Remarks</label>
          <InputTextarea 
            value={newTransactionData.remarks} 
            onChange={(e) => setNewTransactionData(prev => ({ ...prev, remarks: e.target.value }))}
            className="w-full ring-0" 
            rows={3} 
            maxLength={250}
          />
        </div>

        <div className="flex justify-between gap-4 mt-4">
          <Button 
            label="Cancel" 
            className="w-1/2 bg-transparent text-primary border-primary" 
            onClick={handleHide} 
            disabled={isLoading} 
          />
          <Button 
            label="Confirm Return" 
            className="w-1/2 bg-primary hover:border-none" 
            onClick={onReturn} 
            disabled={isLoading} 
            loading={isLoading} 
          />
        </div>
      </div>
    </Dialog>
  );
};


export default ReturnDialog;