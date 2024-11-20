import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { Wheat } from "lucide-react";
import { useAuth } from "../../../Authentication/Login/AuthContext";

function PileRegister({ visible, onHide, warehouses, onPileRegistered }) {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const { user } = useAuth();

  const [warehouseId, setWarehouseId] = useState("");
  const [pileNumber, setPileNumber] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { label: "Inactive", value: "0" },
    { label: "Active", value: "1" },
  ];

  useEffect(() => {
    if (warehouses) {
      setWarehouseId(warehouses.id);
    }
  }, [warehouses]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!warehouseId || !pileNumber || !maxCapacity) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Warehouse ID, Pile Number, and Max Capacity are required.",
        life: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    const newPile = {
      warehouseId,
      pileNumber,
      maxCapacity: parseInt(maxCapacity),
      currentQuantity: 0,
      description,
      status,
    };

    try {
      const res = await fetch(`${apiUrl}/piles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPile),
      });

      if (!res.ok) {
        throw new Error("Error adding pile");
      }

      const data = await res.json();
      onPileRegistered(data);
      resetForm();
    } catch (error) {
      console.error(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to register pile. Please try again.",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPileNumber("");
    setMaxCapacity("");
    setDescription("");
    setStatus("0");
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Toast ref={toast} />
      <div className="bg-white rounded-lg p-5 w-1/3 shadow-lg relative">
        <button
          onClick={onHide}
          className="absolute top-5 right-5 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        <div className="flex items-center mb-4">
          <Wheat className="w-6 h-6 mr-2 text-black" />
          <span className="text-md font-semibold">Pile Details</span>
        </div>

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Warehouse
              </label>
              <InputText
                value={warehouses.facilityName}
                className="w-full rounded-md border border-gray-300 ring-0"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pile Number
              </label>
              <InputText
                value={pileNumber}
                onChange={(e) => setPileNumber(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 ring-0"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Capacity (bags)
              </label>
              <InputText
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 ring-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <InputText
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 ring-0"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <Dropdown
                value={status}
                options={statusOptions}
                onChange={(e) => setStatus(e.value)}
                className="w-full rounded-md border border-gray-300 ring-0"
              />
            </div>

            <Button
              label="Add Pile"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-2 rounded-md ring-0"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default PileRegister;