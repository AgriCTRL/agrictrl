import React from "react";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";

const DetailsDialog = ({
    visible,
    onHide,
    selectedItem,
    selectedFilter,
    getSeverity,
}) => {
    if (!selectedItem) return null;

    const statusBodyTemplate = (rowData, options) => {
        const { field } = options;
        const status = rowData[field];

        return (
            <Tag
                value={status}
                severity={getSeverity(status, field)}
                className="text-sm py-2 px-4 rounded-md font-normal"
            />
        );
    };

    const formatDate = (isoString) => {
        if (!isoString || isoString === "0000-01-01T00:00:00.000Z")
            return "N/A";
        return new Date(isoString).toLocaleDateString("en-PH", {
            timeZone: "UTC",
            month: "numeric",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={`Batch #${selectedItem.wsr} Details`}
            className="w-full max-w-4xl"
        >
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                {/* Basic Information */}
                <div className="col-span-3 border-b pb-2">
                    <h3 className="font-semibold">Batch Information</h3>
                </div>
                {/* <div>
          <p className="text-gray-600">Batch WSR</p>
          <p>{selectedItem.wsr}</p>
        </div> */}
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Quantity</p>
                    <p>{selectedItem.quantityBags} bags</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Gross Weight</p>
                    <p>{selectedItem.grossWeight} Kg</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Net Weight</p>
                    <p>{selectedItem.netWeight} Kg</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Price per Kg</p>
                    <p>₱{selectedItem.fullPalayBatchData.price}</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Quality Type</p>
                    <p>{selectedItem.fullPalayBatchData.qualityType}</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Estimated Capital</p>
                    <p>{selectedItem.fullPalayBatchData.estimatedCapital}</p>
                </div>

                {/* Quality Specifications */}
                <div className="col-span-3 border-b pb-2 mt-2 md:mt-4">
                    <h3 className="font-semibold">Quality Specifications</h3>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Moisture Content</p>
                    <p>
                        {
                            selectedItem.fullPalayBatchData.qualitySpec
                                .moistureContent
                        }
                        %
                    </p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Purity</p>
                    <p>{selectedItem.fullPalayBatchData.qualitySpec.purity}%</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Damage</p>
                    <p>
                        {selectedItem.fullPalayBatchData.qualitySpec.damaged}%
                    </p>
                </div>

                {/* Dates */}
                <div className="col-span-3 border-b pb-2 mt-2 md:mt-4">
                    <h3 className="font-semibold">Important Dates</h3>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Date Bought</p>
                    <p>
                        {formatDate(selectedItem.fullPalayBatchData.dateBought)}
                    </p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Planted Date</p>
                    <p>
                        {formatDate(
                            selectedItem.fullPalayBatchData.plantedDate
                        )}
                    </p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Harvested Date</p>
                    <p>
                        {formatDate(
                            selectedItem.fullPalayBatchData.harvestedDate
                        )}
                    </p>
                </div>

                {/* Buying Station Information */}
                <div className="col-span-3 border-b pb-2 mt-2 md:mt-4">
                    <h3 className="font-semibold">
                        Buying Station Information
                    </h3>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Station Name</p>
                    <p>{selectedItem.buyingStationName}</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Station Location</p>
                    <p>{selectedItem.buyingStationLoc}</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Current Location</p>
                    <p>{selectedItem.currentlyAt}</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Weigher</p>
                    <p>{selectedItem.weighedBy}</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Checker</p>
                    <p>{selectedItem.correctedBy}</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Classifier</p>
                    <p>{selectedItem.classifiedBy}</p>
                </div>

                {/* Transaction Details */}
                <div className="col-span-3 border-b pb-2 mt-2 md:mt-4">
                    <h3 className="font-semibold">Transaction Details</h3>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Transporter</p>
                    <p>{selectedItem.fullTransactionData.transporterName}</p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Sent Date</p>
                    <p>
                        {formatDate(
                            selectedItem.fullTransactionData.sendDateTime
                        )}
                    </p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Received Date</p>
                    <p>
                        {formatDate(
                            selectedItem.fullTransactionData.receiveDateTime
                        )}
                    </p>
                </div>

                {/* Supplier Information */}
                <div className="col-span-3 border-b pb-2 mt-2 md:mt-4">
                    <h3 className="font-semibold">Supplier Details</h3>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Farmer Name</p>
                    <p>
                        {
                            selectedItem.fullPalayBatchData.palaySupplier
                                .farmerName
                        }
                    </p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Contact Number</p>
                    <p>
                        {
                            selectedItem.fullPalayBatchData.palaySupplier
                                .contactNumber
                        }
                    </p>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Email</p>
                    <p>{selectedItem.fullPalayBatchData.palaySupplier.email}</p>
                </div>

                {/* Farm Information */}
                <div className="col-span-3 border-b pb-2 mt-2 md:mt-4">
                    <h3 className="font-semibold">Farm Details</h3>
                </div>
                <div className="text-sm md:text-base">
                    <p className="text-gray-600">Farm Size</p>
                    <p>
                        {selectedItem.fullPalayBatchData.farm.farmSize} hectares
                    </p>
                </div>
                <div className="col-span-2 text-sm md:text-base">
                    <p className="text-gray-600">Farm Location</p>
                    <p>
                        {selectedItem.fullPalayBatchData.farm.street},{" "}
                        {selectedItem.fullPalayBatchData.farm.barangay},
                        {selectedItem.fullPalayBatchData.farm.cityTown},{" "}
                        {selectedItem.fullPalayBatchData.farm.province},
                        {selectedItem.fullPalayBatchData.farm.region}
                    </p>
                </div>
            </div>
        </Dialog>
    );
};

export default DetailsDialog;
