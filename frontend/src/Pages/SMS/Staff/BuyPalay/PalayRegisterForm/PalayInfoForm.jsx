import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

const PalayInfoForm = ({ palayData, handlePalayInputChange, handleQualityTypeInputChange }) => {
    return (  
        <div className="flex flex-col gap-4">
            {/* Purchase Details */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label htmlFor="palayVariety" className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
                    <InputText
                        id="palayVariety"
                        name="palayVariety"
                        value={palayData.palayVariety}
                        onChange={handlePalayInputChange}  
                        placeholder="Enter Palay Variety"
                        className="w-full ring-0"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price per kg</label>
                    <InputText
                        id="price"
                        name="price"
                        value={palayData.price}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter price"
                        className="w-full ring-0"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="dateBought" className="block text-sm font-medium text-gray-700 mb-1">Date Bought</label>
                    <Calendar
                        id="dateBought"
                        name="dateBought"
                        value={palayData.dateBought}
                        onChange={handlePalayInputChange}  
                        showIcon
                        className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                    />
                </div>
            </div>
    
            {/* Quantity and Weight */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label htmlFor="quantityBags" className="block text-sm font-medium text-gray-700 mb-1">Quantity (Bags)</label>
                    <InputText
                        id="quantityBags"
                        name="quantityBags"
                        value={palayData.quantityBags}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter quantity"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="grossWeight" className="block text-sm font-medium text-gray-700 mb-1">Gross Weight (kg)</label>
                    <InputText
                        id="grossWeight"
                        name="grossWeight"
                        value={palayData.grossWeight}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter gross weight"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="netWeight" className="block text-sm font-medium text-gray-700 mb-1">Net Weight (kg)</label>
                    <InputText
                        id="netWeight"
                        name="netWeight"
                        value={palayData.netWeight}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter net weight"
                        className="w-full ring-0"
                    />
                </div>
            </div>
    
            {/* Quality Information */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label htmlFor="qualityType" className="block text-sm font-medium text-gray-700 mb-1">Quality Type</label>
                    <Dropdown
                        id="qualityType"
                        name="qualityType"
                        value={palayData.qualityType}
                        options={[
                            { label: 'Fresh/Wet', value: 'Wet' },
                            { label: 'Clean/Dry', value: 'Dry' },
                        ]}
                        onChange={handleQualityTypeInputChange}  
                        placeholder="Select quality"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="moistureContent" className="block text-sm font-medium text-gray-700 mb-1">Moisture Content (%)</label>
                    <InputText
                        id="moistureContent"
                        name="moistureContent"
                        value={palayData.moistureContent}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter moisture %"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="purity" className="block text-sm font-medium text-gray-700 mb-1">Purity (%)</label>
                    <InputText
                        id="purity"
                        name="purity"
                        value={palayData.purity}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter purity %"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="damaged" className="block text-sm font-medium text-gray-700 mb-1">Damaged (%)</label>
                    <InputText
                        id="damaged"
                        name="damaged"
                        value={palayData.damaged}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter damaged %"
                        className="w-full ring-0"
                    />
                </div>
            </div>
    
            {/* Price and Farm Details */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 mb-1">Farm Size (hectares)</label>
                    <InputText
                        id="farmSize"
                        name="farmSize"
                        value={palayData.farmSize}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter farm size"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="plantedDate" className="block text-sm font-medium text-gray-700 mb-1">Date Planted</label>
                    <Calendar
                        id="plantedDate"
                        name="plantedDate"
                        value={palayData.plantedDate}
                        onChange={handlePalayInputChange}  
                        showIcon
                        className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="harvestedDate" className="block text-sm font-medium text-gray-700 mb-1">Date Harvested</label>
                    <Calendar
                        id="harvestedDate"
                        name="harvestedDate"
                        value={palayData.harvestedDate}
                        onChange={handlePalayInputChange}  
                        showIcon
                        className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                    />
                </div>
            </div>
    
            {/* Farm Location */}
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Address</label>
                <div className="grid grid-cols-5 gap-4">
                    <InputText
                        id="farmRegion"
                        name="farmRegion"
                        value={palayData.farmRegion}
                        onChange={handlePalayInputChange}  
                        placeholder="Region"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="farmProvince"
                        name="farmProvince"
                        value={palayData.farmProvince}
                        onChange={handlePalayInputChange}  
                        placeholder="Province"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="farmCityTown"
                        name="farmCityTown"
                        value={palayData.farmCityTown}
                        onChange={handlePalayInputChange}  
                        placeholder="City/Town"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="farmBarangay"
                        name="farmBarangay"
                        value={palayData.farmBarangay}
                        onChange={handlePalayInputChange}  
                        placeholder="Barangay"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="farmStreet"
                        name="farmStreet"
                        value={palayData.farmStreet}
                        onChange={handlePalayInputChange}  
                        placeholder="Street"
                        className="w-full ring-0"
                    />
                </div>
            </div>
    
            {/* Estimated Capital */}
            <div className="w-full">
                <label htmlFor="estimatedCapital" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Capital
                </label>
                <InputText
                    id="estimatedCapital"
                    name="estimatedCapital"
                    value={palayData.estimatedCapital}
                    onChange={handlePalayInputChange}  
                    type="number"
                    placeholder="Enter estimated capital"
                    className="w-full ring-0"
                />
            </div>
        </div>
    );
};

export { PalayInfoForm };
