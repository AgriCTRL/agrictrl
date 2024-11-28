import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";

function PalayDetails({ visible, onHide, palay, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPalay, setEditedPalay] = useState({});
  const [canEdit, setCanEdit] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (palay && visible) {
      fetchTransactions();
    }
  }, [palay, visible]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/inventory/enhanced?palaybatchId=${palay.id}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await res.json();
      setTransactions(data);

      // Check edit conditions
      if (data.length > 0) {
        const firstTransaction = data[0];
        setCanEdit(
          !(firstTransaction.status === "Received" || data.length > 1)
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "";
  };

  const handleEdit = () => {
    if (canEdit) {
      setEditedPalay({ ...palay });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${apiUrl}/palaybatches/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedPalay, palay.id),
      });

      if (!response.ok) {
        throw new Error("Failed to update palay details");
      }

      onUpdate(editedPalay);
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setEditedPalay((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (section, field, value) => {
    setEditedPalay((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  if (!palay) return null;

  const dialogHeader = (
    <div className="flex justify-between items-center">
      <span>Batch #{palay.wsr} Details</span>
      {!isEditing && canEdit && (
        <Button
          icon="pi pi-pencil"
          className="p-button-text p-button-secondary"
          onClick={handleEdit}
          tooltip="Edit Batch Details"
        />
      )}
    </div>
  );

  const renderField = (label, value, editField = null) => (
    <div>
      <p className="text-gray-600">{label}</p>
      {!isEditing ? <p>{value}</p> : editField}
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={dialogHeader}
      className="w-full max-w-4xl"
      footer={
        isEditing ? (
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={handleCancel}
            />
            <Button label="Save" icon="pi pi-check" onClick={handleSave} />
          </div>
        ) : null
      }
    >
      {!canEdit && (
        <div className="p-2 bg-yellow-100 text-yellow-800 mb-4">
          Editing is disabled for this batch due to existing transactions.
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Basic Information */}
        <div className="col-span-3 border-b pb-2">
          <h3 className="font-semibold">Basic Information</h3>
        </div>

        {renderField(
          "Quantity (Bags)",
          palay.quantityBags,
          <InputNumber
            value={editedPalay.quantityBags}
            onValueChange={(e) => updateField("quantityBags", e.value)}
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Gross Weight",
          `${palay.grossWeight} Kg`,
          <InputNumber
            value={editedPalay.grossWeight}
            onValueChange={(e) => updateField("grossWeight", e.value)}
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Net Weight",
          `${palay.netWeight} Kg`,
          <InputNumber
            value={editedPalay.netWeight}
            onValueChange={(e) => updateField("netWeight", e.value)}
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Quality Type",
          palay.qualityType,
          <Dropdown
            value={editedPalay.qualityType}
            options={[
              { label: "Fresh/Wet", value: "Wet" },
              { label: "Clean/Dry", value: "Dry" },
            ]}
            onChange={(e) => updateField("qualityType", e.value)}
            className="w-full ring-0"
            disabled
          />
        )}

        {renderField(
          "Price/Kg",
          `₱${palay.price}`,
          <InputNumber
            value={editedPalay.price}
            onValueChange={(e) => updateField("price", e.value)}
            mode="currency"
            currency="PHP"
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Estimated Capital",
          `₱${palay.estimatedCapital}`,
          <InputNumber
            value={editedPalay.estimatedCapital}
            onValueChange={(e) => updateField("estimatedCapital", e.value)}
            mode="currency"
            currency="PHP"
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {/* Dates Information */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Important Dates</h3>
        </div>

        {renderField(
          "Date Bought",
          formatDate(palay.dateBought),
          <Calendar
            value={new Date(editedPalay.dateBought)}
            onChange={(e) => updateField("dateBought", e.value)}
            dateFormat="mm/dd/yy"
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Date Planted",
          formatDate(palay.plantedDate),
          <Calendar
            value={new Date(editedPalay.plantedDate)}
            onChange={(e) => updateField("plantedDate", e.value)}
            dateFormat="mm/dd/yy"
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Date Harvested",
          formatDate(palay.harvestedDate),
          <Calendar
            value={new Date(editedPalay.harvestedDate)}
            onChange={(e) => updateField("harvestedDate", e.value)}
            dateFormat="mm/dd/yy"
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {/* Quality Specifications */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Quality Specifications</h3>
        </div>

        {renderField(
          "Moisture Content",
          `${palay.qualitySpec.moistureContent}%`,
          <InputNumber
            value={editedPalay.qualitySpec?.moistureContent}
            onValueChange={(e) =>
              updateNestedField("qualitySpec", "moistureContent", e.value)
            }
            suffix="%"
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Purity",
          `${palay.qualitySpec.purity}%`,
          <InputNumber
            value={editedPalay.qualitySpec?.purity}
            onValueChange={(e) =>
              updateNestedField("qualitySpec", "purity", e.value)
            }
            suffix="%"
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Damage",
          `${palay.qualitySpec.damaged}%`,
          <InputNumber
            value={editedPalay.qualitySpec?.damaged}
            onValueChange={(e) =>
              updateNestedField("qualitySpec", "damaged", e.value)
            }
            suffix="%"
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {/* Buying Station Information */}
        {renderField(
          "Station Name",
          `${palay.buyingStationName}`,
          <InputText
            value={editedPalay.buyingStationName}
            onChange={(e) => updateField("buyingStationName", e.value)}
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Station Location",
          palay.buyingStationLoc,
          <InputText
            value={editedPalay.buyingStationLoc}
            onValueChange={(e) => updateField("buyingStationLoc", e.value)}
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Current Location",
          palay.currentlyAt,
          <InputText
            value={editedPalay.currentlyAt}
            onValueChange={(e) => updateField("currentlyAt", e.value)}
            disabled
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Weigher",
          palay.weighedBy,
          <InputText
            value={editedPalay.weighedBy}
            onValueChange={(e) => updateField("weighedBy", e.value)}
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Checker",
          palay.correctedBy,
          <InputText
            value={editedPalay.correctedBy}
            onValueChange={(e) => updateField("correctedBy", e.value)}
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Classifier",
          palay.classifiedBy,
          <InputText
            value={editedPalay.classifiedBy}
            onValueChange={(e) => updateField("classifiedBy", e.value)}
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {/* Source Information */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Source Information</h3>
        </div>

        {renderField(
          "Farmer Name",
          palay.palaySupplier.farmerName,
          <InputText
            value={editedPalay.palaySupplier.farmerName}
            onValueChange={(e) =>
              updateNestedField("palaySupplier", "farmerName", e.value)
            }
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Contact Number",
          palay.palaySupplier.contactNumber,
          <InputText
            value={editedPalay.palaySupplier.contactNumber}
            onValueChange={(e) =>
              updateNestedField("palaySupplier", "contactNumber", e.value)
            }
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {renderField(
          "Email",
          palay.palaySupplier.email,
          <InputText
            value={editedPalay.palaySupplier.email}
            onValueChange={(e) =>
              updateNestedField("palaySupplier", "email", e.value)
            }
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {/* Farm Information */}
        <div className="col-span-3 border-b pb-2 mt-4">
          <h3 className="font-semibold">Farm Information</h3>
        </div>

        {renderField(
          "Farm Size",
          palay.farm.farmSize,
          <InputText
            value={editedPalay.farm.farmSize}
            onValueChange={(e) =>
              updateNestedField("farm", "farmSize", e.value)
            }
            disabled={!canEdit}
            className="w-full ring-0"
          />
        )}

        {!isEditing && (
          <div className="col-span-2">
            <p className="text-gray-600">Complete Address</p>
            <p>
              {palay.farm.street}, {palay.farm.barangay}, {palay.farm.cityTown},{" "}
              {palay.farm.province}, {palay.farm.region}
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default PalayDetails;
