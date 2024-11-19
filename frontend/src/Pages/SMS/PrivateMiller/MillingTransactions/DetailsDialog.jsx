import React from 'react';
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";

const DetailsDialog = ({ 
  visible, 
  onHide, 
  selectedItem, 
  selectedFilter,
  getSeverity 
}) => {
  if (!selectedItem) return null;

  const statusBodyTemplate = (rowData, options) => {
    const { field } = options;
    const status = rowData[field];

    return (
      <Tag
        value={status}
        severity={getSeverity(status, field)}
        className="text-sm px-2 rounded-md"
      />
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Processing Details - Milling Batch"
      className="w-full max-w-2xl"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 border-b pb-2">
          <h3 className="font-semibold">Basic Information</h3>
        </div>
        <div>
          <p className="text-gray-600">Palay Batch ID</p>
          <p>{selectedItem.palayBatchId}</p>
        </div>
        <div>
          <p className="text-gray-600">Quantity (Bags)</p>
          <p>{selectedItem.quantityBags}</p>
        </div>
        <div>
          <p className="text-gray-600">Gross Weight</p>
          <p>{selectedItem.grossWeight} kg</p>
        </div>
        <div>
          <p className="text-gray-600">Net Weight</p>
          <p>{selectedItem.netWeight} kg</p>
        </div>

        <div className="col-span-2 border-b pb-2 mt-4">
          <h3 className="font-semibold">Location Information</h3>
        </div>
        <div>
          <p className="text-gray-600">From</p>
          <p>{selectedItem.from}</p>
        </div>
        <div>
          <p className="text-gray-600">
            {selectedFilter === "request"
              ? "To be Mill at"
              : selectedFilter === "process"
              ? "Milling at"
              : selectedFilter === "return"
              ? "Milled at"
              : "To be Mill at"}
          </p>
          <p>{selectedItem.location}</p>
        </div>

        {selectedFilter === "request" && (
          <div>
            <p className="text-gray-600">Transported By</p>
            <p>{selectedItem.transportedBy}</p>
          </div>
        )}

        {selectedFilter === "return" && (
          <div className="grid col-span-2 gap-4">
            <div className="col-span-2 border-b pb-2 mt-4">
              <h3 className="font-semibold">Processing Information</h3>
            </div>

            <div>
              <p className="text-gray-600">Start Date</p>
              <p>{selectedItem.startDate || "Not started"}</p>
            </div>

            {selectedFilter === "return" && (
              <div>
                <p className="text-gray-600">End Date</p>
                <p>{selectedItem.endDate || "Not completed"}</p>
              </div>
            )}

            {selectedItem.dryingMethod && (
              <div>
                <p className="text-gray-600">Drying Method</p>
                <p>{selectedItem.dryingMethod}</p>
              </div>
            )}

            {selectedItem.millerType && (
              <div>
                <p className="text-gray-600">Miller Type</p>
                <p>{selectedItem.millerType}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default DetailsDialog;