import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const LogisticsInfoForm = ({
  palayData,
  transactionData,
  handlePalayInputChange,
  handleTransactionInputChange,
  handleLocationId,
  locationOptions,
  errors,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [transporters, setTransporters] = useState([]);

  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        const transporterRes = await fetch(`${apiUrl}/transporters?status=active&transporterType=In House`);
        const transporterData = await transporterRes.json();
        const transporterOptions = transporterData.map(transporter => ({
          label: `${transporter.transporterName} | ${transporter.plateNumber} | ${transporter.description}`,
          value: transporter.id,
          name: transporter.transporterName
        }));
        setTransporters(transporterOptions);
      } catch (error) {
        console.error('Error fetching transporters:', error);
      }
    };
  
    fetchTransporters();
  }, []);

  const handleTransporterChange = (e) => {
    const selectedTransporter = transporters.find(t => t.value === e.value);
    handleTransactionInputChange({
      target: {
        name: 'transporterId',
        value: e.value
      }
    });
    handleTransactionInputChange({
      target: {
        name: 'transporterName',
        value: selectedTransporter.name
      }
    });
  };

  return (
    <div className="flex flex-col h-full w-full gap-4">
      <div className="flex w-full gap-4">
        <div className="w-full">
          <label
            htmlFor="buyingStationName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bought at
          </label>
          <InputText
            id="buyingStationName"
            name="buyingStationName"
            value={palayData.buyingStationName}
            onChange={handlePalayInputChange}
            placeholder="Enter buying station name"
            className="ring-0 w-full placeholder:text-gray-700"
            maxLength={50}
          />
          {errors.buyingStationName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.buyingStationName}
            </p>
          )}
        </div>

        <div className="w-full">
          <label
            htmlFor="buyingStationLoc"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <InputText
            id="buyingStationLoc"
            name="buyingStationLoc"
            value={palayData.buyingStationLoc}
            onChange={handlePalayInputChange}
            placeholder="Enter buying station location"
            className="w-full focus:ring-0"
            maxLength={50}
          />
          {errors.buyingStationLoc && (
            <p className="text-red-500 text-xs mt-1">
              {errors.buyingStationLoc}
            </p>
          )}
        </div>
      </div>

      <div className="w-full">
        <label
          htmlFor="transporterId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Transported by
        </label>
        <Dropdown
          id="transporterId"
          name="transporterId"
          value={transactionData.transporterId}
          options={transporters}
          onChange={handleTransporterChange}
          placeholder="Select transporter"
          className="w-full focus:ring-0"
        />
        {errors.transporterId && (
          <p className="text-red-500 text-xs mt-1">{errors.transporterId}</p>
        )}
      </div>

      {/* <div className="w-full">
                <label htmlFor="transporterDesc" className="block text-sm font-medium text-gray-700 mb-1">Transport Description</label>
                <InputTextarea
                    id="transporterDesc"
                    name="transporterDesc"
                    value={transactionData.transporterDesc}
                    onChange={handleTransactionInputChange}  
                    placeholder="Enter description"
                    className="w-full ring-0"
                    maxLength={250}
                />
                {errors.transporterDesc && <p className="text-red-500 text-xs mt-1">{errors.transporterDesc}</p>}
            </div> */}

      <div className="w-full gap-4">
        <label
          htmlFor="sendToWarehouse"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Send to
        </label>
        <div className="flex flex-row w-full gap-4">
          <div className="flex flex-col w-full">
            <Dropdown
              id="toLocationType"
              name="toLocationType"
              value={transactionData.toLocationType}
              options={[
                { label: "Warehouse", value: "Warehouse" },
                { label: "Dryer", value: "Dryer" },
              ]}
              disabled={true}
              className="ring-0 w-full placeholder:text-gray-400"
            />
            {errors.toLocationType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.toLocationType}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <Dropdown
              id="facility"
              name="facility"
              value={transactionData.toLocationId}
              options={locationOptions}
              onChange={handleLocationId}
              placeholder="Select facility"
              className="ring-0 w-full placeholder:text-gray-400"
            />
            {errors.toLocationId && (
              <p className="text-red-500 text-xs mt-1">{errors.toLocationId}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="w-full">
          <label
            htmlFor="weighedBy"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Weighed By
          </label>
          <InputText
            id="weighedBy"
            name="weighedBy"
            value={palayData.weighedBy}
            onChange={handlePalayInputChange}
            className="w-full ring-0"
            maxLength={250}
          />
          {errors.weighedBy && (
            <p className="text-red-500 text-xs mt-1">{errors.weighedBy}</p>
          )}
        </div>

        <div className="w-full">
          <label
            htmlFor="correctedBy"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Certified Correct By
          </label>
          <InputText
            id="correctedBy"
            name="correctedBy"
            value={palayData.correctedBy}
            onChange={handlePalayInputChange}
            className="w-full ring-0"
            maxLength={250}
          />
          {errors.correctedBy && (
            <p className="text-red-500 text-xs mt-1">{errors.correctedBy}</p>
          )}
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="w-full">
          <label
            htmlFor="classifiedBy"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Classified By
          </label>
          <InputText
            id="classifiedBy"
            name="classifiedBy"
            value={palayData.classifiedBy}
            onChange={handlePalayInputChange}
            className="w-full ring-0"
            maxLength={250}
          />
          {errors.classifiedBy && (
            <p className="text-red-500 text-xs mt-1">{errors.classifiedBy}</p>
          )}
        </div>

        <div className="w-full">
          <label
            htmlFor="remarks"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Remarks
          </label>
          <InputText
            id="remarks"
            name="remarks"
            value={transactionData.remarks}
            onChange={handleTransactionInputChange}
            className="w-full ring-0"
            maxLength={250}
          />
          {errors.remarks && (
            <p className="text-red-500 text-xs mt-1">{errors.remarks}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export { LogisticsInfoForm };
