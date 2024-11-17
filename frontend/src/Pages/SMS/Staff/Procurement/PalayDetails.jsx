import React from 'react';
import { Dialog } from 'primereact/dialog';

function PalayDetails({ visible, onHide, palay }) {
  if (!palay) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Batch #${palay?.id} Details`}
      className="w-full max-w-4xl"
    >
      <div className="grid grid-cols-3 gap-4">
        {/* Basic Information */}
        <div className="col-span-3 border-b pb-2">
          <h3 className="font-semibold">Basic Information</h3>
        </div>
        <div>
          <p className="text-gray-600">Quantity (Bags)</p>
          <p>{palay.quantityBags}</p>
        </div>
        <div>
          <p className="text-gray-600">Gross Weight</p>
          <p>{palay.grossWeight} Kg</p>
        </div>
        <div>
          <p className="text-gray-600">Net Weight</p>
          <p>{palay.netWeight} Kg</p>
        </div>
        <div>
          <p className="text-gray-600">Quality Type</p>
          <p>{palay.qualityType}</p>
        </div>
        <div>
          <p className="text-gray-600">Price/Kg</p>
          <p>₱{palay.price}</p>
        </div>
       
        <div>
          <p className="text-gray-600">Estimated Capital</p>
          <p>₱{palay.estimatedCapital}</p>
        </div>

        {/* Dates Information */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Important Dates</h3>
        </div>
        <div>
          <p className="text-gray-600">Date Bought</p>
          <p>{formatDate(palay.dateBought)}</p>
        </div>
        <div>
          <p className="text-gray-600">Date Planted</p>
          <p>{formatDate(palay.plantedDate)}</p>
        </div>
        <div>
          <p className="text-gray-600">Date Harvested</p>
          <p>{formatDate(palay.harvestedDate)}</p>
        </div>

        {/* Quality Specifications */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Quality Specifications</h3>
        </div>
        <div>
          <p className="text-gray-600">Moisture Content</p>
          <p>{palay.qualitySpec.moistureContent}%</p>
        </div>
        <div>
          <p className="text-gray-600">Purity</p>
          <p>{palay.qualitySpec.purity}%</p>
        </div>
        <div>
          <p className="text-gray-600">Damage</p>
          <p>{palay.qualitySpec.damaged}%</p>
        </div>

        {/* Buying Station Information */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Buying Station Information</h3>
        </div>
        <div>
          <p className="text-gray-600">Station Name</p>
          <p>{palay.buyingStationName}</p>
        </div>
        <div>
          <p className="text-gray-600">Station Location</p>
          <p>{palay.buyingStationLoc}</p>
        </div>
        <div>
          <p className="text-gray-600">Current Location</p>
          <p>{palay.currentlyAt}</p>
        </div>
        <div>
          <p className="text-gray-600">Weigher</p>
          <p>{palay.weighedBy}</p>
        </div>
        <div>
          <p className="text-gray-600">Checker</p>
          <p>{palay.correctedBy}</p>
        </div>
        <div>
          <p className="text-gray-600">classifier</p>
          <p>{palay.classifiedBy}</p>
        </div>

        {/* Source Information */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Source Information</h3>
        </div>
        <div>
          <p className="text-gray-600">Farmer Name</p>
          <p>{palay.palaySupplier.farmerName}</p>
        </div>
        <div>
          <p className="text-gray-600">Contact Number</p>
          <p>{palay.palaySupplier.contactNumber}</p>
        </div>
        <div>
          <p className="text-gray-600">Email</p>
          <p>{palay.palaySupplier.email}</p>
        </div>

        {/* Farm Information */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Farm Information</h3>
        </div>
        <div>
          <p className="text-gray-600">Farm Size</p>
          <p>{palay.farm.farmSize} hectares</p>
        </div>
        <div className='col-span-2'>
          <p className="text-gray-600">Complete Address</p>
          <p>
            {palay.farm.street}, {palay.farm.barangay}, {palay.farm.cityTown},{' '}
            {palay.farm.province}, {palay.farm.region}
          </p>
        </div>
      </div>
    </Dialog>
  );
}

export default PalayDetails;