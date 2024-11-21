import React, { useState, useEffect, useRef, useMemo } from "react";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";

import { WSR } from "../../../../Components/Pdf/pdfWarehouseStockReceipt";

import { Wheat, UserIcon, CheckIcon, TruckIcon } from "lucide-react";

import { Stepper, Step, StepLabel } from "@mui/material";

import { useAuth } from "../../../Authentication/Login/AuthContext";
import { FarmerInfoForm } from "./PalayRegisterForm/FarmerInfoForm";
import { PalayInfoForm } from "./PalayRegisterForm/PalayInfoForm";
import { LogisticsInfoForm } from "./PalayRegisterForm/LogisticsInfoForm";

const initialPalayData = {
  // Farmer Info
  category: "individual",
  farmerName: "",
  numOfFarmer: "",
  birthDate: null,
  gender: "",
  email: "",
  contactNumber: "",
  // House Address
  palaySupplierRegion: "",
  palaySupplierProvince: "",
  palaySupplierCityTown: "",
  palaySupplierBarangay: "",
  palaySupplierStreet: "",
  // Palay Info
  wsr: "",
  wsi: "",
  dateBought: "",
  age: "",
  buyingStationName: "",
  buyingStationLoc: "",
  quantityBags: "",
  grossWeight: "",
  netWeight: "",
  qualityType: "",
  moistureContent: "",
  purity: "",
  damaged: "",
  varietyCode: "",
  price: "",
  // Farm Origin
  farmRegion: "",
  farmProvince: "",
  farmCityTown: "",
  farmBarangay: "",
  farmStreet: "",
  farmSize: "",
  plantedDate: null,
  harvestedDate: null,
  estimatedCapital: "",
  currentlyAt: "",
  weighedBy: "",
  correctedBy: "",
  classifiedBy: "",
  status: "",
};

const initialTransactionData = {
  item: "Palay",
  itemId: "",
  senderId: "",
  fromLocationType: "Procurement",
  fromLocationId: 0,
  transporterName: "",
  transporterDesc: "asd",
  receiverId: 0,
  receiveDateTime: "0",
  toLocationType: "",
  toLocationId: "",
  status: "Pending",
  remarks: "",
  palayBatch: "",
};

function PalayRegister({ visible, onHide, onPalayRegistered, currentWSR }) {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const toast = useRef(null);
  const { user } = useAuth();

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [warehouseData, setWarehouseData] = useState([]);
  const [dryerData, setDryerData] = useState([]);
  const [palayData, setPalayData] = useState({
    // Farmer Info
    category: "individual",
    farmerName: "",
    numOfFarmer: "",
    birthDate: null,
    gender: "",
    email: "",
    contactNumber: "",
    // House Address
    palaySupplierId: "",
    palaySupplierRegion: "",
    palaySupplierProvince: "",
    palaySupplierCityTown: "",
    palaySupplierBarangay: "",
    palaySupplierStreet: "",
    // Palay Info
    dateBought: "",
    wsr: '',
    wsi: '',
    age: "0",
    buyingStationName: "",
    buyingStationLoc: "",
    quantityBags: "",
    grossWeight: "",
    netWeight: "",
    qualityType: "",
    moistureContent: "",
    purity: "",
    damaged: "",
    varietyCode: "",
    price: "",
    // Farm Origin
    farmRegion: "",
    farmProvince: "",
    farmCityTown: "",
    farmBarangay: "",
    farmStreet: "",
    farmSize: "",
    plantedDate: null,
    harvestedDate: null,
    estimatedCapital: "",
    currentlyAt: "",
    weighedBy: "",
    correctedBy: "",
    classifiedBy: "",
    status: "",
  });
  const [transactionData, setTransactionData] = useState({
    item: "Palay",
    itemId: "",
    senderId: user.id,
    fromLocationType: "Procurement",
    fromLocationId: 0,
    transporterName: "",
    transporterDesc: "asd",
    receiverId: 0,
    receiveDateTime: "0",
    toLocationType: "",
    toLocationId: "",
    status: "Pending",
    remarks: "",
    palayBatch: "",
  });

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sameAsHomeAddress, setSameAsHomeAddress] = useState(false);

  const steps = [
    { label: "Farmer", icon: <UserIcon /> },
    { label: "Palay Info", icon: <CheckIcon /> },
    { label: "Logistics", icon: <TruckIcon /> },
  ];

  const locationOptions = useMemo(() => {
    const facilityData =
      palayData.qualityType === "Wet" ? dryerData : warehouseData;

    return facilityData
      .filter((facility) => {
        // Different capacity field names for warehouses vs dryers
        const maxCapacity =
          palayData.qualityType === "Wet"
            ? facility.capacity
            : facility.totalCapacity;
        const currentOccupancy =
          palayData.qualityType === "Wet"
            ? facility.processing
            : facility.currentStock;

        const canAccommodate =
          facility.status === "active" &&
          maxCapacity - currentOccupancy >=
            parseInt(palayData.quantityBags || 0);

        if (palayData.qualityType === "Wet") {
          return canAccommodate; // For dryers, we just check capacity
        } else {
          // For warehouses, we also check if it's a palay warehouse
          return (
            canAccommodate &&
            facility.facilityName.toLowerCase().includes("palay")
          );
        }
      })
      .map((facility) => ({
        label: `${
          palayData.qualityType === "Wet"
            ? facility.dryerName
            : facility.facilityName
        } (Available: ${
          (palayData.qualityType === "Wet"
            ? facility.capacity
            : facility.totalCapacity) -
          (palayData.qualityType === "Wet"
            ? facility.processing
            : facility.currentStock)
        } bags)`,
        name:
          palayData.qualityType === "Wet"
            ? facility.dryerName
            : facility.facilityName,
        value: facility.id,
      }));
  }, [palayData.qualityType, palayData.quantityBags, warehouseData, dryerData]);


  useEffect(() => {
    if (visible) {
      setActiveStep(0);
      setPalayData(prev => ({
        ...prev,
        wsr: currentWSR,
      }));
    }
  }, [visible]);

  useEffect(() => {
    fetchWarehouseData();
    fetchDryerData();
  }, []);

  const refreshData = () => {
    fetchWarehouseData();
  };

  const fetchWarehouseData = async () => {
    try {
      const res = await fetch(`${apiUrl}/warehouses`);
      if (!res.ok) {
        throw new Error("Failed to fetch warehouse data");
      }
      const data = await res.json();
      setWarehouseData(data);
    } catch (error) {
      console.log(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch warehouse data",
        life: 3000,
      });
    }
  };

  const fetchDryerData = async () => {
    try {
      const res = await fetch(`${apiUrl}/dryers`);
      if (!res.ok) {
        throw new Error("Failed to fetch dryer data");
      }
      const data = await res.json();
      setDryerData(data);
    } catch (error) {
      console.log(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch dryer data",
        life: 3000,
      });
    }
  };

  const handlePalayInputChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values
    if (typeof value === "string" && value.includes("-")) {
      return;
    }

    setPalayData((prevState) => {
      let updates = {
        ...prevState,
        [name]: value,
      };

      // Format the estimatedCapital field with commas
      if (name === "estimatedCapital") {
        const numericValue = value.replace(/,/g, "");
        if (!isNaN(numericValue)) {
          // Only format if it's a valid number
          updates[name] = parseInt(numericValue, 10).toLocaleString();
        }
      }

      if (sameAsHomeAddress && name.startsWith("palaySupplier")) {
        const farmField = name.replace("palaySupplier", "farm");
        updates[farmField] = value;
      }

      if (name === "quantityBags") {
        // Reset specific transaction fields
        setTransactionData((prev) => ({
          ...prev,
          toLocationId: "",
        }));
        updates.currentlyAt = "";
      }

      return updates;
    });
  };

  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQualityTypeInputChange = (e) => {
    const { name, value } = e.target;

    setPalayData((prevState) => ({
      ...prevState,
      [name]: value,
      status:
        value === "Wet"
          ? "To be Dry"
          : value === "Dry"
          ? "To be Mill"
          : prevState.status,
      moistureContent:
        value === "Wet" ? 20 : value === "Dry" ? 7 : prevState.moistureContent,
      purity: value === "Wet" ? 97 : value === "Dry" ? 99 : prevState.purity,
      damaged: value === "Wet" ? 4 : value === "Dry" ? 1 : prevState.damaged,
    }));

    // Reset location related fields when quality type changes
    setTransactionData((prevState) => ({
      ...prevState,
      toLocationType: value === "Wet" ? "Dryer" : "Warehouse",
      toLocationId: "", // Reset selected location
    }));

    // Reset currentlyAt in palayData
    setPalayData((prevState) => ({
      ...prevState,
      currentlyAt: "",
    }));
  };

  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAsHomeAddress(checked);

    if (checked) {
      // If checked, copy the home/office address values to farm address
      setPalayData((prev) => ({
        ...prev,
        farmRegion: prev.palaySupplierRegion,
        farmProvince: prev.palaySupplierProvince,
        farmCityTown: prev.palaySupplierCityTown,
        farmBarangay: prev.palaySupplierBarangay,
        farmStreet: prev.palaySupplierStreet,
      }));
    } else {
      // If unchecked, reset farm address fields
      setPalayData((prev) => ({
        ...prev,
        farmRegion: "",
        farmProvince: "",
        farmCityTown: "",
        farmBarangay: "",
        farmStreet: "",
      }));
    }
  };

  const handleLocationId = (e) => {
    const selectedOption = locationOptions.find(
      (option) => option.value === e.value
    );

    setTransactionData((prevState) => ({
      ...prevState,
      toLocationId: e.value,
    }));

    setPalayData((prevState) => ({
      ...prevState,
      currentlyAt: selectedOption.name,
    }));
  };

  const handleNext = () => {
    const isValid = validateForm(activeStep);

    if (isValid && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = validateForm(activeStep);
    if (!isValid) return;

    setIsLoading(true);
    try {
      // Prepare the request body based on whether we have a selected supplier
      const requestBody = {
        ...palayData,
        dateBought: palayData.dateBought
          ? palayData.dateBought.toISOString().split("T")[0]
          : null,
        birthDate: palayData.birthDate
          ? palayData.birthDate.toISOString().split("T")[0]
          : null,
        plantedDate: palayData.plantedDate
          ? palayData.plantedDate.toISOString().split("T")[0]
          : null,
        harvestedDate: palayData.harvestedDate
          ? palayData.harvestedDate.toISOString().split("T")[0]
          : null,
      };

      // If we have a selected supplier, only send the ID
      if (selectedSupplier) {
        requestBody.palaySupplierId = selectedSupplier.id;
        // Remove supplier-related fields that we don't need to send
        delete requestBody.farmerName;
        delete requestBody.palaySupplierRegion;
        delete requestBody.palaySupplierProvince;
        delete requestBody.palaySupplierCityTown;
        delete requestBody.palaySupplierBarangay;
        delete requestBody.palaySupplierStreet;
        delete requestBody.category;
        delete requestBody.numOfFarmer;
        delete requestBody.contactNumber;
        delete requestBody.email;
        delete requestBody.birthDate;
        delete requestBody.gender;
      }
      // Step 1: Create palay data first
      const palayResponse = await fetch(`${apiUrl}/palaybatches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!palayResponse.ok) {
        throw new Error("Failed to submit palay data");
      }

      const palayResult = await palayResponse.json();
      const palayId = palayResult.id;

      // Step 2: Create the transaction with the palay ID
      const transactionResponse = await fetch(`${apiUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...transactionData,
          itemId: palayId,
        }),
      });

      if (!transactionResponse.ok) {
        throw new Error("Failed to submit transaction data");
      }

      const transactionResult = await transactionResponse.json();
      const transactionId = transactionResult.id;

      // Step 3: Update facility stock based on quality type
      if (palayData.qualityType === "Wet") {
        // Update dryer processing count
        const targetDryer = dryerData.find(
          (dryer) => dryer.id === transactionData.toLocationId
        );

        if (!targetDryer) {
          throw new Error("Target dryer not found");
        }

        const newProcessing =
          Number(palayData.quantityBags) + Number(targetDryer.processing);

        const dryerResponse = await fetch(`${apiUrl}/dryers/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: transactionData.toLocationId,
            processing: newProcessing,
          }),
        });

        if (!dryerResponse.ok) {
          throw new Error("Failed to update dryer processing count");
        }
      } else {
        // Update warehouse stock
        const targetWarehouse = warehouseData.find(
          (warehouse) => warehouse.id === transactionData.toLocationId
        );

        if (!targetWarehouse) {
          throw new Error("Target warehouse not found");
        }

        const newStock =
          Number(palayData.quantityBags) + Number(targetWarehouse.currentStock);

        const warehouseResponse = await fetch(`${apiUrl}/warehouses/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: transactionData.toLocationId,
            currentStock: newStock,
          }),
        });

        if (!warehouseResponse.ok) {
          throw new Error("Failed to update warehouse stock");
        }
      }

      // Generate WSR and handle success
      const receiptData = {
        ...palayData,
        ...transactionData,
        palayId,
        transactionId,
      };
      const pdf = WSR(receiptData);
      pdf.save(`WSR-${palayId}.pdf`);

      // Reset states and show success message
      setPalayData(initialPalayData);
      setTransactionData(initialTransactionData);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Records successfully created",
        life: 3000,
      });

      onPalayRegistered(palayResult);
      onHide();

      refreshData();
    } catch (error) {
      console.error("Error:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to create records",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const renderFarmerInfo = () => (
    <FarmerInfoForm
      palayData={palayData}
      handlePalayInputChange={handlePalayInputChange}
      errors={errors}
      onSupplierSelect={handleSupplierSelect}
    />
  );

  const renderPalayInfo = () => (
    <PalayInfoForm
      palayData={palayData}
      handlePalayInputChange={handlePalayInputChange}
      handleQualityTypeInputChange={handleQualityTypeInputChange}
      errors={errors}
      handleSameAddressChange={handleSameAddressChange}
      sameAsHomeAddress={sameAsHomeAddress}
    />
  );

  const renderLogistics = () => (
    <LogisticsInfoForm
      palayData={palayData}
      transactionData={transactionData}
      handlePalayInputChange={handlePalayInputChange}
      handleTransactionInputChange={handleTransactionInputChange}
      handleLocationId={handleLocationId}
      locationOptions={locationOptions}
      errors={errors}
    />
  );

  const CustomStepIcon = ({ icon, active }) => {
    return (
      <div
        className={`flex items-center justify-center -translate-y-2
                            w-10 h-10 rounded-full transition-all
                            ${
                              active
                                ? "bg-primary text-white scale-110"
                                : "bg-white text-primary border-2 border-primary"
                            }`}
      >
        {React.cloneElement(icon, {
          size: active ? 26 : 20,
          className: "transition-all",
        })}
      </div>
    );
  };

  const customDialogHeader = (
    <div className="flex justify-between">
      <div className="flex items-center space-x-2">
        <Wheat className="text-black" />
        <h3 className="text-md font-semibold text-black">Buy Palay</h3>
      </div>
      <div className="flex items-center">
        <label
          htmlFor="wsr"
          className="block text-xl font-semibold text-black"
        >
          WSR:
        </label>
        <InputText
          id="wsr"
          name="wsr"
          value={palayData.wsr}
          onChange={handlePalayInputChange}
          className="w-32 ring-0 border-none text-xl font-semibold text-black"
          keyfilter="int"
          maxLength={8}
        />
      </div>
    </div>
  );

  const validateForm = (step) => {
    let newErrors = {};
    if (step === 0) {
      // Farmer Info Validation
      if (!palayData.category.trim()) {
        newErrors.category = "Category is required";
      }
      if (!palayData.farmerName.trim()) {
        newErrors.farmerName = "Farmer name is required";
      }
      if (palayData.category === "individual") {
        if (!palayData.birthDate) {
          newErrors.birthDate = "Birth date is required";
        }
        if (!palayData.gender) {
          newErrors.gender = "Gender is required";
        }
      } else {
        if (!palayData.numOfFarmer.trim()) {
          newErrors.numOfFarmer = "Number of farmers is required";
        } else if (parseInt(palayData.numOfFarmer) === 0) {
          newErrors.numOfFarmer = "Number of farmers cannot be 0";
        }
      }
      if (!palayData.email) {
        newErrors.email = "Email is required";
      } else {
        const emailRegex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(palayData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
      }
      if (!palayData.contactNumber.trim()) {
        newErrors.contactNumber = "Contact number is required";
      } else if (!/^\d{10,}$/.test(palayData.contactNumber)) {
        newErrors.contactNumber = "Invalid contact number format";
      }
      if (!palayData.palaySupplierRegion) {
        newErrors.palaySupplierRegion = "Region is required";
      }
      if (
        !palayData.palaySupplierProvince &&
        palayData.palaySupplierRegion != "National Capital Region"
      ) {
        newErrors.palaySupplierProvince = "Province is required";
      }
      if (!palayData.palaySupplierCityTown) {
        newErrors.palaySupplierCityTown = "City/Town is required";
      }
      if (!palayData.palaySupplierBarangay) {
        newErrors.palaySupplierBarangay = "Barangay is required";
      }
      if (!palayData.palaySupplierStreet) {
        newErrors.palaySupplierStreet = "Street is required";
      }
    } else if (step === 1) {
      // Palay Info Validation
      if (!palayData.varietyCode) {
        newErrors.varietyCode = "Variety Code is required";
      }
      if (!palayData.price) {
        newErrors.price = "Price is required";
      } else if (parseFloat(palayData.price) === 0) {
        newErrors.price = "Price cannot be 0";
      }
      if (!palayData.dateBought) {
        newErrors.dateBought = "Date bought is required";
      }
      if (!palayData.quantityBags.trim()) {
        newErrors.quantityBags = "Quantity in bags is required";
      } else if (parseInt(palayData.quantityBags) === 0) {
        newErrors.quantityBags = "Quantity cannot be 0";
      }
      if (!palayData.grossWeight.trim()) {
        newErrors.grossWeight = "Gross weight is required";
      } else if (parseFloat(palayData.grossWeight) === 0) {
        newErrors.grossWeight = "Gross weight cannot be 0";
      }
      if (!palayData.netWeight.trim()) {
        newErrors.netWeight = "Net weight is required";
      } else if (parseFloat(palayData.netWeight) === 0) {
        newErrors.netWeight = "Net weight cannot be 0";
      }
      if (!palayData.qualityType) {
        newErrors.qualityType = "Quality type is required";
      }
      if (!palayData.moistureContent) {
        newErrors.moistureContent = "Moisture Content is required";
      } else if (parseFloat(palayData.moistureContent) === 0) {
        newErrors.moistureContent = "Moisture Content cannot be 0";
      } else if (parseFloat(palayData.moistureContent) > 100) {
        newErrors.moistureContent = "Moisture Content cannot exceed 100%";
      }
      if (!palayData.purity) {
        newErrors.purity = "Purity is required";
      } else if (parseFloat(palayData.purity) === 0) {
        newErrors.purity = "Purity cannot be 0";
      } else if (parseFloat(palayData.purity) > 100) {
        newErrors.purity = "Purity cannot exceed 100%";
      }
      if (!palayData.damaged) {
        newErrors.damaged = "Damaged is required";
      } else if (parseFloat(palayData.damaged) === 0) {
        newErrors.damaged = "Damaged cannot be 0";
      } else if (parseFloat(palayData.damaged) > 100) {
        newErrors.damaged = "Damaged cannot exceed 100%";
      }
      if (!palayData.farmSize) {
        newErrors.farmSize = "Farm size is required";
      } else if (parseFloat(palayData.farmSize) === 0) {
        newErrors.farmSize = "Farm size cannot be 0";
      } else if (parseFloat(palayData.farmSize) > 7) {
        newErrors.farmSize = "Farm size must not be more than 7";
      }
      if (!palayData.plantedDate) {
        newErrors.plantedDate = "Date planted is required";
      } else {
        const plantedYear = new Date(palayData.plantedDate).getFullYear();
        const currentYear = new Date().getFullYear();
        if (plantedYear > currentYear) {
          newErrors.plantedDate =
            "Date planted must not be more than current year";
        }
      }
      if (!palayData.harvestedDate) {
        newErrors.harvestedDate = "Date harvested is required";
      }

      // Farm Origin Validation
      if (!palayData.farmRegion) {
        newErrors.farmRegion = "Farm region is required";
      }
      if (
        !palayData.farmProvince &&
        palayData.farmRegion != "National Capital Region"
      ) {
        newErrors.farmProvince = "Farm province is required";
      }
      if (!palayData.farmCityTown) {
        newErrors.farmCityTown = "Farm city/town is required";
      }
      if (!palayData.farmBarangay) {
        newErrors.farmBarangay = "Farm barangay is required";
      }
      if (!palayData.farmStreet) {
        newErrors.farmStreet = "Farm street is required";
      }

      if (!palayData.estimatedCapital) {
        newErrors.estimatedCapital = "Estimated Capital is required";
      } else if (parseFloat(palayData.estimatedCapital) === 0) {
        newErrors.estimatedCapital = "Estimated Capital cannot be 0";
      }
    } else if (step === 2) {
      // Logistics Validation
      if (!transactionData.transporterName) {
        newErrors.transporterName = "Transporter is required";
      }
      if (!transactionData.transporterDesc) {
        newErrors.transporterDesc = "Transporter Description is required";
      }
      if (!transactionData.toLocationType) {
        newErrors.toLocationType = "Location type is required";
      }
      if (!transactionData.toLocationId) {
        newErrors.toLocationId = "Destination is required";
      }
      if (!palayData.weighedBy) {
        newErrors.weighedBy = "Weigher is required";
      }
      if (!palayData.correctedBy) {
        newErrors.correctedBy = "Checker is required";
      }
      if (!palayData.classifiedBy) {
        newErrors.classifiedBy = "classifiedBy is required";
      }
      if (!transactionData.remarks) {
        newErrors.remarks = "Remarks is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Dialog
      visible={visible}
      onHide={isLoading ? null : onHide}
      header={customDialogHeader}
      modal
      style={{ minWidth: "60vw", maxWidth: "60vw" }}
      footer={
        <div className="flex justify-between">
          <Button
            label="Previous"
            onClick={handlePrevious}
            disabled={activeStep === 0 || isLoading}
            className="bg-primary w-1/2"
          />
          <Button
            label={activeStep === steps.length - 1 ? "Buy Palay" : "Next"}
            onClick={
              activeStep === steps.length - 1 ? handleSubmit : handleNext
            }
            disabled={isLoading}
            className="bg-primary w-1/2"
            loading={isLoading}
          />
        </div>
      }
    >
      <div className="w-full px-4 pt-5 ">
        <Toast ref={toast} />
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(({ label, icon }, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={({ active }) => (
                  <CustomStepIcon icon={icon} active={active} />
                )}
              >
                <div
                  className={`text-base text-primary -translate-y-4 ${
                    index === activeStep ? "font-semibold" : ""
                  }`}
                >
                  {label}
                </div>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className="">
        {activeStep === 0 && renderFarmerInfo()}
        {activeStep === 1 && renderPalayInfo()}
        {activeStep === 2 && renderLogistics()}
      </div>
    </Dialog>
  );
}

export default PalayRegister;
