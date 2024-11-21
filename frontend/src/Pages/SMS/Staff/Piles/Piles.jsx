import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { Search, Plus } from "lucide-react";

import { useAuth } from "../../../Authentication/Login/AuthContext";
import StaffLayout from "@/Layouts/StaffLayout";
import PileRegister from "./PileRegister";
import PileUpdate from "./PileUpdate";
import Loader from "@/Components/Loader";

function Piles() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const { user } = useAuth();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [pileData, setPileData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedPile, setSelectedPile] = useState(null);
  const [displayPileRegister, setDisplayPileRegister] = useState(false);
  const [displayPileUpdate, setDisplayPileUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPileData();
    fetchWarehouseData();
  }, []);

  useEffect(() => {
    fetchWarehouseData();
  }, []);

  useEffect(() => {
    if (warehouseData) {
      fetchPileData(warehouseData.id);
    }
  }, [warehouseData]);

  const fetchPileData = async (warehouseId) => {
    try {
      setIsLoading(true);

      const id = warehouseId || warehouseData?.id;

      if (!id) {
        setPileData([]);
        return;
      }

      const res = await fetch(`${apiUrl}/piles/warehouse/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch pile data");
      }
      const responseData = await res.json();
      setPileData(Array.isArray(responseData.data) ? responseData.data : []);
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
      setIsLoading(true);

      const res = await fetch(`${apiUrl}/warehouses`);
      if (!res.ok) {
        throw new Error("Failed to fetch warehouse data");
      }
      const data = await res.json();
      const userWarehouses = data.filter(
        (warehouse) => warehouse.userId === user.id
      );

      // Set the first warehouse as the default if user has warehouses
      if (userWarehouses.length > 0) {
        setWarehouseData(userWarehouses[0]);
        fetchPileData(userWarehouses[0].id);
      } else {
        setWarehouseData(null);
        setPileData([]);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch warehouse data",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePileRegistered = (newPile) => {
    setPileData([...pileData, newPile]);
    setDisplayPileRegister(false);
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Pile registered successfully",
      life: 5000,
    });
  };

  const handlePileUpdated = (updatedPile) => {
    const updatedData = pileData.map((pile) =>
      pile.id === updatedPile.id ? updatedPile : pile
    );
    setPileData(updatedData);
    setDisplayPileUpdate(false);
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Pile updated successfully",
      life: 5000,
    });
  };

  const getSeverity = (status) => {
    switch (status) {
      case "0":
        return "warning";
      case "1":
        return "success";
      default:
        return "secondary";
    }
  };

  const statusBodyTemplate = (rowData) => (
    <Tag
      value={rowData.status === "0" ? "Inactive" : "Active"}
      severity={getSeverity(rowData.status)}
      style={{ minWidth: "80px", textAlign: "center" }}
      className="text-sm px-2 rounded-md"
    />
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => {
          setSelectedPile(rowData);
          setDisplayPileUpdate(true);
        }}
      />
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setGlobalFilterValue(value);
    setFilters(_filters);
  };

  return (
    <StaffLayout activePage="Piles" user={user}>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}
      <Toast ref={toast} />
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
          <h1 className="text-2xl sm:text-4xl text-white font-semibold">
            Manage Pile
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
              type="button"
              className="flex flex-center items-center gap-4 bg-white ring-0"
              onClick={() => setDisplayPileRegister(true)}
            >
              <p className="font-semibold text-primary">Add New</p>
              <Plus size={20} className="text-primary" />
            </Button>
          </div>
        </div>

        <div
          className="relative flex flex-col"
          style={{ height: "calc(100vh - 390px)" }}
        >
          <DataTable
            value={pileData}
            scrollable
            scrollHeight="flex"
            className="p-datatable-sm px-5 pt-5"
            filters={filters}
            globalFilterFields={["warehouseId", "pileNumber", "status"]}
            emptyMessage="No piles found"
            paginator
            paginatorClassName="border-t border-gray-300"
            rows={30}
          >
            <Column
              field="pileNumber"
              header="Pile Number"
              className="text-center"
              headerClassName="text-center"
            />
            <Column
              field="maxCapacity"
              header="Max Capacity (bags)"
              className="text-center"
              headerClassName="text-center"
            />
            <Column
              field="currentQuantity"
              header="Current Quantity (bags)"
              className="text-center"
              headerClassName="text-center"
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              className="text-center"
              headerClassName="text-center"
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              className="text-center"
              headerClassName="text-center"
            />
          </DataTable>
        </div>

        <PileRegister
          visible={displayPileRegister}
          onHide={() => setDisplayPileRegister(false)}
          warehouses={warehouseData}
          onPileRegistered={handlePileRegistered}
        />

        {selectedPile && (
          <PileUpdate
            visible={displayPileUpdate}
            onHide={() => setDisplayPileUpdate(false)}
            selectedPile={selectedPile}
            warehouses={warehouseData}
            onUpdatePile={handlePileUpdated}
          />
        )}
      </div>
    </StaffLayout>
  );
}

export default Piles;