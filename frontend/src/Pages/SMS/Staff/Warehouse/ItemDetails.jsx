import React from 'react';
import { Dialog } from "primereact/dialog";

const ItemDetails = ({ 
  visible, 
  onHide, 
  selectedBatchDetails, 
  selectedFilter 
}) => {
  if (!selectedBatchDetails) return null;

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Batch Details - ${selectedBatchDetails.id}`}
      className="w-full max-w-2xl"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 border-b pb-2">
          <h3 className="font-semibold">Basic Information</h3>
        </div>
        <div>
          <p className="text-gray-600">Gross Weight</p>
          <p>{selectedBatchDetails.grossWeight} Kg</p>
        </div>
        <div>
          <p className="text-gray-600">Net Weight</p>
          <p>{selectedBatchDetails.netWeight} Kg</p>
        </div>
        {selectedBatchDetails.item === "Palay" && (
          <div>
            <p className="text-gray-600">Quality Type</p>
            <p>{selectedBatchDetails.qualityType}</p>
          </div>
        )}

        <div className="col-span-2 border-b pb-2 mt-4">
          <h3 className="font-semibold">Source Information</h3>
        </div>
        <div>
          <p className="text-gray-600">From</p>
          <p>{selectedBatchDetails.from}</p>
        </div>
        <div>
          <p className="text-gray-600">To be Stored at</p>
          <p>{selectedBatchDetails.toBeStoreAt}</p>
        </div>

        <div className="col-span-2 border-b pb-2 mt-4">
          <h3 className="font-semibold">Transport Information</h3>
        </div>
        <div>
          <p className="text-gray-600">Transported by</p>
          <p>{selectedBatchDetails.transportedBy}</p>
        </div>
      </div>
    </Dialog>
  );
};

export default ItemDetails;