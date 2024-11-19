import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

const ProcessDialog = ({
  visible,
  viewMode,
  newDryingData,
  newMillingData,
  onCancel,
  setNewDryingData,
  setNewMillingData,
  selectedItem,
  onSuccess,
  apiUrl,
  refreshData,
}) => {
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!selectedItem) {
    return null;
  }

  // Use the consolidated quantityBags
  const maxValue = selectedItem.quantityBags;

  const calculateWeights = (quantity) => {
    const bagWeight = 50; // Assuming 50kg per bag
    return {
      grossWeight: quantity * bagWeight,
      netWeight: quantity * bagWeight - quantity, // Assuming 1kg per bag is tare weight
    };
  };

  const calculateMillingEfficiency = (milledBags, totalBags) => {
    if (totalBags === 0) return 0;
    return ((milledBags / totalBags) * 100).toFixed(2);
  };

  const handleInputChange = (fieldName, value) => {
    // If the input is empty, clear the relevant state without setting it to 0
    if (value === "") {
      if (fieldName === "driedQuantityBags") {
        setNewDryingData((prev) => ({
          ...prev,
          driedQuantityBags: "",
          driedGrossWeight: "",
          driedNetWeight: "",
        }));
      } else if (fieldName === "milledQuantityBags") {
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

    const quantity = Math.min(parsedValue, maxValue);

    // Check if the value has been clamped
    if (quantity !== parsedValue) {
      toast.current.show({
        severity: "warn",
        summary: "Input Clamped",
        detail: `Value has been clamped to the maximum of ${maxValue} bags.`,
        life: 3000,
      });
    }

    const { grossWeight, netWeight } = calculateWeights(quantity);

    if (fieldName === "driedQuantityBags") {
      setNewDryingData((prev) => ({
        ...prev,
        driedQuantityBags: quantity,
        driedGrossWeight: grossWeight,
        driedNetWeight: netWeight,
      }));
    } else if (fieldName === "milledQuantityBags") {
      setNewMillingData((prev) => {
        const newMillingData = {
          ...prev,
          milledQuantityBags: quantity,
          milledGrossWeight: grossWeight,
          milledNetWeight: netWeight,
        };
        // Calculate and set milling efficiency using the consolidated quantityBags
        return {
          ...newMillingData,
          millingEfficiency: calculateMillingEfficiency(
            newMillingData.milledQuantityBags,
            selectedItem.quantityBags
          ),
        };
      });
    }
  };

  const handleProcess = async () => {
    if (!validateForm()) return;
    if (!selectedItem) {
      return;
    }
    setIsLoading(true);
    try {
      let updateData;
      let endpoint;

      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours()+8);

      if (viewMode === "drying") {
        updateData = {
          id: selectedItem.dryingBatchId,
          dryerId: selectedItem.toLocationId,
          dryingMethod: newDryingData.dryingMethod,
          endDateTime: currentDate.toISOString(),
          driedQuantityBags: parseInt(newDryingData.driedQuantityBags),
          driedGrossWeight: parseFloat(newDryingData.driedGrossWeight),
          driedNetWeight: parseFloat(newDryingData.driedNetWeight),
          moistureContent: parseFloat(newDryingData.moistureContent),
          status: "Done",
        };
        endpoint = "dryingbatches";
      } else {
        updateData = {
          id: selectedItem.millingBatchId,
          palayBatchId: selectedItem.palayBatchId,
          millerId: selectedItem.toLocationId,
          millerType: selectedItem.millerType,
          endDateTime: currentDate.toISOString(),
          milledGrossWeight: parseFloat(newMillingData.milledGrossWeight),
          milledQuantityBags: parseInt(newMillingData.milledQuantityBags),
          milledNetWeight: parseFloat(newMillingData.milledNetWeight),
          millingEfficiency: parseFloat(newMillingData.millingEfficiency),
          status: "Done",
        };
        endpoint = "millingbatches";
      }

      // update batches
      const response = await fetch(`${apiUrl}/${endpoint}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${viewMode} batch`);
      }

      // Update palay batch status
      const palayResponse = await fetch(`${apiUrl}/palaybatches/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedItem.palayBatchId,
          status: viewMode === "drying" ? "To be Mill" : "Milled",
        }),
      });

      if (!palayResponse.ok) {
        throw new Error("Failed to update palay batch status");
      }

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `${
          viewMode === "drying" ? "Drying" : "Milling"
        } process completed successfully`,
        life: 3000,
      });

      refreshData();
      onSuccess();
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

  const validateForm = () => {
    let newErrors = {};

    if (viewMode === "milling") {
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
        newErrors.milledNetWeight = "Please enter dried net weight";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter dried net weight",
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
    } else if (viewMode === "drying") {
      if (!newDryingData.driedQuantityBags) {
        newErrors.driedQuantityBags = "Please enter dried quantity";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter dried quantity",
          life: 3000,
        });
      }

      if (!newDryingData.driedGrossWeight) {
        newErrors.driedGrossWeight = "Please enter dried gross weight";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter dried gross weight",
          life: 3000,
        });
      }

      if (!newDryingData.driedNetWeight) {
        newErrors.driedNetWeight = "Please enter dried net weight";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter dried net weight",
          life: 3000,
        });
      }

      if (!newDryingData.moistureContent) {
        newErrors.moistureContent = "Please enter moisture content";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter moisture content",
          life: 3000,
        });
      }

      if (!newDryingData.dryingMethod) {
        newErrors.dryingMethod = "Please enter drying method";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter drying method",
          life: 3000,
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Dialog
      header={`Complete ${viewMode} Process`}
      visible={visible}
      onHide={isLoading ? null : onCancel}
      className="w-1/3"
    >
      <Toast ref={toast} />
      <div className="flex flex-col gap-4">
        {viewMode === "drying" ? (
          <>
            <div className="w-full">
              <label className="block mb-2">
                Dried Quantity in Bags (50Kg per bag)
              </label>
              <InputText
                type="number"
                min={0}
                max={selectedItem.quantityBags}
                value={newDryingData.driedQuantityBags}
                onChange={(e) =>
                  handleInputChange("driedQuantityBags", e.target.value)
                }
                className="w-full ring-0"
                keyfilter="num"
              />
              {errors.driedQuantityBags && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.driedQuantityBags}
                </div>
              )}
            </div>

            <div className="w-full">
              <label className="block mb-2">Dried Gross Weight (Kg)</label>
              <InputText
                type="number"
                value={newDryingData.driedGrossWeight}
                onChange={(e) =>
                  setNewDryingData((prev) => ({
                    ...prev,
                    driedGrossWeight: e.target.value,
                  }))
                }
                className="w-full ring-0"
                keyfilter="num"
              />
              {errors.driedGrossWeight && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.driedGrossWeight}
                </div>
              )}
            </div>

            <div className="w-full">
              <label className="block mb-2">Dried Net Weight (Kg)</label>
              <InputText
                type="number"
                value={newDryingData.driedNetWeight}
                onChange={(e) =>
                  setNewDryingData((prev) => ({
                    ...prev,
                    driedNetWeight: e.target.value,
                  }))
                }
                className="w-full ring-0"
                keyfilter="num"
              />
              {errors.driedNetWeight && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.driedNetWeight}
                </div>
              )}
            </div>

            <div className="w-full">
              <label className="block mb-2">Moisture Content (%)</label>
              <InputText
                type="number"
                value={newDryingData.moistureContent}
                onChange={(e) =>
                  setNewDryingData((prev) => ({
                    ...prev,
                    moistureContent: e.target.value,
                  }))
                }
                className="w-full ring-0"
                keyfilter="num"
              />
              {errors.moistureContent && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.moistureContent}
                </div>
              )}
            </div>

            <div className="w-full">
              <label className="block mb-2">Drying Method</label>
              <Dropdown
                value={newDryingData.dryingMethod}
                options={[
                  { label: "Sun Dry", value: "Sun Dry" },
                  { label: "Machine Dry", value: "Machine Dry" },
                ]}
                onChange={(e) =>
                  setNewDryingData((prev) => ({
                    ...prev,
                    dryingMethod: e.value,
                  }))
                }
                className="w-full"
                placeholder="Select Drying Method"
              />
              {errors.dryingMethod && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.dryingMethod}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
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
          </>
        )}

        <div className="flex justify-between gap-4 mt-4">
          <Button
            label="Cancel"
            className="w-1/2 bg-transparent text-primary border-primary"
            onClick={onCancel}
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
  );
};

export default ProcessDialog;
