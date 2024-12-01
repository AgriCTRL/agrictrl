import React, { useEffect, useState, useRef } from "react";
import StaffLayout from "@/Layouts/Staff/StaffLayout";

import { DataView } from "primereact/dataview";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { Search, Wheat, RotateCw } from "lucide-react";

import { useAuth } from "../../../Authentication/Login/AuthContext";
import SendTo from "./SendTo";
import PalayBatches from "./PalayBatches";
import ManagePile from "./ManagePile";
import Loader from "@/Components/Loader";

function WarehouseStorage() {
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
  const [palayBatchesPagination, setPalayBatchesPagination] = useState({
    limit: 12,
    offset: 0,
  });

  //Dialogs
  const [showSendToDialog, setShowSendToDialog] = useState(false);
  const [showManagePileDialog, setShowManagePileDialog] = useState(false);
  const [showPalayBatchesDialog, setShowPalayBatchesDialog] = useState(false);

  //selected
  const [selectedPile, setSelectedPile] = useState(null);

  //facilities data
  const [warehouseData, setWarehouseData] = useState([]);
  const [millerData, setMillerData] = useState([]);
  const [dryerData, setDryerData] = useState([]);

  //inventory
  const [userWarehouse, setUserWarehouse] = useState(null);
  const [combinedData, setCombinedData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pileData, setPileData] = useState([]);
  const [palayBatches, setPalayBatches] = useState([]);

  useEffect(() => {
    const newFilters = {
      global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    };
    setFilters(newFilters);
  }, [globalFilterValue]);

  useEffect(() => {
    fetchPileData(userWarehouse?.id);
    fetchDryerData();
    fetchMillerData();
    fetchWarehouseData();
  }, [first, rows]);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const refreshData = () => {
    setFirst(0);
    setRows(10);

    fetchPileData(userWarehouse?.id);
    fetchDryerData();
    fetchMillerData();
    fetchWarehouseData();
  };

  const fetchPileData = async (warehouseId, paginationParams) => {
    try {
      setIsLoading(true);
      const id = warehouseId || userWarehouse?.id;

      if (!id) {
        setPileData([]);
        return;
      }

      const { limit, offset } = paginationParams || palayBatchesPagination;
      const res = await fetch(
        `${apiUrl}/piles/warehouse/${id}?pbLimit=${limit}&pbOffset=${offset}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch pile data");
      }

      const responseData = await res.json();

      const piles = Array.isArray(responseData.data) ? responseData.data : [];
      setCombinedData(piles);
      setTotalRecords(responseData.total || 0);

      setPileData(Array.isArray(responseData.data) ? responseData.data : []);
      setPalayBatches(responseData.data[0]?.palayBatches || []);
    } catch (error) {
      setPileData([]);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch pile data",
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
        fetchPileData(userWarehouses[0].id);
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

  const itemTemplate = (item) => {
    const bgColorClass = 
      (item.type === "Palay" && item.age >= 3) || 
      (item.type === "Rice" && item.age >= 6) 
        ? "bg-red-200 hover:bg-red-300" 
        : "bg-gray-100 hover:bg-gray-200";
  
    return (
      <div
        className="col-12"
        onClick={() => {
          setSelectedPile(item);
          setPalayBatches(item.palayBatches || []);
          setShowPalayBatchesDialog(true);
        }}
      >
        <div className={`flex flex-row items-center p-4 gap-4 cursor-pointer ${bgColorClass} rounded-lg mb-4`}>
          <div className="flex-none">
            <Wheat size={40} className="text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-xl mb-1">
              Pile #{item.pileNumber}
            </div>
            <div className="text-gray-600 mb-1">
              Current Quantity: {item.currentQuantity} / {item.maxCapacity} bags
            </div>
            <div className="flex items-center">
              <span className="py-1 text-sm">{item.status} | age: {item.age}</span>
            </div>
          </div>
          <div className="flex-none flex flex-col items-center gap-2">
            <Button
              label={item.type === "Palay" ? "Send to" : "Manage"}
              className="p-button-text p-button-sm text-primary ring-0"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPile(item);
                if (item.type === "Palay") {
                  setShowSendToDialog(true);
                } else {
                  setShowManagePileDialog(true);
                }
              }}
            />
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
  };

  const handlePalayBatchesPagination = (newPagination) => {
    setPalayBatchesPagination(newPagination);
    fetchPileData(null, newPagination);
  };

  return (
    <StaffLayout activePage="Storage" user={user}>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}
      <Toast ref={toast} />
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
          <h1 className="text-2xl sm:text-4xl text-white font-semibold">
            Storage
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
              />
            </IconField>
          </span>
        </div>

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

      <SendTo
        visible={showSendToDialog}
        onHide={() => setShowSendToDialog(false)}
        onSendSuccess={() => {
          refreshData();
        }}
        user={user}
        dryerData={dryerData}
        millerData={millerData}
        warehouseData={warehouseData}
        selectedPile={selectedPile}
      />

      <PalayBatches
        visible={showPalayBatchesDialog}
        onHide={() => setShowPalayBatchesDialog(false)}
        palayBatches={palayBatches}
        selectedPile={selectedPile}
        onPaginationChange={handlePalayBatchesPagination}
        totalRecords={selectedPile?.pbTotal || 0}
        loading={isLoading}
      />

      <ManagePile
        visible={showManagePileDialog}
        onHide={() => setShowManagePileDialog(false)}
        selectedItem={selectedPile}
        onUpdateSuccess={() => {}}
        user={user}
        refreshData={refreshData}
      />
    </StaffLayout>
  );
}

export default WarehouseStorage;
