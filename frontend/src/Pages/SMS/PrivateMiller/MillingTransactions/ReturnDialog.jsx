import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import Loader from "@/Components/Loader";

const initialTransactionData = {
  item: "Rice",
  itemId: "",
  senderId: "",
  fromLocationType: "Miller",
  fromLocationId: 0,
  transporterName: "",
  transporterDesc: "",
  receiverId: "",
  receiveDateTime: "0",
  toLocationType: "Warehouse",
  toLocationId: "",
  toLocationName: "",
  status: "Pending",
  remarks: "",
};

const ReturnDialog = ({
  visible,
  onHide,
  selectedItem,
  warehouses,
  millerData,
  user,
  apiUrl,
  toast,
  onSuccess,
}) => {
  const [newTransactionData, setNewTransactionData] = useState(
    initialTransactionData
  );
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const filteredWarehouses = warehouses
    .filter((warehouse) => {
      const requiredQuantity = parseInt(selectedItem?.milledQuantityBags || 0);
      const hasEnoughCapacity =
        warehouse.status === "active" &&
        warehouse.totalCapacity - warehouse.currentStock >= requiredQuantity;

      const warehouseName = warehouse.facilityName.toLowerCase();
      const isCorrectType = warehouseName.includes("rice");
      return hasEnoughCapacity && isCorrectType;
    })
    .map((warehouse) => ({
      label: `${warehouse.facilityName} (Available: ${
        warehouse.totalCapacity - warehouse.currentStock
      } bags)`,
      name: warehouse.facilityName,
      value: warehouse.id,
    }));

  const validateForm = () => {
    let newErrors = {};

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

  const handleReturn = async () => {
    if (!validateForm()) return;
    if (!selectedItem || !newTransactionData.toLocationId) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a warehouse",
        life: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Update the facility's current processing
      const selectedMiller = millerData.find(
        (miller) => miller.id === selectedItem.toLocationId
      );

      if (!selectedMiller) {
        throw new Error("Miller not found");
      }

      const initialQuantity = parseInt(
        selectedItem.driedQuantityBags || selectedItem.palayQuantityBags
      );

      const newProcessing = Math.max(
        0,
        parseInt(selectedMiller.processing) - initialQuantity
      );

      const millerUpdateResponse = await fetch(`${apiUrl}/millers/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedItem.toLocationId,
          processing: newProcessing,
        }),
      });

      if (!millerUpdateResponse.ok) {
        throw new Error("Failed to update miller processing quantity");
      }

      // 2. Update current transaction to Completed
      const updateTransactionResponse = await fetch(
        `${apiUrl}/transactions/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedItem.transactionId,
            status: "Completed",
          }),
        }
      );

      if (!updateTransactionResponse.ok) {
        throw new Error("Failed to update current transaction");
      }

      // 3. Update palay batch with new status
      const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedItem.palayBatchId,
          currentlyAt: newTransactionData.toLocationName,
        }),
      });

      if (!palayResponse.ok) {
        throw new Error("Failed to update palay batch");
      }

      // 4. Create new return transaction
      const newTransaction = {
        ...newTransactionData,
        item: "Rice",
        itemId: selectedItem.palayBatchId,
        fromLocationType: "Miller",
        fromLocationId: selectedItem.toLocationId,
        toLocationType: "Warehouse",
        senderId: user.id,
        receiverId: "0",
        status: "Pending",
        receiveDateTime: "0",
      };

      const createTransactionResponse = await fetch(`${apiUrl}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      if (!createTransactionResponse.ok) {
        throw new Error("Failed to create return transaction");
      }

      // 5. Update warehouse stock
      const targetWarehouse = warehouses.find(
        (warehouse) => warehouse.id === newTransactionData.toLocationId
      );

      if (!targetWarehouse) {
        throw new Error("Target warehouse not found");
      }

      const quantityToAdd = parseInt(selectedItem.quantityBags);
      const newStock = quantityToAdd + parseInt(targetWarehouse.currentStock);

      const warehouseResponse = await fetch(`${apiUrl}/warehouses/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newTransactionData.toLocationId,
          currentStock: newStock,
        }),
      });

      if (!warehouseResponse.ok) {
        throw new Error("Failed to update warehouse stock");
      }

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Return process initiated successfully",
        life: 3000,
      });

      onSuccess();
      handleHide();
    } catch (error) {
      console.error("Error in handleReturn:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to process return: ${error.message}`,
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHide = () => {
    setNewTransactionData(initialTransactionData);
    setErrors({});
    onHide();
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}
      <Dialog
        header="Return Rice"
        visible={visible}
        onHide={isLoading ? null : handleHide}
        className="w-1/3"
      >
        <div className="flex flex-col w-full gap-4">
          <div className="w-full">
            <label className="block mb-2">Warehouse</label>
            <Dropdown
              value={newTransactionData.toLocationId}
              options={filteredWarehouses}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  toLocationId: e.value,
                  toLocationName: filteredWarehouses.find(
                    (w) => w.value === e.value
                  )?.name,
                }))
              }
              placeholder="Select a warehouse"
              className="w-full ring-0"
            />
            {errors.toLocationId && (
              <div className="text-red-500 text-sm mt-1">
                {errors.toLocationId}
              </div>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2">Transported By</label>
            <InputText
              value={newTransactionData.transporterName}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  transporterName: e.target.value,
                }))
              }
              className="w-full ring-0"
              maxLength={50}
              keyfilter="alphanum"
            />
            {errors.transporterName && (
              <div className="text-red-500 text-sm mt-1">
                {errors.transporterName}
              </div>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2">Transport Description</label>
            <InputTextarea
              value={newTransactionData.transporterDesc}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  transporterDesc: e.target.value,
                }))
              }
              className="w-full ring-0"
              rows={3}
              maxLength={250}
            />
            {errors.transporterDesc && (
              <div className="text-red-500 text-sm mt-1">
                {errors.transporterDesc}
              </div>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2">Remarks</label>
            <InputTextarea
              value={newTransactionData.remarks}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }))
              }
              className="w-full ring-0"
              rows={3}
              maxLength={250}
            />
            {errors.remarks && (
              <div className="text-red-500 text-sm mt-1">{errors.remarks}</div>
            )}
          </div>

          <div className="flex justify-between gap-4 mt-4">
            <Button
              label="Cancel"
              className="w-1/2 bg-transparent text-primary border-primary"
              disabled={isLoading}
              onClick={handleHide}
            />
            <Button
              label="Confirm Return"
              className="w-1/2 bg-primary hover:border-none"
              onClick={handleReturn}
              disabled={isLoading}
              loading={isLoading}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ReturnDialog;
