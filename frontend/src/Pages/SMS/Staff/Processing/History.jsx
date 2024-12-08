import React, { useState, useEffect } from "react";
import StaffLayout from "@/Layouts/Staff/StaffLayout";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { useAuth } from "../../../Authentication/Login/AuthContext";
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
    <div className="flex items-center bg-primary text-white rounded-full">
      <Button
        icon={<ChevronLeft size={18} />}
        onClick={() => navigate(-1)}
        className="p-button-text text-white ring-0 text-sm"
        disabled={disabled}
      />
      <span className="font">{formatDateRange()}</span>
      <Button
        icon={<ChevronRight size={18} />}
        onClick={() => navigate(1)}
        className="p-button-text text-white ring-0 text-sm"
        disabled={disabled}
      />
    </div>
  );
}

function ProcessingStaffHistory() {
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
      // Fetch inventory transactions for Processing Staff
      const response = await fetch(
        `${apiUrl}/inventory?status=Completed&toLocationType=Dryer&toLocationType=Miller&millerType=In House`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();

      // Transform transactions to match our display requirements
      const transformedTransactions = data.items.map((item) => {
        const transaction = item.transaction;
        const palayBatch = item.palayBatch;

        return {
          id: transaction.id,
          item: transaction.item,
          description: `${transaction.item} Batch ${palayBatch.id}`,
          date: new Date(transaction.receiveDateTime),
          displayStatus: getDisplayStatus(transaction),
          fromLocation: transaction.fromLocationId,
          toLocation: transaction.toLocationId,
          toLocationType: transaction.toLocationType,
          fullTransaction: item,
        };
      });

      setAllTransactions(transformedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayStatus = (transaction) => {
    // Simply return the destination type
    if (transaction.toLocationType === "Dryer") {
      return "DRYING";
    } else if (transaction.toLocationType === "Miller") {
      return "MILLING";
    }

    return "UNKNOWN";
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
          return transactionDate >= weekStart && transactionDate <= weekEnd;
        } else if (selectedFilter === "monthly") {
          return (
            transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear()
          );
        } else {
          return transactionDate.getFullYear() === currentDate.getFullYear();
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
        const itemMatch = transaction.item.toLowerCase().includes(searchTerm);
        const descriptionMatch = transaction.description
          .toLowerCase()
          .includes(searchTerm);

        return (
          transactionIdMatch || statusMatch || itemMatch || descriptionMatch
        );
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
    <StaffLayout
      activePage="History"
      user={user}
      isRightSidebarOpen={false}
      rightSidebar={<></>}
    >
      <div className="flex flex-col h-full gap-4">
        {/* Header Section */}
        <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
          <h1 className="text-2xl sm:text-4xl text-white font-semibold">
            Processing Staff History
          </h1>
          <span className="w-1/2">
            <IconField iconPosition="left">
              <InputIcon className="">
                <Search className="text-white" size={18} />
              </InputIcon>
              <InputText
                className="ring-0 w-full rounded-full text-white bg-transparent border border-white placeholder:text-white"
                value={globalFilterValue}
                onChange={(e) => setGlobalFilterValue(e.target.value)}
                placeholder="Tap to search"
              />
            </IconField>
          </span>
        </div>

        {/* Filters Section */}
        <div className="flex items-center rounded-lg gap-2">
          <Button
            label="All"
            className={`p-button-text bg-white ring-0  ${
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
            className="rounded-full bg-primary ring-0 border-0 custom-dropdown text-sm px-2"
            style={{ color: "white" }}
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
                  className="flex items-center justify-between p-4 border-b bg-white rounded-xl mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src="/profileAvatar.png"
                      alt="User"
                      className="rounded-full mr-4 h-16 w-16"
                    />
                    <span>{transaction.description}</span>
                    <Tag
                      value={transaction.displayStatus}
                      severity={
                        transaction.displayStatus === "DRYING"
                          ? "warning"
                          : transaction.displayStatus === "MILLING"
                          ? "success"
                          : "danger"
                      }
                      className="ml-4"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4">
                      {transaction.date.toLocaleDateString()}
                    </span>
                    <Button
                      icon="pi pi-ellipsis-v"
                      className="p-button-text"
                      onClick={() => handleShowDetails(transaction)}
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="font-semibold">Transaction ID:</div>
              <div>{selectedTransaction.id}</div>

              <div className="font-semibold">Item:</div>
              <div>{selectedTransaction.item}</div>

              <div className="font-semibold">Process:</div>
              <div>
                <Tag
                  value={selectedTransaction.displayStatus}
                  severity={
                    selectedTransaction.displayStatus === "DRYING"
                      ? "warning"
                      : selectedTransaction.displayStatus === "MILLING"
                      ? "success"
                      : "danger"
                  }
                />
              </div>

              <div className="font-semibold">Date:</div>
              <div>{selectedTransaction.date.toLocaleDateString()}</div>

              <div className="font-semibold">From Location:</div>
              <div>{selectedTransaction.fromLocation}</div>

              <div className="font-semibold">To Location:</div>
              <div>{selectedTransaction.toLocation}</div>

              {/* Additional Details from Full Transaction */}
              {selectedTransaction.fullTransaction && (
                <>
                  <div className="font-semibold">Batch Details:</div>
                  <div>
                    Quantity:{" "}
                    {
                      selectedTransaction.fullTransaction.palayBatch
                        .quantityBags
                    }{" "}
                    bags
                  </div>

                  <div className="font-semibold">Quality:</div>
                  <div>
                    Moisture:{" "}
                    {
                      selectedTransaction.fullTransaction.palayBatch.qualitySpec
                        .moistureContent
                    }
                    %
                    <br />
                    Purity:{" "}
                    {
                      selectedTransaction.fullTransaction.palayBatch.qualitySpec
                        .purity
                    }
                    %
                    <br />
                    Damaged:{" "}
                    {
                      selectedTransaction.fullTransaction.palayBatch.qualitySpec
                        .damaged
                    }
                    %
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </StaffLayout>
  );
}

export default ProcessingStaffHistory;
