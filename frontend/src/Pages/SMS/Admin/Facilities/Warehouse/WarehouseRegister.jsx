import React, { useState } from "react";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { Wheat } from "lucide-react";

function WarehouseRegister({
  visible,
  onHide,
  onWarehouseRegistered,
  warehouseManagers,
}) {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = React.useRef(null);

  const [facilityType, setFacilityType] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [nfaBranch, setNfaBranch] = useState("Nueva Ecija");
  const [totalCapacity, setTotalCapacity] = useState("");
  const [currentStock, setCurrentStock] = useState("0");
  const [location, setLocation] = useState("Nueva Ecija");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("active");
  const [userId, setUserId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const facilityTypeOptions = [
    { label: "Rice", value: "Rice" },
    { label: "Palay", value: "Palay" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const resetForm = () => {
    setFacilityType("");
    setFacilityName("");
    setNfaBranch("Nueva Ecija");
    setTotalCapacity("");
    setLocation("Nueva Ecija");
    setContactNumber("");
    setEmail("");
    setStatus("active");
    setUserId("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !facilityName ||
      !nfaBranch ||
      !totalCapacity ||
      !location ||
      !contactNumber ||
      !email ||
      !userId
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "All fields are required.",
        life: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    const newWarehouse = {
      facilityName: `${facilityType} ${facilityName}`,
      nfaBranch,
      totalCapacity,
      currentStock,
      location,
      contactNumber,
      email,
      status,
      userId,
    };

    console.log(userId);

    try {
      const res = await fetch(`${apiUrl}/warehouses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWarehouse),
      });

      if (!res.ok) {
        throw new Error("Error adding data");
      }

      const data = await res.json();
      resetForm();
      onWarehouseRegistered(data);
      onHide();
    } catch (error) {
      console.error(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to register warehouse. Please try again.",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Toast ref={toast} />
      <div className="bg-white rounded-lg p-5 w-1/3 shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onHide}
          className="absolute top-5 right-5 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center mb-4">
          <Wheat className="w-6 h-6 mr-2 text-black" />
          <span className="text-md font-semibold">Warehouse Details</span>
        </div>

        {/* Form Content */}
        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="facilityType"
                className="block text-sm font-medium text-gray-700"
              >
                Facility Type
              </label>
              <Dropdown
                id="facilityType"
                value={facilityType}
                options={facilityTypeOptions}
                onChange={(e) => setFacilityType(e.value)}
                placeholder="Select Facility Type"
                className="w-full rounded-md border border-gray-300 ring-0"
              />
            </div>

            <div>
              <label
                htmlFor="facilityName"
                className="block text-sm font-medium text-gray-700"
              >
                Warehouse Name
              </label>
              <InputText
                id="facilityName"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                maxLength={50}
              />
            </div>

            <div>
              <label
                htmlFor="warehouseManager"
                className="block text-sm font-medium text-gray-700"
              >
                Warehouse Manager
              </label>
              <Dropdown
                id="warehouseManager"
                value={userId}
                options={warehouseManagers}
                onChange={(e) => setUserId(e.value)}
                placeholder="Select Manager"
                className="w-full rounded-md border border-gray-300 ring-0"
              />
            </div>

            {/* <div>
                    <label htmlFor="nfaBranch" className="block text-sm font-medium text-gray-700">NFA Branch</label>
                    <InputText
                        id="nfaBranch"
                        value={nfaBranch}
                        onChange={(e) => setNfaBranch(e.target.value)}
                        className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                        maxLength={50}    
                    />
                </div> */}

            <div>
              <label
                htmlFor="totalCapacity"
                className="block text-sm font-medium text-gray-700"
              >
                Capacity(bags)
              </label>
              <InputText
                id="totalCapacity"
                value={totalCapacity}
                type="number"
                onChange={(e) => setTotalCapacity(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                keyfilter="int"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <InputText
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                maxLength={50}
              />
            </div>

            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>
              <InputText
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                maxLength={11}
                keyfilter="int"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <InputText
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium ring-0"
                keyfilter="email"
                maxLength={50}
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <Dropdown
                id="status"
                value={status}
                options={statusOptions}
                onChange={(e) => setStatus(e.value)}
                placeholder="Select Status"
                className="w-full rounded-md border border-gray-300 ring-0"
              />
            </div>

            <Button
              label="Add New"
              disabled={isSubmitting}
              className="col-start-2 row-start-7 bg-primary text-white py-2 rounded-md ring-0"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default WarehouseRegister;
