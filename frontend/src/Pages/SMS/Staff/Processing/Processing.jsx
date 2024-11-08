import React, { useEffect, useState, useRef } from "react";
import StaffLayout from "@/Layouts/StaffLayout";
import {
  Search,
  Box,
  Sun,
  RotateCcw,
  RotateCw,
  Loader2,
  Undo2,
  CheckCircle2,
} from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

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
  const [viewMode, setViewMode] = useState("drying");
  const [selectedFilter, setSelectedFilter] = useState("request");
  const [selectedItem, setSelectedItem] = useState(null);

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
  }, [viewMode, selectedFilter]);

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
      const status = selectedFilter === "request" ? "Pending" : "Received";
      const millerType = "In House";

      // Fetch all required data in parallel
      const [facilitiesRes, inventoryRes, warehousesRes] = await Promise.all([
        fetch(`${apiUrl}/${processType}s`),
        fetch(
          `${apiUrl}/inventory?toLocationType=${locationType}&status=${status}&batchType=drying&batchType=drying&millerType=${millerType}`
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

      // Update facility states based on viewMode
      if (viewMode === "drying") {
        setDryerData(facilities);
      } else {
        setMillerData(facilities);
      }

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
          millerType: toFacility?.type || null,
          dryingMethod: dryingBatch.dryingMethod || "",
          requestDate: transaction.sendDateTime
            ? new Date(transaction.sendDateTime).toLocaleDateString()
            : "",
          startDate:
            millingBatch.startDateTime || dryingBatch.startDateTime
              ? new Date(
                  millingBatch.startDateTime || dryingBatch.startDateTime
                ).toLocaleDateString()
              : "",
          endDate:
            millingBatch.endDateTime || dryingBatch.endDateTime
              ? new Date(
                  millingBatch.endDateTime || dryingBatch.endDateTime
                ).toLocaleDateString()
              : "",
          moistureContent: qualitySpec.moistureContent || "",
          transportedBy: transaction.transporterName || "",
          palayStatus: palayBatch.status || null,
          transactionStatus: transaction.status || null,
          processingStatus: millingBatch.status || dryingBatch.status || null,
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
    setProcessedCount( millingCount + dryingCount );
    const distributeCountRes = await fetch(`${apiUrl}/riceorders/received/count`);
    setDistributedCount(await distributeCountRes.json());
}

  const handleActionClick = (rowData) => {
    setSelectedItem(rowData);

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
        onClick={() => handleActionClick(rowData)}
      />
    );
  };

  const filteredData = combinedData.filter((item) => {
    if (viewMode === "drying") {
      switch (selectedFilter) {
        case "request":
          return item.transactionStatus === "Pending";
        case "process":
          return (
            item.transactionStatus === "Received" &&
            item.palayStatus === "In Drying" &&
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
    } else {
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
    }
  });

  const getFilterCount = (filterType) => {
    return combinedData.filter((item) => {
      if (viewMode === "drying") {
        switch (filterType) {
          case "request":
            return item.transactionStatus === "Pending";
          case "process":
            return (
              item.transactionStatus === "Received" &&
              item.palayStatus === "In Drying" &&
              item.processingStatus === "In Progress"
            );
          case "return":
            return (
              item.transactionStatus === "Received" &&
              item.processingStatus === "Done"
            );
          default:
            return false;
        }
      } else {
        switch (filterType) {
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
            return false;
        }
      }
    }).length;
  };

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
    ></Button>
  );

  // RIGHT SIDEBAR DETAILS

  const personalStats = [
    { icon: <Loader2 size={18} />, title: "Palay Bought", value: palayCount },
    { icon: <Undo2 size={18} />, title: "Processed", value: processedCount },
    { icon: <CheckCircle2 size={18} />, title: "Distributed", value: distributedCount },
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
      isRightSidebarOpen={true}
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

        {/* Filters */}
        <div className="flex justify-start">
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
        </div>

        {/* Data Table */}
        <div className="flex-grow flex flex-col overflow-hidden rounded-lg">
          <div className="overflow-hidden bg-white flex flex-col gap-4 p-5 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="font-medium text-black">Storage</p>
              <RotateCw
                size={18}
                onClick={fetchData}
                className="text-primary cursor-pointer hover:text-primaryHover"
                title="Refresh data"
              />
            </div>
            <DataTable
              value={filteredData}
              scrollable
              scrollHeight="flex"
              scrollDirection="both"
              filters={filters}
              globalFilterFields={[
                "processingBatchId",
                "palayBatchId",
                "transactionStatus",
                "processingStatus",
              ]}
              emptyMessage="No data found."
              paginator
              rows={10}
              // tableStyle={{ minWidth: '2200px' }}
            >
              {selectedFilter !== "request" && (
                <Column
                  field="processingBatchId"
                  header={
                    viewMode === "drying"
                      ? "Drying Batch ID"
                      : "Milling Batch ID"
                  }
                  body={(rowData) =>
                    rowData.millingBatchId ?? rowData.dryingBatchId
                  }
                  className="text-center"
                  headerClassName="text-center"
                />
              )}
              <Column
                field="palayBatchId"
                header="Palay Batch ID"
                className="text-center"
                headerClassName="text-center"
              />
              <Column
                field="quantityBags"
                header="Quantity in Bags"
                className="text-center"
                headerClassName="text-center"
              />
              <Column
                field="grossweight"
                header="Gross Weight"
                className="text-center"
                headerClassName="text-center"
                body={(rowData) =>
                  rowData.batchGrossWeight ?? rowData.grossWeight
                }
              />
              <Column
                field="netweight"
                header="Net Weight"
                className="text-center"
                headerClassName="text-center"
                body={(rowData) => rowData.batchNetWeight ?? rowData.netWeight}
              />
              {viewMode === "drying" && selectedFilter === "return" && (
                <Column
                  field="moistureContent"
                  header="Moisture Content"
                  className="text-center"
                  headerClassName="text-center"
                />
              )}
              <Column
                field="from"
                header="From"
                className="text-center"
                headerClassName="text-center"
              />
              <Column
                field="location"
                header={
                  viewMode === "drying"
                    ? selectedFilter === "request"
                      ? "To be Dry at"
                      : selectedFilter === "process"
                      ? "Drying at"
                      : "Dried at"
                    : selectedFilter === "request"
                    ? "To be Milled at"
                    : selectedFilter === "process"
                    ? "Milling at"
                    : "Milled at"
                }
                className="text-center"
                headerClassName="text-center"
              />
              {viewMode === "drying" && selectedFilter === "return" && (
                <Column
                  field="dryingMethod"
                  header="Drying Method"
                  className="text-center"
                  headerClassName="text-center"
                />
              )}
              {viewMode === "milling" && selectedFilter === "return" && (
                <Column
                  field="millerType"
                  header="Miller Type"
                  className="text-center"
                  headerClassName="text-center"
                />
              )}
              {selectedFilter === "return" && (
                <Column
                  field="startDate"
                  header="Start Date"
                  className="text-center"
                  headerClassName="text-center"
                />
              )}
              <Column
                field={
                  selectedFilter === "request"
                    ? "requestDate"
                    : selectedFilter === "process"
                    ? "startDate"
                    : "endDate"
                }
                header={
                  selectedFilter === "request"
                    ? "Request Date"
                    : selectedFilter === "process"
                    ? "Start Date"
                    : "End Date"
                }
                className="text-center"
                headerClassName="text-center"
              />
              <Column
                field="transportedBy"
                header="Transported By"
                className="text-center"
                headerClassName="text-center"
              />
              {selectedFilter === "request" && (
                <Column
                  field="transactionStatus"
                  header="Status"
                  body={(rowData) =>
                    statusBodyTemplate(rowData, { field: "transactionStatus" })
                  }
                  className="text-center"
                  headerClassName="text-center"
                />
              )}
              {selectedFilter !== "request" && (
                <Column
                  field="processingStatus"
                  header={
                    viewMode === "drying" ? "Drying Status" : "Milling Status"
                  }
                  className="text-center"
                  headerClassName="text-center"
                  frozen
                  alignFrozen="right"
                  body={(rowData) =>
                    statusBodyTemplate(rowData, { field: "processingStatus" })
                  }
                />
              )}
              <Column
                header="Action"
                body={actionBodyTemplate}
                className="text-center"
                headerClassName="text-center"
                frozen
                alignFrozen="right"
              />
            </DataTable>
          </div>
        </div>
      </div>

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
