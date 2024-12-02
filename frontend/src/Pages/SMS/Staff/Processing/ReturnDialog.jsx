import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

import { Wheat } from "lucide-react";

import Loader from "@/Components/Loader";
import { ProcessingReturnWSR } from "../../../../Components/Pdf/pdfProcessingWSR";

const initialTransactionData = {
  item: "",
  itemId: "",
  senderId: "",
  fromLocationType: "",
  fromLocationId: 0,
  transporterId: "",
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

const ReturnDialog = ({
  visible,
  viewMode,
  onCancel,
  selectedItem,
  warehouses,
  user,
  apiUrl,
  onSuccess,
  newDryingData,
  newMillingData,
  dryerData,
  millerData,
  refreshData,
}) => {
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newTransactionData, setNewTransactionData] = useState(
    initialTransactionData
  );
  const [transporters, setTransporters] = useState([]);
  const [wsr, setWsr] = useState("");

  // Filter warehouses based on capacity and type
  const filteredWarehouses = warehouses
    .filter((warehouse) => {
      const requiredQuantity =
        viewMode === "drying"
          ? parseInt(newDryingData?.driedQuantityBags || 0)
          : parseInt(newMillingData?.milledQuantityBags || 0);

      const hasEnoughCapacity =
        warehouse.status === "active" &&
        warehouse.totalCapacity - warehouse.currentStock >= requiredQuantity;

      const warehouseName = warehouse.facilityName.toLowerCase();
      const isCorrectType =
        viewMode === "drying"
          ? warehouseName.includes("palay")
          : warehouseName.includes("rice");

      return hasEnoughCapacity && isCorrectType;
    })
    .map((warehouse) => ({
      label: `${warehouse.facilityName} (Available: ${
        warehouse.totalCapacity - warehouse.currentStock
      } bags)`,
      name: warehouse.facilityName,
      value: warehouse.id,
    }));

  useEffect(() => {
    if (newTransactionData.toLocationId) {
      fetchTransporters();
      setWsr(viewMode === "drying" ? selectedItem?.wsr : "")
    }
  }, [newTransactionData.toLocationId]);

  const fetchTransporters = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/transporters?status=active&transporterType=In House`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transporters");
      }

      const data = await response.json();
      const transporterOptions = data.map((transporter) => ({
        label: `${transporter.transporterName} | ${transporter.plateNumber} | ${transporter.description}`,
        value: transporter.id,
        name: transporter.transporterName,
        description: transporter.description,
      }));

      setTransporters(transporterOptions);
    } catch (error) {
      console.error("Error fetching transporters:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch transporters",
        life: 3000,
      });
    }
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
      const facilityData =
        viewMode === "drying"
          ? dryerData.find((dryer) => dryer.id === selectedItem.toLocationId)
          : millerData.find(
              (miller) => miller.id === selectedItem.toLocationId
            );

      if (!facilityData) {
        throw new Error(
          `${viewMode === "drying" ? "Dryer" : "Miller"} not found`
        );
      }

      const initialQuantity =
        viewMode === "drying"
          ? parseInt(selectedItem.palayQuantityBags) // Initial palay batch quantity
          : parseInt(
              selectedItem.driedQuantityBags || selectedItem.palayQuantityBags
            ); // Initial dried quantity

      const newProcessing = Math.max(
        0,
        parseInt(facilityData.processing) - initialQuantity
      );

      const facilityUpdateResponse = await fetch(
        `${apiUrl}/${viewMode === "drying" ? "dryers" : "millers"}/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedItem.toLocationId,
            processing: newProcessing,
          }),
        }
      );

      if (!facilityUpdateResponse.ok) {
        throw new Error(
          `Failed to update ${viewMode} facility processing quantity`
        );
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
          wsr: wsr,
        }),
      });

      if (!palayResponse.ok) {
        throw new Error("Failed to update palay batch");
      }

      // 4. Create milling batch if needed
      if (viewMode === "drying") {
        const millingBatchData = {
          dryingBatchId: selectedItem.dryingBatchId,
          palayBatchId: selectedItem.palayBatchId,
          millerId: "0",
          millerType: "0",
          endDateTime: "0",
          milledQuantityBags: "0",
          milledNetWeight: "0",
          millingEfficiency: "0",
          status: "In Progress",
        };

        const createMillingBatchResponse = await fetch(
          `${apiUrl}/millingbatches`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(millingBatchData),
          }
        );

        if (!createMillingBatchResponse.ok) {
          throw new Error("Failed to create milling batch");
        }
      }

      // 5. Create new return transaction
      const newTransaction = {
        ...newTransactionData,
        item: viewMode === "drying" ? "Palay" : "Rice",
        itemId: selectedItem.palayBatchId,
        senderId: user.id,
        fromLocationType: viewMode === "drying" ? "Dryer" : "Miller",
        fromLocationId: selectedItem.toLocationId,
        toLocationType: "Warehouse",
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

      // 6. Update warehouse stock
      const targetWarehouse = warehouses.find(
        (warehouse) => warehouse.id === newTransactionData.toLocationId
      );

      if (!targetWarehouse) {
        throw new Error("Target warehouse not found");
      }

      const quantityToAdd =
        viewMode === "drying"
          ? parseInt(newDryingData.driedQuantityBags)
          : parseInt(newMillingData.milledQuantityBags);

      console.log("quantity to add: ", quantityToAdd)

      const newStock = quantityToAdd + parseInt(targetWarehouse.currentStock);

      console.log("target warehouse stock: ", targetWarehouse.currentStock)
      console.log("new stock: ", newStock)

      const warehouseResponse = await fetch(`${apiUrl}/warehouses/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetWarehouse.id,
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

      setWsr("")
      generatePDF();
      handleHide();
      onSuccess();
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
    if (!isLoading) {
      setNewTransactionData(initialTransactionData);
      refreshData();
      onCancel();
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!wsr) {
      newErrors.wsr = "Please enter WSR";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter WSR",
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

    if (!newTransactionData.transporterId) {
      newErrors.transporterId = "Please select a transporter";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a transporter",
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

  const customDialogHeader = (
    <div className="flex justify-between">
      <div className="flex items-center space-x-2">
        <Wheat className="text-black" />
        <h3 className="text-md font-semibold text-black">
          Return {viewMode === "drying" ? "Palay" : "Rice"}
        </h3>
      </div>
      <div className="flex flex-col items-center gap-2">
        {selectedItem && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="wsr"
              className="block text-xl font-semibold text-black"
            >
              WSR:
            </label>
            <InputText
              id="wsr"
              name="wsr"
              value={wsr}
              onChange={(e) => setWsr(e.target.value)}
              className="w-40 ring-0 border-primary text-xl h-8 font-semibold text-black"
              keyfilter="int"
              maxLength={8}
            />
          </div>
        )}
        {errors.wsr && <p className="text-red-500 text-xs">{errors.wsr}</p>}
      </div>
    </div>
  );

  const preparePDFData = (selectedItem, viewMode) => {
    // Initial Data Mapping
    const initialData = {
      category: selectedItem.fullPalayBatchData?.palaySupplier?.category || 'N/A',
      farmerName: selectedItem.fullPalayBatchData?.palaySupplier?.farmerName || 'N/A',
      contactNumber: selectedItem.fullPalayBatchData?.palaySupplier?.contactNumber || 'N/A',
      farmStreet: selectedItem.fullPalayBatchData?.farm?.street || 'N/A',
      farmBarangay: selectedItem.fullPalayBatchData?.farm?.barangay || 'N/A',
      farmCityTown: selectedItem.fullPalayBatchData?.farm?.cityTown || 'N/A',
      farmProvince: selectedItem.fullPalayBatchData?.farm?.province || 'N/A',
      farmRegion: selectedItem.fullPalayBatchData?.farm?.region || 'N/A',
      palayId: selectedItem.palayBatchId,
      dateBought: selectedItem.fullPalayBatchData?.dateBought,
      palayVariety: selectedItem.fullPalayBatchData?.varietyCode,
      qualityType: selectedItem.fullPalayBatchData?.qualityType,
      quantityBags: selectedItem.palayQuantityBags,
      grossWeight: selectedItem.grossWeight,
      netWeight: selectedItem.netWeight,
      transactionId: selectedItem.transactionId,
      fromLocationType: selectedItem.from,
      fromLocationId: selectedItem.toLocationId,
      toLocationType: 'Warehouse',
      toLocationId: newTransactionData.toLocationId,
      sendDateTime: selectedItem.requestDate,
      wsr: selectedItem.wsr
    };
  
    // Processed Data Mapping
    const processedData = viewMode === 'drying' 
      ? {
          batchId: selectedItem.dryingBatchId,
          facilityName: selectedItem.location,
          startDateTime: selectedItem.fullProcessingBatchData?.dryingBatch?.startDateTime,
          endDateTime: selectedItem.fullProcessingBatchData?.dryingBatch?.endDateTime,
          processedQuantityBags: selectedItem.quantityBags,
          moistureContent: selectedItem.moistureContent,
          processedNetWeight: selectedItem.netWeight
        }
      : {
          batchId: selectedItem.millingBatchId,
          facilityName: selectedItem.location,
          startDateTime: selectedItem.fullProcessingBatchData?.millingBatch?.startDateTime,
          endDateTime: selectedItem.fullProcessingBatchData?.millingBatch?.endDateTime,
          processedQuantityBags: selectedItem.quantityBags,
          millingEfficiency: selectedItem.fullProcessingBatchData?.millingBatch?.millingEfficiency,
          processedNetWeight: selectedItem.netWeight
        };
  
    return { initialData, processedData };
  };

  const generatePDF = () => {
    try {
      const { initialData, processedData } = preparePDFData(selectedItem, viewMode);
      const pdf = ProcessingReturnWSR(initialData, processedData, viewMode);
      pdf.save(`WSR-${wsr}.pdf`);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "PDF Generation Error",
        detail: error.message,
        life: 3000,
      });
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}
      <Toast ref={toast} />
      <Dialog
        header={customDialogHeader}
        visible={visible}
        onHide={handleHide}
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
            <Dropdown
              value={newTransactionData.transporterId}
              options={transporters}
              onChange={(e) => {
                const selectedTransporter = transporters.find(
                  (t) => t.value === e.value
                );
                setNewTransactionData((prev) => ({
                  ...prev,
                  transporterId: e.value,
                  transporterName: selectedTransporter.name,
                  transporterDesc: selectedTransporter.description,
                }));
              }}
              placeholder="Select a transporter"
              className="w-full ring-0"
              disabled={!newTransactionData.toLocationId}
            />
            {errors.transporterId && (
              <div className="text-red-500 text-sm mt-1">
                {errors.transporterId}
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
              onClick={handleHide}
              disabled={isLoading}
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
