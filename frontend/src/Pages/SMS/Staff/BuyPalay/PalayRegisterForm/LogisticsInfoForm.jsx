import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

const LogisticsInfoForm = ({ 
    palayData, 
    transactionData, 
    handlePalayInputChange, 
    handleTransactionInputChange,
    handleStationChange,
    handleLocationType,
    handleLocationId,
    options,
    locationOptions 
  }) => {
    return (
        <div className="flex flex-col h-full w-full gap-2">
            <div className="flex w-full gap-4">
                <div className="w-full">
                    <label htmlFor="buyingStationName" className="block text-sm font-medium text-gray-700 mb-1">Bought at</label>
                    <Dropdown
                        id="buyingStationName"
                        name="buyingStationName"
                        value={palayData.buyingStationName}
                        options={options}
                        onChange={handleStationChange}
                        placeholder="Select buying station"
                        className="ring-0 w-full placeholder:text-gray-400"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="buyingStationLoc" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <InputText
                        id="buyingStationLoc"
                        name="buyingStationLoc"
                        value={palayData.buyingStationLoc}
                        onChange={handlePalayInputChange}  
                        className='w-full focus:ring-0'
                    />
                </div>
            </div>
            
            <div className="w-full">
                <label htmlFor="transporterName" className="block text-sm font-medium text-gray-700 mb-1">Transported by</label>
                <InputText
                    id="transporterName"
                    name="transporterName"
                    value={transactionData.transporterName}
                    onChange={handleTransactionInputChange}  
                    placeholder="Enter transport"
                    className='w-full focus:ring-0'
                />
            </div>

            <div className="w-full">
                <label htmlFor="transporterDesc" className="block text-sm font-medium text-gray-700 mb-1">Transport Description</label>
                <InputTextarea
                    id="transporterDesc"
                    name="transporterDesc"
                    value={transactionData.transporterDesc}
                    onChange={handleTransactionInputChange}  
                    placeholder="Enter description"
                    className="w-full ring-0"
                />
            </div>

            <div className="w-full">
                <label htmlFor="sendToWarehouse" className="block text-sm font-medium text-gray-700 mb-1">Send to</label>
                <div className="flex flex-row w-full space-x-2">
                    <InputText
                        id="sendToWarehouse"
                        name="sendToWarehouse"
                        value={transactionData.toLocationType}
                        onChange={handleLocationType} 
                        placeholder="Select location"
                        className="ring-0 w-full placeholder:text-gray-400"
                        disabled
                    />

                    <Dropdown
                        id="facility"
                        name="facility"
                        value={transactionData.toLocationId}
                        options={locationOptions}
                        onChange={handleLocationId}
                        placeholder="Select facility"
                        className="ring-0 w-full placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="w-full">
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <InputTextarea
                    id="remarks"
                    name="remarks"
                    value={transactionData.remarks}
                    onChange={handleTransactionInputChange} 
                    placeholder="Enter Remarks"
                    className="w-full ring-0"
                />
            </div>
        </div>
    );
};

export { LogisticsInfoForm };
