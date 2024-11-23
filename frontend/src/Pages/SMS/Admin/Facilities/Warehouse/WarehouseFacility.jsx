import React, { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { Search, Settings2, FileX, Filter, Download, Plus } from "lucide-react";

import WarehouseRegister from "./WarehouseRegister";
import WarehouseUpdate from "./WarehouseUpdate";
import pdfPortraitExport from "../../../../../Components/Pdf/pdfPortraitExport";
import Loader from "../../../../../Components/Loader";
import EmptyRecord from "../../../../../Components/EmptyRecord";

function Warehouse() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);

  const CAPACITY_WARNING_THRESHOLD = 5;

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [displayWarehouseRegister, setDisplayWarehouseRegister] =
    useState(false);
  const [displayWarehouseUpdate, setDisplayWarehouseUpdate] = useState(false);
  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseManagers, setWarehouseManagers] = useState([]);

  useEffect(() => {
    fetchWarehouseData();
    fetchWarehouseManagers();
  }, []);

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

  const fetchWarehouseManagers = async () => {
    try {
      const res = await fetch(`${apiUrl}/users`);
      if (!res.ok) {
        throw new Error("Failed to fetch warehouse managers");
      }
      const data = await res.json();
      // Filter users who are warehouse managers
      const managers = data.filter(
        (user) =>
          user.userType === "NFA Branch Staff" &&
          user.jobTitlePosition === "Warehouse Manager"
      );
      // Format the data for dropdown
      const formattedManagers = managers.map((manager) => ({
        label: `${manager.firstName} ${manager.lastName}`,
        value: manager.id,
        fullName: `${manager.firstName} ${manager.lastName}`,
      }));
      setWarehouseManagers(formattedManagers);
    } catch (error) {
      console.log(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch warehouse managers",
        life: 3000,
      });
    }
  };

  const handleWarehouseRegistered = (newWarehouse) => {
    setWarehouseData([...warehouseData, newWarehouse]);
    setDisplayWarehouseRegister(false);
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Warehouse registered successfully",
      life: 5000,
    });
  };

  const handleWarehouseUpdated = (updatedWarehouse) => {
    const updatedData = warehouseData.map((warehouse) =>
      warehouse.id === updatedWarehouse.id ? updatedWarehouse : warehouse
    );
    setWarehouseData(updatedData);
    setDisplayWarehouseUpdate(false);
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Warehouse updated successfully",
      life: 5000,
    });
  };

  const showDialog = () => {
    setDisplayWarehouseRegister(true);
  };

  const hideRegisterDialog = () => {
    setDisplayWarehouseRegister(false);
  };

  const hideUpdateDialog = () => {
    setDisplayWarehouseUpdate(false);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => {
          setSelectedWarehouse(rowData);
          setDisplayWarehouseUpdate(true);
        }}
      />
    );
  };

  const getSeverity = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "danger";
      default:
        return "secondary";
    }
  };

  const managerBodyTemplate = (rowData) => {
    const manager = warehouseManagers.find((m) => m.value === rowData.userId);
    return manager ? manager.fullName : "Not Assigned";
  };

  const statusBodyTemplate = (rowData) => (
    <Tag
      value={rowData.status}
      severity={getSeverity(rowData.status)}
      style={{ minWidth: "80px", textAlign: "center" }}
      className="text-sm px-2 rounded-md"
    />
  );

  const filterByGlobal = (value) => {
    setFilters({
      global: { value: value, matchMode: "contains" },
    });
  };

  const exportPdf = () => {
    const columns = [
      "ID",
      "Warehouse Name",
      "Location",
      "Branch",
      "Capacity (mt)",
      "Current Stock (mt)",
      "Status",
    ];
    const data = warehouseData.map((warehouse) => [
      warehouse.id,
      warehouse.facilityName,
      warehouse.location,
      warehouse.nfaBranch,
      warehouse.totalCapacity,
      warehouse.currentStock,
      warehouse.status,
    ]);

    pdfPortraitExport("Warehouse Data Export", columns, data);
  };

  // Row class function to determine background color
  const getRowClassName = (data) => {
    const remainingCapacity = data.totalCapacity - data.currentStock;
    const remainingPercentage = (remainingCapacity / data.totalCapacity) * 100;
    return remainingPercentage <= CAPACITY_WARNING_THRESHOLD ? 'bg-red-100' : '';
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Toast ref={toast} />
      {/* top buttons */}
      <div className="w-full flex items-center justify-between gap-4">
        <IconField iconPosition="left" className="w-1/2">
          <InputIcon className="pi pi-search text-light-grey"></InputIcon>
          <InputText
            placeholder="Tap to Search"
            type="search"
            onChange={(e) => {
              setGlobalFilterValue(e.target.value);
              filterByGlobal(e.target.value);
            }}
            className="w-full ring-0 hover:border-primary focus:border-primary placeholder:text-light-grey"
          />
        </IconField>
        <div className="flex justify-end w-1/2">
          <div className="flex gap-4">
            <Button
              type="button"
              className="flex flex-center items-center gap-4 bg-primary hover:bg-primaryHover border-0 ring-0"
              onClick={showDialog}
            >
              <Plus size={20} />
              <p className="font-semibold">Add New</p>
            </Button>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
        <div className="flex-grow overflow-auto bg-white">
          <DataTable
            value={warehouseData}
            scrollable
            scrollHeight="flex"
            scrolldirection="both"
            className="p-datatable-sm px-5 pt-5"
            filters={filters}
            globalFilterFields={["id", "facilityName", "location", "status"]}
            emptyMessage={<EmptyRecord label="No records found" />}
            paginator
            paginatorClassName="border-t-2 border-gray-300"
            rows={30}
            rowClassName={getRowClassName}
          >
            <Column
              field="id"
              header="ID"
              className="text-center"
              headerClassName="text-center"
            />
            <Column
              field="facilityName"
              header="Warehouse Name"
              className="text-center"
              headerClassName="text-center"
            />
            <Column
              field="userId"
              header="Warehouse Manager"
              body={managerBodyTemplate}
              className="text-center"
              headerClassName="text-center"
            />
            <Column
              field="location"
              header="Location"
              className="text-center"
              headerClassName="text-center"
            />
            <Column
              field="nfaBranch"
              header="Branch"
              className="text-center"
              headerClassName="text-center"
            />
            <Column
              field="totalCapacity"
              header="Capacity (bags)"
              className="text-center"
              headerClassName="text-center"
            />
            <Column
              field="currentStock"
              header="Current Stock (bags)"
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
      </div>

      <WarehouseRegister
        visible={displayWarehouseRegister}
        onHide={hideRegisterDialog}
        onWarehouseRegistered={handleWarehouseRegistered}
        warehouseManagers={warehouseManagers}
      />

      {selectedWarehouse && (
        <WarehouseUpdate
          visible={displayWarehouseUpdate}
          onHide={hideUpdateDialog}
          selectedWarehouse={selectedWarehouse}
          onUpdateWarehouse={handleWarehouseUpdated}
          warehouseManagers={warehouseManagers}
        />
      )}
    </div>
  );
}

export default Warehouse;
