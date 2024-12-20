import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { ChevronDown } from "lucide-react";

const PalayInfoForm = ({
    palayData,
    handlePalayInputChange,
    handleQualityTypeInputChange,
    errors,
    handleSameAddressChange,
    sameAsHomeAddress,
}) => {
    const [regionOptions, setRegionOptions] = useState([]);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityTownOptions, setCityTownOptions] = useState([]);
    const [barangayOptions, setBarangayOptions] = useState([]);

    const varietyCodeOptions = [
        { label: "PW S", value: "PW S", qualityType: "Wet" },
        { label: "PW M", value: "PW M", qualityType: "Wet" },
        { label: "PD S", value: "PD S", qualityType: "Dry" },
        { label: "PD M", value: "PD M", qualityType: "Dry" },
    ];

    useEffect(() => {
        fetchRegions();
    }, []);

    useEffect(() => {
        if (palayData.farmRegion) {
            const selectedRegion = regionOptions.find(
                (r) => r.value === palayData.farmRegion
            );
            if (selectedRegion && selectedRegion.code === "130000000") {
                fetchCities(selectedRegion.code);
            } else if (selectedRegion) {
                fetchProvinces(selectedRegion.code);
            }
        }
    }, [palayData.farmRegion, regionOptions]);

    useEffect(() => {
        if (palayData.farmProvince) {
            const selectedProvince = provinceOptions.find(
                (p) => p.value === palayData.farmProvince
            );
            if (selectedProvince) {
                fetchCities(selectedProvince.code);
            }
        }
    }, [palayData.farmProvince, provinceOptions]);

    useEffect(() => {
        if (palayData.farmCityTown) {
            const selectedCity = cityTownOptions.find(
                (c) => c.value === palayData.farmCityTown
            );
            if (selectedCity) {
                fetchBarangays(selectedCity.code);
            }
        }
    }, [palayData.farmCityTown, cityTownOptions]);

    const fetchRegions = async () => {
        try {
            const res = await fetch("https://psgc.gitlab.io/api/regions/");
            const data = await res.json();
            const regions = data.map((region) => ({
                label: region.regionName,
                value: region.regionName,
                code: region.code,
            }));
            setRegionOptions(regions);
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    };

    const fetchProvinces = async (regionCode) => {
        try {
            const res = await fetch(
                `https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`
            );
            const data = await res.json();
            const provinces = data.map((province) => ({
                label: province.name,
                value: province.name,
                code: province.code,
            }));
            setProvinceOptions(provinces);
            setCityTownOptions([]);
            setBarangayOptions([]);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchCities = async (code) => {
        try {
            const endpoint = `https://psgc.gitlab.io/api/${
                code === "130000000" ? "regions" : "provinces"
            }/${code}/cities-municipalities/`;
            const res = await fetch(endpoint);
            const data = await res.json();
            const cities = data.map((city) => ({
                label: city.name,
                value: city.name,
                code: city.code,
            }));
            setCityTownOptions(cities);
            setBarangayOptions([]);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const fetchBarangays = async (cityOrMunicipalityCode) => {
        try {
            const res = await fetch(
                `https://psgc.gitlab.io/api/cities-municipalities/${cityOrMunicipalityCode}/barangays/`
            );
            const data = await res.json();
            const barangays = data.map((barangay) => ({
                label: barangay.name,
                value: barangay.name,
                code: barangay.code,
            }));
            setBarangayOptions(barangays);
        } catch (error) {
            console.error("Error fetching barangays:", error);
        }
    };

    const handleAddressChange = (field, value) => {
        if (field === "Region") {
            const selectedRegion = regionOptions.find((r) => r.value === value);
            handlePalayInputChange({
                target: {
                    name: "farmRegion",
                    value: value,
                },
            });

            handlePalayInputChange({
                target: {
                    name: "farmProvince",
                    value: "",
                },
            });
            handlePalayInputChange({
                target: {
                    name: "farmCityTown",
                    value: "",
                },
            });
            handlePalayInputChange({
                target: {
                    name: "farmBarangay",
                    value: "",
                },
            });

            if (selectedRegion) {
                if (selectedRegion.code === "130000000") {
                    setProvinceOptions([]);
                    fetchCities(selectedRegion.code);
                } else {
                    fetchProvinces(selectedRegion.code);
                }
            }
            setCityTownOptions([]);
            setBarangayOptions([]);
        } else if (field === "Province") {
            const selectedProvince = provinceOptions.find(
                (p) => p.value === value
            );
            handlePalayInputChange({
                target: {
                    name: "farmProvince",
                    value: value,
                },
            });

            handlePalayInputChange({
                target: {
                    name: "farmCityTown",
                    value: "",
                },
            });
            handlePalayInputChange({
                target: {
                    name: "farmBarangay",
                    value: "",
                },
            });

            if (selectedProvince) {
                fetchCities(selectedProvince.code);
            }
            setBarangayOptions([]);
        } else if (field === "CityTown") {
            const selectedCity = cityTownOptions.find((c) => c.value === value);
            handlePalayInputChange({
                target: {
                    name: "farmCityTown",
                    value: value,
                },
            });

            handlePalayInputChange({
                target: {
                    name: "farmBarangay",
                    value: "",
                },
            });

            if (selectedCity) {
                fetchBarangays(selectedCity.code);
            }
        } else if (field === "Barangay") {
            handlePalayInputChange({
                target: {
                    name: "farmBarangay",
                    value: value,
                },
            });
        }
    };

    const getCurrentDate = () => {
        return new Date();
    };

    const getMinDateBought = () => {
        return getCurrentDate();
    };

    const getMinDatePlanted = () => {
        const currentDate = getCurrentDate();

        // Set minimum date to January 1st of current year
        const minDate = new Date(currentDate.getFullYear(), 0, 1);

        // Set maximum date to 2 months behind current date
        const maxDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 2,
            currentDate.getDate()
        );

        return {
            minDate: minDate,
            maxDate: maxDate,
        };
    };

    const getMinDateHarvested = () => {
        const currentDate = getCurrentDate();
        const plantedDate = new Date(palayData.plantedDate);
        const minDate = new Date(
            plantedDate.getFullYear(),
            plantedDate.getMonth() + 2,
            plantedDate.getDate()
        );
        return minDate > currentDate ? currentDate : minDate;
    };

    const handleVarietyCodeChange = (e) => {
        const selectedVariety = varietyCodeOptions.find(
            (option) => option.value === e.value
        );

        // Update variety code
        handlePalayInputChange({
            target: {
                name: "varietyCode",
                value: e.value,
            },
        });

        // Automatically update quality type
        if (selectedVariety) {
            handleQualityTypeInputChange({
                target: {
                    name: "qualityType",
                    value: selectedVariety.qualityType,
                },
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Purchase Details */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Variety Code
                    </label>
                    <Dropdown
                        id="varietyCode"
                        name="varietyCode"
                        value={palayData.varietyCode}
                        options={varietyCodeOptions}
                        onChange={handleVarietyCodeChange}
                        placeholder="Select Variety Code"
                        className="flex items-center justify-between gap-2 md:gap-4"
                        pt={{
                            input: "text-sm md:text-base",
                            trigger: "text-sm md:text-base",
                            panel: "text-sm md:text-base",
                        }}
                        dropdownIcon={
                            <ChevronDown className="size-4 md:size-5" />
                        }
                    />
                    {errors.varietyCode && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.varietyCode}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Price per kg
                    </label>
                    <InputText
                        id="price"
                        name="price"
                        value={palayData.price}
                        onChange={handlePalayInputChange}
                        type="number"
                        placeholder="Enter price"
                        className="w-full ring-0 text-sm md:text-base"
                        keyfilter="money"
                    />
                    {errors.price && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.price}
                        </p>
                    )}
                </div>

                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Date Bought
                    </label>
                    <Calendar
                        id="dateBought"
                        name="dateBought"
                        value={palayData.dateBought || new Date()}
                        onChange={handlePalayInputChange}
                        showIcon
                        disabled
                        className="rig-0 w-full focus:shadow-none custom-calendar text-sm md:text-base"
                    />
                    {errors.dateBought && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.dateBought}
                        </p>
                    )}
                </div>
            </div>

            {/* Quantity and Weight */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Quantity (Bags)
                    </label>
                    <InputText
                        id="quantityBags"
                        name="quantityBags"
                        value={palayData.quantityBags}
                        onChange={handlePalayInputChange}
                        type="text"
                        placeholder="Enter quantity"
                        className="w-full ring-0 text-sm md:text-base"
                        keyfilter="num"
                    />
                    {errors.quantityBags && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.quantityBags}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Gross Weight (kg)
                    </label>
                    <InputText
                        id="grossWeight"
                        name="grossWeight"
                        value={palayData.grossWeight}
                        onChange={handlePalayInputChange}
                        type="text"
                        placeholder="Enter gross weight"
                        className="w-full ring-0 text-sm md:text-base"
                        keyfilter="num"
                    />
                    {errors.grossWeight && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.grossWeight}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Net Weight (kg)
                    </label>
                    <InputText
                        id="netWeight"
                        name="netWeight"
                        value={palayData.netWeight}
                        onChange={handlePalayInputChange}
                        type="text"
                        placeholder="Enter net weight"
                        className="w-full ring-0 text-sm md:text-base"
                        keyfilter="num"
                    />
                    {errors.netWeight && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.netWeight}
                        </p>
                    )}
                </div>
            </div>

            {/* Quality Information */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Quality Type
                    </label>
                    <Dropdown
                        id="qualityType"
                        name="qualityType"
                        value={palayData.qualityType}
                        options={[
                            { label: "Fresh/Wet", value: "Wet" },
                            { label: "Clean/Dry", value: "Dry" },
                        ]}
                        onChange={handleQualityTypeInputChange}
                        placeholder="Select quality"
                        className="w-full ring-0 text-sm md:text-base"
                    />
                    {errors.qualityType && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.qualityType}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Moisture Content (%)
                    </label>
                    <InputText
                        id="moistureContent"
                        name="moistureContent"
                        value={palayData.moistureContent}
                        onChange={handlePalayInputChange}
                        type="number"
                        placeholder="Enter moisture %"
                        className="w-full ring-0 text-sm md:text-base"
                        keyfilter="num"
                    />
                    {errors.moistureContent && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.moistureContent}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Purity (%)
                    </label>
                    <InputText
                        id="purity"
                        name="purity"
                        value={palayData.purity}
                        onChange={handlePalayInputChange}
                        type="number"
                        placeholder="Enter purity %"
                        className="w-full ring-0 text-sm md:text-base"
                        keyfilter="num"
                    />
                    {errors.purity && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.purity}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Damaged (%)
                    </label>
                    <InputText
                        id="damaged"
                        name="damaged"
                        value={palayData.damaged}
                        onChange={handlePalayInputChange}
                        type="number"
                        placeholder="Enter damaged %"
                        className="w-full ring-0 text-sm md:text-base"
                        keyfilter="num"
                    />
                    {errors.damaged && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.damaged}
                        </p>
                    )}
                </div>
            </div>

            {/* Price and Farm Details */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Farm Size (hectares)
                    </label>
                    <InputText
                        id="farmSize"
                        name="farmSize"
                        value={palayData.farmSize}
                        onChange={handlePalayInputChange}
                        type="number"
                        placeholder="Enter farm size"
                        className="w-full ring-0 text-sm md:text-base"
                        keyfilter="num"
                        max={7}
                    />
                    {errors.farmSize && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.farmSize}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Date Planted
                    </label>
                    <Calendar
                        id="plantedDate"
                        name="plantedDate"
                        value={palayData.plantedDate}
                        onChange={handlePalayInputChange}
                        showIcon
                        className="rig-0 w-full text-sm md:text-base focus:shadow-none custom-calendar"
                        minDate={getMinDatePlanted().minDate}
                        maxDate={getMinDatePlanted().maxDate}
                    />
                    {errors.plantedDate && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.plantedDate}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Date Harvested
                    </label>
                    <Calendar
                        id="harvestedDate"
                        name="harvestedDate"
                        value={palayData.harvestedDate}
                        onChange={handlePalayInputChange}
                        showIcon
                        className="rig-0 w-full text-sm md:text-base focus:shadow-none custom-calendar"
                        minDate={getMinDateHarvested()}
                        maxDate={getCurrentDate()}
                    />
                    {errors.harvestedDate && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.harvestedDate}
                        </p>
                    )}
                </div>
            </div>

            {/* Farm Location */}
            <div className="w-full">
                <div className="flex gap-4">
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Farm Address
                    </label>
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        (Same as Home/Office Address?
                      </label>
                    <input
                        type="checkbox"
                        checked={sameAsHomeAddress}
                        onChange={handleSameAddressChange}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary text-sm md:text-base"
                    />
                    <label>)</label>
                </div>

                <div className="grid grid-cols-5 gap-4">
                    <div className="flex flex-col w-full">
                        <Dropdown
                            value={palayData.farmRegion}
                            options={regionOptions}
                            onChange={handlePalayInputChange}
                            placeholder="Region"
                            className="flex items-center justify-between gap-2 md:gap-4"
                            pt={{
                                input: "text-sm md:text-base",
                                trigger: "text-sm md:text-base",
                                panel: "text-sm md:text-base",
                            }}
                            dropdownIcon={
                                <ChevronDown className="size-4 md:size-5" />
                            }
                            disabled={sameAsHomeAddress}
                        />
                        {errors.farmRegion && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.farmRegion}
                            </p>
                        )}
                    </div>
                    {palayData.farmRegion !== "National Capital Region" && (
                        <div className="flex flex-col w-full">
                            <Dropdown
                                id="farmProvince"
                                value={palayData.farmProvince}
                                options={provinceOptions}
                                onChange={(e) =>
                                    handleAddressChange("Province", e.value)
                                }
                                placeholder="Province"
                                className="flex items-center justify-between gap-2 md:gap-4"
                                pt={{
                                    input: "text-sm md:text-base",
                                    trigger: "text-sm md:text-base",
                                    panel: "text-sm md:text-base",
                                }}
                                dropdownIcon={
                                    <ChevronDown className="size-4 md:size-5" />
                                }
                                disabled={sameAsHomeAddress}
                            />
                            {errors.farmProvince && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.farmProvince}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col w-full">
                        <Dropdown
                            id="farmCityTown"
                            value={palayData.farmCityTown}
                            options={cityTownOptions}
                            onChange={(e) =>
                                handleAddressChange("CityTown", e.value)
                            }
                            placeholder="City/Town"
                            className="flex items-center justify-between gap-2 md:gap-4"
                            pt={{
                                input: "text-sm md:text-base",
                                trigger: "text-sm md:text-base",
                                panel: "text-sm md:text-base",
                            }}
                            dropdownIcon={
                                <ChevronDown className="size-4 md:size-5" />
                            }
                            disabled={sameAsHomeAddress}
                        />
                        {errors.farmCityTown && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.farmCityTown}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col w-full">
                        <Dropdown
                            id="farmBarangay"
                            value={palayData.farmBarangay}
                            options={barangayOptions}
                            onChange={(e) =>
                                handleAddressChange("Barangay", e.value)
                            }
                            placeholder="Barangay"
                            className="flex items-center justify-between gap-2 md:gap-4"
                            pt={{
                                input: "text-sm md:text-base",
                                trigger: "text-sm md:text-base",
                                panel: "text-sm md:text-base",
                            }}
                            dropdownIcon={
                                <ChevronDown className="size-4 md:size-5" />
                            }
                            disabled={sameAsHomeAddress}
                        />
                        {errors.farmBarangay && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.farmBarangay}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col w-full">
                        <InputText
                            id="farmStreet"
                            name="farmStreet"
                            value={palayData.farmStreet}
                            onChange={handlePalayInputChange}
                            placeholder="Street"
                            className="w-full ring-0 text-sm md:text-base"
                            maxLength={50}
                            disabled={sameAsHomeAddress}
                        />
                        {errors.farmStreet && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.farmStreet}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Estimated Capital */}
            <div className="w-full">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Estimated Capital
                </label>
                <InputText
                    id="estimatedCapital"
                    name="estimatedCapital"
                    value={palayData.estimatedCapital}
                    onChange={handlePalayInputChange}
                    type="text"
                    placeholder="Enter estimated capital"
                    className="w-full ring-0 text-sm md:text-base"
                    keyfilter="num"
                    min="1"
                />
                {errors.estimatedCapital && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.estimatedCapital}
                    </p>
                )}
            </div>
        </div>
    );
};

export { PalayInfoForm };
