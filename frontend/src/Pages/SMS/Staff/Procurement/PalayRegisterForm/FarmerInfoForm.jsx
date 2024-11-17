import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';

const FarmerInfoForm = ({ palayData, handlePalayInputChange, errors, onSupplierSelect }) => {
  const [regionOptions, setRegionOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityTownOptions, setCityTownOptions] = useState([]);
  const [barangayOptions, setBarangayOptions] = useState([]);
  const [palaySuppliers, setPalaySuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  let today = new Date();
  let year = today.getFullYear();
  let maxYear = year - 18;
  let maxDate = new Date();
  maxDate.setFullYear(maxYear);

  useEffect(() => {
    fetchRegions();
    fetchPalaySuppliers();
  }, []);

  useEffect(() => {
    if (palayData.palaySupplierRegion) {
      const selectedRegion = regionOptions.find(r => r.value === palayData.palaySupplierRegion);
      if (selectedRegion && selectedRegion.code === '130000000') {
        fetchCities(selectedRegion.code);
      } else if (selectedRegion) {
        fetchProvinces(selectedRegion.code);
      }
    }
  }, [palayData.palaySupplierRegion, regionOptions]);

  useEffect(() => {
    if (palayData.palaySupplierProvince) {
      const selectedProvince = provinceOptions.find(p => p.value === palayData.palaySupplierProvince);
      if (selectedProvince) {
        fetchCities(selectedProvince.code);
      }
    }
  }, [palayData.palaySupplierProvince, provinceOptions]);

  useEffect(() => {
    if (palayData.palaySupplierCityTown) {
      const selectedCity = cityTownOptions.find(c => c.value === palayData.palaySupplierCityTown);
      if (selectedCity) {
        fetchBarangays(selectedCity.code);
      }
    }
  }, [palayData.palaySupplierCityTown, cityTownOptions]);

  const fetchRegions = async () => {
    try {
      const res = await fetch('https://psgc.gitlab.io/api/regions/');
      const data = await res.json();
      const regions = data.map(region => ({
        label: region.regionName,
        value: region.regionName,
        code: region.code
      }));
      setRegionOptions(regions);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const fetchProvinces = async (regionCode) => {
    try {
      const res = await fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`);
      const data = await res.json();
      const provinces = data.map(province => ({
        label: province.name,
        value: province.name,
        code: province.code
      }));
      setProvinceOptions(provinces);
      setCityTownOptions([]);
      setBarangayOptions([]);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchCities = async (code) => {
    try {
      const endpoint = `https://psgc.gitlab.io/api/${code === '130000000' ? 'regions' : 'provinces'}/${code}/cities-municipalities/`;
      const res = await fetch(endpoint);
      const data = await res.json();
      const cities = data.map(city => ({
        label: city.name,
        value: city.name,
        code: city.code
      }));
      setCityTownOptions(cities);
      setBarangayOptions([]);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchBarangays = async (cityOrMunicipalityCode) => {
    try {
      const res = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityOrMunicipalityCode}/barangays/`);
      const data = await res.json();
      const barangays = data.map(barangay => ({
        label: barangay.name,
        value: barangay.name,
        code: barangay.code
      }));
      setBarangayOptions(barangays);
    } catch (error) {
      console.error('Error fetching barangays:', error);
    }
  };

  const handleAddressChange = (field, value) => {
    if (field === 'Region') {
      const selectedRegion = regionOptions.find(r => r.value === value);
      handlePalayInputChange({
        target: {
          name: 'palaySupplierRegion',
          value: value
        }
      });
      
      handlePalayInputChange({
        target: {
          name: 'palaySupplierProvince',
          value: ''
        }
      });
      handlePalayInputChange({
        target: {
          name: 'palaySupplierCityTown',
          value: ''
        }
      });
      handlePalayInputChange({
        target: {
          name: 'palaySupplierBarangay',
          value: ''
        }
      });

      if (selectedRegion) {
        if (selectedRegion.code === '130000000') {
          setProvinceOptions([]);
          fetchCities(selectedRegion.code);
        } else {
          fetchProvinces(selectedRegion.code);
        }
      }
      setCityTownOptions([]);
      setBarangayOptions([]);
    } 
    else if (field === 'Province') {
      const selectedProvince = provinceOptions.find(p => p.value === value);
      handlePalayInputChange({
        target: {
          name: 'palaySupplierProvince',
          value: value
        }
      });
      
      handlePalayInputChange({
        target: {
          name: 'palaySupplierCityTown',
          value: ''
        }
      });
      handlePalayInputChange({
        target: {
          name: 'palaySupplierBarangay',
          value: ''
        }
      });

      if (selectedProvince) {
        fetchCities(selectedProvince.code);
      }
      setBarangayOptions([]);
    }
    else if (field === 'CityTown') {
      const selectedCity = cityTownOptions.find(c => c.value === value);
      handlePalayInputChange({
        target: {
          name: 'palaySupplierCityTown',
          value: value
        }
      });
      
      handlePalayInputChange({
        target: {
          name: 'palaySupplierBarangay',
          value: ''
        }
      });

      if (selectedCity) {
        fetchBarangays(selectedCity.code);
      }
    }
    else if (field === 'Barangay') {
      handlePalayInputChange({
        target: {
          name: 'palaySupplierBarangay',
          value: value
        }
      });
    }
  };

  const fetchPalaySuppliers = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${apiUrl}/palaysuppliers`);
      const data = await res.json();
      setPalaySuppliers(data);
    } catch (error) {
      console.error('Error fetching palay suppliers:', error);
    }
  };

  const searchSuppliers = (event) => {
    const query = event.query.toLowerCase();
    const filtered = palaySuppliers.filter(supplier => 
      supplier.farmerName.toLowerCase().includes(query)
    );
    setFilteredSuppliers(filtered);
  };

  const handleSupplierSelect = (e) => {
    const supplier = e.value;
    setSelectedSupplier(supplier); // Store the selected supplier
    
    // Create synthetic events for form updates
    const createEvent = (name, value) => ({
      target: { name, value }
    });

    // Update form fields with supplier data
    handlePalayInputChange(createEvent('farmerName', supplier.farmerName));
    handlePalayInputChange(createEvent('category', supplier.category));
    handlePalayInputChange(createEvent('email', supplier.email));
    handlePalayInputChange(createEvent('contactNumber', supplier.contactNumber));
    
    if (supplier.category === 'individual') {
      handlePalayInputChange(createEvent('birthDate', new Date(supplier.birthDate)));
      handlePalayInputChange(createEvent('gender', supplier.gender));
    } else {
      handlePalayInputChange(createEvent('numOfFarmer', supplier.numOfFarmer));
    }

    // Update address fields
    handlePalayInputChange(createEvent('palaySupplierRegion', supplier.houseOfficeAddress.region));
    handlePalayInputChange(createEvent('palaySupplierProvince', supplier.houseOfficeAddress.province));
    handlePalayInputChange(createEvent('palaySupplierCityTown', supplier.houseOfficeAddress.cityTown));
    handlePalayInputChange(createEvent('palaySupplierBarangay', supplier.houseOfficeAddress.barangay));
    handlePalayInputChange(createEvent('palaySupplierStreet', supplier.houseOfficeAddress.street));

    // Pass the full supplier object to parent
    onSupplierSelect(supplier);
  };
  
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="w-full">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <Dropdown
          id="category"
          name="category"
          value={palayData.category}
          options={[{ label: 'Individual Farmer', value: 'individual' }, { label: 'Cooperative', value: 'coop' }]}
          onChange={handlePalayInputChange}  
          placeholder="Select category"
          className="w-full ring-0"
        />
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      <div className="flex flex-row w-full gap-4">
        <div className="w-1/2">
          <label htmlFor="farmerName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <AutoComplete
            id="farmerName"
            name="farmerName"
            value={palayData.farmerName}
            suggestions={filteredSuppliers}
            completeMethod={searchSuppliers}
            field="farmerName"
            onChange={handlePalayInputChange}
            onSelect={handleSupplierSelect}
            placeholder="Enter your name"
            className="w-full"
            inputClassName='ring-0 w-full'
          />
          {errors.farmerName && <p className="text-red-500 text-xs mt-1">{errors.farmerName}</p>}
        </div>

        {palayData.category === 'individual' ? (
          <div className="flex flex-row w-1/2 gap-4">
            <div className="w-3/5">
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
              <Calendar
                id="birthDate"
                name="birthDate"
                value={palayData.birthDate}
                onChange={handlePalayInputChange} 
                placeholder="Select birthdate"
                showIcon
                className="ring-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                maxDate={maxDate}
              />
              {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
            </div>

            <div className="w-2/5">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Dropdown
                id="gender"
                name="gender"
                value={palayData.gender}
                options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Others', value: 'others' }]}
                onChange={handlePalayInputChange}  
                placeholder="gender"
                className="w-full ring-0"
              />
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>
        ) : (
          <div className="w-1/2">
            <label htmlFor="numOfFarmer" className="block text-sm font-medium text-gray-700 mb-1">Number of Farmers</label>
            <InputText
              id="numOfFarmer"
              name="numOfFarmer"
              value={palayData.numOfFarmer}
              onChange={handlePalayInputChange} 
              placeholder="Enter number of farmers"
              className="w-full ring-0"
              keyfilter="int"
            />
            {errors.numOfFarmer && <p className="text-red-500 text-xs mt-1">{errors.numOfFarmer}</p>}
          </div>
        )}
      </div>
      
      <div className="flex flex-row w-full gap-4">
        <div className="w-1/2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <InputText
            id="email"
            name="email"
            value={palayData.email}
            onChange={handlePalayInputChange}  
            placeholder="Enter your email"
            className="w-full ring-0"
            keyfilter="email"
            maxLength={50}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="w-1/2">
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <InputText
            id="contactNumber"
            name="contactNumber"
            value={palayData.contactNumber}
            onChange={handlePalayInputChange} 
            placeholder="Enter your phone number"
            className="w-full ring-0"
            keyfilter="alphanum"
            maxLength={11}
          />
          {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {palayData.category === 'individual' ? 'Home Address' : 'Office Address'}
        </label>
        <div className="flex gap-4">
          <div className="flex flex-col w-full">
            <Dropdown
              id="palaySupplierRegion"
              value={palayData.palaySupplierRegion}
              options={regionOptions}
              onChange={(e) => handleAddressChange('Region', e.value)}
              placeholder="Region"
              className="w-full ring-0"
            />
            {errors.palaySupplierRegion && <p className="text-red-500 text-xs mt-1">{errors.palaySupplierRegion}</p>}
          </div>
          {palayData.palaySupplierRegion !== 'National Capital Region' && (
            <div className="flex flex-col w-full">
              <Dropdown
                id="palaySupplierProvince"
                value={palayData.palaySupplierProvince}
                options={provinceOptions}
                onChange={(e) => handleAddressChange('Province', e.value)}
                placeholder="Province"
                className="w-full ring-0"
              />
              {errors.palaySupplierProvince && <p className="text-red-500 text-xs mt-1">{errors.palaySupplierProvince}</p>}
            </div>
          )}
          <div className="flex flex-col w-full">
            <Dropdown
              id="palaySupplierCityTown"
              value={palayData.palaySupplierCityTown}
              options={cityTownOptions}
              onChange={(e) => handleAddressChange('CityTown', e.value)}
              placeholder="City/Town"
              className="w-full ring-0"
            />
            {errors.palaySupplierCityTown && <p className="text-red-500 text-xs mt-1">{errors.palaySupplierCityTown}</p>}
          </div>
          <div className="flex flex-col w-full">
            <Dropdown
              id="palaySupplierBarangay"
              value={palayData.palaySupplierBarangay}
              options={barangayOptions}
              onChange={(e) => handleAddressChange('Barangay', e.value)}
              placeholder="Barangay"
              className="w-full ring-0"
            />
            {errors.palaySupplierBarangay && <p className="text-red-500 text-xs mt-1">{errors.palaySupplierBarangay}</p>}
          </div>
          <div className="flex flex-col w-full">
            <InputText
              id="palaySupplierStreet"
              name="palaySupplierStreet"
              value={palayData.palaySupplierStreet}
              onChange={handlePalayInputChange}  
              placeholder="Street"
              className="w-full ring-0"
              maxLength={50}
            />
            {errors.palaySupplierStreet && <p className="text-red-500 text-xs mt-1">{errors.palaySupplierStreet}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export { FarmerInfoForm };