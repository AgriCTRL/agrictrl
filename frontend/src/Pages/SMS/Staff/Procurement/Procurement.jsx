import React, { useState, useEffect, useRef } from "react";

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
    RotateCw,
    Plus,
    Loader2,
    Undo2,
    CheckCircle2,
} from "lucide-react";

import PalayRegister from "./PalayRegister";
import PalayDetails from "./PalayDetails";
import { useAuth } from "../../../Authentication/Login/AuthContext";
import StaffLayout from "@/Layouts/Staff/StaffLayout";
import Loader from "@/Components/Loader";
import EmptyRecord from "../../../../Components/EmptyRecord";

function BuyPalay() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const { user } = useAuth();

    const [palayCount, setPalayCount] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [distributedCount, setDistributedCount] = useState(0);

    const [first, setFirst] = useState(0);

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedPalay, setSelectedPalay] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [showRegisterPalay, setShowRegisterPalay] = useState(false);
    const [inventoryData, setInventoryData] = useState([]);
    const [currentWSR, setCurrentWSR] = useState("00000000");

    useEffect(() => {
        fetchPalayData();
        fetchData();
    }, []);

    useEffect(() => {
        const newFilters = {
            global: {
                value: globalFilterValue,
                matchMode: FilterMatchMode.CONTAINS,
            },
        };
        setFilters(newFilters);
    }, [globalFilterValue]);

    useEffect(() => {
        fetchPalayData(Math.floor(first / 10), globalFilterValue);
    }, [first, globalFilterValue]);

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const fetchPalayData = async (page = 0, searchValue = "") => {
        try {
            setIsLoading(true);

            const limit = 10;
            const offset = page * limit;

            let url = `${apiUrl}/palaybatches?limit=${limit}&offset=${offset}`;

            if (searchValue) {
                url = `${apiUrl}/palaybatches/search?id=${searchValue}&limit=${limit}&offset=${offset}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch palay data");
            }

            const { data, total, latestWSR } = await response.json();
            setInventoryData(data);
            setPalayCount(total);

            // Find the highest WSR number from the fetched data
            // if (latestWSR) {
            //   // Increment the WSR number
            //   const nextWSR = String(latestWSR + 1).padStart(8, "0");
            //   setCurrentWSR(nextWSR);
            // } else {
            //   // Fallback to default if no latestWSR is provided
            //   setCurrentWSR("00000001");
            // }
        } catch (error) {
            console.error("Error:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch palay data",
                life: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            // Set loading to true before fetch
            setIsLoading(true);

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
        } catch (error) {
            console.error("Error fetching counts:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch data counts",
                life: 3000,
            });
        } finally {
            // Set loading to false after fetch completes
            setIsLoading(false);
        }
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

    const handlePalayRegistered = () => {
        fetchPalayData();
        setShowRegisterPalay(false);
    };

    const handlePalayUpdate = () => {
        fetchPalayData();
        setShowDetails(false);
    };

    const handleItemClick = (item) => {
        setSelectedPalay(item);
        setShowDetails(true);
    };

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
            <div
                className="flex items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200  rounded-lg mb-4"
                onClick={() => handleItemClick(item)}
            >
                <div className="flex-none mr-4">
                    <Wheat size={40} className="text-gray-400" />
                </div>
                <div className="flex-grow">
                    <div className="text-xl font-semibold mb-1">
                        Palay Batch #{item.wsr}
                    </div>
                    <div className="text-gray-600 mb-2">
                        {new Date(item.dateBought).toLocaleDateString()} || age:{" "}
                        {item.age}
                    </div>
                    <div className="text-sm text-gray-500">
                        {item.quantityBags} bags
                    </div>
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
                        Palay Procurement
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

                {/* Data View */}
                <div className="flex flex-col overflow-hidden rounded-lg">
                    <div className="overflow-hidden bg-white flex flex-col gap-4 p-2 md:p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 md:gap-4">
                                <p className="text-sm md:text-base font-medium text-black">
                                    Refresh Data
                                </p>
                                <RotateCw
                                    onClick={fetchPalayData}
                                    className="size-4 md:size-5 text-primary cursor-pointer hover:text-primaryHover"
                                    title="Refresh data"
                                />
                            </div>

                            <Button
                                className="ring-0 border-0 text-white bg-gradient-to-r from-primary to-secondary flex flex-center justify-between items-center gap-2 md:gap-4"
                                onClick={handleAddPalay}
                            >
                                <p className="text-sm md:text-base font-medium">Buy Palay</p>
                                <Plus className="size-4 md:size-5" />
                            </Button>
                        </div>

                        {/* Container with relative positioning */}
                        <div
                            className="relative flex flex-col"
                            style={{ height: "calc(100vh - 430px)" }}
                        >
                            <DataView
                                value={inventoryData}
                                itemTemplate={itemTemplate}
                                lazy
                                paginator
                                rows={10}
                                first={first}
                                onPage={(e) => setFirst(e.first)}
                                emptyMessage={<EmptyRecord label='No Inventory Data' />}
                                totalRecords={palayCount}
                                className="overflow-y-auto pb-16"
                                paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300"
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
                currentWSR={currentWSR}
            />

            <PalayDetails
                visible={showDetails}
                onHide={() => setShowDetails(false)}
                palay={selectedPalay}
                onUpdate={handlePalayUpdate}
            />
        </StaffLayout>
    );
}

export default BuyPalay;
