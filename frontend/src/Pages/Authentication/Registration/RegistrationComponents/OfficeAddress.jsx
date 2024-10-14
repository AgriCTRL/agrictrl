import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useRegistration } from '../RegistrationContext';

const OfficeAddress = () => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const { region, province, cityTown, barangay, street } = registrationData.officeAddress;
  const [regionOptions, setRegionOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityTownOptions, setCityTownOptions] = useState([]);
  const [barangayOptions, setBarangayOptions] = useState([]);

  // Fetch regions on component mount
  useEffect(() => {
    fetchRegions();
  }, []);

  // Fetch provinces if a region is selected (excluding NCR)
  useEffect(() => {
    if (region) {
      const selectedRegion = regionOptions.find(r => r.value === region);
      if (selectedRegion && selectedRegion.code === '130000000') { // Check for NCR
        fetchCities(selectedRegion.code); // Fetch cities directly for NCR
      } else if (selectedRegion) {
        fetchProvinces(selectedRegion.code); // Fetch provinces for other regions
      }
    }
  }, [region, regionOptions]);

  // Fetch cities/municipalities if a province is selected
  useEffect(() => {
    if (province) {
      const selectedProvince = provinceOptions.find(p => p.value === province);
      if (selectedProvince) {
        fetchCities(selectedProvince.code);
      }
    }
  }, [province, provinceOptions]);

  // Fetch barangays if a city/municipality is selected
  useEffect(() => {
    if (cityTown) {
      const selectedCity = cityTownOptions.find(c => c.value === cityTown);
      if (selectedCity) {
        fetchBarangays(selectedCity.code);
      }
    }
  }, [cityTown, cityTownOptions]);

  // Fetch regions
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

  // Fetch provinces based on region
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
      // Reset cityTown and barangay options when a new region is selected
      setCityTownOptions([]);
      setBarangayOptions([]);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  // Fetch cities/municipalities for NCR or for a specific province
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
      // Reset barangay options when new cities are fetched
      setBarangayOptions([]);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  // Fetch barangays based on city/municipality
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

  const handleInputChange = (field, value) => {
    if (field === 'region') {
      const selectedRegion = regionOptions.find(r => r.value === value);
      updateRegistrationData('officeAddress', { 
        region: value,
        province: '',
        cityTown: '',
        barangay: ''
      });
  
      if (selectedRegion) {
        if (selectedRegion.code === '130000000') { // NCR
          setProvinceOptions([]); // Clear provinces for NCR
          fetchCities(selectedRegion.code); // Directly fetch cities for NCR
        } else {
          fetchProvinces(selectedRegion.code); // Fetch provinces for other regions
        }
      }
      setCityTownOptions([]); // Clear cities/towns
      setBarangayOptions([]); // Clear barangays
    } else if (field === 'province') {
      const selectedProvince = provinceOptions.find(p => p.value === value);
      updateRegistrationData('officeAddress', { 
        ...registrationData.officeAddress,
        province: value,
        cityTown: '',
        barangay: ''
      });
  
      if (selectedProvince) {
        fetchCities(selectedProvince.code);
      }
      setCityTownOptions([]); // Clear cities/towns
      setBarangayOptions([]); // Clear barangays
    } else if (field === 'cityTown') {
      const selectedCity = cityTownOptions.find(c => c.value === value);
      updateRegistrationData('officeAddress', { 
        ...registrationData.officeAddress,
        cityTown: value,
        barangay: ''
      });
  
      if (selectedCity) {
        fetchBarangays(selectedCity.code);
      }
      setBarangayOptions([]); // Clear barangays
    } else {
      // For other fields (like barangay and street)
      updateRegistrationData('officeAddress', { 
        ...registrationData.officeAddress,
        [field]: value 
      });
    }
  };

  return (
    <form className="h-full w-full px-16">
      <h2 className="text-4xl font-medium mb-2 text-secondary">Office Address</h2>
      <p className="mb-6 font-medium text-black0">Enter your office address</p>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label htmlFor="region" className="block mb-2 text-sm font-medium text-gray-700">Region</label>
          <Dropdown 
            id="region" 
            value={region} 
            options={regionOptions} 
            onChange={(e) => handleInputChange('region', e.value)}
            placeholder="Select a region" 
            className="ring-0 w-full placeholder:text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
      {region !== 'National Capital Region' && (
          <div>
            <label htmlFor="province" className="block mb-2 text-sm font-medium text-gray-700">Province</label>
            <Dropdown
              id="province"
              value={province}
              options={provinceOptions}
              onChange={(e) => handleInputChange('province', e.value)}
              placeholder="Select a province"
              className="ring-0 w-full"
            />
          </div>
        )}
        
        <div>
          <label htmlFor="cityTown" className="block mb-2 text-sm font-medium text-gray-700">City / Town</label>
          <Dropdown 
            id="cityTown" 
            value={cityTown} 
            options={cityTownOptions} 
            onChange={(e) => handleInputChange('cityTown', e.value)}
            placeholder="Select a city" 
            className="ring-0 w-full placeholder:text-gray-400"/>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="barangay" className="block mb-2 text-sm font-medium text-gray-700">Barangay</label>
          <Dropdown 
            id="barangay" 
            value={barangay} 
            options={barangayOptions} 
            onChange={(e) => handleInputChange('barangay', e.value)} 
            placeholder="Select a barangay" 
            className="ring-0 w-full placeholder:text-gray-400"/>
        </div>

        <div className="mb-4">
          <label htmlFor="street" className="block mb-2 text-sm font-medium text-gray-700">Street</label>
          <InputText 
            id="street" 
            value={street} 
            onChange={(e) => handleInputChange('street', e.target.value)} 
            className="w-full focus:ring-0" 
            placeholder="#123 Sample Street" />
        </div>
      </div>
    </form>
  );
};

export default OfficeAddress;