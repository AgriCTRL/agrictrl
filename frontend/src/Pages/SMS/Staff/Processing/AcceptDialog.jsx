import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { useAuth } from "../../../Authentication/Login/AuthContext";
import Loader from "@/Components/Loader";

const AcceptDialog = ({
  visible,
  viewMode,
  onCancel,
  selectedItem,
  refreshData,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleAccept = async () => {
    if (!selectedItem) {
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 8);

    setIsLoading(true);
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
      const newPalayStatus = viewMode === "drying" ? "In Drying" : "In Milling";
      const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedItem.palayBatchId,
          status: newPalayStatus,
        }),
      });

      if (!palayResponse.ok) {
        throw new Error("Failed to update palay batch status");
      }

      // 3. Create new processing batch with correct data
      if (viewMode === "drying") {
        const dryingBatchData = {
          palayBatchId: selectedItem.palayBatchId,
          dryerId: selectedItem.toLocationId,
          startDateTime: "0",
          endDateTime: "0",
          dryingMethod: "0",
          driedQuantityBags: "0",
          driedGrossWeight: "0",
          driedNetWeight: "0",
          moistureContent: "0",
          status: "In Progress",
        };

        const dryingResponse = await fetch(`${apiUrl}/dryingbatches`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dryingBatchData),
        });

        if (!dryingResponse.ok) {
          throw new Error("Failed to create drying batch");
        }
      } else {
        // Get all milling batches and check if one exists for this palay batch
        const millingBatchesResponse = await fetch(`${apiUrl}/millingbatches`);
        const millingBatches = await millingBatchesResponse.json();

        const existingMillingBatch = millingBatches.find(
          (batch) => batch.palayBatchId === selectedItem.palayBatchId
        );

        if (!existingMillingBatch) {
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
        } else {
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
                startDateTime: new Date().toISOString(),
              }),
            }
          );

          if (!updateMillingResponse.ok) {
            throw new Error("Failed to update existing milling batch");
          }
          console.log(
            "Updated existing milling batch with current startDateTime"
          );
        }
      }

      // 4. Refresh data and close dialog
      onCancel();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `${
          viewMode === "drying" ? "Drying" : "Milling"
        } process started successfully`,
        life: 3000,
      });
      refreshData();
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
      <Toast ref={toast} />
      <Dialog
        header={`Receive ${viewMode}`}
        visible={visible}
        onHide={isLoading ? null : onCancel}
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
              onClick={onCancel}
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
