import React, { useState, useEffect, useRef } from "react";

import {
  Search,
  Box,
  Factory,
  RotateCcw,
  RotateCw,
  Wheat,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { DataView } from "primereact/dataview";
import { FilterMatchMode } from "primereact/api";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import PrivateMillerLayout from "@/Layouts/Miller/PrivateMillerLayout";
import EmptyRecord from "@/Components/EmptyRecord";
import AcceptDialog from "./AcceptDialog";
import ProcessDialog from "./ProcessDialog";
import ReturnDialog from "./ReturnDialog";
import DetailsDialog from "./DetailsDialog";
import { useAuth } from "../../../Authentication/Login/AuthContext";
import Loader from "@/Components/Loader";

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

const MillingTransactions = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const { user } = useAuth();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
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

  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    fetchData(first, rows);
    fetchActiveWarehouses();
  }, [selectedFilter, first, rows]);

  useEffect(() => {
    const newFilters = {
      global: {
        value: globalFilterValue,
        matchMode: FilterMatchMode.CONTAINS,
      },
    };
    setFilters(newFilters);
  }, [globalFilterValue]);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const refreshData = () => {
    fetchData();
    fetchActiveWarehouses();
  };

  const fetchData = async (offset = 0, limit = 10) => {
    try {
      setIsLoading(true);
      const processType = "miller";
      const locationType = "Miller";
      const millerType = "Private";
      let transactionStatus = "";
      let processingStatus = "";
      let palayStatus = [];

      // Determine statuses based on selectedFilter
      switch (selectedFilter) {
        case "request":
          transactionStatus = "Pending";
          break;
        case "process":
          transactionStatus = "Received";
          palayStatus = ["In Milling"];
          break;
        case "return":
          transactionStatus = "Received";
          processingStatus = "Done";
          break;
      }

      // Build URL parameters
      const params = new URLSearchParams({
        toLocationType: locationType,
        status: transactionStatus,
        millerType: millerType,
        userId: user.id,
        offset: offset.toString(),
        limit: limit.toString(),
      });

      // Add processing status if present
      if (processingStatus) {
        params.append("processingStatus", processingStatus);
      }

      // Add palay status if present
      if (palayStatus.length > 0) {
        palayStatus.forEach((status) => params.append("palayStatus", status));
      }

      // Add batch types
      params.append("batchType", "milling");
      params.append("batchType", "drying");

      // Fetch data
      const [facilitiesRes, inventoryRes, warehousesRes] = await Promise.all([
        fetch(`${apiUrl}/millers`),
        fetch(`${apiUrl}/inventory?${params}`),
        fetch(`${apiUrl}/warehouses`),
      ]);

      if (!facilitiesRes.ok || !inventoryRes.ok || !warehousesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [facilities, inventoryData, warehouses] = await Promise.all([
        facilitiesRes.json(),
        inventoryRes.json(),
        warehousesRes.json(),
      ]);

      setMillerData(facilities);
      setTotalRecords(inventoryData.total);

      // Transform the inventory items
      const transformedData = inventoryData.items.map((item) => {
        const processingBatch = item.processingBatch || {};
        const millingBatch = processingBatch.millingBatch || {};
        const dryingBatch = processingBatch.dryingBatch || {};
        const palayBatch = item.palayBatch || {};
        const transaction = item.transaction || {};
        const qualitySpec = palayBatch.qualitySpec || {};

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
            ? new Date(transaction.sendDateTime).toLocaleDateString("en-PH", {
                timeZone: "UTC",
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })
            : "",
          startDate: millingBatch.startDateTime
            ? new Date(millingBatch.startDateTime).toLocaleDateString("en-PH", {
                timeZone: "UTC",
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })
            : "",
          endDate: millingBatch.endDateTime
            ? new Date(millingBatch.endDateTime).toLocaleDateString("en-PH", {
                timeZone: "UTC",
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })
            : "",
          moistureContent: qualitySpec.moistureContent || "",
          transportedBy: transaction.transporterName || "",
          palayStatus: palayBatch.status || null,
          transactionStatus: transaction.status || null,
          processingStatus: millingBatch.status || null,

          // Add full data objects
          fullPalayBatchData: palayBatch,
          fullTransactionData: transaction,
          fullProcessingBatchData: processingBatch,
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveWarehouses = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (rowData) => {
    console.log(rowData);
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

  const handleItemClick = (item) => {
    setSelectedItemDetails(item);
    setShowDetailsDialog(true);
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

  const FilterButton = ({ label, icon, filter }) => (
    <Button
      label={label}
      icon={icon}
      className={`p-button-sm ring-0 border-none rounded-full gap-4 ${
        selectedFilter === filter
          ? "p-button-outlined bg-primary text-white"
          : "p-button-text text-primary"
      } flex items-center`}
      onClick={() => setSelectedFilter(filter)}
    />
  );

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
              Batch #{item.fullPalayBatchData.wsi}
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

  const onPage = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  // RIGHT SIDEBAR
  const millingStatsSummary = [
    { icon: <Loader2 size={18} />, title: "Milling Requests", value: 0 },
    { icon: <Factory size={18} />, title: "In Milling", value: 0 },
    { icon: <CheckCircle2 size={18} />, title: "To Return", value: 0 },
  ];

  const rightSidebar = () => {
    return (
      <div className="p-4 bg-white rounded-lg flex flex-col gap-4">
        <div className="header flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="">Total</p>
            <p className="text-2xl sm:text-4xl font-semibold text-primary">
              {0}
            </p>
          </div>
          <div className="flex gap-2">
            {millingStatsSummary.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 flex-1 items-center justify-center text-center"
              >
                <p className="text-sm">{stat.title}</p>
                <p className="font-semibold text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PrivateMillerLayout
      activePage="Milling Transactions"
      user={user}
      isRightSidebarOpen={false}
      rightSidebar={rightSidebar()}
    >
      <Toast ref={toast} />
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
          <h1 className="text-2xl sm:text-4xl text-white font-semibold">
            Mill Palay
          </h1>
          <span className="w-1/2">
            <IconField iconPosition="left">
              <InputIcon className="">
                <Search className="text-white" size={18} />
              </InputIcon>
              <InputText
                className="ring-0 w-full rounded-full text-white bg-transparent border border-white placeholder:text-white"
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Tap to search"
              />
            </IconField>
          </span>
        </div>

        <div className="flex-grow flex flex-col overflow-hidden rounded-lg">
          <div className="overflow-hidden bg-white flex flex-col gap-4 p-5 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex bg-white rounded-full gap-2 p-2">
                <FilterButton
                  label="Request"
                  icon={<Box size={18} />}
                  filter="request"
                />
                <FilterButton
                  label="In Milling"
                  icon={<Factory size={18} />}
                  filter="process"
                />
                <FilterButton
                  label="Return"
                  icon={<RotateCcw size={18} />}
                  filter="return"
                />
              </div>
              <div className="flex items-center gap-4">
                <p className="font-medium text-black">Refresh Data</p>
                <RotateCw
                  size={18}
                  onClick={fetchData}
                  className="text-primary cursor-pointer hover:text-primaryHover"
                  title="Refresh data"
                />
              </div>
            </div>

            {/* Container with relative positioning */}
            <div className="relative flex flex-col" style={{ height: "550px" }}>
              <DataView
                value={combinedData}
                itemTemplate={itemTemplate}
                paginator
                rows={rows}
                first={first}
                totalRecords={totalRecords}
                onPage={onPage}
                emptyMessage={<EmptyRecord label="No milling data to show." />}
                className="overflow-y-auto pb-16"
                paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                lazy
              />
            </div>
          </div>
        </div>
      </div>

      {/* Accept Dialog */}
      <AcceptDialog
        visible={showAcceptDialog}
        onHide={() => setShowAcceptDialog(false)}
        selectedItem={selectedItem}
        toast={toast}
        apiUrl={apiUrl}
        user={user}
        onSuccess={() => {
          setShowAcceptDialog(false);
          refreshData();
        }}
      />

      {/* Process Dialog */}
      <ProcessDialog
        visible={showProcessDialog}
        onHide={() => setProcessDialog(false)}
        selectedItem={selectedItem}
        apiUrl={apiUrl}
        toast={toast}
        onSuccess={() => {
          setProcessDialog(false);
          refreshData();
        }}
      />

      {/* Return Dialog */}
      <ReturnDialog
        visible={showReturnDialog}
        onHide={() => setShowReturnDialog(false)}
        selectedItem={selectedItem}
        warehouses={warehouses}
        millerData={millerData}
        user={user}
        apiUrl={apiUrl}
        toast={toast}
        onSuccess={() => {
          setShowReturnDialog(false);
          refreshData();
        }}
      />

      {/* Details Dialog */}
      <DetailsDialog
        visible={showDetailsDialog}
        onHide={() => setShowDetailsDialog(false)}
        selectedItem={selectedItemDetails}
        selectedFilter={selectedFilter}
        getSeverity={getSeverity}
      />
    </PrivateMillerLayout>
  );
};

export default MillingTransactions;
