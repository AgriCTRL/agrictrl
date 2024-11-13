import React, { useState, useEffect, useRef } from "react";
import PrivateMillerLayout from "../../../Layouts/PrivateMillerLayout";

import {
  Search,
  Box,
  Factory,
  RotateCcw,
  RotateCw,
  Wheat,
} from "lucide-react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataView } from "primereact/dataview";
import { FilterMatchMode } from "primereact/api";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useAuth } from "../../Authentication/Login/AuthContext";

const initialMillingData = {
  palayBatchId: "",
  millerId: "",
  millerType: "Private",
  startDateTime: "",
  endDateTime: "",
  milledQuantityBags: "",
  milledGrossWeight: "",
  milledNetWeight: "",
  millingEfficiency: "",
  status: "In Progress",
};

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

const MillingTransactions = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const { user } = useAuth();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("request");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showProcessDialog, setProcessDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);

  const [combinedData, setCombinedData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [millerData, setMillerData] = useState([]);
  const [newMillingData, setNewMillingData] = useState(initialMillingData);
  const [newTransactionData, setNewTransactionData] = useState(
    initialTransactionData
  );

  const filteredWarehouses = warehouses
    .filter((warehouse) => {
      const requiredQuantity = parseInt(
        newMillingData?.milledQuantityBags || 0
      );
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

  useEffect(() => {
    fetchData();
    fetchActiveWarehouses();
  }, [selectedFilter]);

  useEffect(() => {
    const newFilters = {
      global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    };
    setFilters(newFilters);
  }, [globalFilterValue]);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const fetchData = async () => {
    try {
      // Determine processing type and location based on fixed values for milling
      const processType = "miller";
      const locationType = "Miller";
      const status = selectedFilter === "request" ? "Pending" : "Received";
      const millerType = "Private";

      // Fetch all required data in parallel
      const [facilitiesRes, inventoryRes, warehousesRes] = await Promise.all([
        fetch(`${apiUrl}/millers`),
        fetch(
          `${apiUrl}/inventory?toLocationType=${locationType}&status=${status}&batchType=milling&batchType=drying&millerType=${millerType}&userId=${user.id}`
        ),
        fetch(`${apiUrl}/warehouses`),
      ]);

      if (!facilitiesRes.ok || !inventoryRes.ok || !warehousesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [facilities, inventory, warehouses] = await Promise.all([
        facilitiesRes.json(),
        inventoryRes.json(),
        warehousesRes.json(),
      ]);

      setMillerData(facilities);

      // Combine and structure the data based on the backend associations
      const transformedData = inventory.map((item) => {
        // Safely access nested properties
        const processingBatch = item.processingBatch || {};
        const millingBatch = processingBatch.millingBatch || {};
        const dryingBatch = processingBatch.dryingBatch || {};

        const palayBatch = item.palayBatch || {};
        const transaction = item.transaction || {};
        const qualitySpec = palayBatch.qualitySpec || {};

        // Find facility and warehouse
        const fromWarehouse = warehouses.find(
          (w) => w.id === transaction.fromLocationId
        );
        const toFacility = facilities.find(
          (f) => f.id === transaction.toLocationId
        );

        return {
          palayBatchId: palayBatch.id || null,
          transactionId: transaction.id || null,
          millingBatchId: millingBatch?.id || null,
          dryingBatchId: dryingBatch?.id || null,
          palayQuantityBags: palayBatch.quantityBags || null,
          driedQuantityBags: dryingBatch?.driedQuantityBags || null,
          quantityBags:
            millingBatch.milledQuantityBags ||
            dryingBatch.driedQuantityBags ||
            palayBatch.quantityBags ||
            0,
          grossWeight:
            millingBatch.milledGrossWeight ||
            dryingBatch.driedGrossWeight ||
            palayBatch.grossWeight ||
            0,
          netWeight:
            millingBatch.milledNetWeight ||
            dryingBatch.driedNetWeight ||
            palayBatch.netWeight ||
            0,
          from: fromWarehouse?.facilityName || "Unknown Warehouse",
          location: toFacility?.[`${processType}Name`] || "Unknown Facility",
          toLocationId: transaction.toLocationId || null,
          millerType: "Private",
          requestDate: transaction.sendDateTime
            ? new Date(transaction.sendDateTime).toLocaleDateString()
            : "",
          startDate: millingBatch.startDateTime
            ? new Date(millingBatch.startDateTime).toLocaleDateString()
            : "",
          endDate: millingBatch.endDateTime
            ? new Date(millingBatch.endDateTime).toLocaleDateString()
            : "",
          moistureContent: qualitySpec.moistureContent || "",
          transportedBy: transaction.transporterName || "",
          palayStatus: palayBatch.status || null,
          transactionStatus: transaction.status || null,
          processingStatus: millingBatch.status || null,
        };
      });

      setCombinedData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch data",
        life: 3000,
      });
    }
  };

  const fetchActiveWarehouses = async () => {
    try {
      const response = await fetch(`${apiUrl}/warehouses?status=Active`);

      if (!response.ok) {
        throw new Error("Failed to fetch warehouses");
      }

      const data = await response.json();
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch warehouses",
        life: 3000,
      });
    }
  };

  const handleActionClick = (rowData) => {
    setSelectedItem(rowData);

    switch (rowData.transactionStatus?.toLowerCase()) {
      case "pending":
        setShowAcceptDialog(true);
        break;
      case "received":
        if (rowData.processingStatus?.toLowerCase() === "in progress") {
          setNewMillingData(initialMillingData);

          setProcessDialog(true);
        } else if (rowData.processingStatus?.toLowerCase() === "done") {
          setShowReturnDialog(true);
        }
        break;
    }
  };

  const handleAccept = async () => {
    if (!selectedItem) {
      console.error("No item selected");
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 8);
    setIsLoading(true);
    try {
      // 1. Update transaction status to "Received"
      const transactionResponse = await fetch(`${apiUrl}/transactions/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedItem.transactionId,
          status: "Received",
          receiveDateTime: currentDate.toISOString(),
          receiverId: user.id,
        }),
      });

      if (!transactionResponse.ok) {
        throw new Error("Failed to update transaction");
      }

      // 2. Update palay batch status
      const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedItem.palayBatchId,
          status: "In Milling",
        }),
      });

      if (!palayResponse.ok) {
        throw new Error("Failed to update palay batch status");
      }

      // 3. Check if milling batch already exists for this palay batch
      const millingBatchesResponse = await fetch(`${apiUrl}/millingbatches`);
      const millingBatches = await millingBatchesResponse.json();

      const existingMillingBatch = millingBatches.find(
        (batch) => batch.palayBatchId === selectedItem.palayBatchId
      );

      if (existingMillingBatch) {
        // Update existing milling batch with current startDateTime
        const updateMillingResponse = await fetch(
          `${apiUrl}/millingbatches/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: existingMillingBatch.id,
              startDateTime: currentDate.toISOString(),
              status: "In Progress",
            }),
          }
        );

        if (!updateMillingResponse.ok) {
          throw new Error("Failed to update existing milling batch");
        }
        console.log(
          "Updated existing milling batch with current startDateTime"
        );
      } else {
        // Create new milling batch if none exists
        const millingBatchData = {
          dryingBatchId: "0",
          palayBatchId: selectedItem.palayBatchId,
          millerId: selectedItem.toLocationId,
          millerType: "0",
          startDateTime: "0",
          endDateTime: "0",
          milledQuantityBags: "0",
          milledNetWeight: "0",
          millingEfficiency: "0",
          status: "In Progress",
        };

        const millingResponse = await fetch(`${apiUrl}/millingbatches`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(millingBatchData),
        });

        if (!millingResponse.ok) {
          throw new Error("Failed to create milling batch");
        }
      }

      await fetchData();
      setShowAcceptDialog(false);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Milling process started successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error in handleAccept:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to process acceptance: ${error.message}`,
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!validateForm()) return;
    if (!selectedItem) {
      console.error("No item selected");
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 8);

    setIsLoading(true);
    try {
      const { millingBatchId, palayBatchId, toLocationId, millerType } =
        selectedItem;

      // Calculate weights
      const milledQuantityBags = parseInt(newMillingData.milledQuantityBags);
      const milledGrossWeight = parseFloat(newMillingData.milledGrossWeight);
      const milledNetWeight = parseFloat(newMillingData.milledNetWeight);
      const millingEfficiency = calculateMillingEfficiency(
        milledQuantityBags,
        selectedItem.quantityBags
      );

      const updateData = {
        id: millingBatchId,
        palayBatchId,
        millerId: toLocationId,
        millerType,
        endDateTime: currentDate,
        milledGrossWeight,
        milledQuantityBags,
        milledNetWeight,
        millingEfficiency,
        status: "Done",
      };

      const response = await fetch(`${apiUrl}/millingbatches/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update milling batch");
      }

      // Update palay batch status
      const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: palayBatchId,
          status: "Milled",
        }),
      });

      if (!palayResponse.ok) {
        throw new Error("Failed to update palay batch status");
      }

      await fetchData();
      setProcessDialog(false);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Milling process completed successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error in handleProcess:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to complete process: ${error.message}`,
        life: 3000,
      });
    } finally {
      setIsLoading(false);
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
      const selectedMiller = millerData.find(
        (miller) => miller.id === selectedItem.toLocationId
      );

      console.log(selectedMiller);

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
        item: "Palay",
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

      console.log(newTransactionData.toLocationId);
      console.log(warehouses);

      // 5. Update warehouse stock
      const targetWarehouse = warehouses.find(
        (warehouse) => warehouse.id === newTransactionData.toLocationId
      );

      console.log("target: ", targetWarehouse);

      if (!targetWarehouse) {
        throw new Error("Target warehouse not found");
      }

      const quantityToAdd = parseInt(newMillingData.milledQuantityBags);
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

      await fetchData();
      setShowReturnDialog(false);
      setNewTransactionData(initialTransactionData);
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

  const handleItemClick = (item) => {
    setSelectedItemDetails(item);
    setShowDetailsDialog(true);
  };

  const calculateMillingEfficiency = (milledBags, totalBags) => {
    if (totalBags === 0) return 0;
    return ((milledBags / totalBags) * 100).toFixed(2);
  };

  const handleInputChange = (fieldName, value) => {
    // If the input is empty, clear the relevant state without setting it to 0
    if (value === "") {
      if (fieldName === "milledQuantityBags") {
        setNewMillingData((prev) => ({
          ...prev,
          milledQuantityBags: "",
          milledGrossWeight: "",
          milledNetWeight: "",
          millingEfficiency: "",
        }));
      }
      return;
    }

    // Parse the input value
    const parsedValue = parseInt(value);

    // Validate the parsed value
    if (isNaN(parsedValue)) {
      return;
    }

    const quantity = Math.min(parsedValue, selectedItem.quantityBags);

    // Check if the value has been clamped
    if (quantity !== parsedValue) {
      toast.current.show({
        severity: "warn",
        summary: "Input Clamped",
        detail: `Value has been clamped to the maximum of ${selectedItem.quantityBags} bags.`,
        life: 3000,
      });
    }

    const { grossWeight, netWeight } = calculateWeights(quantity);

    if (fieldName === "milledQuantityBags") {
      setNewMillingData((prev) => ({
        ...prev,
        milledQuantityBags: quantity,
        milledGrossWeight: grossWeight,
        milledNetWeight: netWeight,
        millingEfficiency: calculateMillingEfficiency(
          quantity,
          selectedItem.quantityBags
        ),
      }));
    }
  };

  const calculateWeights = (quantity) => {
    const bagWeight = 50; // Assuming 50kg per bag
    return {
      grossWeight: quantity * bagWeight,
      netWeight: quantity * bagWeight - quantity, // Assuming 1kg per bag is tare weight
    };
  };

  const actionBodyTemplate = (rowData) => {
    let actionText = "Action";
    switch (rowData.transactionStatus?.toLowerCase()) {
      case "pending":
        actionText = "Accept";
        break;
      case "received":
        if (rowData.processingStatus?.toLowerCase() === "in progress") {
          actionText = "Done";
        } else if (rowData.processingStatus?.toLowerCase() === "done") {
          actionText = "Return";
        }
        break;
    }

    return (
      <Button
        label={actionText}
        className="p-button-text p-button-sm text-primary ring-0"
        
        onClick={(e) => {
          e.stopPropagation();
          handleActionClick(rowData);
        }}
      />
    );
  };

  const getSeverity = (status, type) => {
    const statusLower = status?.toLowerCase();

    // Processing status severities
    if (statusLower === "in progress") return "warning";
    if (statusLower === "done") return "success";

    // Transaction status severities
    if (statusLower === "pending") return "warning";
    if (statusLower === "received") return "success";

    // Palay/Processing status severities
    if (statusLower === "to be dry" || statusLower === "to be mill")
      return "info";
    if (statusLower === "in drying" || statusLower === "in milling")
      return "warning";
    if (statusLower === "dried" || statusLower === "milled") return "success";

    return "secondary"; // default severity
  };

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

  const filteredData = combinedData.filter((item) => {
    switch (selectedFilter) {
      case "request":
        return item.transactionStatus === "Pending";
      case "process":
        return (
          item.transactionStatus === "Received" &&
          item.palayStatus === "In Milling" &&
          item.processingStatus === "In Progress"
        );
      case "return":
        return (
          item.transactionStatus === "Received" &&
          item.processingStatus === "Done"
        );
      default:
        return true;
    }
  });

  const FilterButton = ({ label, icon, filter }) => (
    <Button
      label={label}
      icon={icon}
      className={`p-button-sm ring-0 border-none rounded-full ${
        selectedFilter === filter
          ? "p-button-outlined bg-primary text-white"
          : "p-button-text text-primary"
      } flex items-center`}
      onClick={() => setSelectedFilter(filter)}
    />
  );

  const validateForm = () => {
    let newErrors = {};

    if (selectedFilter === "process") {
      if (!newMillingData.milledQuantityBags) {
        newErrors.milledQuantityBags = "Please enter milled quantity";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter milled quantity",
          life: 3000,
        });
      }

      if (!newMillingData.milledGrossWeight) {
        newErrors.milledGrossWeight = "Please enter milled gross weight";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter milled gross weight",
          life: 3000,
        });
      }

      if (!newMillingData.milledNetWeight) {
        newErrors.milledNetWeight = "Please enter milled net weight";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter milled net weight",
          life: 3000,
        });
      }

      if (!newMillingData.millingEfficiency) {
        newErrors.millingEfficiency = "Please enter milling efficiency";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter milling efficiency",
          life: 3000,
        });
      }
    } else if (selectedFilter === "return") {
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const itemTemplate = (item) => {
    return (
      <div className="col-12" onClick={() => handleItemClick(item)}>
        <div className="flex flex-row items-center p-4 gap-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg mb-4">
          {/* Left Side - Icon */}
          <div className="flex-none">
            <Wheat size={40} className="text-gray-400" />
          </div>

          {/* Middle - Main Info */}
          <div className="flex-1">
            <div className="font-medium text-xl mb-1">
              Batch #{item.palayBatchId}
            </div>
            <div className="text-gray-600 mb-1">
              {item.requestDate || item.startDate || item.endDate}
            </div>
            <div className="flex items-center">
              <span className="py-1 text-sm">{item.quantityBags} bags</span>
            </div>
          </div>

          {/* Right Side - Status and Action */}
          <div className="flex-none flex flex-col items-center gap-2">
            {statusBodyTemplate(item, {
              field:
                selectedFilter === "request"
                  ? "transactionStatus"
                  : "processingStatus",
            })}
            {actionBodyTemplate(item)}
          </div>
        </div>
      </div>
    );
  };

  const renderDetailsDialog = () => {
    if (!selectedItem) return null;

    return (
      <Dialog
        visible={showDetailsDialog}
        onHide={() => setShowDetailsDialog(false)}
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

  return (
    <PrivateMillerLayout activePage="Milling Transactions" user={user}>
      <Toast ref={toast} />
      <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
        <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
          <h1 className="text-5xl h-full text-white font-bold mb-2">
            Mill Palay
          </h1>
          <span className="p-input-icon-left w-1/2 mr-4">
            <Search className="text-white ml-2 -translate-y-1" />
            <InputText
              type="search"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Tap to Search"
              className="w-full pl-10 pr-4 py-2 rounded-full text-white bg-transparent border border-white placeholder:text-white"
            />
          </span>
        </div>

        <div className="flex-grow flex flex-col overflow-hidden rounded-lg">
          <div className="overflow-hidden bg-white flex flex-col gap-4 p-5 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex bg-white rounded-full gap-2 p-2">
                <FilterButton
                  label="Request"
                  icon={<Box className="mr-2" size={16} />}
                  filter="request"
                />
                <FilterButton
                  label="In Milling"
                  icon={<Factory className="mr-2" size={16} />}
                  filter="process"
                />
                <FilterButton
                  label="Return"
                  icon={<RotateCcw className="mr-2" size={16} />}
                  filter="return"
                />
              </div>
              <div className="flex gap-4">
                <p className="font-medium text-black">Refresh Data</p>
                <RotateCw
                  size={25}
                  onClick={fetchData}
                  className="text-primary cursor-pointer hover:text-primaryHover"
                  title="Refresh data"
                />
              </div>
            </div>

            {/* Container with relative positioning */}
            <div className="relative flex flex-col" style={{ height: "510px" }}>
              <DataView
                value={filteredData}
                itemTemplate={itemTemplate}
                paginator
                rows={10}
                emptyMessage="No data found."
                className="overflow-y-auto pb-16"
                paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
              />
            </div>
          </div>
        </div>
      </div>

      {renderDetailsDialog()}

      {/* Accept Dialog */}
      <Dialog
        header={`Receive Palay`}
        visible={showAcceptDialog}
        onHide={isLoading ? null : () => setShowAcceptDialog(false)}
        className="w-1/3"
      >
        <div className="flex flex-col items-center">
          <p className="mb-10">
            Are you sure you want to receive this request?
          </p>
          <div className="flex justify-between w-full gap-4">
            <Button
              label="Cancel"
              className="w-1/2 bg-transparent text-primary border-primary"
              onClick={() => setShowAcceptDialog(false)}
              disabled={isLoading}
            />
            <Button
              label="Confirm Receive"
              className="w-1/2 bg-primary hover:border-none"
              onClick={handleAccept}
              disabled={isLoading}
            />
          </div>
        </div>
      </Dialog>

      {/* Process Dialog */}
      <Dialog
        header={`Complete Milling Process`}
        visible={showProcessDialog}
        onHide={isLoading ? null : () => setProcessDialog(false)}
        className="w-1/3"
      >
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <label className="block mb-2">
              Milled Quantity in Bags (50Kg per Bag)
            </label>
            <InputText
              type="number"
              value={newMillingData.milledQuantityBags}
              onChange={(e) =>
                handleInputChange("milledQuantityBags", e.target.value)
              }
              className="w-full ring-0"
              keyfilter="num"
            />
            {errors.milledQuantityBags && (
              <div className="text-red-500 text-sm mt-1">
                {errors.milledQuantityBags}
              </div>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2">Milled Gross Weight (Kg)</label>
            <InputText
              type="number"
              value={newMillingData.milledGrossWeight}
              onChange={(e) =>
                setNewMillingData((prev) => ({
                  ...prev,
                  milledGrossWeight: e.target.value,
                }))
              }
              className="w-full ring-0"
              keyfilter="num"
            />
            {errors.milledGrossWeight && (
              <div className="text-red-500 text-sm mt-1">
                {errors.milledGrossWeight}
              </div>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2">Milled Net Weight (Kg)</label>
            <InputText
              type="number"
              value={newMillingData.milledNetWeight}
              onChange={(e) =>
                setNewMillingData((prev) => ({
                  ...prev,
                  milledNetWeight: e.target.value,
                }))
              }
              className="w-full ring-0"
              keyfilter="num"
            />
            {errors.milledNetWeight && (
              <div className="text-red-500 text-sm mt-1">
                {errors.milledNetWeight}
              </div>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2">Milling Efficiency (%)</label>
            <InputText
              type="number"
              value={newMillingData.millingEfficiency}
              onChange={(e) =>
                setNewMillingData((prev) => ({
                  ...prev,
                  millingEfficiency: e.target.value,
                }))
              }
              className="w-full ring-0"
              keyfilter="num"
            />
            {errors.millingEfficiency && (
              <div className="text-red-500 text-sm mt-1">
                {errors.millingEfficiency}
              </div>
            )}
          </div>

          <div className="flex justify-between gap-4 mt-4">
            <Button
              label="Cancel"
              className="w-1/2 bg-transparent text-primary border-primary"
              onClick={() => setProcessDialog(false)}
              disabled={isLoading}
            />
            <Button
              label="Complete Process"
              className="w-1/2 bg-primary hover:border-none"
              onClick={handleProcess}
              disabled={isLoading}
            />
          </div>
        </div>
      </Dialog>

      {/* Return Dialog */}
      <Dialog
        header={`Return Rice`}
        visible={showReturnDialog}
        onHide={
          isLoading
            ? null
            : () => {
                setShowReturnDialog(false);
              }
        }
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
              onClick={() => {
                setShowReturnDialog(false);
                setNewTransactionData(initialTransactionData);
              }}
            />
            <Button
              label="Confirm Return"
              className="w-1/2 bg-primary hover:border-none"
              onClick={handleReturn}
              disabled={isLoading}
            />
          </div>
        </div>
      </Dialog>
    </PrivateMillerLayout>
  );
};

export default MillingTransactions;
