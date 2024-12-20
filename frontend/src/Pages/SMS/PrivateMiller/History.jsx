import React, { useState, useEffect } from "react";

import { Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { useAuth } from "../../Authentication/Login/AuthContext";
import PrivateMillerLayout from "@/Layouts/Miller/PrivateMillerLayout";
import Loader from "@/Components/Loader";
import EmptyRecord from "@/Components/EmptyRecord";

function CustomDateRangeSelector({ selectedFilter, onChange, disabled }) {
    const [currentDate, setCurrentDate] = useState(getStartOfWeek(new Date()));

    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    const formatDateRange = () => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        if (selectedFilter === "weekly") {
            const start = new Date(currentDate);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            return `${start.toLocaleDateString(
                "en-US",
                options
            )} - ${end.toLocaleDateString("en-US", options)}`;
        } else if (selectedFilter === "monthly") {
            return currentDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
            });
        } else {
            return currentDate.getFullYear().toString();
        }
    };

    const navigate = (direction) => {
        const newDate = new Date(currentDate);
        if (selectedFilter === "weekly") {
            newDate.setDate(newDate.getDate() + direction * 7);
        } else if (selectedFilter === "monthly") {
            newDate.setMonth(newDate.getMonth() + direction);
        } else {
            newDate.setFullYear(newDate.getFullYear() + direction);
        }
        setCurrentDate(newDate);
        onChange(newDate);
    };

    useEffect(() => {
        onChange(currentDate);
    }, [selectedFilter]);

    return (
        <div className="flex items-center bg-primary text-white rounded-full gap-2 px-2 md:px-4 py-3">
            <Button
                icon={<ChevronLeft className="size-4 md:size-5" />}
                onClick={() => navigate(-1)}
                className="p-button-text text-white ring-0 text-sm md:text-base p-0 w-fit"
                disabled={disabled}
            />
            <span
                className="text-sm md:text-base font text-center truncate w-20 sm:w-40 md:w-auto overflow-hidden"
                title={formatDateRange()} // Adds full-text tooltip for truncation
            >
                {formatDateRange()}
            </span>
            <Button
                icon={<ChevronRight className="size-4 md:size-5" />}
                onClick={() => navigate(1)}
                className="p-button-text text-white ring-0 text-sm md:text-base p-0 w-fit"
                disabled={disabled}
            />
        </div>
    );
}

function History() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("weekly");
    const [currentDate, setCurrentDate] = useState(getStartOfWeek(new Date()));
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchTransactions();
    }, [user.id]);

    useEffect(() => {
        filterTransactions();
    }, [
        selectedFilter,
        currentDate,
        globalFilterValue,
        showAll,
        allTransactions,
    ]);

    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            // First fetch all millers and find the one associated with our user
            const millerResponse = await fetch(`${apiUrl}/millers`);
            if (!millerResponse.ok) {
                throw new Error("Failed to fetch miller information");
            }
            const millersData = await millerResponse.json();
            const ourMiller = millersData.find(
                (miller) => miller.userId === user.id
            );

            if (!ourMiller) {
                throw new Error("Miller not found for current user");
            }

            // Then fetch and filter transactions using our miller's ID
            const response = await fetch(`${apiUrl}/transactions`);
            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const data = await response.json();

            // Filter transactions where our miller is either sender or receiver
            const userTransactions = data.filter(
                (transaction) =>
                    transaction.fromLocationId === ourMiller.id ||
                    transaction.toLocationId === ourMiller.id
            );

            const transformedTransactions = userTransactions.map(
                (transaction) => ({
                    ...transaction,
                    date: new Date(
                        transaction.sendDateTime || transaction.receiveDateTime
                    ),
                    description: `Transaction ${transaction.id}`,
                    displayStatus: getDisplayStatus(transaction),
                })
            );

            setAllTransactions(transformedTransactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getDisplayStatus = (transaction) => {
        if (transaction.status === "Completed") return "RETURNED";
        if (transaction.status === "Received") return "MILLED";
        return "RECEIVED"; // For Pending or other statuses
    };

    const displayModeOptions = [
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
        { label: "Annually", value: "annually" },
    ];

    const filterTransactions = () => {
        let filtered = [...allTransactions];

        if (!showAll) {
            filtered = filtered.filter((transaction) => {
                const transactionDate = new Date(transaction.date);

                if (selectedFilter === "weekly") {
                    const weekStart = new Date(currentDate);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return (
                        transactionDate >= weekStart &&
                        transactionDate <= weekEnd
                    );
                } else if (selectedFilter === "monthly") {
                    return (
                        transactionDate.getMonth() === currentDate.getMonth() &&
                        transactionDate.getFullYear() ===
                            currentDate.getFullYear()
                    );
                } else {
                    return (
                        transactionDate.getFullYear() ===
                        currentDate.getFullYear()
                    );
                }
            });
        }

        if (globalFilterValue) {
            const searchTerm = globalFilterValue.toLowerCase();
            filtered = filtered.filter((transaction) => {
                const transactionIdMatch = transaction.id
                    .toString()
                    .includes(searchTerm);
                const statusMatch = transaction.displayStatus
                    .toLowerCase()
                    .includes(searchTerm);
                const itemMatch = transaction.item
                    .toLowerCase()
                    .includes(searchTerm);

                return transactionIdMatch || statusMatch || itemMatch;
            });
        }

        setFilteredTransactions(filtered);
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const handleShowDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsDialog(true);
    };

    return (
        <PrivateMillerLayout
            activePage="History"
            user={user}
            isRightSidebarOpen={false}
            rightSidebar={<></>}
        >
            <div className="flex flex-col h-full gap-4">
                {/* Header Section */}
                <div className="flex flex-col justify-center gap-4 items-center p-4 md:p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
                    <h1 className="text-2xl sm:text-4xl text-white font-semibold">
                        History
                    </h1>
                    <span className="md:w-1/2">
                        <IconField iconPosition="left">
                            <InputIcon className="">
                                <Search className="text-white size-4 md:size-5" />
                            </InputIcon>
                            <InputText
                                className="py-2 md:py-3 text-sm md:text-base ring-0 w-full rounded-full text-white bg-transparent border border-white placeholder:text-white"
                                value={globalFilterValue}
                                onChange={(e) =>
                                    setGlobalFilterValue(e.target.value)
                                }
                                placeholder="Tap to search"
                                maxLength="8"
                            />
                        </IconField>
                    </span>
                </div>

                {/* Filters Section */}
                <div className="flex items-center rounded-lg gap-2">
                    <Button
                        label="All"
                        className={`text-sm md:text-base p-button-text bg-white ring-0 p-3 ${
                            showAll
                                ? "bg-gradient-to-r from-primary to-primary border-none text-white"
                                : ""
                        }`}
                        onClick={toggleShowAll}
                    />
                    <Dropdown
                        value={selectedFilter}
                        options={displayModeOptions}
                        onChange={(e) => setSelectedFilter(e.value)}
                        className="ring-0 border-0 flex items-center justify-between gap-4 px-4 py-3"
                        pt={{
                            root: "bg-primary rounded-full",
                            input: "text-sm md:text-base text-white p-0",
                            trigger: "text-sm md:text-base text-white h-fit w-fit",
                            panel: "text-sm md:text-base",
                        }}
                        dropdownIcon={
                            <ChevronDown className="size-4 md:size-5 text-white" />
                        }
                        disabled={showAll}
                    />
                    <CustomDateRangeSelector
                        selectedFilter={selectedFilter}
                        onChange={setCurrentDate}
                        disabled={showAll}
                    />
                </div>

                {/* Transactions List */}
                <div className="overflow-hidden">
                    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                        {isLoading ? (
                            <Loader />
                        ) : filteredTransactions.length === 0 ? (
                            <EmptyRecord label="No transactions found." />
                        ) : (
                            filteredTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-2 md:p-4 border-b bg-white rounded-xl mb-2 md:mb-4"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src="/profileAvatar.png"
                                            alt="User"
                                            className="rounded-full mr-2 md:mr-4 size-12 md:size-16"
                                        />
                                        <span>{transaction.description}</span>
                                        <Tag
                                            value={transaction.displayStatus}
                                            severity={
                                                transaction.displayStatus ===
                                                "RETURNED"
                                                    ? "success"
                                                    : transaction.displayStatus ===
                                                      "MILLED"
                                                    ? "info"
                                                    : transaction.displayStatus ===
                                                      "RECEIVED"
                                                    ? "warning"
                                                    : "danger"
                                            }
                                            className="text-sm py-2 px-4 rounded-md font-normal"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-2 md:mr-4">
                                            {transaction.date.toLocaleDateString()}
                                        </span>
                                        <Button
                                            icon="pi pi-ellipsis-v"
                                            className="p-button-text text-sm md:text-base"
                                            onClick={() =>
                                                handleShowDetails(transaction)
                                            }
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Dialog
                visible={showDetailsDialog}
                onHide={() => setShowDetailsDialog(false)}
                header="Transaction Details"
                className="w-full md:w-[32rem]"
            >
                {selectedTransaction && (
                    <div className="space-y-2 md:space-y-4">
                        <div className="grid grid-cols-2 gap-2 md:gap-4">
                            <div className="font-semibold text-sm md:text-base">
                                Transaction ID:
                            </div>
                            <div className="text-sm md:text-base">
                                {selectedTransaction.id}
                            </div>

                            <div className="font-semibold text-sm md:text-base">
                                Item:
                            </div>
                            <div className="text-sm md:text-base">
                                {selectedTransaction.item}
                            </div>

                            <div className="font-semibold text-sm md:text-base">
                                Status:
                            </div>
                            <div>
                                <Tag
                                    value={selectedTransaction.displayStatus}
                                    severity={
                                        selectedTransaction.displayStatus ===
                                        "RETURNED"
                                            ? "success"
                                            : selectedTransaction.displayStatus ===
                                              "MILLED"
                                            ? "info"
                                            : selectedTransaction.displayStatus ===
                                              "RECEIVED"
                                            ? "warning"
                                            : "danger"
                                    }
                                    className="text-sm py-2 px-4 rounded-md font-normal"
                                />
                            </div>

                            <div className="font-semibold text-sm md:text-base">
                                Date:
                            </div>
                            <div className="text-sm md:text-base">
                                {selectedTransaction.date.toLocaleDateString()}
                            </div>

                            <div className="font-semibold text-sm md:text-base">
                                Send Date/Time:
                            </div>
                            <div className="text-sm md:text-base">
                                {selectedTransaction.sendDateTime}
                            </div>

                            <div className="font-semibold text-sm md:text-base">
                                Receive Date/Time:
                            </div>
                            <div className="text-sm md:text-base">
                                {selectedTransaction.receiveDateTime}
                            </div>

                            <div className="font-semibold text-sm md:text-base">
                                From Location:
                            </div>
                            <div className="text-sm md:text-base">
                                {selectedTransaction.fromLocationId}
                            </div>

                            <div className="font-semibold text-sm md:text-base">
                                To Location:
                            </div>
                            <div className="text-sm md:text-base">
                                {selectedTransaction.toLocationId}
                            </div>

                            {/* Add any additional transaction details you want to display */}
                        </div>
                    </div>
                )}
            </Dialog>
        </PrivateMillerLayout>
    );
}

export default History;
