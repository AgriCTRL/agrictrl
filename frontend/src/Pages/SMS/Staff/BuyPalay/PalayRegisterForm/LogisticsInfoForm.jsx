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
    locationOptions, 
    errors 
  }) => {
    return (
        <div className="flex flex-col h-full w-full gap-2">
            <div className="flex w-full gap-4">
                <div className="w-full">
                    <label htmlFor="buyingStationName" className="block text-sm font-medium text-gray-700 mb-1">Bought at</label>
                    <Dropdown
                        id="buyingStationName"
                        name="buyingStationName"
                        value={options.find(option => option.label === palayData.buyingStationName) || null} // Find the selected option object
                        options={options}
                        onChange={handleStationChange}
                        placeholder="Select buying station"
                        className="ring-0 w-full placeholder:text-gray-400"
                    />
                    {errors.buyingStationName && <p className="text-red-500 text-xs mt-1">{errors.buyingStationName}</p>}
                </div>

                <div className="w-full">
                    <label htmlFor="buyingStationLoc" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <InputText
                        id="buyingStationLoc"
                        name="buyingStationLoc"
                        value={palayData.buyingStationLoc}
                        className='w-full focus:ring-0'
                        disabled
                    />
                    {errors.buyingStationLoc && <p className="text-red-500 text-xs mt-1">{errors.buyingStationLoc}</p>}
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
                {errors.transporterName && <p className="text-red-500 text-xs mt-1">{errors.transporterName}</p>}
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
                {errors.transporterDesc && <p className="text-red-500 text-xs mt-1">{errors.transporterDesc}</p>}
            </div>

            <div className="w-full">
                <label htmlFor="sendToWarehouse" className="block text-sm font-medium text-gray-700 mb-1">Send to</label>
                <div className="flex flex-row w-full space-x-2">
                    <div className="flex flex-col w-full">
                        <InputText
                            id="sendToWarehouse"
                            name="sendToWarehouse"
                            value={transactionData.toLocationType}
                            onChange={handleLocationType} 
                            placeholder="Select location"
                            className="ring-0 w-full placeholder:text-gray-400"
                            disabled
                        />
                        {errors.toLocationType && <p className="text-red-500 text-xs mt-1">{errors.toLocationType}</p>}
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
                        {errors.toLocationId && <p className="text-red-500 text-xs mt-1">{errors.toLocationId}</p>}
                    </div>
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
                {errors.remarks && <p className="text-red-500 text-xs mt-1">{errors.remarks}</p>}
            </div>
        </div>
    );
};

export { LogisticsInfoForm };