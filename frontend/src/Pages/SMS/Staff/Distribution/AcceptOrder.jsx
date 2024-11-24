import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import Loader from "@/Components/Loader";

const AcceptOrder = ({ visible, onHide, selectedOrder, onUpdate }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmAccept = async () => {
    setIsLoading(true);
    const order = {
      id: selectedOrder.id,
      status: "Accepted",
      isAccepted: true,
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
        detail: "Order accepted successfully!",
        life: 3000,
      });
      onUpdate();
    } catch (error) {
      console.error(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to accept order. Please try again.",
        life: 3000,
      });
    } finally {
      onHide();
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
        header="Accept Order"
        visible={visible}
        className="w-1/3"
        onHide={isLoading ? null : onHide}
      >
        <div className="flex flex-col items-center">
          <p className="mb-10">
            Are you sure you want to receive this request?
          </p>
          <div className="flex justify-between w-full gap-4">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={onHide}
              className="w-1/2 bg-transparent text-primary border-primary"
              disabled={isLoading}
            />
            <Button
              label="Confirm Accept"
              icon="pi pi-check"
              onClick={handleConfirmAccept}
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

export default AcceptOrder;
