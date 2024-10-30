import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const AcceptDialog = ({ visible, onAccept, viewMode, onCancel, isLoading }) => {
  return (
    <Dialog header={`Receive ${viewMode}`} visible={visible} onHide={isLoading ? null : onCancel} className="w-1/3">
      <div className="flex flex-col items-center">
        <p className="mb-10">Are you sure you want to receive this request?</p>
        <div className="flex justify-between w-full gap-4">
          <Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={onCancel} disabled={isLoading} />
          <Button label="Confirm Receive" className="w-1/2 bg-primary hover:border-none" onClick={onAccept} disabled={isLoading} loading={isLoading} />
        </div>
      </div>
    </Dialog>
  );
};

export default AcceptDialog;