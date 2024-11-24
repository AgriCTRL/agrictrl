import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import Loader from "@/Components/Loader";

const initialMillingData = {
  palayBatchId: "",
  millerId: "",
  millerType: "Private",
  startDateTime: "",
  endDateTime: "",
  milledQuantityBags: "",
  milledGrossWeight: "",
  milledNetWeight: "",
  millingEfficiency: "",
  status: "In Progress",
};

const ProcessDialog = ({
  visible,
  onHide,
  selectedItem,
  apiUrl,
  toast,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newMillingData, setNewMillingData] = useState(initialMillingData);

  const calculateMillingEfficiency = (milledBags, totalBags) => {
    if (totalBags === 0) return 0;
    return ((milledBags / totalBags) * 100).toFixed(2);
  };

  const calculateWeights = (quantity) => {
    const bagWeight = 50; // Assuming 50kg per bag
    return {
      grossWeight: quantity * bagWeight,
      netWeight: quantity * bagWeight - quantity, // Assuming 1kg per bag is tare weight
    };
  };

  const handleInputChange = (fieldName, value) => {
    // If the input is empty, clear the relevant state without setting it to 0
    if (value === "") {
      if (fieldName === "milledQuantityBags") {
        setNewMillingData((prev) => ({
          ...prev,
          milledQuantityBags: "",
          milledGrossWeight: "",
          milledNetWeight: "",
          millingEfficiency: "",
        }));
      }
      return;
    }

    // Parse the input value
    const parsedValue = parseInt(value);

    // Validate the parsed value
    if (isNaN(parsedValue)) {
      return;
    }

    const quantity = Math.min(parsedValue, selectedItem.quantityBags);

    // Check if the value has been clamped
    if (quantity !== parsedValue) {
      toast.current.show({
        severity: "warn",
        summary: "Input Clamped",
        detail: `Value has been clamped to the maximum of ${selectedItem.quantityBags} bags.`,
        life: 3000,
      });
    }

    const { grossWeight, netWeight } = calculateWeights(quantity);

    if (fieldName === "milledQuantityBags") {
      setNewMillingData((prev) => ({
        ...prev,
        milledQuantityBags: quantity,
        milledGrossWeight: grossWeight,
        milledNetWeight: netWeight,
        millingEfficiency: calculateMillingEfficiency(
          quantity,
          selectedItem.quantityBags
        ),
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!newMillingData.milledQuantityBags) {
      newErrors.milledQuantityBags = "Please enter milled quantity";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter milled quantity",
        life: 3000,
      });
    }

    if (!newMillingData.milledGrossWeight) {
      newErrors.milledGrossWeight = "Please enter milled gross weight";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter milled gross weight",
        life: 3000,
      });
    }

    if (!newMillingData.milledNetWeight) {
      newErrors.milledNetWeight = "Please enter milled net weight";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter milled net weight",
        life: 3000,
      });
    }

    if (!newMillingData.millingEfficiency) {
      newErrors.millingEfficiency = "Please enter milling efficiency";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter milling efficiency",
        life: 3000,
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProcess = async () => {
    if (!validateForm()) return;
    if (!selectedItem) {
      console.error("No item selected");
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 8);

    setIsLoading(true);
    try {
      const { millingBatchId, palayBatchId, toLocationId, millerType } =
        selectedItem;

      // Calculate weights
      const milledQuantityBags = parseInt(newMillingData.milledQuantityBags);
      const milledGrossWeight = parseFloat(newMillingData.milledGrossWeight);
      const milledNetWeight = parseFloat(newMillingData.milledNetWeight);
      const millingEfficiency = calculateMillingEfficiency(
        milledQuantityBags,
        selectedItem.quantityBags
      );

      const updateData = {
        id: millingBatchId,
        palayBatchId,
        millerId: toLocationId,
        millerType,
        endDateTime: currentDate,
        milledGrossWeight,
        milledQuantityBags,
        milledNetWeight,
        millingEfficiency,
        status: "Done",
      };

      const response = await fetch(`${apiUrl}/millingbatches/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update milling batch");
      }

      // Update palay batch status
      const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: palayBatchId,
          status: "Milled",
        }),
      });

      if (!palayResponse.ok) {
        throw new Error("Failed to update palay batch status");
      }

      onSuccess();
      onHide();
      setNewMillingData(initialMillingData);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Milling process completed successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error in handleProcess:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to complete process: ${error.message}`,
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
        header="Complete Milling Process"
        visible={visible}
        onHide={isLoading ? null : onHide}
        className="w-1/3"
      >
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <label className="block mb-2">
              Milled Quantity in Bags (50Kg per Bag)
            </label>
            <InputText
              type="number"
              value={newMillingData.milledQuantityBags}
              onChange={(e) =>
                handleInputChange("milledQuantityBags", e.target.value)
              }
              className="w-full ring-0"
              keyfilter="num"
            />
            {errors.milledQuantityBags && (
              <div className="text-red-500 text-sm mt-1">
                {errors.milledQuantityBags}
              </div>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2">Milled Gross Weight (Kg)</label>
            <InputText
              type="number"
              value={newMillingData.milledGrossWeight}
              onChange={(e) =>
                setNewMillingData((prev) => ({
                  ...prev,
                  milledGrossWeight: e.target.value,
                }))
              }
              className="w-full ring-0"
              keyfilter="num"
            />
            {errors.milledGrossWeight && (
              <div className="text-red-500 text-sm mt-1">
                {errors.milledGrossWeight}
              </div>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2">Milled Net Weight (Kg)</label>
            <InputText
              type="number"
              value={newMillingData.milledNetWeight}
              onChange={(e) =>
                setNewMillingData((prev) => ({
                  ...prev,
                  milledNetWeight: e.target.value,
                }))
              }
              className="w-full ring-0"
              keyfilter="num"
            />
            {errors.milledNetWeight && (
              <div className="text-red-500 text-sm mt-1">
                {errors.milledNetWeight}
              </div>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2">Milling Efficiency (%)</label>
            <InputText
              type="number"
              value={newMillingData.millingEfficiency}
              onChange={(e) =>
                setNewMillingData((prev) => ({
                  ...prev,
                  millingEfficiency: e.target.value,
                }))
              }
              className="w-full ring-0"
              keyfilter="num"
            />
            {errors.millingEfficiency && (
              <div className="text-red-500 text-sm mt-1">
                {errors.millingEfficiency}
              </div>
            )}
          </div>

          <div className="flex justify-between gap-4 mt-4">
            <Button
              label="Cancel"
              className="w-1/2 bg-transparent text-primary border-primary"
              onClick={onHide}
              disabled={isLoading}
            />
            <Button
              label="Complete Process"
              className="w-1/2 bg-primary hover:border-none"
              onClick={handleProcess}
              disabled={isLoading}
              loading={isLoading}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProcessDialog;
