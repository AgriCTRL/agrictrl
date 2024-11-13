import React, { useState, useEffect, useRef } from "react";

import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";

import {
  Search,
  Wheat,
  RotateCw,
  Plus,
  Loader2,
  Undo2,
  CheckCircle2,
} from "lucide-react";

import PalayRegister from "./PalayRegister";
import { useAuth } from "../../../Authentication/Login/AuthContext";
import StaffLayout from "@/Layouts/StaffLayout";

function BuyPalay() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const { user } = useAuth();

  // const [user] = useState({ userType: 'NFA Branch Staff' });

  const [palayCount, setPalayCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [distributedCount, setDistributedCount] = useState(0);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPalay, setSelectedPalay] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [showRegisterPalay, setShowRegisterPalay] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetchPalayData();
    fetchData();
  }, []);

  useEffect(() => {
    const newFilters = {
      global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    };
    setFilters(newFilters);
  }, [globalFilterValue]);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const fetchPalayData = async () => {
    try {
      const response = await fetch(`${apiUrl}/palaybatches`);

      if (!response.ok) {
        throw new Error("Failed to fetch palay data");
      }

      const data = await response.json();
      setInventoryData(data);
    } catch (error) {
      console.error("Error:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch palay data",
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

  const getSeverity = (status) => {
    switch (status.toLowerCase()) {
      case "to be dry":
        return "success";
      case "in drying":
        return "success";
      case "to be mill":
        return "info";
      case "in milling":
        return "info";
      case "milled":
        return "primary";
      default:
        return "danger";
    }
    // sucess - green
    // info - blue
    // warning - orange
    // danger - red
    // primary - cyan
  };

  const handleAddPalay = () => {
    setShowRegisterPalay(true);
  };

  const handlePalayRegistered = (newPalay) => {
    fetchPalayData();
    setShowRegisterPalay(false);
  };

  const handleItemClick = (item) => {
    setSelectedPalay(item);
    setShowDetails(true);
  };

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
      <div
        className="flex items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200  rounded-lg mb-4"
        onClick={() => handleItemClick(item)}
      > 
        <div className="flex-none mr-4">
          <Wheat size={40} className="text-gray-400" />
        </div>
        <div className="flex-grow">
          <div className="text-xl font-semibold mb-1">
            Palay Batch #{item.id}
          </div>
          <div className="text-gray-600 mb-2">
            {new Date(item.dateBought).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-500">{item.quantityBags} bags</div>
        </div>
        <div className="flex-none flex flex-col items-center">
          <Tag
            value={item.status}
            severity={getSeverity(item.status)}
            className="text-sm px-2 rounded-md"
          />
        </div>
      </div>
    );
  };

  return (
    <StaffLayout
      activePage="Procurement"
      user={user}
      isRightSidebarOpen={true}
      rightSidebar={rightSidebar()}
    >
      <Toast ref={toast} />
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
          <h1 className="text-2xl sm:text-4xl text-white font-semibold">
            Palay Procurement
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

        {/* Data View */}
        <div className="flex flex-col overflow-hidden rounded-lg">
          <div className="overflow-hidden bg-white flex flex-col gap-4 p-5">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <p className="font-medium text-black">Refresh Data</p>
                <RotateCw
                  size={25}
                  onClick={fetchPalayData}
                  className="text-primary cursor-pointer hover:text-primaryHover"
                  title="Refresh data"
                />
              </div>

              <Button
                className="ring-0 border-0 text-white bg-gradient-to-r from-primary to-secondary flex flex-center justify-between items-center gap-4"
                onClick={handleAddPalay}
              >
                <p className="font-medium">Buy Palay</p>
                <Plus size={18} />
              </Button>
            </div>

            {/* Container with relative positioning */}
            <div className="relative flex flex-col" style={{ height: "calc(100vh - 430px)" }}>
              <DataView
                value={inventoryData}
                itemTemplate={itemTemplate}
                filters={filters}
                globalFilterFields={["id", "status"]}
                emptyMessage="No inventory found."
                paginator
                rows={10}
                className="overflow-y-auto pb-16" // Add padding at bottom to prevent content being hidden behind paginator
                paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t" // Fix paginator at bottom
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
              />
            </div>
          </div>
        </div>
      </div>

      <PalayRegister
        visible={showRegisterPalay}
        onHide={() => setShowRegisterPalay(false)}
        onPalayRegistered={handlePalayRegistered}
      />

      <Dialog
        visible={showDetails}
        onHide={() => setShowDetails(false)}
        header={`Batch #${selectedPalay?.id} Details`}
        className="w-full max-w-2xl"
      >
        {selectedPalay && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 border-b pb-2">
              <h3 className="font-semibold">Basic Information</h3>
            </div>
            <div>
              <p className="text-gray-600">Gross Weight</p>
              <p>{selectedPalay.grossWeight} Kg</p>
            </div>
            <div>
              <p className="text-gray-600">Net Weight</p>
              <p>{selectedPalay.netWeight} Kg</p>
            </div>
            <div>
              <p className="text-gray-600">Quality Type</p>
              <p>{selectedPalay.qualityType}</p>
            </div>
            <div>
              <p className="text-gray-600">Price/Kg</p>
              <p>{selectedPalay.price}</p>
            </div>

            <div className="col-span-2 border-b pb-2 mt-4">
              <h3 className="font-semibold">Quality Specifications</h3>
            </div>
            <div>
              <p className="text-gray-600">Moisture Content</p>
              <p>{selectedPalay.qualitySpec.moistureContent}%</p>
            </div>
            <div>
              <p className="text-gray-600">Purity</p>
              <p>{selectedPalay.qualitySpec.purity}%</p>
            </div>
            <div>
              <p className="text-gray-600">Damage</p>
              <p>{selectedPalay.qualitySpec.damaged}%</p>
            </div>

            <div className="col-span-2 border-b pb-2 mt-4">
              <h3 className="font-semibold">Source Information</h3>
            </div>
            <div>
              <p className="text-gray-600">Supplier</p>
              <p>{selectedPalay.palaySupplier.farmerName}</p>
            </div>
            <div>
              <p className="text-gray-600">Farm Origin</p>
              <p>
                {selectedPalay.farm.region}, {selectedPalay.farm.province}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Current Location</p>
              <p>{selectedPalay.currentlyAt}</p>
            </div>
          </div>
        )}
      </Dialog>
    </StaffLayout>
  );
}

export default BuyPalay;
