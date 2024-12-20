import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import Loader from "@/Components/Loader";
import { ProcessingReturnWSR } from "../../../../Components/Pdf/pdfProcessingWSR";

const initialTransactionData = {
    item: "Rice",
    itemId: "",
    senderId: "",
    fromLocationType: "Miller",
    fromLocationId: 0,
    transporterId: "",
    transporterName: "",
    transporterDesc: "",
    receiverId: "",
    receiveDateTime: "0",
    toLocationType: "Warehouse",
    toLocationId: "",
    toLocationName: "",
    status: "Pending",
    remarks: "",
};

const ReturnDialog = ({
    visible,
    onHide,
    selectedItem,
    warehouses,
    millerData,
    user,
    apiUrl,
    toast,
    onSuccess,
}) => {
    const [newTransactionData, setNewTransactionData] = useState(
        initialTransactionData
    );
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [transporters, setTransporters] = useState([]);
    const [wsr, setWsr] = useState("");
    const [viewMode, setViewMode] = useState("milling");

    const filteredWarehouses = warehouses
        .filter((warehouse) => {
            const requiredQuantity = parseInt(
                selectedItem?.milledQuantityBags || 0
            );
            const hasEnoughCapacity =
                warehouse.status === "active" &&
                warehouse.totalCapacity - warehouse.currentStock >=
                    requiredQuantity;

            const warehouseName = warehouse.facilityName.toLowerCase();
            const isCorrectType = warehouseName.includes("rice");
            return hasEnoughCapacity && isCorrectType;
        })
        .map((warehouse) => ({
            label: `${warehouse.facilityName} (Available: ${
                warehouse.totalCapacity - warehouse.currentStock
            } bags)`,
            name: warehouse.facilityName,
            value: warehouse.id,
        }));

    useEffect(() => {
        if (visible && newTransactionData.toLocationId) {
            fetchTransporters();
        }
    }, [visible, newTransactionData.toLocationId]);

    const fetchTransporters = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/transporters?status=active&transporterType=Private&userId=${user.id}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch transporters");
            }

            const data = await response.json();
            const transporterOptions = data.map((transporter) => ({
                label: `${transporter.transporterName} | ${transporter.plateNumber} | ${transporter.description}`,
                value: transporter.id,
                name: transporter.transporterName,
                description: transporter.description,
            }));

            setTransporters(transporterOptions);
        } catch (error) {
            console.error("Error fetching transporters:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch transporters",
                life: 3000,
            });
        }
    };

    const handleReturn = async () => {
        if (!validateForm()) return;
        if (!selectedItem || !newTransactionData.toLocationId) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please select a warehouse",
                life: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            // 1. Update palay batch with new status
            const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedItem.palayBatchId,
                    currentlyAt: newTransactionData.toLocationName,
                    wsr: wsr,
                }),
            });

            if (!palayResponse.ok) {
                if (palayResponse.status === 400) {
                    const errorData = await palayResponse.json();

                    toast.current.show({
                        severity: "error",
                        summary: "Conflict",
                        detail: errorData.message,
                        life: 3000,
                    });
                    return;
                }
                throw new Error("Failed to update palay batch");
            }

            const selectedMiller = millerData.find(
                (miller) => miller.id === selectedItem.toLocationId
            );

            // 2. Update miller
            if (!selectedMiller) {
                throw new Error("Miller not found");
            }

            const initialQuantity = parseInt(
                selectedItem.driedQuantityBags || selectedItem.palayQuantityBags
            );

            const newProcessing = Math.max(
                0,
                parseInt(selectedMiller.processing) - initialQuantity
            );

            const millerUpdateResponse = await fetch(
                `${apiUrl}/millers/update`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: selectedItem.toLocationId,
                        processing: newProcessing,
                        status: "inactive",
                    }),
                }
            );

            if (!millerUpdateResponse.ok) {
                throw new Error("Failed to update miller processing quantity");
            }

            // 3. Update current transaction to Completed
            const updateTransactionResponse = await fetch(
                `${apiUrl}/transactions/update`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: selectedItem.transactionId,
                        status: "Completed",
                    }),
                }
            );

            if (!updateTransactionResponse.ok) {
                throw new Error("Failed to update current transaction");
            }

            // 4. Create new return transaction
            const newTransaction = {
                ...newTransactionData,
                item: "Rice",
                itemId: selectedItem.palayBatchId,
                fromLocationType: "Miller",
                fromLocationId: selectedItem.toLocationId,
                toLocationType: "Warehouse",
                senderId: user.id,
                receiverId: "0",
                status: "Pending",
                receiveDateTime: "0",
            };

            const createTransactionResponse = await fetch(
                `${apiUrl}/transactions`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newTransaction),
                }
            );

            if (!createTransactionResponse.ok) {
                throw new Error("Failed to create return transaction");
            }

            // 5. Update warehouse stock
            const targetWarehouse = warehouses.find(
                (warehouse) => warehouse.id === newTransactionData.toLocationId
            );

            if (!targetWarehouse) {
                throw new Error("Target warehouse not found");
            }

            const quantityToAdd = parseInt(selectedItem.quantityBags);
            const newStock =
                quantityToAdd + parseInt(targetWarehouse.currentStock);

            const warehouseResponse = await fetch(
                `${apiUrl}/warehouses/update`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: newTransactionData.toLocationId,
                        currentStock: newStock,
                    }),
                }
            );

            if (!warehouseResponse.ok) {
                throw new Error("Failed to update warehouse stock");
            }

            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Return process initiated successfully",
                life: 3000,
            });

            generatePDF();
            onSuccess();
            handleHide();
        } catch (error) {
            console.error("Error in handleReturn:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Failed to process return: ${error.message}`,
                life: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleHide = () => {
        setNewTransactionData(initialTransactionData);
        setErrors({});
        onHide();
    };

    const validateForm = () => {
        let newErrors = {};

        if (!wsr) {
            newErrors.wsr = "Please enter WSR";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please enter WSR",
                life: 3000,
            });
        }

        if (!newTransactionData.toLocationId) {
            newErrors.toLocationId = "Please select a facility";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please select a facility",
                life: 3000,
            });
        }

        if (!newTransactionData.transporterId) {
            newErrors.transporterId = "Please select a transporter";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please select a transporter",
                life: 3000,
            });
        }

        if (!newTransactionData.remarks.trim()) {
            newErrors.remarks = "Remarks are required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Remarks are required",
                life: 3000,
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const customDialogHeader = (
        <div className="flex justify-between">
            <h3 className="text-base md:text-md font-semibold text-black">Return Rice</h3>
            <div className="flex flex-col items-center gap-2">
                {selectedItem && (
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="wsr"
                            className="block text-sm md:text-xl font-semibold text-black"
                        >
                            WSR:
                        </label>

                        <InputText
                            id="wsr"
                            name="wsr"
                            value={wsr}
                            onChange={(e) => setWsr(e.target.value)}
                            className="w-40 ring-0 border-primary text-base md:text-xl h-8 font-semibold text-black"
                            keyfilter="int"
                            maxLength={8}
                        />
                    </div>
                )}
                {errors.wsr && (
                    <p className="text-red-500 text-xs md:text-xs">{errors.wsr}</p>
                )}
            </div>
        </div>
    );

    const preparePDFData = (selectedItem) => {
        // Initial Data Mapping
        const initialData = {
            category:
                selectedItem.fullPalayBatchData?.palaySupplier?.category ||
                "N/A",
            farmerName:
                selectedItem.fullPalayBatchData?.palaySupplier?.farmerName ||
                "N/A",
            contactNumber:
                selectedItem.fullPalayBatchData?.palaySupplier?.contactNumber ||
                "N/A",
            farmStreet: selectedItem.fullPalayBatchData?.farm?.street || "N/A",
            farmBarangay:
                selectedItem.fullPalayBatchData?.farm?.barangay || "N/A",
            farmCityTown:
                selectedItem.fullPalayBatchData?.farm?.cityTown || "N/A",
            farmProvince:
                selectedItem.fullPalayBatchData?.farm?.province || "N/A",
            farmRegion: selectedItem.fullPalayBatchData?.farm?.region || "N/A",
            palayId: selectedItem.palayBatchId,
            dateBought: selectedItem.fullPalayBatchData?.dateBought,
            palayVariety: selectedItem.fullPalayBatchData?.varietyCode,
            qualityType: selectedItem.fullPalayBatchData?.qualityType,
            quantityBags: selectedItem.palayQuantityBags,
            grossWeight: selectedItem.grossWeight,
            netWeight: selectedItem.netWeight,
            transactionId: selectedItem.transactionId,
            fromLocationType: selectedItem.from,
            fromLocationId: selectedItem.toLocationId,
            toLocationType: "Warehouse",
            toLocationId: newTransactionData.toLocationId,
            sendDateTime: selectedItem.requestDate,
            wsr: wsr,
        };

        // Processed Data Mapping
        const processedData = {
            batchId: selectedItem.millingBatchId,
            facilityName: selectedItem.location,
            startDateTime:
                selectedItem.fullProcessingBatchData?.millingBatch
                    ?.startDateTime,
            endDateTime:
                selectedItem.fullProcessingBatchData?.millingBatch?.endDateTime,
            processedQuantityBags: selectedItem.quantityBags,
            millingEfficiency:
                selectedItem.fullProcessingBatchData?.millingBatch
                    ?.millingEfficiency,
            processedNetWeight: selectedItem.netWeight,
        };

        return { initialData, processedData };
    };

    const generatePDF = () => {
        try {
            const { initialData, processedData } = preparePDFData(
                selectedItem,
                viewMode
            );
            const pdf = ProcessingReturnWSR(
                initialData,
                processedData,
                viewMode
            );
            pdf.save(`WSR-${wsr}.pdf`);
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "PDF Generation Error",
                detail: error.message,
                life: 3000,
            });
        }
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
                    <Loader />
                </div>
            )}
            <Dialog
                header={customDialogHeader}
                visible={visible}
                onHide={isLoading ? null : handleHide}
                className="w-1/3"
            >
                <div className="flex flex-col w-full gap-2 md:gap-4">
                    <div className="w-full">
                        <label className="block mb-2">Warehouse</label>
                        <Dropdown
                            value={newTransactionData.toLocationId}
                            options={filteredWarehouses}
                            onChange={(e) => {
                                setNewTransactionData((prev) => ({
                                    ...prev,
                                    toLocationId: e.value,
                                    toLocationName: filteredWarehouses.find(
                                        (w) => w.value === e.value
                                    )?.name,
                                }));
                            }}
                            placeholder="Select a warehouse"
                            className="w-full ring-0 text-sm md:text-base"
                        />
                        {errors.toLocationId && (
                            <div className="text-red-500 text-xs md:text-sm mt-1">
                                {errors.toLocationId}
                            </div>
                        )}
                    </div>

                    <div className="w-full">
                        <label className="block mb-2 text-xs md:text-sm font-medium text-black">Transported By</label>
                        <Dropdown
                            value={newTransactionData.transporterId}
                            options={transporters}
                            onChange={(e) => {
                                const selectedTransporter = transporters.find(
                                    (t) => t.value === e.value
                                );
                                setNewTransactionData((prev) => ({
                                    ...prev,
                                    transporterId: e.value,
                                    transporterName: selectedTransporter.name,
                                    transporterDesc:
                                        selectedTransporter.description,
                                }));
                            }}
                            placeholder="Select a transporter"
                            className="w-full ring-0 text-sm md:text-base"
                            disabled={!newTransactionData.toLocationId}
                        />
                        {errors.transporterId && (
                            <div className="text-red-500 text-xs md:text-sm mt-1">
                                {errors.transporterId}
                            </div>
                        )}
                    </div>

                    <div className="w-full">
                        <label className="block mb-2 text-xs md:text-sm font-medium text-black">Remarks</label>
                        <InputTextarea
                            value={newTransactionData.remarks}
                            onChange={(e) =>
                                setNewTransactionData((prev) => ({
                                    ...prev,
                                    remarks: e.target.value,
                                }))
                            }
                            className="w-full ring-0 text-sm md:text-base"
                            rows={3}
                            maxLength={250}
                        />
                        {errors.remarks && (
                            <div className="text-red-500 text-xs md:text-sm mt-1">
                                {errors.remarks}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between gap-2 md:gap-4 mt-2 md:mt-4">
                        <Button
                            label="Cancel"
                            className="w-1/2 bg-transparent text-primary border-primary text-sm md:text-base"
                            disabled={isLoading}
                            onClick={handleHide}
                        />
                        <Button
                            label="Confirm Return"
                            className="w-1/2 bg-primary hover:border-none text-sm md:text-base"
                            onClick={handleReturn}
                            disabled={isLoading}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ReturnDialog;
