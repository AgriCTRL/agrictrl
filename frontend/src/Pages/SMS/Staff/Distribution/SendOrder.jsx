import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

const KILOS_PER_BAG = 50; // Constants for conversion

const SendOrder = ({
  visible,
  onHide,
  pilesData,
  selectedOrder,
  user,
  onUpdate,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPiles, setSelectedPiles] = useState([]);
  const [pileQuantities, setPileQuantities] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [palayBatchAllocations, setPalayBatchAllocations] = useState([]);

  useEffect(() => {
    if (selectedOrder && pilesData.length > 0) {
      const requiredQuantity = selectedOrder.riceQuantityBags;
      const piles = [];
      const quantities = [];
      const allocations = [];
      let remainingQuantity = requiredQuantity;
      let calculatedTotalCost = 0;

      for (const pile of pilesData) {
        if (remainingQuantity <= 0) break;
        if (pile.type !== "Rice" || pile.status !== "Active") continue;
  
        // Sort palay batches by date (oldest first)
        const sortedBatches = pile.palayBatches?.sort(
          (a, b) => new Date(a.dateBought) - new Date(b.dateBought)
        ) || [];
  
        let quantityFromPile = 0;
        const pileBatchAllocations = [];
  
        for (const batch of sortedBatches) {
          if (remainingQuantity <= 0) break;
          
          const quantityFromBatch = Math.min(
            batch.currentQuantityBags,
            remainingQuantity
          );
  
          if (quantityFromBatch > 0) {
            pileBatchAllocations.push({
              palayBatchId: batch.id,
              quantity: quantityFromBatch
            });
            
            quantityFromPile += quantityFromBatch;
            remainingQuantity -= quantityFromBatch;
            
            // Correct cost calculation: bags -> kg -> total cost
            const kilos = quantityFromBatch * KILOS_PER_BAG; // Convert bags to kilos
            const batchCost = kilos * (pile.price || 0); // Multiply kilos by price per kilo
            calculatedTotalCost += batchCost;
          }
        }
  
        if (quantityFromPile > 0) {
          piles.push(pile);
          quantities.push(quantityFromPile);
          allocations.push(pileBatchAllocations);
        }
      }

      setSelectedPiles(piles);
      setPileQuantities(quantities);
      setPalayBatchAllocations(allocations);
      setTotalCost(calculatedTotalCost);

      if (piles.length > 0) {
        setSendOrderData((prev) => ({
          ...prev,
          pileId: piles[0].id,
        }));
      }
    }
  }, [selectedOrder, pilesData]);

  useEffect(() => {
    if (selectedOrder) {
      setSendOrderData((prev) => ({
        ...prev,
        riceQuantityBags: selectedOrder.riceQuantityBags,
        dropOffLocation: selectedOrder.dropOffLocation,
        description: selectedOrder.description || "",
        riceOrderId: selectedOrder.id,
        riceRecipientId: selectedOrder.riceRecipientId,
      }));
    }
  }, [selectedOrder]);

  const [sendOrderData, setSendOrderData] = useState({
    warehouseId: null,
    riceQuantityBags: "",
    dropOffLocation: "",
    description: "",
    transportedBy: "",
    transporterDescription: "",
    remarks: "",
    riceOrderId: null,
    riceRecipientId: null,
    pileId: null,
    totalCost: 0,
  });

  const calculatePileCost = (quantity, pricePerUnit) => {
    return quantity * (pricePerUnit || 0);
  };

  const renderPilesInfo = () => {
    return selectedPiles.map((pile, pileIndex) => (
      <div key={pile.id} className="mb-2 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-medium mb-2">Pile {pile.pileNumber}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Pile ID: {pile.id}</div>
          <div>Quantity to Send: {pileQuantities[pileIndex]} bags</div>
          <div>Price per Unit: ₱{pile.price?.toLocaleString() || "0"}</div>
          <div>
            Subtotal: ₱
            {calculatePileCost(
              pileQuantities[pileIndex],
              pile.price
            ).toLocaleString()}
          </div>
          <div>Available Quantity: {pile.currentQuantity} bags</div>
          <div>Type: {pile.type}</div>
        </div>
        <div className="mt-2">
          <h4 className="font-medium text-sm mb-1">Palay Batch Allocations:</h4>
          <div className="pl-4">
            {palayBatchAllocations[pileIndex]?.map((allocation) => (
              <div key={allocation.palayBatchId} className="text-sm">
                Batch {allocation.palayBatchId}: {allocation.quantity} bags
              </div>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  const handleInputChange = (e) => {
    const value = e.target?.value ?? e;
    const name = e.target?.name;

    setSendOrderData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConfirmSend = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const warehousesResponse = await fetch(`${apiUrl}/warehouses`);
      if (!warehousesResponse.ok) {
        throw new Error("Failed to fetch warehouses");
      }
      const warehouses = await warehousesResponse.json();

      if (!selectedPiles.length) {
        throw new Error("No piles selected");
      }
      if (!selectedOrder) {
        throw new Error("No order selected");
      }
      if (!user || !user.id) {
        throw new Error("User information is missing");
      }

      const promises = [];

      // Create transaction body with total cost
      const transactionBody = {
        item: "Rice",
        pileId: selectedPiles[0].id,
        senderId: user.id,
        sendDateTime: new Date().toISOString(),
        fromLocationType: "Warehouse",
        fromLocationId: selectedPiles[0].warehouseId,
        transporterName: sendOrderData.transportedBy,
        transporterDesc: sendOrderData.transporterDescription,
        receiverId: selectedOrder.riceRecipientId,
        receiveDateTime: "0",
        toLocationType: "Distribution",
        toLocationId: selectedOrder.riceRecipientId,
        status: "Pending",
        remarks: `Sending from ${selectedPiles.length} piles: ${
          sendOrderData.remarks || ""
        }`,
        totalCost: totalCost,
      };

      promises.push(
        fetch(`${apiUrl}/transactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionBody),
        })
      );

      // Create pile transactions for each allocation
      selectedPiles.forEach((pile, pileIndex) => {
        const pileAllocations = palayBatchAllocations[pileIndex];

        pileAllocations.forEach((allocation) => {
          const pileTransactionBody = {
            palayBatchId: allocation.palayBatchId,
            pileId: pile.id,
            transactionType: "OUT",
            quantityBags: allocation.quantity,
            transactionDate: new Date().toISOString(),
            performedBy: user.id,
            notes: `Order ID: ${selectedOrder.id}, Transported by: ${sendOrderData.transportedBy}`,
          };

          promises.push(
            fetch(`${apiUrl}/piletransactions`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(pileTransactionBody),
            })
          );
        });

        // Update warehouse stock
        const warehouse = warehouses.find((w) => w.id === pile.warehouseId);
        if (!warehouse) {
          throw new Error(`Warehouse not found for pile ${pile.id}`);
        }

        const warehouseBody = {
          id: pile.warehouseId,
          currentStock: warehouse.currentStock - pileQuantities[pileIndex],
        };

        promises.push(
          fetch(`${apiUrl}/warehouses/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(warehouseBody),
          })
        );
      });

      // Update rice order status and total cost
      const riceOrderBody = {
        id: selectedOrder.id,
        status: "In Transit",
        pileId: selectedPiles.map((p) => p.id).join(","),
        totalCost: `₱${totalCost.toLocaleString()}`,
      };

      promises.push(
        fetch(`${apiUrl}/riceorders/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(riceOrderBody),
        })
      );

      const results = await Promise.all(promises);
      const failedRequests = results.filter((response) => !response.ok);

      if (failedRequests.length > 0) {
        throw new Error("One or more requests failed");
      }

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Rice order sent successfully!",
        life: 3000,
      });

      onUpdate();
      handleClose();
    } catch (error) {
      console.error("Error in handleConfirmSend:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to process rice order: ${error.message}`,
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetSendOrderData();
    setTotalCost(0);
    onHide();
  };

  const resetSendOrderData = () => {
    setSendOrderData({
      warehouseId: null,
      riceQuantityBags: "",
      dropOffLocation: "",
      description: "",
      transportedBy: "",
      transporterDescription: "",
      remarks: "",
      riceOrderId: null,
      riceRecipientId: null,
      pileId: null,
      totalCost: 0,
    });
  };

  const validateForm = () => {
    const errors = [];

    if (!sendOrderData.pileId) {
      errors.push("Please select a pile");
    }

    if (!sendOrderData.transportedBy) {
      errors.push("Please enter transporter name");
    }

    if (!sendOrderData.transporterDescription) {
      errors.push("Please enter transporter description");
    }

    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.current.show({
          severity: "warn",
          summary: "Required Field",
          detail: error,
          life: 3000,
        });
      });
      return false;
    }

    return true;
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Send Rice"
        visible={visible}
        className="w-1/3"
        onHide={isLoading ? null : handleClose}
      >
        <div className="flex flex-col gap-2 h-full">
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Piles
            </label>
            {renderPilesInfo()}
            <div className="mt-2 p-2 bg-primary/10 rounded-lg">
              <p className="font-medium text-right">
                Total Cost: ₱{totalCost.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="quantityInBags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Total Quantity to Send
            </label>
            <InputText
              id="quantityInBags"
              value={selectedOrder?.riceQuantityBags || ""}
              disabled
              className="w-full focus:ring-0 bg-gray-50"
              keyfilter="num"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Drop-off Location
            </label>
            <InputText
              id="location"
              value={sendOrderData.dropOffLocation}
              disabled
              className="w-full focus:ring-0 bg-gray-50"
              maxLength={50}
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Order Description
            </label>
            <InputTextarea
              id="description"
              value={sendOrderData.description}
              disabled
              className="w-full ring-0 bg-gray-50"
              maxLength={250}
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="transportedBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Transported By <span className="text-red-500">*</span>
            </label>
            <InputText
              id="transportedBy"
              name="transportedBy"
              value={sendOrderData.transportedBy}
              onChange={handleInputChange}
              placeholder="Enter transporter name"
              className="w-full focus:ring-0"
              maxLength={50}
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="transporterDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Transporter Description <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              id="transporterDescription"
              name="transporterDescription"
              value={sendOrderData.transporterDescription}
              onChange={handleInputChange}
              placeholder="Enter transporter description"
              className="w-full ring-0"
              maxLength={250}
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="remarks"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Remarks
            </label>
            <InputTextarea
              id="remarks"
              name="remarks"
              value={sendOrderData.remarks}
              onChange={handleInputChange}
              placeholder="Enter remarks"
              className="w-full ring-0"
              maxLength={250}
            />
          </div>

          <div className="flex justify-between w-full gap-4 mt-5">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={handleClose}
              className="w-1/2 bg-transparent text-primary border-primary"
              disabled={isLoading}
            />
            <Button
              label="Send Rice"
              icon="pi pi-check"
              onClick={handleConfirmSend}
              className="w-1/2 bg-primary hover:border-none"
              disabled={isLoading}
              loading={isLoading}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SendOrder;
