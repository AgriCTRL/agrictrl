import React, { useEffect, useState, useRef } from "react";
import StaffLayout from "@/Layouts/StaffLayout";

    import { DataTable } from 'primereact/datatable';
    import { Column } from 'primereact/column';
    import { Tag } from 'primereact/tag';
    import { FilterMatchMode } from 'primereact/api';
    import { Button } from 'primereact/button';
    import { InputText } from 'primereact/inputtext';
    import { Toast } from 'primereact/toast';
    import { IconField } from 'primereact/iconfield';
    import { InputIcon } from 'primereact/inputicon';

    import { Search, Wheat, RotateCw, Loader2, Undo2, CheckCircle2 } from "lucide-react";

import { useAuth } from "../../../Authentication/Login/AuthContext";
import ReceiveRice from "./ReceiveRice";
import ReceivePalay from "./ReceivePalay";
import SendTo from "./SendTo";
import ManageRice from "./ManageRice";

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

  const [showSendToDialog, setShowSendToDialog] = useState(false);
  const [showRiceAcceptDialog, setShowRiceAcceptDialog] = useState(false);
  const [showPalayAcceptDialog, setShowPalayAcceptDialog] = useState(false);
  const [showManageRiceDialog, setShowManageRiceDialog] = useState(false);

  const [combinedData, setCombinedData] = useState([]);
  const [millerData, setMillerData] = useState([]);
  const [dryerData, setDryerData] = useState([]);
  const [riceBatchData, setRiceBatchData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);

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
    fetchInventory();
    fetchDryerData();
    fetchMillerData();
    fetchWarehouseData();
  }, [viewMode]);

  const refreshData = () => {
    fetchInventory();
    fetchDryerData();
    fetchMillerData();
    fetchWarehouseData();
  };

  const fetchInventory = async () => {
    try {
      const status = viewMode === "requests" ? "Pending" : "Received";
  
      // Fetch all required data
      const [inventoryRes, dryersRes, millersRes, riceBatchesRes] = await Promise.all([
        fetch(`${apiUrl}/inventory?toLocationType=Warehouse&status=${status}&batchType=drying&batchType=milling`),
        fetch(`${apiUrl}/dryers`),
        fetch(`${apiUrl}/millers`),
        viewMode === "inWarehouse" ? fetch(`${apiUrl}/ricebatches`) : Promise.resolve(null),
      ]);
  
      // Error handling
      if (!inventoryRes.ok || !dryersRes.ok || !millersRes.ok) {
        throw new Error("Failed to fetch data");
      }
  
      // Parse JSON responses
      const [inventory, dryers, millers, riceBatches] = await Promise.all([
        inventoryRes.json(),
        dryersRes.json(),
        millersRes.json(),
        viewMode === "inWarehouse" ? riceBatchesRes.json() : null,
      ]);
  
      // Transform inventory data
      const transformedInventory = inventory.map((item) => {
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
          dateRequest: item.transaction.sendDateTime
            ? new Date(item.transaction.sendDateTime).toLocaleDateString()
            : "",
          receivedOn: item.transaction.receiveDateTime
            ? new Date(item.transaction.receiveDateTime).toLocaleDateString()
            : "",
          transportedBy: item.transaction.transporterName,
          transactionStatus: item.transaction.status,
          fromLocationType: item.transaction.fromLocationType,
          transactionId: item.transaction.id,
          toLocationId: item.transaction.toLocationId,
          fromLocationId: item.transaction.fromLocationId,
          item: item.transaction.item,
          qualityType: batchData.qualityType,
          millingBatchId: item.transaction.fromLocationType === "Miller" ? batchData.id : null,
          grossWeight: (() => {
            switch (item.transaction.fromLocationType) {
              case "Procurement":
                return null;
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
                return null;
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
          currentlyAt: warehouseData.find((w) => w.id === riceBatch.warehouseId)?.facilityName,
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
  
        const filteredInventory = transformedInventory.filter(
          (item) => item.palayStatus !== "Milled"
        );
        setCombinedData([...filteredInventory, ...transformedRiceBatches]);
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

  const handleActionClick = (rowData) => {
    if (viewMode === "requests") {
      setSelectedItem(rowData);
      if (["To be Mill", "To be Dry"].includes(rowData.palayStatus)) {
        setShowPalayAcceptDialog(true);
      } else if (rowData.palayStatus === "Milled") {
        setShowRiceAcceptDialog(true);
      }
    } else if (viewMode === "inWarehouse") {
      setSelectedItem(rowData);
      if (selectedFilter === "rice") {
        setShowManageRiceDialog(true);
      } else {
        setShowSendToDialog(true);
      }
    }
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

  const actionBodyTemplate = (rowData) => {
    if (viewMode === "inWarehouse") {
      if (rowData.item === "Rice") {
        return (
          <Button
            label="Manage"
            className="p-button-text p-button-sm text-primary ring-0"
            onClick={() => handleActionClick(rowData)}
          />
        );
      }
      return (
        <Button
          label="Send to"
          className="p-button-text p-button-sm text-primary ring-0"
          onClick={() => handleActionClick(rowData)}
        />
      );
    }
    return (
      <Button
        label="Accept"
        className="p-button-text p-button-sm text-primary ring-0"
        onClick={() => handleActionClick(rowData)}
      />
    );
  };

  const forSaleBodyTemplate = (rowData) => {
    const forSaleText = rowData.forSale ? "For Sale" : "Not for Sale";
    const severity = rowData.forSale ? "success" : "danger"; // Assuming success shows green and danger shows red

    return (
      <Tag
        value={forSaleText}
        severity={severity}
        style={{ minWidth: "100px", textAlign: "center" }}
        className="text-sm px-2 rounded-md"
      />
    );
  };

  const filteredData = combinedData.filter((item) => {
    // First apply view mode filter
    if (viewMode === "inWarehouse") {
      const allowedStatuses = ["To be Mill", "To be Dry", "Milled"];
      if (!allowedStatuses.includes(item.palayStatus)) return false;
      if (["In Milling", "In Drying"].includes(item.palayStatus)) return false;

      // Apply item type filter for inWarehouse view
      switch (selectedFilter) {
        case "palay":
          return item.item === "Palay";
        case "rice":
          return item.item === "Rice";
        default:
          return true;
      }
    } else {
      // For requests viewMode, filter based on palayStatus
      switch (selectedFilter) {
        case "palay":
          return ["To be Mill", "To be Dry"].includes(item.palayStatus);
        case "rice":
          return item.palayStatus === "Milled";
        default:
          return true;
      }
    }
  });

  const getFilterCount = (filter) => {
    const excludedStatuses = ["In Milling", "In Drying"];

    let baseData =
      viewMode === "inWarehouse"
        ? [...combinedData, ...riceBatchData]
        : combinedData;

    if (viewMode === "requests") {
      baseData = baseData.filter(
        (item) => item.transactionStatus === "Pending"
      );

      // Update count logic for requests viewMode
      switch (filter) {
        case "palay":
          return baseData.filter((item) =>
            ["To be Mill", "To be Dry"].includes(item.palayStatus)
          ).length;
        case "rice":
          return baseData.filter((item) => item.palayStatus === "Milled")
            .length;
        default:
          return baseData.length;
      }
    } else {
      baseData = baseData.filter((item) => {
        if (item.item === "Rice") {
          return true;
        }
        return (
          item.transactionStatus === "Received" &&
          !excludedStatuses.includes(item.palayStatus)
        );
      });

      // Original count logic for inWarehouse viewMode
      switch (filter) {
        case "palay":
          return baseData.filter((item) => item.item === "Palay").length;
        case "rice":
          return baseData.filter((item) => item.item === "Rice").length;
        default:
          return baseData.length;
      }
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
                className={`p-button-sm ring-0 border-none rounded-full ${
                    selectedFilter === filter 
                        ? 'p-button-outlined bg-primary text-white' 
                        : 'p-button-text text-primary'
                } flex items-center`} 
                onClick={() => setSelectedFilter(filter)}
            >
                <span className={`ring-0 border-none rounded-full ml-2 px-1 ${
                    selectedFilter === filter 
                        ? 'p-button-outlined bg-gray-200 text-primary' 
                        : 'p-button-text text-white bg-primary'
                } flex items-center`}>
                    {getFilterCount(filter)}
                </span>
            </Button>
        );

        const personalStats = [
            { icon: <Loader2 size={18} />, title: "Palay Bought", value: 9 },
            { icon: <Undo2 size={18} />, title: "Processed", value: 4 },
            { icon: <CheckCircle2 size={18} />, title: "Distributed", value: 2 },
        ];
    
        const totalValue = personalStats.reduce((acc, stat) => acc + stat.value, 0);
    
        const rightSidebar = () => {
            return (
                <div className="p-4 bg-white rounded-lg flex flex-col gap-4">
                    <div className="header flex flex-col gap-4">
                        <div className='flex flex-col items-center justify-center gap-2'>
                            <p className="">Total</p>
                            <p className="text-2xl sm:text-4xl font-semibold text-primary">{totalValue}</p>
                        </div>
                        <div className="flex gap-2">
                            {personalStats.map((stat, index) => (
                                <div key={index} className="flex flex-col gap-2 flex-1 items-center justify-center">
                                    <p className="text-sm">{stat.title}</p>
                                    <p className="font-semibold text-primary">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        };
        
        return (
            <StaffLayout activePage="Warehouse" user={user} isRightSidebarOpen={true} isLeftSidebarOpen={false} rightSidebar={rightSidebar()}>
                <Toast ref={toast} />
                <div className="flex flex-col h-full gap-4">
                    <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
                        <h1 className="text-2xl sm:text-4xl text-white font-semibold">Stocks Storage</h1>
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
                                className={`ring-0 ${viewMode === 'requests' ? 'bg-white text-primary border-0' : 'bg-transparent text-white border-white'}`} 
                                onClick={() => {
                                    setViewMode('requests');
                                    setSelectedFilter('palay');
                                }} 
                            />
                            <Button 
                                label="In Warehouse" 
                                className={`ring-0 ${viewMode === 'inWarehouse' ? 'bg-white text-primary border-0' : 'bg-transparent text-white border-white'}`} 
                                onClick={() => {
                                    setViewMode('inWarehouse');
                                    setSelectedFilter('palay');
                                }} 
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex justify-start">
                        <div className="flex bg-white rounded-full gap-2 p-2">
                            <FilterButton 
                                label="Palay" 
                                icon={<Wheat 
                                className="mr-2" 
                                size={16} />} 
                                filter="palay" 
                            />
                            <FilterButton 
                                label="Rice" 
                                icon={<Wheat 
                                className="mr-2" 
                                size={16} />} 
                                filter="rice" 
                            />
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="flex-grow flex flex-col overflow-hidden rounded-lg">
                        <div className="overflow-hidden bg-white flex flex-col gap-4 p-5 rounded-lg">
                            <div className='flex justify-between items-center'>
                                <p className='font-medium text-black'>Storage</p>
                                <RotateCw size={18} 
                                    onClick={refreshData}
                                    className='text-primary cursor-pointer hover:text-primaryHover'
                                    title="Refresh data"                                
                                />
                            </div>
                            <DataTable 
                                value={filteredData}
                                scrollable
                                scrollHeight="flex"
                                scrolldirection="both"
                                filters={filters}
                                globalFilterFields={viewMode === 'inWarehouse' ? 
                                    ['id', 'from', 'currentlyAt', 'receivedOn', 'transportedBy', 'status', 'riceBatchName'] : 
                                    ['id', 'from', 'toBeStoreAt', 'dateRequest', 'transportedBy', 'status']}
                                emptyMessage="No inventory found."
                                paginator
                                rows={10}
                            >
                                <Column
                                    field="id" 
                                    header={selectedFilter === 'all' ? 'Batch ID' : (selectedFilter === 'rice' ? 'Rice Batch ID' : 'Palay Batch ID')} 
                                    className="text-center" 
                                    headerClassName="text-center" 
                                />
                                {viewMode === 'inWarehouse' && selectedFilter === 'rice' && (
                                    <Column
                                        field="riceBatchName" 
                                        header="Batch Name" 
                                        className="text-center" 
                                        headerClassName="text-center"
                                    />
                                )}
                                <Column
                                    field="quantity" header="Quantity in Bags" 
                                    body={(rowData) => rowData.batchQuantityBags ?? rowData.palayQuantityBags}
                                    className="text-center" headerClassName="text-center" 
                                />
                                {!(viewMode === 'inWarehouse' && selectedFilter === 'rice') && (
                                    <Column field="from" header="From" className="text-center" headerClassName="text-center" />
                                )}
                                {!(viewMode === 'inWarehouse' && selectedFilter === 'rice') && (
                                    <Column 
                                        field={viewMode === 'inWarehouse' ? "currentlyAt" : "toBeStoreAt"} 
                                        header={viewMode === 'inWarehouse' ? "Currently at" : "To be Store at"} 
                                        className="text-center" headerClassName="text-center" 
                                    />
                                )}
                                <Column 
                                    field={viewMode === 'inWarehouse' ? "receivedOn" : "dateRequest"} 
                                    header={viewMode === 'inWarehouse' ? "Received On" : "Date Request"} 
                                    className="text-center" headerClassName="text-center" />
                                {!(viewMode === 'inWarehouse' && selectedFilter === 'rice') && (
                                    <Column field="transportedBy" header="Transported By" className="text-center" headerClassName="text-center" />
                                )}
                                {/* <Column field="qualityType" header="Quality Type" className="text-center" headerClassName="text-center" /> */}
                                {!(viewMode === 'inWarehouse' && selectedFilter === 'rice') && (
                                    <Column 
                                        field={viewMode === 'requests' ? 'transactionStatus' : 'palayStatus'} 
                                        header="Status" 
                                        body={statusBodyTemplate} 
                                        className="text-center" 
                                        headerClassName="text-center"
                                    />
                                )}
                                
                                {(viewMode === 'inWarehouse' && selectedFilter === 'rice') && (
                                    <Column header="Status" body={forSaleBodyTemplate} className="text-center" headerClassName="text-center"/> 
                                )}
                                <Column header="Action" body={actionBodyTemplate} className="text-center" headerClassName="text-center"/>
                            </DataTable>
                        </div>
                    </div>
                </div>

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
        onAcceptSuccess={fetchInventory}
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
