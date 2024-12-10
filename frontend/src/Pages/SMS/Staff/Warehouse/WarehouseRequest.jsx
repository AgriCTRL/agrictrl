import React, { useEffect, useState, useRef } from "react";
import StaffLayout from '@/Layouts/Staff/StaffLayout';

import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { Search, Wheat, WheatOff, RotateCw } from "lucide-react";

import { useAuth } from "../../../Authentication/Login/AuthContext";
import ReceiveRice from "./ReceiveRice";
import ReceivePalay from "./ReceivePalay";
import ItemDetails from "./ItemDetails";
import Loader from "@/Components/Loader";

function WarehouseRequest() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const { user } = useAuth();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  //page changes
  const [isLoading, setIsLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  //Dialogs
  const [showRiceAcceptDialog, setShowRiceAcceptDialog] = useState(false);
  const [showPalayAcceptDialog, setShowPalayAcceptDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  //selected
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState(null);

  //inventory
  const [userWarehouse, setUserWarehouse] = useState(null);
  const [combinedData, setCombinedData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const onGlobalFilterChange = (e) => {
    const wsr = e.target.value;
    setGlobalFilterValue(wsr);

    if (wsr.trim() === "") {
      fetchInventory(0, 10);
    } else {
      searchInventory(wsr);
    }
  };

  useEffect(() => {
    fetchInventory(first, rows);
    fetchWarehouseData();
  }, [first, rows]);

  const refreshData = () => {
    setFirst(0);
    setRows(10);

    fetchInventory(0, 10);
    fetchWarehouseData();
  };

  const searchInventory = async (wsr) => {
    try {
      let inventoryUrl = `${apiUrl}/inventory?toLocationType=Warehouse&status=Pending&userId=${user.id}&wsr=${wsr}`;

      const [inventoryRes, dryersRes, millersRes] = await Promise.all([
        fetch(inventoryUrl),
        fetch(`${apiUrl}/dryers`),
        fetch(`${apiUrl}/millers`),
      ]);

      if (!inventoryRes.ok || !dryersRes.ok || !millersRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [inventoryData, dryers, millers] = await Promise.all([
        inventoryRes.json(),
        dryersRes.json(),
        millersRes.json(),
      ]);

      setTotalRecords(inventoryData.total);

      const transformedInventory = inventoryData.items.map((item) => {
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
          // Original transformations
          id: item.palayBatch.id,
          wsr: item.palayBatch.wsr,
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

          // New fields to expose full data
          fullPalayBatchData: item.palayBatch,
          fullTransactionData: item.transaction,
          fullProcessingBatchData: item.processingBatch,
        };
      });

      setCombinedData(transformedInventory);
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

  const fetchInventory = async (offset, limit) => {
    setIsLoading(true);
    try {
      let inventoryUrl = `${apiUrl}/inventory?toLocationType=Warehouse&status=Pending&offset=${offset}&limit=${limit}&userId=${user.id}`;

      const [inventoryRes, dryersRes, millersRes] = await Promise.all([
        fetch(inventoryUrl),
        fetch(`${apiUrl}/dryers`),
        fetch(`${apiUrl}/millers`),
      ]);

      if (!inventoryRes.ok || !dryersRes.ok || !millersRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [inventoryData, dryers, millers] = await Promise.all([
        inventoryRes.json(),
        dryersRes.json(),
        millersRes.json(),
      ]);

      setTotalRecords(inventoryData.total);

      const transformedInventory = inventoryData.items.map((item) => {
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
          // Original transformations
          id: item.palayBatch.id,
          wsr: item.palayBatch.wsr,
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

          // New fields to expose full data
          fullPalayBatchData: item.palayBatch,
          fullTransactionData: item.transaction,
          fullProcessingBatchData: item.processingBatch,
        };
      });

      setCombinedData(transformedInventory);
    } catch (error) {
      console.error("Error fetching warehouse inventory:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch warehouse inventory",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
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

      // Set user's warehouse
      const userWarehouses = data.filter(
        (warehouse) => warehouse.userId === user.id
      );
      if (userWarehouses.length > 0) {
        setUserWarehouse(userWarehouses[0]);
      }
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

  const handleItemClick = (item) => {
    console.log(item);
    setSelectedBatchDetails(item);
    setShowDetailsDialog(true);
  };

  const getSeverity = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Received":
        return "success";
      default:
        return "info";
    }
  };

  const statusBodyTemplate = (rowData) => {
    const status = rowData.transactionStatus;

    return (
      <Tag
        value={status}
        severity={getSeverity(status)}
        style={{ minWidth: "80px", textAlign: "center" }}
        className="text-sm px-2 rounded-md"
      />
    );
  };

  const actionBodyTemplate = (item) => {
    return (
      <Button
        label="Accept"
        className="p-button-text p-button-sm text-primary ring-0"
        onClick={(e) => {
          e.stopPropagation();
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

  const itemTemplate = (item) => {
    return (
      <div className="col-12" onClick={() => handleItemClick(item)}>
        <div className="flex flex-row items-center p-4 gap-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg mb-4">
          <div className="flex-none">
            {item.item === "Palay" ? (
              <Wheat size={40} className="text-gray-400" />
            ) : (
              <WheatOff size={40} className="text-gray-400" />
            )}
          </div>

          <div className="flex-1">
            <div className="font-medium text-xl mb-1">
              {item.item} Batch #{item.wsr}
            </div>
            <div className="text-gray-600 mb-1">
              {item?.receivedOn &&
              item?.receivedOn !== "0000-01-01T00:00:00.000Z"
                ? new Date(item?.receivedOn).toLocaleDateString()
                : new Date(item?.dateRequest).toLocaleDateString()}
            </div>

            <div className="flex items-center">
              <span className="py-1 text-sm">{item.quantityBags} bags</span>
            </div>
          </div>

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
    <StaffLayout activePage="Request" user={user}>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}
      <Toast ref={toast} />
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
          <h1 className="text-2xl sm:text-4xl text-white font-semibold">
            Request
          </h1>
          <span className="w-1/2">
            <IconField iconPosition="left">
              <InputIcon>
                <Search className="text-white" size={18} />
              </InputIcon>
              <InputText
                className="ring-0 w-full rounded-full text-white bg-transparent border border-white placeholder:text-white"
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Tap to search"
                maxLength="8"
              />
            </IconField>
          </span>
        </div>

        {/* DataView for requests */}
        <div className="flex-grow flex flex-col overflow-hidden rounded-lg">
          <div className="overflow-hidden bg-white flex flex-col gap-4 p-5 rounded-lg">
            <div className="flex justify-between items-center">
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
              style={{ height: "calc(100vh - 410px)" }}
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
                paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                lazy
              />
            </div>
          </div>
        </div>
      </div>

      <ReceivePalay
        visible={showPalayAcceptDialog}
        onHide={() => setShowPalayAcceptDialog(false)}
        selectedItem={selectedItem}
        onAcceptSuccess={() => {
          refreshData();
        }}
        user={user}
        userWarehouse={userWarehouse}
      />

      <ReceiveRice
        visible={showRiceAcceptDialog}
        onHide={() => setShowRiceAcceptDialog(false)}
        selectedItem={selectedItem}
        onAcceptSuccess={() => {
          refreshData();
        }}
        user={user}
        userWarehouse={userWarehouse}
      />

      <ItemDetails
        visible={showDetailsDialog}
        onHide={() => setShowDetailsDialog(false)}
        selectedBatchDetails={selectedBatchDetails}
      />
    </StaffLayout>
  );
}

export default WarehouseRequest;
