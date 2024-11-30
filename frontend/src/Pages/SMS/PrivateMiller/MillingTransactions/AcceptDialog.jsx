import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import Loader from "@/Components/Loader";

const AcceptDialog = ({
  visible,
  onHide,
  selectedItem,
  toast,
  apiUrl,
  user,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    if (!selectedItem) {
      console.error("No item selected");
      return;
    }
    setIsLoading(true);
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 8);

    try {
      // 1. Update transaction status to "Received"
      const transactionResponse = await fetch(`${apiUrl}/transactions/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedItem.transactionId,
          status: "Received",
          receiveDateTime: currentDate.toISOString(),
          receiverId: user.id,
        }),
      });

      if (!transactionResponse.ok) {
        throw new Error("Failed to update transaction");
      }

      // 2. Update palay batch status
      const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedItem.palayBatchId,
          status: "In Milling",
        }),
      });

      if (!palayResponse.ok) {
        throw new Error("Failed to update palay batch status");
      }

      // 3. Check if milling batch already exists for this palay batch
      const millingBatchesResponse = await fetch(`${apiUrl}/millingbatches`);
      const millingBatches = await millingBatchesResponse.json();

      const existingMillingBatch = millingBatches.find(
        (batch) => batch.palayBatchId === selectedItem.palayBatchId
      );

      if (existingMillingBatch) {
        // Update existing milling batch with current startDateTime
        const updateMillingResponse = await fetch(
          `${apiUrl}/millingbatches/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: existingMillingBatch.id,
              startDateTime: currentDate.toISOString(),
              status: "In Progress",
            }),
          }
        );

        if (!updateMillingResponse.ok) {
          throw new Error("Failed to update existing milling batch");
        }

        const updateDryingResponse = await fetch(
          `${apiUrl}/dryingbatches/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: existingMillingBatch.dryingBatchId,
              status: "Completed",
            }),
          }
        );

        if (!updateDryingResponse.ok) {
          throw new Error("Failed to update existing milling batch");
        }
      } else {
        // Create new milling batch if none exists
        const millingBatchData = {
          dryingBatchId: "0",
          palayBatchId: selectedItem.palayBatchId,
          millerId: selectedItem.toLocationId,
          millerType: "0",
          startDateTime: "0",
          endDateTime: "0",
          milledQuantityBags: "0",
          milledNetWeight: "0",
          millingEfficiency: "0",
          status: "In Progress",
        };

        const millingResponse = await fetch(`${apiUrl}/millingbatches`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(millingBatchData),
        });

        if (!millingResponse.ok) {
          throw new Error("Failed to create milling batch");
        }
      }

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Milling process started successfully",
        life: 3000,
      });

      onSuccess();
    } catch (error) {
      console.error("Error in handleAccept:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to process acceptance: ${error.message}`,
        life: 3000,
      });
    } finally {
      setIsLoading(false);
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
        header="Receive Palay"
        visible={visible}
        onHide={isLoading ? null : onHide}
        className="w-1/3"
      >
        <div className="flex flex-col items-center">
          <p className="mb-10">
            Are you sure you want to receive this request?
          </p>
          <div className="flex justify-between w-full gap-4">
            <Button
              label="Cancel"
              className="w-1/2 bg-transparent text-primary border-primary"
              onClick={onHide}
              disabled={isLoading}
            />
            <Button
              label="Confirm Receive"
              className="w-1/2 bg-primary hover:border-none"
              onClick={handleAccept}
              disabled={isLoading}
              loading={isLoading}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AcceptDialog;
