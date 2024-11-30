import React from "react";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";

const ItemDetails = ({ visible, onHide, selectedBatchDetails }) => {
  if (!selectedBatchDetails) return null;

  const {
    fullPalayBatchData: palayBatch,
    fullTransactionData: transaction,
    fullProcessingBatchData: processingBatch,
  } = selectedBatchDetails;

  const formatDate = (isoString) => {
    if (!isoString || isoString === "0000-01-01T00:00:00.000Z") return "N/A";
    return new Date(isoString).toLocaleDateString();
  };

  const getSeverity = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Received":
        return "success";
      default:
        return "info";
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Batch #${palayBatch.wsr} Details`}
      className="w-full max-w-4xl"
    >
      <div className="grid grid-cols-3 gap-4">
        {/* Basic Information */}
        <div className="col-span-3 border-b pb-2">
          <h3 className="font-semibold">Batch Information</h3>
        </div>
        {/* <div>
          <p className="text-gray-600">Batch WSR</p>
          <p>{palayBatch.wsr}</p>
        </div> */}
        <div>
          <p className="text-gray-600">Quantity</p>
          <p>{palayBatch.quantityBags} bags</p>
        </div>
        <div>
          <p className="text-gray-600">Gross Weight</p>
          <p>{palayBatch.grossWeight} Kg</p>
        </div>
        <div>
          <p className="text-gray-600">Net Weight</p>
          <p>{palayBatch.netWeight} Kg</p>
        </div>
        <div>
          <p className="text-gray-600">Price per Kg</p>
          <p>₱{palayBatch.price}</p>
        </div>
        <div>
          <p className="text-gray-600">Quality Type</p>
          <p>{palayBatch.qualityType}</p>
        </div>
        <div>
          <p className="text-gray-600">Estimated Capital</p>
          <p>{palayBatch.estimatedCapital}</p>
        </div>

        {/* Quality Specifications */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Quality Specifications</h3>
        </div>
        <div>
          <p className="text-gray-600">Moisture Content</p>
          <p>{palayBatch.qualitySpec.moistureContent}%</p>
        </div>
        <div>
          <p className="text-gray-600">Purity</p>
          <p>{palayBatch.qualitySpec.purity}%</p>
        </div>
        <div>
          <p className="text-gray-600">Damage</p>
          <p>{palayBatch.qualitySpec.damaged}%</p>
        </div>

        {/* Dates */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Important Dates</h3>
        </div>
        <div>
          <p className="text-gray-600">Date Bought</p>
          <p>{formatDate(palayBatch.dateBought)}</p>
        </div>
        <div>
          <p className="text-gray-600">Planted Date</p>
          <p>{formatDate(palayBatch.plantedDate)}</p>
        </div>
        <div>
          <p className="text-gray-600">Harvested Date</p>
          <p>{formatDate(palayBatch.harvestedDate)}</p>
        </div>

        {/* Buying Station Information */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Buying Station Information</h3>
        </div>
        <div>
          <p className="text-gray-600">Station Name</p>
          <p>{palayBatch.buyingStationName}</p>
        </div>
        <div>
          <p className="text-gray-600">Station Location</p>
          <p>{palayBatch.buyingStationLoc}</p>
        </div>
        <div>
          <p className="text-gray-600">Current Location</p>
          <p>{palayBatch.currentlyAt}</p>
        </div>
        <div>
          <p className="text-gray-600">Weigher</p>
          <p>{palayBatch.weighedBy}</p>
        </div>
        <div>
          <p className="text-gray-600">Checker</p>
          <p>{palayBatch.correctedBy}</p>
        </div>
        <div>
          <p className="text-gray-600">Classifier</p>
          <p>{palayBatch.classifiedBy}</p>
        </div>

        {/* Transaction Details */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Transaction Details</h3>
        </div>
        <div>
          <p className="text-gray-600">Transporter</p>
          <p>{transaction.transporterName}</p>
        </div>
        <div>
          <p className="text-gray-600">Sent Date</p>
          <p>{formatDate(transaction.sendDateTime)}</p>
        </div>
        <div>
          <p className="text-gray-600">Received Date</p>
          <p>{formatDate(transaction.receiveDateTime)}</p>
        </div>

        {/* Supplier Information */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Supplier Details</h3>
        </div>
        <div>
          <p className="text-gray-600">Farmer Name</p>
          <p>{palayBatch.palaySupplier.farmerName}</p>
        </div>
        <div>
          <p className="text-gray-600">Contact Number</p>
          <p>{palayBatch.palaySupplier.contactNumber}</p>
        </div>
        <div>
          <p className="text-gray-600">Email</p>
          <p>{palayBatch.palaySupplier.email}</p>
        </div>

        {/* Farm Information */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Farm Details</h3>
        </div>
        <div>
          <p className="text-gray-600">Farm Size</p>
          <p>{palayBatch.farm.farmSize} hectares</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-600">Farm Location</p>
          <p>
            {palayBatch.farm.street}, {palayBatch.farm.barangay},
            {palayBatch.farm.cityTown}, {palayBatch.farm.province},
            {palayBatch.farm.region}
          </p>
        </div>
      </div>
    </Dialog>
  );
};

export default ItemDetails;
