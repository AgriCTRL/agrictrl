import React, { useState, useEffect, useRef } from "react";
import StaffLayout from "@/Layouts/Staff/StaffLayout";

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
    ShoppingCart,
    ThumbsUp,
    ThumbsDown,
    RotateCw,
    Loader2,
    Undo2,
    CheckCircle2,
    Package,
    ChevronDown,
} from "lucide-react";

import { useAuth } from "../../../Authentication/Login/AuthContext";
import AcceptOrder from "./AcceptOrder";
import DeclineOrder from "./DeclineOrder";
import SendOrder from "./SendOrder";
import DeclineDetails from "./DeclineDetails";
import OrderDetails from "./OrderDetails";
import Loader from "@/Components/Loader";
import EmptyRecord from "../../../../Components/EmptyRecord";
import { Dropdown } from "primereact/dropdown";

function Distribution() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef();
    const { user } = useAuth();
    // const [user] = useState({ userType: 'NFA Branch Staff' });

    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("request");
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [showDeclinedDetailsDialog, setShowDeclinedDetailsDialog] =
        useState(false);

    const [ordersData, setOrdersData] = useState([]);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [recipients, setRecipients] = useState({});

    const [pilesData, setPilesData] = useState([]);
    const [totalAvailableQuantity, setTotalAvailableQuantity] = useState(0);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [declineReason, setDeclineReason] = useState("");
    const [declinedDetails, setDeclinedDetails] = useState({});

    const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});

    const [sendOrderData, setSendOrderData] = useState({});

    const [palayCount, setPalayCount] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [distributedCount, setDistributedCount] = useState(0);

    const ACTION_TYPES = {
        ACCEPT: "accept",
        DECLINE: "decline",
        SEND: "send",
        VIEW_DETAILS: "view_details",
        VIEW_ORDER_DETAILS: "view_order_details",
    };

    useEffect(() => {
        fetchRecipients();
        fetchPilesData();
        fetchData();
    }, [selectedFilter]);

    useEffect(() => {
        if (Object.keys(recipients).length > 0) {
            fetchOrders();
        }
    }, [recipients]);

    const fetchRecipients = async () => {
        try {
            setIsLoading(true);

            const res = await fetch(
                `${apiUrl}/users?userType=Rice%20Recipient`
            );
            const data = await res.json();
            if (!res.ok) {
                throw new Error("failed to fetch rice recipients");
            }
            const recipientMap = data.reduce((acc, recipient) => {
                acc[
                    recipient.id
                ] = `${recipient.firstName} ${recipient.lastName}`;
                return acc;
            }, {});
            setRecipients(recipientMap);
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setIsLoading(true);

            const res = await fetch(`${apiUrl}/riceorders`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error("failed to fetch rice orders");
            }
            const ordersWithRecipients = data.map((order) => ({
                ...order,
                orderedBy: recipients[order.riceRecipientId] || "Unknown",
            }));
            setOrdersData(ordersWithRecipients);
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const searchOrders = async (id) => {
        try {
            const res = await fetch(`${apiUrl}/riceorders?id=${id}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error("failed to fetch rice orders");
            }
            const ordersWithRecipients = data.map((order) => ({
                ...order,
                orderedBy: recipients[order.riceRecipientId] || "Unknown",
            }));
            setOrdersData(ordersWithRecipients);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchData = async () => {
        try {
            const palayCountRes = await fetch(`${apiUrl}/palaybatches/count`);
            setPalayCount(await palayCountRes.json());
            const millingCountRes = await fetch(
                `${apiUrl}/millingbatches/count`
            );
            const millingCount = await millingCountRes.json();
            const dryingCountRes = await fetch(`${apiUrl}/dryingbatches/count`);
            const dryingCount = await dryingCountRes.json();
            setProcessedCount(millingCount + dryingCount);
            const distributeCountRes = await fetch(
                `${apiUrl}/riceorders/received/count`
            );
            setDistributedCount(await distributeCountRes.json());
        } catch {
            console.error("Error fetching data:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch data",
                life: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onUpdate = () => {
        fetchRecipients();
        if (Object.keys(recipients).length > 0) {
            fetchOrders();
        }
        fetchPilesData();
    };

    const fetchPilesData = async () => {
        try {
            setIsLoading(true);

            const res = await fetch(`${apiUrl}/piles?type=Rice`);
            if (!res.ok) {
                throw new Error("Failed to fetch piles data");
            }
            const { data } = await res.json();

            // Filter and sort piles that are for sale and of type "Rice"
            const forSalePiles = data
                .filter((pile) => pile.forSale === true && pile.type === "Rice")
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((pile) => ({
                    ...pile,
                    currentQuantity: Math.floor(pile.currentQuantity * 0.5), // Limit to 50% of available bags
                }));

            // Store full piles data
            setPilesData(forSalePiles);

            // Calculate total available quantity (now limited to 50%)
            const totalQuantity = forSalePiles.reduce(
                (sum, pile) => sum + pile.currentQuantity,
                0
            );
            setTotalAvailableQuantity(totalQuantity);
        } catch (error) {
            console.log(error.message);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch piles data",
                life: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onGlobalFilterChange = (e) => {
        const id = e.target.value;
        setGlobalFilterValue(id);

        if (id.trim() === "") {
            fetchOrders();
        } else {
            searchOrders(id);
        }
    };

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case "for approval":
                return "warning";
            case "accepted":
                return "success";
            case "declined":
                return "danger";
            case "in transit":
                return "info";
            case "received":
                return "success";
            default:
                return "info";
        }
    };

    const statusBodyTemplate = (rowData) => (
        <Tag
            value={rowData.status}
            severity={getSeverity(rowData.status)}
            className="text-sm px-3 py-1 rounded-lg"
        />
    );

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    const handleActionClick = (actionType, rowData) => {
        setSelectedOrder(rowData);

        switch (actionType) {
            case ACTION_TYPES.ACCEPT:
                if (totalAvailableQuantity < rowData.riceQuantityBags) {
                    toast.current.show({
                        severity: "error",
                        summary: "Insufficient Rice Bags",
                        detail: `Cannot accept order. Available bags (${totalAvailableQuantity}) is less than required bags (${rowData.riceQuantityBags}).`,
                        life: 3000,
                    });
                    return;
                }
                setShowAcceptDialog(true);
                break;

            case ACTION_TYPES.DECLINE:
                setShowDeclineDialog(true);
                break;

            case ACTION_TYPES.SEND:
                if (totalAvailableQuantity < rowData.riceQuantityBags) {
                    toast.current.show({
                        severity: "error",
                        summary: "Insufficient Rice Bags",
                        detail: `Cannot send order. Available bags (${totalAvailableQuantity}) is less than required bags (${rowData.riceQuantityBags}).`,
                        life: 3000,
                    });
                    return;
                }
                setSendOrderData({
                    warehouseId: null,
                    riceQuantityBags: rowData.riceQuantityBags,
                    dropOffLocation: rowData.dropOffLocation,
                    description: rowData.description || "",
                    transportedBy: "",
                    transporterDescription: "",
                    remarks: "",
                    riceOrderId: rowData.id,
                    riceRecipientId: rowData.riceRecipientId,
                });
                setShowSendDialog(true);
                break;

            case ACTION_TYPES.VIEW_DETAILS:
                setDeclinedDetails({
                    orderID: rowData.id,
                    quantity: rowData.riceQuantityBags,
                    description: rowData.description,
                    orderDate: new Date(rowData.orderDate)
                        .toISOString()
                        .split("T")[0],
                });
                setShowDeclinedDetailsDialog(true);
                break;

            case ACTION_TYPES.VIEW_ORDER_DETAILS:
                setOrderDetails({
                    orderID: rowData.id,
                    quantity: rowData.riceQuantityBags,
                    description: rowData.description,
                    orderDate: new Date(rowData.orderDate)
                        .toISOString()
                        .split("T")[0],
                    status: rowData.status,
                });
                setShowOrderDetailsDialog(true);
                break;

            default:
                console.warn("Unknown action type:", actionType);
        }
    };

    const handleItemClick = (item) => {
        setSelectedOrder(item);
        setShowOrderDetails(true);
    };

    const actionBodyTemplate = (rowData) => {
        switch (rowData.status) {
            case "For Approval":
                return (
                    <div className="flex justify-center space-x-2">
                        <Button
                            label="Accept"
                            className="p-button-success p-button-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleActionClick(ACTION_TYPES.ACCEPT, rowData);
                            }}
                            tooltip={
                                totalAvailableQuantity <
                                rowData.riceQuantityBags
                                    ? "Insufficient rice bags available"
                                    : undefined
                            }
                        />
                        <Button
                            label="Decline"
                            className="p-button-danger p-button-sm ring-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleActionClick(
                                    ACTION_TYPES.DECLINE,
                                    rowData
                                );
                            }}
                        />
                    </div>
                );
            case "Accepted":
                return (
                    <Button
                        label="Send"
                        className="p-button-primary p-button-sm ring-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(ACTION_TYPES.SEND, rowData);
                        }}
                        tooltip={
                            totalAvailableQuantity < rowData.riceQuantityBags
                                ? "Insufficient rice bags available"
                                : undefined
                        }
                    />
                );
            case "Declined":
                return (
                    <Button
                        label="View Details"
                        className="p-button-primary p-button-sm ring-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(
                                ACTION_TYPES.VIEW_DETAILS,
                                rowData
                            );
                        }}
                    />
                );
            case "In Transit":
            case "Received":
                return (
                    <Button
                        label="View Details"
                        className="p-button-primary p-button-sm ring-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(
                                ACTION_TYPES.VIEW_ORDER_DETAILS,
                                rowData
                            );
                        }}
                    />
                );
            default:
                return null;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const filteredData = ordersData.filter((item) => {
        switch (selectedFilter) {
            case "request":
                return item.status === "For Approval";
            case "accepted":
                return item.status === "Accepted";
            case "declined":
                return item.status === "Declined";
            case "delivered":
                return (
                    item.status === "In Transit" || item.status === "Received"
                );
            default:
                return true;
        }
    });

    const buttonStyle = (isSelected) =>
        isSelected
            ? "bg-primary text-white"
            : "bg-white text-primary border border-gray-300";

    // RIGHT SIDEBAR DETAILS
    const personalStats = [
        {
            icon: <Loader2 size={18} />,
            title: "Palay Bought",
            value: palayCount,
        },
        {
            icon: <Undo2 size={18} />,
            title: "Processed",
            value: processedCount,
        },
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
                                <p className="font-semibold text-primary">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (item) => {
        return (
            <div className="col-12">
                <div
                    className="flex flex-row items-center p-4 gap-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg mb-4"
                    onClick={() => handleItemClick(item)}
                >
                    {/* Left Side - Icon */}
                    <div className="flex-none">
                        <Package size={40} className="text-gray-400" />
                    </div>

                    {/* Middle - Main Info */}
                    <div className="flex-1">
                        <div className="font-medium text-xl mb-1">
                            Order #{item.id}
                        </div>
                        <div className="text-gray-600 mb-1">
                            {formatDate(item.orderDate)}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="py-1 text-sm">
                                {item.riceQuantityBags} bags
                            </span>

                            <span className="py-1 text-sm">
                                To: {item.dropOffLocation}
                            </span>
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

    return (
        <StaffLayout
            activePage="Distribution"
            user={user}
            isRightSidebarOpen={false}
            rightSidebar={rightSidebar()}
        >
            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
                    <Loader />
                </div>
            )}
            <Toast ref={toast} />
            <div className="flex flex-col h-full gap-4">
                <div className="flex flex-col justify-center gap-4 items-center p-4 md:p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
                    <h1 className="text-2xl sm:text-4xl text-white font-semibold">
                        Mill Palay
                    </h1>
                    <span className="md:w-1/2">
                        <IconField iconPosition="left">
                            <InputIcon className="">
                                <Search className="text-white size-4 md:size-5" />
                            </InputIcon>
                            <InputText
                                className="py-2 md:py-3 text-sm md:text-base ring-0 w-full rounded-full text-white bg-transparent border border-white placeholder:text-white"
                                value={globalFilterValue}
                                onChange={onGlobalFilterChange}
                                placeholder="Tap to search"
                                maxLength="8"
                            />
                        </IconField>
                    </span>
                </div>

                {/* Buttons & Search bar */}

                {/* Data View */}
                <div className="flex-grow flex flex-col overflow-hidden rounded-lg">
                    <div className="overflow-hidden bg-white flex flex-col gap-4 p-2 md:p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="hidden md:flex bg-white rounded-full gap-2 items-center">
                                <Button
                                    icon={
                                        <ShoppingCart className="size-4 md:size-5 mr-2" />
                                    }
                                    label="Request"
                                    className={`p-button-success p-button-sm border border-primary ring-0 rounded-full ${buttonStyle(
                                        selectedFilter === "request"
                                    )}`}
                                    onClick={() =>
                                        handleFilterChange("request")
                                    }
                                />
                                <Button
                                    icon={
                                        <ThumbsUp className="size-4 md:size-5 mr-2" />
                                    }
                                    label="Accepted"
                                    className={`p-button-success p-button-sm border border-primary ring-0 rounded-full ${buttonStyle(
                                        selectedFilter === "accepted"
                                    )}`}
                                    onClick={() =>
                                        handleFilterChange("accepted")
                                    }
                                />
                                <Button
                                    icon={
                                        <ThumbsDown className="size-4 md:size-5 mr-2" />
                                    }
                                    label="Declined"
                                    className={`p-button-success p-button-sm border border-primary ring-0 rounded-full ${buttonStyle(
                                        selectedFilter === "declined"
                                    )}`}
                                    onClick={() =>
                                        handleFilterChange("declined")
                                    }
                                />

                                <Button
                                    icon={
                                        <RotateCw className="size-4 md:size-5 mr-2" />
                                    }
                                    label="Delivered"
                                    className={`p-button-success p-button-sm border border-primary ring-0 rounded-full ${buttonStyle(
                                        selectedFilter === "delivered"
                                    )}`}
                                    onClick={() =>
                                        handleFilterChange("delivered")
                                    }
                                />

                                <RotateCw
                                    className="size-4 md:size-5 text-primary cursor-pointer hover:text-secondary transition-colors"
                                    onClick={onUpdate}
                                    title="Refresh data"
                                />
                            </div>
                            <Dropdown
                                value={selectedFilter}
                                onChange={(e) => handleFilterChange(e.value)}
                                options={[
                                    { label: "Request", value: "request" },
                                    { label: "Accepted", value: "accepted" },
                                    { label: "Declined", value: "declined" },
                                    { label: "Delivered", value: "delivered" },
                                ]}
                                optionLabel="label"
                                className="ring-0 border-0 flex items-center justify-between gap-4 md:hidden px-4 py-3"
                                pt={{
                                    root: "bg-primary rounded-full",
                                    input: "text-sm text-white p-0",
                                    trigger: "text-sm text-white h-fit w-fit",
                                    panel: "text-sm",
                                }}
                                dropdownIcon={
                                    <ChevronDown className="size-4 text-white" />
                                }
                            />

                            <div className="text-sm md:text-base text-white p-3 rounded-lg bg-primary">
                                Total Rice Bags Available:{" "}
                                <span className="font-semibold text-sm md:text-base">
                                    {totalAvailableQuantity} Bags
                                </span>
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col"
                            style={{ height: "calc(100vh - 440px)" }}
                        >
                            <DataView
                                value={filteredData}
                                itemTemplate={itemTemplate}
                                paginator
                                rows={10}
                                emptyMessage={
                                    <EmptyRecord label="No orders found." />
                                }
                                className="overflow-y-auto pb-16"
                                paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AcceptOrder
                visible={showAcceptDialog}
                onHide={() => setShowAcceptDialog(false)}
                selectedOrder={selectedOrder}
                onUpdate={onUpdate}
            />

            <DeclineOrder
                visible={showDeclineDialog}
                onHide={() => setShowDeclineDialog(false)}
                declineReason={declineReason}
                onReasonChange={setDeclineReason}
                selectedOrder={selectedOrder}
                onUpdate={onUpdate}
            />

            <SendOrder
                visible={showSendDialog}
                onHide={() => setShowSendDialog(false)}
                pilesData={pilesData}
                selectedOrder={selectedOrder}
                user={user}
                toast={toast}
                onUpdate={onUpdate}
                sendOrderData={sendOrderData}
            />

            <DeclineDetails
                visible={showDeclinedDetailsDialog}
                onHide={() => setShowDeclinedDetailsDialog(false)}
                isLoading={isLoading}
                declinedDetails={declinedDetails}
                formatDate={formatDate}
                selectedOrder={selectedOrder}
                onUpdate={onUpdate}
            />

            <OrderDetails
                visible={showOrderDetailsDialog}
                onHide={() => setShowOrderDetailsDialog(false)}
                isLoading={isLoading}
                orderDetails={orderDetails}
                formatDate={formatDate}
            />

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
                                <p className="font-medium">
                                    #{selectedOrder.id}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-600">Status</h3>
                                <div className="mt-1">
                                    {statusBodyTemplate(selectedOrder)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-600">Order Date</h3>
                                <p className="font-medium">
                                    {formatDate(selectedOrder.orderDate)}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-600">
                                    Delivery Location
                                </h3>
                                <p className="font-medium">
                                    {selectedOrder.dropOffLocation}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-600">Quantity</h3>
                                <p className="font-medium">
                                    {selectedOrder.riceQuantityBags} bags
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-600">Ordered By</h3>
                                <p className="font-medium">
                                    {selectedOrder.orderedBy}
                                </p>
                            </div>
                            {selectedOrder.description && (
                                <div className="col-span-2">
                                    <h3 className="text-gray-600">
                                        Description
                                    </h3>
                                    <p className="font-medium">
                                        {selectedOrder.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Dialog>
        </StaffLayout>
    );
}

export default Distribution;