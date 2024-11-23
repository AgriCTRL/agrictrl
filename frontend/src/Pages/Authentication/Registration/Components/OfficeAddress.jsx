import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const OfficeAddress = ({ 
  officeAddress, 
  updateRegistrationData,
  nextBtnIsClicked
}) => {
  const { region, province, cityTown, barangay, street } = officeAddress;
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
    officeAddress[field] = value;
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
    <form className="h-fit w-full flex flex-col gap-4">
      <h2 className="font-medium text-black text-2xl sm:text-4xl">Office Address</h2>
      <p className="text-md text-black">Enter your office address</p>
      
      <div className="flex flex-col gap-4 pt-4">
        <div className='flex flex-col gap-2'>
          <label htmlFor="region" className="block text-sm text-black">Region</label>
          <Dropdown 
            id="region" 
            value={region} 
            options={regionOptions} 
            onChange={(e) => handleInputChange('region', e.value)}
            placeholder="Select a region" 
            className="ring-0 w-full placeholder:text-gray-400"
            invalid={!officeAddress.region && nextBtnIsClicked}
          />
          {(!officeAddress.region && nextBtnIsClicked) &&
            <small className='p-error'>Region is required.</small>
          }
        </div>

        <div className="grid grid-cols-2 gap-4 ">
        {region !== 'National Capital Region' && (
            <div className='flex flex-col gap-2'>
              <label htmlFor="province" className="block text-sm text-black">Province</label>
              <Dropdown
                id="province"
                value={province}
                options={provinceOptions}
                onChange={(e) => handleInputChange('province', e.value)}
                placeholder="Select a province"
                className="ring-0 w-full"
                invalid={!officeAddress.province && nextBtnIsClicked}
              />
              {((region && !province && provinceOptions.length > 0) && nextBtnIsClicked) &&
                <small className='p-error'>Province is required.</small>
              }
            </div>
          )}
          
          <div className='flex flex-col gap-2'>
            <label htmlFor="cityTown" className="block text-sm text-black">City / Town</label>
            <Dropdown 
              id="cityTown" 
              value={cityTown} 
              options={cityTownOptions} 
              onChange={(e) => handleInputChange('cityTown', e.value)}
              placeholder="Select a city" 
              className="ring-0 w-full placeholder:text-gray-400"
              invalid={!officeAddress.cityTown && nextBtnIsClicked}
            />
            {((province && !cityTown && cityTownOptions.length > 0) && nextBtnIsClicked) &&
              <small className='p-error'>City is required.</small>
            }
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className='flex flex-col gap-2'>
            <label htmlFor="barangay" className="block text-sm text-black">Barangay</label>
            <Dropdown 
              id="barangay" 
              value={barangay} 
              options={barangayOptions} 
              onChange={(e) => handleInputChange('barangay', e.value)} 
              placeholder="Select a barangay" 
              className="ring-0 w-full placeholder:text-gray-400"
              invalid={!officeAddress.barangay && nextBtnIsClicked}
            />
            {((cityTown && !barangay && barangayOptions.length > 0) && nextBtnIsClicked) &&
              <small className='p-error'>Barangay is required.</small>
            }
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="street" className="block text-sm text-black">Street</label>
            <InputText 
              id="street" 
              value={street} 
              onChange={(e) => handleInputChange('street', e.target.value)} 
              className="w-full focus:ring-0" 
              placeholder="#123 Sample Street"
              invalid={!officeAddress.street && nextBtnIsClicked}
              maxLength={100}
            />
            {(!officeAddress.street && nextBtnIsClicked) &&
              <small className='p-error'>Street is required.</small>
            }
          </div>
        </div>
      </div>
    </form>
  );
};

export default OfficeAddress;