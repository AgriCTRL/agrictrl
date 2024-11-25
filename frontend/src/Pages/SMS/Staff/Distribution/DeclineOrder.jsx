import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

import Loader from "@/Components/Loader";

const DeclineOrder = ({
  visible,
  onHide,
  declineReason,
  onReasonChange,
  selectedOrder,
  onUpdate,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    onHide();
  };

  const handleConfirmDecline = async () => {
    if (!declineReason.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Required field",
        detail: "Please enter a reason for declining",
        life: 3000,
      });
      return;
    }

    setIsLoading(true);
    const order = {
      id: selectedOrder.id,
      status: "Declined",
      remarks: declineReason,
    };
    try {
      const res = await fetch(`${apiUrl}/riceorders/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      if (!res.ok) {
        throw new Error("failed to update rice order status");
      }
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Order declined successfully!",
        life: 3000,
      });
      onUpdate();
      onHide();
    } catch (error) {
      console.error(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to decline order. Please try again.",
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
        header="Decline Order"
        visible={visible}
        className="w-1/3"
        onHide={isLoading ? null : handleCancel}
      >
        <Toast ref={toast} />
        <div className="flex flex-col items-center gap-5">
          <p>Are you sure you want to decline this request?</p>
          <div className="w-full">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reason <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              id="reason"
              name="reason"
              value={declineReason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="w-full ring-0"
              maxLength={250}
            />
          </div>
          <div className="flex justify-between w-full gap-4">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={handleCancel}
              className="w-1/2 bg-transparent text-primary border-primary"
              disabled={isLoading}
            />
            <Button
              label="Confirm Decline"
              icon="pi pi-check"
              onClick={handleConfirmDecline}
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

export default DeclineOrder;
