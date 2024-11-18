import React, { useEffect, useState, useRef } from "react";
import StaffLayout from "@/Layouts/StaffLayout";

import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import {
  Search,
  Wheat,
  WheatOff,
  RotateCw,
  Loader2,
  Undo2,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../../Authentication/Login/AuthContext";
import ReceiveRice from "./ReceiveRice";
import ReceivePalay from "./ReceivePalay";
import SendTo from "./SendTo";
import ManageRice from "./ManageRice";
import ItemDetails from "./ItemDetails";

function Warehouse() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const { user } = useAuth();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [viewMode, setViewMode] = useState("requests");
  const [selectedFilter, setSelectedFilter] = useState("palay");
  const [selectedItem, setSelectedItem] = useState(null);

  const [palayCount, setPalayCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [distributedCount, setDistributedCount] = useState(0);
  const [palayTotal, setPalayTotal] = useState(0);
  const [riceTotal, setRiceTotal] = useState(0);

  const [showSendToDialog, setShowSendToDialog] = useState(false);
  const [showRiceAcceptDialog, setShowRiceAcceptDialog] = useState(false);
  const [showPalayAcceptDialog, setShowPalayAcceptDialog] = useState(false);
  const [showManageRiceDialog, setShowManageRiceDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const [combinedData, setCombinedData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const [millerData, setMillerData] = useState([]);
  const [dryerData, setDryerData] = useState([]);
  const [riceBatchData, setRiceBatchData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);

  const [selectedBatchDetails, setSelectedBatchDetails] = useState(null);

  useEffect(() => {
    const newFilters = {
      global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    };
    setFilters(newFilters);
  }, [globalFilterValue]);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  useEffect(() => {
    fetchInventory(first, rows);
    fetchDryerData();
    fetchMillerData();
    fetchWarehouseData();
    fetchData();
  }, [viewMode, first, rows, selectedFilter]);

  const refreshData = () => {
    fetchInventory(first, rows);
    fetchDryerData();
    fetchMillerData();
    fetchWarehouseData();
  };

  const fetchInventory = async (offset, limit) => {
    setLoading(true);
    try {
      const status = viewMode === "requests" ? "Pending" : "Received";

      const [palayRes, riceRes] = await Promise.all([
        fetch(`${apiUrl}/inventory?toLocationType=Warehouse&status=${status}&item=Palay`),
        fetch(`${apiUrl}/inventory?toLocationType=Warehouse&status=${status}&item=Rice`)
      ]);

      const [palayData, riceData] = await Promise.all([
        palayRes.json(),
        riceRes.json()
      ]);

      setPalayTotal(palayData.total);
      setRiceTotal(riceData.total);

      // Fetch the actual data for the current filter
      let inventoryUrl = `${apiUrl}/inventory?toLocationType=Warehouse&status=${status}&offset=${offset}&limit=${limit}`;

      // Apply item-based filter based on selectedFilter
      if (selectedFilter === "palay") {
        inventoryUrl += "&item=Palay";
      } else if (selectedFilter === "rice") {
        inventoryUrl += "&item=Rice";
      }

      // Fetch all required data
      const [inventoryRes, dryersRes, millersRes, riceBatchesRes] =
        await Promise.all([
          fetch(inventoryUrl),
          fetch(`${apiUrl}/dryers`),
          fetch(`${apiUrl}/millers`),
          viewMode === "inWarehouse"
            ? fetch(`${apiUrl}/ricebatches`)
            : Promise.resolve(null),
        ]);

      // Error handling
      if (!inventoryRes.ok || !dryersRes.ok || !millersRes.ok) {
        throw new Error("Failed to fetch data");
      }

      // Parse JSON responses
      const [inventoryData, dryers, millers, riceBatches] = await Promise.all([
        inventoryRes.json(),
        dryersRes.json(),
        millersRes.json(),
        viewMode === "inWarehouse" ? riceBatchesRes.json() : null,
      ]);

      // Update total records
      setTotalRecords(inventoryData.total);

      // Transform inventory data
      const transformedInventory = inventoryData.items.map((item) => {
        // Determine batch data based on fromLocationType
        let batchData = {};

        switch (item.transaction.fromLocationType) {
          case "Procurement":
            batchData = item.palayBatch || {};
            break;
          case "Dryer":
            batchData = item.processingBatch?.dryingBatch || {};
            break;
          case "Miller":
            batchData = item.processingBatch?.millingBatch || {};
            break;
          default:
            batchData = item.palayBatch || {};
        }

        return {
          id: item.palayBatch.id,
          quantityBags: (() => {
            switch (item.transaction.fromLocationType) {
              case "Procurement":
                return item.palayBatch.quantityBags;
              case "Dryer":
                return batchData.driedQuantityBags;
              case "Miller":
                return batchData.milledQuantityBags;
              default:
                return item.palayBatch.quantityBags;
            }
          })(),
          from: getLocationName(item, dryers, millers),
          toBeStoreAt: item.palayBatch.currentlyAt,
          currentlyAt: item.palayBatch.currentlyAt,
          palayStatus: item.palayBatch.status,
          dateRequest: item.transaction.sendDateTime,
          receivedOn: item.transaction.receiveDateTime,
          transportedBy: item.transaction.transporterName,
          transactionStatus: item.transaction.status,
          fromLocationType: item.transaction.fromLocationType,
          transactionId: item.transaction.id,
          toLocationId: item.transaction.toLocationId,
          fromLocationId: item.transaction.fromLocationId,
          item: item.transaction.item,
          qualityType: batchData.qualityType,
          millingBatchId:
            item.transaction.fromLocationType === "Miller"
              ? batchData.id
              : null,
          grossWeight: (() => {
            switch (item.transaction.fromLocationType) {
              case "Procurement":
                return item.palayBatch.grossWeight;
              case "Dryer":
                return batchData.driedGrossWeight;
              case "Miller":
                return batchData.milledGrossWeight;
              default:
                return null;
            }
          })(),
          netWeight: (() => {
            switch (item.transaction.fromLocationType) {
              case "Procurement":
                return item.palayBatch.netWeight;
              case "Dryer":
                return batchData.driedNetWeight;
              case "Miller":
                return batchData.milledNetWeight;
              default:
                return null;
            }
          })(),
        };
      });

      // Combine with rice batches if in 'inWarehouse' view mode
      if (viewMode === "inWarehouse" && riceBatches) {
        const transformedRiceBatches = riceBatches.map((riceBatch) => ({
          id: riceBatch.id,
          quantityBags: riceBatch.currentCapacity,
          from: "Miller",
          currentlyAt: warehouseData.find((w) => w.id === riceBatch.warehouseId)
            ?.facilityName,
          receivedOn: riceBatch.dateReceived
            ? new Date(riceBatch.dateReceived).toLocaleDateString()
            : "",
          transportedBy: "Internal Transfer",
          palayStatus: "Milled",
          item: "Rice",
          riceBatchName: riceBatch.name,
          currentCapacity: riceBatch.currentCapacity,
          maxCapacity: riceBatch.maxCapacity,
          price: riceBatch.price,
          warehouseId: riceBatch.warehouseId,
          forSale: riceBatch.forSale,
        }));

        let finalData;
        if (selectedFilter === "palay") {
          finalData = transformedInventory.filter(
            (item) => item.item === "Palay"
          );
        } else if (selectedFilter === "rice") {
          finalData = [
            ...transformedInventory.filter((item) => item.item === "Rice"),
            ...transformedRiceBatches,
          ];
        } else {
          finalData = [...transformedInventory, ...transformedRiceBatches];
        }

        setCombinedData(finalData);
      } else {
        setCombinedData(transformedInventory);
      }
    } catch (error) {
      console.error("Error fetching warehouse inventory:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch warehouse inventory",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDryerData = async () => {
    try {
      const res = await fetch(`${apiUrl}/dryers`);
      if (!res.ok) {
        throw new Error("Failed to fetch dryer data");
      }
      const data = await res.json();
      setDryerData(data);
    } catch (error) {
      console.log(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch dryer data",
        life: 3000,
      });
    }
  };

  const fetchMillerData = async () => {
    try {
      const res = await fetch(`${apiUrl}/millers`);
      if (!res.ok) {
        throw new Error("Failed to fetch miller data");
      }
      const data = await res.json();
      setMillerData(data);
    } catch (error) {
      console.log(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch miller data",
        life: 3000,
      });
    }
  };

  const fetchWarehouseData = async () => {
    try {
      const res = await fetch(`${apiUrl}/warehouses`);
      if (!res.ok) {
        throw new Error("Failed to fetch warehouse data");
      }
      const data = await res.json();
      setWarehouseData(data);
    } catch (error) {
      console.log(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch warehouse data",
        life: 3000,
      });
    }
  };

  const fetchData = async () => {
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

  const handleItemClick = (item) => {
    console.log(combinedData);
    setSelectedBatchDetails(item);
    setShowDetailsDialog(true);
  };

  const getSeverity = (status, viewMode) => {
    // Handle transaction statuses
    if (viewMode === "requests") {
      switch (status) {
        case "Pending":
          return "warning";
        case "Received":
          return "success";
        default:
          return "info";
      }
    }

    // Handle palay batch statuses
    switch (status) {
      case "To be Dry":
      case "To be Mill":
        return "warning";
      case "In Drying":
      case "In Milling":
        return "info";
      case "Milled":
        return "success";
      default:
        return "info";
    }
  };

  const statusBodyTemplate = (rowData) => {
    const status =
      viewMode === "requests" ? rowData.transactionStatus : rowData.palayStatus;

    return (
      <Tag
        value={status}
        severity={getSeverity(status, viewMode)}
        style={{ minWidth: "80px", textAlign: "center" }}
        className="text-sm px-2 rounded-md"
      />
    );
  };

  const actionBodyTemplate = (item) => {
    if (viewMode === "inWarehouse") {
      if (item.item === "Rice") {
        return (
          <Button
            label="Manage"
            className="p-button-text p-button-sm text-primary ring-0"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              setSelectedItem(item);
              setShowManageRiceDialog(true);
            }}
          />
        );
      }
      return (
        <Button
          label="Send to"
          className="p-button-text p-button-sm text-primary ring-0"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            setSelectedItem(item);
            setShowSendToDialog(true);
          }}
        />
      );
    }
    return (
      <Button
        label="Accept"
        className="p-button-text p-button-sm text-primary ring-0"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          setSelectedItem(item);
          if (["To be Mill", "To be Dry"].includes(item.palayStatus)) {
            setShowPalayAcceptDialog(true);
          } else if (item.palayStatus === "Milled") {
            setShowRiceAcceptDialog(true);
          }
        }}
      />
    );
  };

  const getFilterCount = (filter) => {
    switch (filter) {
      case "palay":
        return palayTotal;
      case "rice":
        return riceTotal;
      default:
        return palayTotal + riceTotal;
    }
  };

  const getLocationName = (item, dryers, millers) => {
    // Handle rice batches
    if (item.warehouseId) {
      const warehouseName = warehouseData.find(
        (warehouse) => warehouse.id === item.warehouseId
      )?.facilityName;
      return `Warehouse: ${warehouseName}`;
    }

    // Handle other cases
    if (item.transaction.fromLocationType === "Procurement") {
      return `Procurement: ${
        item.palayBatch.buyingStationLoc || "Unknown Location"
      }`;
    } else if (item.transaction.fromLocationType === "Dryer") {
      const dryerName =
        dryers.find((dryer) => dryer.id === item.transaction.fromLocationId)
          ?.dryerName || "Unknown Dryer";
      return `Dryer: ${dryerName}`;
    } else if (item.transaction.fromLocationType === "Miller") {
      const millerName =
        millers.find((miller) => miller.id === item.transaction.fromLocationId)
          ?.millerName || "Unknown Miller";
      return `Miller: ${millerName}`;
    }
    return "Unknown Location";
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
    >
      <span
        className={`ring-0 border-none rounded-full ml-2 px-1 ${
          selectedFilter === filter
            ? "p-button-outlined bg-gray-200 text-primary"
            : "p-button-text text-white bg-primary"
        } flex items-center`}
      >
        {getFilterCount(filter)}
      </span>
    </Button>
  );

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

  const itemTemplate = (item) => {
    return (
      <div className="col-12" onClick={() => handleItemClick(item)}>
        <div className="flex flex-row items-center p-4 gap-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg mb-4">
          {/* Left Side - Icon */}
          <div className="flex-none">
            {selectedFilter === "palay" ? (
              <Wheat size={40} className="text-gray-400" />
            ) : (
              <WheatOff size={40} className="text-gray-400" />
            )}
          </div>

          {/* Middle - Main Info */}
          <div className="flex-1">
            <div className="font-medium text-xl mb-1">
              {selectedFilter === "palay" ? "Palay" : "Rice"} Batch #{item.id}
            </div>
            <div className="text-gray-600 mb-1">
              {item?.receivedOn &&
              item?.receivedOn !== "0000-01-01T00:00:00.000Z"
                ? new Date(item?.receivedOn).toLocaleDateString()
                : new Date(item?.dateRequest).toLocaleDateString()}
            </div>

            <div className="flex items-center">
              <span className=" py-1 text-sm">{item.quantityBags} bags</span>
            </div>
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
    const newFirst = event.first;
    const newRows = event.rows;
    setFirst(newFirst);
    setRows(newRows);

    fetchInventory(newFirst, newRows);
  };

  return (
    <StaffLayout
      activePage="Warehouse"
      user={user}
      isRightSidebarOpen={false}
      isLeftSidebarOpen={false}
      rightSidebar={rightSidebar()}
    >
      <Toast ref={toast} />
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
          <h1 className="text-2xl sm:text-4xl text-white font-semibold">
            Stocks Storage
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
              label="Requests"
              className={`ring-0 ${
                viewMode === "requests"
                  ? "bg-white text-primary border-0"
                  : "bg-transparent text-white border-white"
              }`}
              onClick={() => {
                setViewMode("requests");
                setSelectedFilter("palay");
              }}
            />
            <Button
              label="In Warehouse"
              className={`ring-0 ${
                viewMode === "inWarehouse"
                  ? "bg-white text-primary border-0"
                  : "bg-transparent text-white border-white"
              }`}
              onClick={() => {
                setViewMode("inWarehouse");
                setSelectedFilter("palay");
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
                  label="Palay"
                  icon={<Wheat className="mr-2" size={16} />}
                  filter="palay"
                />
                <FilterButton
                  label="Rice"
                  icon={<Wheat className="mr-2" size={16} />}
                  filter="rice"
                />
              </div>
              <div className="flex gap-4">
                <p className="font-medium text-black">Refresh Data</p>
                <RotateCw
                  size={25}
                  onClick={refreshData}
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
                emptyMessage="No inventory found."
                className="overflow-y-auto pb-16"
                paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                lazy
              />
            </div>
          </div>
        </div>
      </div>

      <ItemDetails
        visible={showDetailsDialog}
        onHide={() => setShowDetailsDialog(false)}
        selectedBatchDetails={selectedBatchDetails}
        selectedFilter={selectedFilter}
      />

      <SendTo
        visible={showSendToDialog}
        onHide={() => setShowSendToDialog(false)}
        selectedItem={selectedItem}
        onSendSuccess={fetchInventory}
        user={user}
        dryerData={dryerData}
        millerData={millerData}
        refreshData={refreshData}
        warehouseData={warehouseData}
      />

      <ReceiveRice
        visible={showRiceAcceptDialog}
        onHide={() => setShowRiceAcceptDialog(false)}
        selectedItem={selectedItem}
        onAcceptSuccess={fetchInventory}
        user={user}
        refreshData={refreshData}
      />

      <ReceivePalay
        visible={showPalayAcceptDialog}
        onHide={() => setShowPalayAcceptDialog(false)}
        selectedItem={selectedItem}
        onAcceptSuccess={() => {
          fetchInventory(first, rows); // Pass the current pagination values
        }}
        user={user}
        refreshData={refreshData}
      />

      <ManageRice
        visible={showManageRiceDialog}
        onHide={() => setShowManageRiceDialog(false)}
        selectedItem={selectedItem}
        onUpdateSuccess={fetchInventory}
        user={user}
        refreshData={refreshData}
      />
    </StaffLayout>
  );
}

export default Warehouse;
