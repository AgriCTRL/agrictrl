import React, { useEffect, useState, useRef } from "react";
import StaffLayout from "@/Layouts/StaffLayout";

import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import {
  Search,
  Box,
  Sun,
  RotateCcw,
  RotateCw,
  Loader2,
  Undo2,
  CheckCircle2,
  Wheat,
} from "lucide-react";

import { useAuth } from "../../../Authentication/Login/AuthContext";
import AcceptDialog from "./AcceptDialog";
import ProcessDialog from "./ProcessDialog";
import ReturnDialog from "./ReturnDialog";

const initialDryingData = {
  palayBatchId: "",
  dryingMethod: "",
  dryerId: "",
  startDateTime: "",
  endDateTime: "",
  driedQuantityBags: "",
  driedGrossWeight: "",
  driedNetWeight: "",
  moistureContent: "",
  status: "In Progress",
};

const initialMillingData = {
  dryingBatchId: "",
  palayBatchId: "",
  millerId: "",
  millerType: "",
  startDateTime: "",
  endDateTime: "",
  milledQuantityBags: "",
  milledGrossWeight: "",
  milledNetWeight: "",
  millingEfficiency: "",
  status: "In Progress",
};

const initialTransactionData = {
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

const Processing = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const { user } = useAuth();
  // const [user] = useState({ userType: 'NFA Branch Staff' });

  // States for UI controls
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewMode, setViewMode] = useState("drying");
  const [selectedFilter, setSelectedFilter] = useState("request");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const [palayCount, setPalayCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [distributedCount, setDistributedCount] = useState(0);

  // Dialog states
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showProcessDialog, setProcessDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);

  // Data states
  const [combinedData, setCombinedData] = useState([]);
  const [dryerData, setDryerData] = useState([]);
  const [millerData, setMillerData] = useState([]);

  const [warehouses, setWarehouses] = useState([]);

  const [newDryingData, setNewDryingData] = useState(initialDryingData);
  const [newMillingData, setNewMillingData] = useState(initialMillingData);
  const [newTransactionData, setNewTransactionData] =
    useState(initialMillingData);

  useEffect(() => {
    fetchData();
    fetchActiveWarehouses();
    fetchStatsData();
  }, [viewMode, selectedFilter, first, rows, globalFilterValue]);

  useEffect(() => {
    const newFilters = {
      global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    };
    setFilters(newFilters);
  }, [globalFilterValue]);

  const refreshData = () => {
    fetchData();
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const fetchData = async () => {
    try {
      // Determine processing type and location based on viewMode
      const processType = viewMode === "drying" ? "dryer" : "miller";
      const locationType = viewMode === "drying" ? "Dryer" : "Miller";
      let transactionStatus = "";
      let processingStatus = "";
      let palayStatus = [];
  
      switch (selectedFilter) {
        case "request":
          transactionStatus = "Pending";
          break;
        case "process":
          transactionStatus = "Received";
          processingStatus = "In Progress";
          palayStatus = viewMode === "drying" ? ["In Drying"] : ["In Milling"];
          break;
        case "return":
          transactionStatus = "Received";
          processingStatus = "Done";
          break;
      }

      // First fetch totals for each category
      const palayStatusParams = new URLSearchParams({
        toLocationType: locationType,
        status: transactionStatus,
        millerType: "In House",
      });

      if (processingStatus) {
        palayStatusParams.append("processingStatus", processingStatus);
      }

      if (palayStatus.length > 0) {
        palayStatus.forEach(status => palayStatusParams.append("palayStatus", status));
      }

      const [palayRes, facilitiesRes, warehousesRes] = await Promise.all([
        fetch(`${apiUrl}/inventory?${palayStatusParams}`),
        fetch(`${apiUrl}/${processType}s`),
        fetch(`${apiUrl}/warehouses`)
      ]);

      if (!palayRes.ok || !facilitiesRes.ok || !warehousesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [palayData, facilities, warehouses] = await Promise.all([
        palayRes.json(),
        facilitiesRes.json(),
        warehousesRes.json()
      ]);

      // Update total records for pagination
      setTotalRecords(palayData.total);

      // Update facility states based on viewMode
      if (viewMode === "drying") {
        setDryerData(facilities);
      } else {
        setMillerData(facilities);
      }

      // Then fetch paginated data with all filters
      const paginatedParams = new URLSearchParams({
        toLocationType: locationType,
        status: transactionStatus,
        offset: first.toString(),
        limit: rows.toString(),
        millerType: "In House",
      });

      if (processingStatus) {
        paginatedParams.append("processingStatus", processingStatus);
      }

      if (palayStatus.length > 0) {
        palayStatus.forEach(status => paginatedParams.append("palayStatus", status));
      }

      if (globalFilterValue) {
        paginatedParams.append("searchTerm", globalFilterValue);
      }

      const paginatedRes = await fetch(`${apiUrl}/inventory?${paginatedParams}`);
      
      if (!paginatedRes.ok) {
        throw new Error("Failed to fetch paginated data");
      }

      const paginatedData = await paginatedRes.json();

      // Transform the paginated data
      const transformedData = paginatedData.items.map((item) => {
        const { transaction, palayBatch, processingBatch } = item;
        const millingBatch = processingBatch?.millingBatch || {};
        const dryingBatch = processingBatch?.dryingBatch || {};
        const qualitySpec = palayBatch?.qualitySpec || {};

        const fromWarehouse = warehouses.find(w => w.id === transaction?.fromLocationId);
        const toFacility = facilities.find(f => f.id === transaction?.toLocationId);

        return {
          palayBatchId: palayBatch?.id || null,
          transactionId: transaction?.id || null,
          millingBatchId: millingBatch?.id || null,
          dryingBatchId: dryingBatch?.id || null,
          palayQuantityBags: palayBatch?.quantityBags || null,
          driedQuantityBags: dryingBatch?.driedQuantityBags || null,
          quantityBags: millingBatch?.milledQuantityBags || 
                       dryingBatch?.driedQuantityBags || 
                       palayBatch?.quantityBags || 0,
          grossWeight: millingBatch?.milledGrossWeight || 
                      dryingBatch?.driedGrossWeight || 
                      palayBatch?.grossWeight || 0,
          netWeight: millingBatch?.milledNetWeight || 
                    dryingBatch?.driedNetWeight || 
                    palayBatch?.netWeight || 0,
          from: transaction?.fromLocationType === "Procurement" 
                ? "Procurement" 
                : fromWarehouse?.facilityName || "Unknown Warehouse",
          location: toFacility?.[`${processType}Name`] || "Unknown Facility",
          toLocationId: transaction?.toLocationId || null,
          millerType: toFacility?.type || null,
          dryingMethod: dryingBatch?.dryingMethod || "",
          requestDate: transaction?.sendDateTime 
                      ? new Date(transaction.sendDateTime).toLocaleDateString() 
                      : "",
          startDate: (processingBatch?.dryingBatch?.startDateTime || processingBatch?.millingBatch?.startDateTime)
                    ? new Date(processingBatch.dryingBatch?.startDateTime || processingBatch.millingBatch?.startDateTime).toLocaleDateString()
                    : "",
          endDate: (processingBatch?.dryingBatch?.endDateTime || processingBatch?.millingBatch?.endDateTime)
                  ? new Date(processingBatch.dryingBatch?.endDateTime || processingBatch.millingBatch?.endDateTime).toLocaleDateString()
                  : "",
          moistureContent: qualitySpec?.moistureContent || "",
          transportedBy: transaction?.transporterName || "",
          palayStatus: palayBatch?.status || null,
          transactionStatus: transaction?.status || null,
          processingStatus: processingBatch?.dryingBatch?.status || 
                          processingBatch?.millingBatch?.status || null,
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

  const fetchStatsData = async () => {
    const palayCountRes = await fetch(`${apiUrl}/palaybatches/count`);
    setPalayCount(await palayCountRes.json());
    const millingCountRes = await fetch(`${apiUrl}/millingbatches/count`);
    const millingCount = await millingCountRes.json();
    const dryingCountRes = await fetch(`${apiUrl}/dryingbatches/count`);
    const dryingCount = await dryingCountRes.json();
    setProcessedCount(millingCount + dryingCount);
    const distributeCountRes = await fetch(
      `${apiUrl}/riceorders/received/count`
    );
    setDistributedCount(await distributeCountRes.json());
  };

  const handleActionClick = (rowData) => {
    setSelectedItem(rowData);
    console.log(rowData);

    switch (rowData.transactionStatus?.toLowerCase()) {
      case "pending":
        setShowAcceptDialog(true);
        break;
      case "received":
        if (rowData.processingStatus?.toLowerCase() === "in progress") {
          // Reset the form data for the specific process
          if (viewMode === "drying") {
            setNewDryingData(initialDryingData);
          } else {
            setNewMillingData(initialMillingData);
          }
          setProcessDialog(true);
        } else if (rowData.processingStatus?.toLowerCase() === "done") {
          setNewTransactionData(initialTransactionData); // Reset the form data
          setShowReturnDialog(true);
        }
        break;
    }
  };

  const handleItemClick = (item) => {
    console.log(combinedData);
    setSelectedItem(item);
    setShowDetailsDialog(true);
  };

  const getSeverity = (status, type) => {
    const statusLower = status?.toLowerCase();

    if (statusLower === "in progress") return "warning";
    if (statusLower === "done") return "success";
    if (statusLower === "pending") return "warning";
    if (statusLower === "received") return "success";
    if (statusLower === "to be dry" || statusLower === "to be mill")
      return "info";
    if (statusLower === "in drying" || statusLower === "in milling")
      return "warning";
    if (statusLower === "dried" || statusLower === "milled") return "success";

    return "secondary";
  };

  const statusBodyTemplate = (item) => {
    const status =
      selectedFilter === "request"
        ? item.transactionStatus
        : item.processingStatus;

    return (
      <Tag
        value={status}
        severity={getSeverity(status)}
        className="text-sm px-2 rounded-md"
      />
    );
  };

  const actionBodyTemplate = (item) => {
    let actionText = "Action";
    switch (item.transactionStatus?.toLowerCase()) {
      case "pending":
        actionText = "Accept";
        break;
      case "received":
        if (item.processingStatus?.toLowerCase() === "in progress") {
          actionText = "Done";
        } else if (item.processingStatus?.toLowerCase() === "done") {
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
          handleActionClick(item);
        }}
      />
    );
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
              Palay Batch #{item.palayBatchId}
            </div>
            {selectedFilter === "request" && (
              <>
                <div className="text-gray-600 mb-1">From {item.from}</div>
                <div className="text-gray-600">
                  To be {viewMode === "drying" ? "Dry" : "Mill"} at{" "}
                  {item.location}
                </div>
              </>
            )}
            {selectedFilter === "process" && (
              <>
                <div className="text-gray-600 mb-1">
                  Start Date: {item.startDate}
                </div>
                <div className="text-gray-600">
                  {viewMode === "drying" ? "Drying" : "Milling"} at{" "}
                  {item.location}
                </div>
              </>
            )}
            {selectedFilter === "return" && (
              <>
                <div className="text-gray-600 mb-1">
                  Start Date: {item.startDate}
                </div>
                <div className="text-gray-600 mb-1">
                  End Date: {item.endDate}
                </div>
              </>
            )}
          </div>

          {/* Right Side - Status and Action */}
          <div className="flex-none flex flex-col items-center gap-2">
            {statusBodyTemplate(item)}
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

  const renderDetailsDialog = () => {
    if (!selectedItem) return null;

    return (
      <Dialog
        visible={showDetailsDialog}
        onHide={() => setShowDetailsDialog(false)}
        header={`Processing Details - ${
          viewMode === "drying" ? "Drying" : "Milling"
        } Batch`}
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
          {/* {viewMode === "drying" && (
            <div>
              <p className="text-gray-600">Moisture Content</p>
              <p>{selectedItem.moistureContent}%</p>
            </div>
          )} */}

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
                ? viewMode === "drying"
                  ? "To be Dry at"
                  : "To be Mill at"
                : selectedFilter === "process"
                ? viewMode === "drying"
                  ? "Drying at"
                  : "Milling at"
                : selectedFilter === "return"
                ? viewMode === "drying"
                  ? "Dried at"
                  : "Milled at"
                : viewMode === "drying"
                ? "To be Dry at"
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

  const FilterButton = ({ label, icon, filter }) => (
    <Button
      label={label}
      icon={icon}
      className={`p-button-sm ring-0 border border-primary rounded-full ${
        selectedFilter === filter
          ? "p-button-outlined bg-primary text-white"
          : "p-button-text text-primary"
      } flex items-center`}
      onClick={() => setSelectedFilter(filter)}
    ></Button>
  );

  // RIGHT SIDEBAR DETAILS

  const personalStats = [
    { icon: <Loader2 size={18} />, title: "Palay Bought", value: palayCount },
    { icon: <Undo2 size={18} />, title: "Processed", value: processedCount },
    {
      icon: <CheckCircle2 size={18} />,
      title: "Distributed",
      value: distributedCount,
    },
  ];

  const totalValue = personalStats.reduce((acc, stat) => acc + stat.value, 0);

  const rightSidebar = () => {
    return (
      <div className="p-4 bg-white rounded-lg flex flex-col gap-4">
        <div className="header flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="">Total</p>
            <p className="text-2xl sm:text-4xl font-semibold text-primary">
              {totalValue}
            </p>
          </div>
          <div className="flex gap-2">
            {personalStats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 flex-1 items-center justify-center"
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
    <StaffLayout
      activePage="Processing"
      user={user}
      isRightSidebarOpen={false}
      isLeftSidebarOpen={false}
      rightSidebar={rightSidebar()}
    >
      <Toast ref={toast} />
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
          <h1 className="text-2xl sm:text-4xl text-white font-semibold">
            Palay Processing
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
          <div className="flex justify-center space-x-4 w-full">
            <Button
              label="Drying"
              className={`ring-0 ${
                viewMode === "drying"
                  ? "bg-white text-primary border-0"
                  : "bg-transparent text-white border-white"
              }`}
              onClick={() => {
                setViewMode("drying");
                setSelectedFilter("request");
              }}
            />
            <Button
              label="Milling"
              className={`ring-0 ${
                viewMode === "milling"
                  ? "bg-white text-primary border-0"
                  : "bg-transparent text-white border-white"
              }`}
              onClick={() => {
                setViewMode("milling");
                setSelectedFilter("request");
              }}
            />
          </div>
        </div>

        {/* Data View */}
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
                  label={viewMode === "milling" ? "In Milling" : "In Drying"}
                  icon={<Sun className="mr-2" size={16} />}
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
            <div
              className="relative flex flex-col"
              style={{ height: "calc(100vh - 510px)" }}
            >
              <DataView
                value={combinedData}
                itemTemplate={itemTemplate}
                paginator
                rows={rows}
                first={first}
                totalRecords={totalRecords}
                onPage={onPage}
                emptyMessage="No data found."
                className="overflow-y-auto pb-16"
                paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300"
                lazy
              />
            </div>
          </div>
        </div>
      </div>

      {renderDetailsDialog()}

      <AcceptDialog
        visible={showAcceptDialog}
        viewMode={viewMode}
        onCancel={() => setShowAcceptDialog(false)}
        selectedItem={selectedItem}
        refreshData={refreshData}
      />

      <ProcessDialog
        visible={showProcessDialog}
        viewMode={viewMode}
        newDryingData={newDryingData}
        newMillingData={newMillingData}
        onCancel={() => setProcessDialog(false)}
        setNewDryingData={setNewDryingData}
        setNewMillingData={setNewMillingData}
        selectedItem={selectedItem}
        onSuccess={() => {
          setProcessDialog(false);
          fetchData();
        }}
        apiUrl={apiUrl}
        refreshData={refreshData}
      />

      <ReturnDialog
        visible={showReturnDialog}
        viewMode={viewMode}
        onCancel={() => setShowReturnDialog(false)}
        selectedItem={selectedItem}
        warehouses={warehouses}
        user={user}
        apiUrl={apiUrl}
        onSuccess={fetchData}
        newDryingData={newDryingData}
        newMillingData={newMillingData}
        dryerData={dryerData}
        millerData={millerData}
        refreshData={refreshData}
      />
    </StaffLayout>
  );
};

export default Processing;
