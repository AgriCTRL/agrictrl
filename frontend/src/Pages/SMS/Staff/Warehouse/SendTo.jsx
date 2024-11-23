import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

import { WSI } from "../../../../Components/Pdf/pdfWarehouseStockIssue";

const initialNewTransactionData = {
  item: "",
  itemId: "",
  senderId: "",
  fromLocationType: "",
  fromLocationId: 0,
  transporterName: "",
  transporterDesc: "",
  receiverId: "",
  receiveDateTime: "0",
  toLocationType: "",
  toLocationId: "",
  toLocationName: "",
  status: "Pending",
  remarks: "",
};

const SendTo = ({
  visible,
  onHide,
  onSendSuccess,
  user,
  dryerData,
  millerData,
  warehouseData,
  selectedPile,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newTransactionData, setNewTransactionData] = useState(initialNewTransactionData);
    
  useEffect(() => {
    if (visible && selectedPile) {
      fetchInventoryItems();
    }
  }, [visible, selectedPile]);

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/inventory/by-pile/${selectedPile.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch inventory items");
      }
      const data = await response.json();
      
      // Check if data.items exists and is an array
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error("Invalid data structure received");
      }

      // Transform the data for dropdown, accessing the nested structure
      const formattedItems = data.items.map(item => {
        const palayBatch = item.palayBatch;
        const transaction = item.transaction;
        
        return {
          label: `${palayBatch.id} - ${palayBatch.quantityBags} bags - ${palayBatch.status}`,
          value: palayBatch.id,
          id: palayBatch.id,
          item: transaction.item,
          quantityBags: palayBatch.quantityBags,
          palayStatus: palayBatch.status,
          transactionId: transaction.id,
          toLocationId: transaction.toLocationId
        };
      });

      setInventoryItems(formattedItems);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch inventory items",
        life: 3000,
      });
    }
  };

  const getAvailableFacilities = () => {
    if (!selectedItem) return [];

    const quantityBags = Number(selectedItem.quantityBags);

    if (selectedItem.palayStatus === "To be Dry") {
      return dryerData
        .filter(
          (dryer) =>
            dryer.status === "active" &&
            Number(dryer.capacity) - Number(dryer.processing) >= quantityBags
        )
        .map((dryer) => ({
          label: dryer.dryerName.toString(),
          value: dryer.id,
          name: dryer.dryerName.toString(),
          currentProcessing: dryer.processing,
        }));
    }

    if (selectedItem.palayStatus === "To be Mill") {
      return millerData
        .filter(
          (miller) =>
            miller.status === "active" &&
            Number(miller.capacity) - Number(miller.processing) >= quantityBags
        )
        .map((miller) => ({
          label: miller.millerName.toString(),
          value: miller.id,
          name: miller.millerName.toString(),
          currentProcessing: miller.processing,
        }));
    }

    return [];
  };

  const validateForm = () => {
    let newErrors = {};

    if (!selectedItem) {
      newErrors.selectedItem = "Please select a palay batch";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a palay batch",
        life: 3000,
      });
    }

    if (!newTransactionData.toLocationId) {
      newErrors.toLocationId = "Please select a facility";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a facility",
        life: 3000,
      });
    }

    if (!newTransactionData.transporterName.trim()) {
      newErrors.transporterName = "Transporter name is required";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Transporter name is required",
        life: 3000,
      });
    }

    if (!newTransactionData.transporterDesc.trim()) {
      newErrors.transporterDesc = "Transport description is required";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Transport description is required",
        life: 3000,
      });
    }

    if (!newTransactionData.remarks.trim()) {
      newErrors.remarks = "Remarks are required";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Remarks are required",
        life: 3000,
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendTo = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const toLocationType =
        selectedItem.palayStatus === "To be Dry"
          ? "Dryer"
          : selectedItem.palayStatus === "To be Mill"
          ? "Miller"
          : "";

      const transactionResponse = await fetch(`${apiUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newTransactionData,
          item: selectedItem.item,
          itemId: selectedItem.id,
          senderId: user.id,
          fromLocationType: "Warehouse",
          fromLocationId: selectedItem.toLocationId,
          receiverId: 0,
          receiveDateTime: "0",
          toLocationType: toLocationType,
          status: "Pending",
        }),
      });

      if (!transactionResponse.ok) {
        throw new Error("Failed to create transaction");
      }

      const transactionResult = await transactionResponse.json();

      // Update palay batch with new status
      const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedItem.id,
          currentlyAt: newTransactionData.toLocationName,
        }),
      });

      if (!palayResponse.ok) {
        throw new Error("Failed to update palay batch");
      }

      //update old transaction to status = completed
      const oldTransactionResponse = await fetch(
        `${apiUrl}/transactions/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedItem.transactionId,
            status: "Completed",
          }),
        }
      );

      if (!oldTransactionResponse.ok) {
        throw new Error("Failed to update Old transaction");
      }

      //update warehouse
      const targetWarehouse = warehouseData.find(
        (warehouse) => warehouse.id === selectedItem.toLocationId
      );

      if (!targetWarehouse) {
        throw new Error("Target warehouse not found");
      }

      const currentStock =
        Number(targetWarehouse.currentStock) -
        Number(selectedItem.quantityBags);
      const warehouseResponse = await fetch(`${apiUrl}/warehouses/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedItem.toLocationId,
          currentStock: currentStock,
        }),
      });

      if (!warehouseResponse.ok) {
        throw new Error("Failed to update warehouse stock");
      }

      // Update facility processing capacity
      const selectedFacility = getAvailableFacilities().find(
        (facility) => facility.value === newTransactionData.toLocationId
      );

      if (!selectedFacility) {
        throw new Error("Selected facility not found");
      }

      const newProcessing =
        Number(selectedFacility.currentProcessing) +
        Number(selectedItem.quantityBags);
      const facilityEndpoint =
        selectedItem.palayStatus === "To be Dry"
          ? `${apiUrl}/dryers/update`
          : `${apiUrl}/millers/update`;

      const facilityResponse = await fetch(facilityEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: newTransactionData.toLocationId,
          processing: newProcessing,
        }),
      });

      if (!facilityResponse.ok) {
        throw new Error("Failed to update facility processing capacity");
      }

      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours()+8);

      const data = {
        palayBatchId: selectedItem.id,
        palayBatchStatus: selectedItem.palayStatus,
        currentLocation: newTransactionData.toLocationName,
        transactionId: transactionResult.id,
        senderId: user.id,
        fromLocationType: "Warehouse",
        fromLocationId: selectedItem.toLocationId,
        sendDate: currentDate,
        toLocationType: toLocationType,
        toLocationId: newTransactionData.toLocationId,
        warehouseName: targetWarehouse.facilityName,
        currentStock: currentStock,
      };

      //create pile transaction
      const pileTransactionBody = {
        palayBatchId: selectedItem.id,
        pileId: selectedPile.id,
        transactionType: 'OUT',
        quantityBags: selectedItem.quantityBags,
        performedBy: user.id,
        notes: `Received from transaction ${selectedItem.transactionId}`
      };
  
      const pileTransactionResponse = await fetch(`${apiUrl}/piletransactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pileTransactionBody)
      });
  
      if (!pileTransactionResponse.ok) {
        throw new Error('Failed to create pile transaction');
      }

      const pdf = WSI(data);
      pdf.save(`WSI-${selectedItem.id}.pdf`);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Palay batch status updated successfully",
        life: 3000,
      });

      onSendSuccess();
      onHide();
      setNewTransactionData(initialNewTransactionData);
    } catch (error) {
      console.error("Error:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to complete the process",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Send To"
        visible={visible}
        onHide={isLoading ? null : onHide}
        className="w-1/3"
      >
        <div className="flex flex-col">
          <div className="mb-4">
            <label className="block mb-2">Select Palay Batch</label>
            <Dropdown
              value={selectedItem?.id}
              options={inventoryItems}
              onChange={(e) => {
                const selected = inventoryItems.find(item => item.value === e.value);
                setSelectedItem(selected);
                setErrors(prev => ({ ...prev, selectedItem: "" }));
              }}
              placeholder="Select a palay batch"
              className={`w-full ${errors.selectedItem ? "p-invalid" : ""}`}
            />
            {errors.selectedItem && (
              <p className="text-red-500 text-xs mt-1">{errors.selectedItem}</p>
            )}
          </div>

          {selectedItem && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Send To</label>
                <InputText
                  value={
                    selectedItem?.palayStatus === "To be Dry" ? "Dryer" : "Miller"
                  }
                  disabled
                  className="w-full"
                  keyfilter={/^[a-zA-Z\s]/}
                  maxLength={50}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Facility</label>
                <Dropdown
                  value={newTransactionData.toLocationId}
                  options={getAvailableFacilities()}
                  onChange={(e) => {
                    const selectedOption = getAvailableFacilities().find(
                      (opt) => opt.value === e.value
                    );
                    if (selectedOption) {
                      setNewTransactionData((prev) => ({
                        ...prev,
                        toLocationId: selectedOption.value,
                        toLocationName: selectedOption.label,
                      }));
                      setErrors((prev) => ({ ...prev, toLocationId: "" }));
                    }
                  }}
                  placeholder="Select a facility"
                  className={`w-full ${errors.toLocationId ? "p-invalid" : ""}`}
                />
                {errors.toLocationId && (
                  <p className="text-red-500 text-xs mt-1">{errors.toLocationId}</p>
                )}
              </div>

              <div className="w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transported by
                </label>
                <InputText
                  value={newTransactionData.transporterName}
                  onChange={(e) => {
                    setNewTransactionData((prev) => ({
                      ...prev,
                      transporterName: e.target.value,
                    }));
                    setErrors((prev) => ({ ...prev, transporterName: "" }));
                  }}
                  className={`w-full ring-0 ${
                    errors.transporterName ? "p-invalid" : ""
                  }`}
                  keyfilter={/^[a-zA-Z\s]/}
                  maxLength={50}
                />
                {errors.transporterName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.transporterName}
                  </p>
                )}
              </div>

              <div className="w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transport Description
                </label>
                <InputTextarea
                  value={newTransactionData.transporterDesc}
                  onChange={(e) => {
                    setNewTransactionData((prev) => ({
                      ...prev,
                      transporterDesc: e.target.value,
                    }));
                    setErrors((prev) => ({ ...prev, transporterDesc: "" }));
                  }}
                  className={`w-full ring-0 ${
                    errors.transporterDesc ? "p-invalid" : ""
                  }`}
                  maxLength={250}
                />
                {errors.transporterDesc && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.transporterDesc}
                  </p>
                )}
              </div>

              <div className="w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <InputTextarea
                  value={newTransactionData.remarks}
                  onChange={(e) => {
                    setNewTransactionData((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }));
                    setErrors((prev) => ({ ...prev, remarks: "" }));
                  }}
                  className={`w-full ring-0 ${errors.remarks ? "p-invalid" : ""}`}
                  maxLength={250}
                />
                {errors.remarks && (
                  <p className="text-red-500 text-xs mt-1">{errors.remarks}</p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-between w-full gap-4 mt-4">
            <Button
              label="Cancel"
              className="w-1/2 bg-transparent text-primary border-primary"
              onClick={onHide}
              disabled={isLoading}
            />
            <Button
              label="Send Request"
              className="w-1/2 bg-primary hover:border-none"
              onClick={handleSendTo}
              disabled={isLoading}
              loading={isLoading}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SendTo;