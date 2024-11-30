import React, { useRef, useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { CheckCircle, AlertCircle } from "lucide-react";

import Loader from "@/Components/Loader";

const ReceiveRice = ({
  visible,
  onHide,
  selectedItem = {},
  onAcceptSuccess,
  user,
  userWarehouse,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [availablePiles, setAvailablePiles] = useState([]);
  const [selectedPile, setSelectedPile] = useState(null);

  useEffect(() => {
    if (visible) {
      fetchAvailablePiles();
    }
  }, [visible]);

  const fetchAvailablePiles = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/piles/warehouse/${userWarehouse.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch piles");
      const { data } = await response.json();

      // Filter active piles that can store the complete batch
      const compatiblePiles = data.filter(
        (pile) =>
          pile.status === "Active" &&
          pile.type === "Rice" &&
          pile.maxCapacity - pile.currentQuantity >=
            (selectedItem?.quantityBags || 0)
      );

      setAvailablePiles(compatiblePiles);
      setSelectedPile(null);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch piles",
        life: 3000,
      });
    }
  };

  const handleReceiveRice = async () => {
    if (!selectedPile) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please select a pile",
        life: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create pile transaction for storing rice
      await fetch(`${apiUrl}/piletransactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          palayBatchId: selectedItem.id,
          pileId: selectedPile.id,
          transactionType: "IN",
          quantityBags: selectedItem.quantityBags,
          performedBy: user.id,
          notes: `Received from milling batch ${selectedItem?.millingBatchId}`,
        }),
      });

      // // Create rice-milling batch junction record
      // await fetch(`${apiUrl}/ricemillingbatches`, {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //         pileId: selectedPile.id,
      //         millingBatchId: selectedItem?.millingBatchId,
      //         riceQuantityBags: selectedItem.quantityBags,
      //         riceGrossWeight: selectedItem.grossWeight,
      //         riceNetWeight: selectedItem.netWeight
      //     })
      // });

      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 8);

      // Update transaction status
      if (selectedItem?.transactionId) {
        await fetch(`${apiUrl}/transactions/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedItem.transactionId,
            status: "Received",
            receiveDateTime: currentDate.toISOString(),
            receiverId: user?.id,
          }),
        });
      }

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Rice successfully stored in pile",
        life: 3000,
      });

      onAcceptSuccess();
      onHide();
    } catch (error) {
      console.error("Error in handleReceiveRice:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to process rice storage",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pileOptionTemplate = (pile) => {
    if (!pile) return null;
    const availableBags = pile.maxCapacity - pile.currentQuantity;
    return (
      <div className="flex justify-between gap-4">
        <span>{`Pile ${pile.pileNumber}`}</span>
        <span className="text-gray-500">{`(available: ${availableBags} bags)`}</span>
      </div>
    );
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}
      <Toast ref={toast} />
      <Dialog
        header="Receive Rice"
        visible={visible}
        onHide={isLoading ? null : onHide}
        className="w-1/3"
        closeOnEscape={!isLoading}
      >
        <div className="flex flex-col items-center gap-4">
          <CheckCircle size={32} className="text-primary" />
          <p> Receive {selectedItem ? selectedItem.quantityBags : "0"} bags of Rice </p>
          
          <div className="w-full">
            <label className="block mb-2">Select Pile</label>
            <Dropdown
              value={selectedPile}
              options={availablePiles}
              onChange={(e) => setSelectedPile(e.value)}
              optionLabel="pileNumber"
              placeholder="Select a Pile"
              className="w-full"
              itemTemplate={pileOptionTemplate}
            />
          </div>

          <div className="flex justify-between w-full mt-5">
            <Button
              label="Confirm Receive"
              className="w-full bg-primary hover:border-none"
              onClick={handleReceiveRice}
              disabled={isLoading || !selectedPile}
              loading={isLoading}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ReceiveRice;
