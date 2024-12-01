import React, { useState, useEffect } from "react";
import RecipientLayout from '@/Layouts/Recipient/RecipientLayout';
import { Settings2, Search, RotateCw, Package } from "lucide-react";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import ConfirmReceive from "./ConfirmReceive";
import { useAuth } from "../../../Authentication/Login/AuthContext";

import Loader from "@/Components/Loader";

function RiceReceive() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [showConfirmReceive, setShowConfirmReceive] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("riceOrders");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedFilter]);

  useEffect(() => {
    const newFilters = {
      global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    };
    setFilters(newFilters);
  }, [globalFilterValue]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${apiUrl}/riceorders?riceRecipientId=${user.id}&status=Accepted&status=In%20Transit&status=Received`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch rice orders");
      }
      const data = await res.json();
      setInventoryData(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false)
    }
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const getSeverity = (status) => {
    switch (status.toLowerCase()) {
      case "in transit":
        return "primary";
      case "received":
        return "success";
      case "accepted":
        return "info";
      default:
        return "secondary";
    }
  };

  const handleReceiveClick = (rowData) => {
    console.log(rowData);
    setSelectedOrderData({
      ...rowData,
      dateBought: new Date(rowData.dateBought),
    });
    setShowConfirmReceive(true);
  };

  const actionBodyTemplate = (rowData) => {
    if (rowData.status === "In Transit") {
      return (
        <Button
          label="Receive"
          className="p-button-success p-button-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleReceiveClick(rowData);
          }}
        />
      );
    }
    return null;
  };

  const handleItemClick = (item) => {
    console.log(item);
    setSelectedOrder(item);
    setShowOrderDetails(true);
  };

  const itemTemplate = (item) => {
    return (
      <div className="col-12" onClick={() => handleItemClick(item)}>
        <div className="flex flex-row items-center p-4 gap-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg mb-4">
          {/* Left Side - Icon */}
          <div className="flex-none">
            <Package size={40} className="text-gray-600" />
          </div>

          {/* Middle - Main Info */}
          <div className="flex-1">
            <div className="font-medium text-xl mb-1">
              Order #0304-{item.id}
            </div>
            <div className="text-gray-600 mb-1">
              {new Date(item.orderDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <span className="py-1 text-sm">{item.riceQuantityBags} bags</span>
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

  const OrderDetailsDialog = () => {
    return (
      <Dialog
        visible={showOrderDetails}
        onHide={() => setShowOrderDetails(false)}
        header="Order Details"
        className="w-full max-w-2xl"
      >
        {selectedOrder && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-600">Order ID</h3>
                <p className="font-medium">0304-{selectedOrder.id}</p>
              </div>
              <div>
                <h3 className="text-gray-600">Status</h3>
                <div className="mt-1">{statusBodyTemplate(selectedOrder)}</div>
              </div>
              <div>
                <h3 className="text-gray-600">Order Date</h3>
                <p className="font-medium">
                  {new Date(selectedOrder.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-gray-600">Preferred Delivery Date</h3>
                <p className="font-medium">
                  {new Date(
                    selectedOrder.preferredDeliveryDate
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-gray-600">Quantity</h3>
                <p className="font-medium">
                  {selectedOrder.riceQuantityBags} bags
                </p>
              </div>
              <div>
                <h3 className="text-gray-600">Total Cost</h3>
                <p className="font-medium">{selectedOrder.totalCost}</p>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    );
  };

  const filteredData = inventoryData.filter((item) =>
    selectedFilter === "riceOrders"
      ? item.status !== "Received"
      : item.status === "Received"
  );

  const statusBodyTemplate = (rowData) => (
    <Tag
      value={rowData.status}
      severity={getSeverity(rowData.status)}
      style={{ minWidth: "80px", textAlign: "center" }}
      className="text-sm px-2 rounded-md"
    />
  );

  const buttonStyle = (isSelected) =>
    isSelected
      ? "bg-primary text-white"
      : "bg-white text-primary border border-gray-300";

  // RIGHT SIDEBAR DETAILS
  const personalStats = [
    { title: "Palay Bought", value: 9 },
    { title: "Processed", value: 4 },
    { title: "Distributed", value: 2 },
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
    <RecipientLayout
      activePage="Rice Receive"
      user={user}
      isRightSidebarOpen={false}
      rightSidebar={rightSidebar()}
    >
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}
      <div className="flex flex-col h-full gap-4 bg-[#F1F5F9]">
        <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
          <h1 className="text-2xl sm:text-4xl text-white font-semibold">
            Rice Receive
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
        <div className="flex-grow flex flex-col overflow-hidden rounded-lg bg-white p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center bg-white p-2 rounded-full">
              <Button
                icon={<Settings2 size={18} />}
                label="Rice Orders"
                className={`p-button-sm gap-4 border border-primary ring-0 rounded-full ${buttonStyle(
                  selectedFilter === "riceOrders"
                )}`}
                onClick={() => setSelectedFilter("riceOrders")}
              />

              <Button
                icon={<Settings2 size={18} />}
                label="Orders Received"
                className={`p-button-sm gap-4 border border-primary ring-0 rounded-full ${buttonStyle(
                  selectedFilter === "received"
                )}`}
                onClick={() => setSelectedFilter("received")}
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
          <div className="relative flex flex-col" style={{ height: "550px" }}>
            <DataView
              value={filteredData}
              itemTemplate={itemTemplate}
              paginator
              rows={10}
              emptyMessage="No orders found."
              className="overflow-y-auto pb-16"
              paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            />
          </div>
        </div>
      </div>

      <OrderDetailsDialog />

      <ConfirmReceive
        visible={showConfirmReceive}
        onHide={() => setShowConfirmReceive(false)}
        data={selectedOrderData}
        user={user}
        onConfirmReceive={fetchData}
      />
    </RecipientLayout>
  );
}

export default RiceReceive;
