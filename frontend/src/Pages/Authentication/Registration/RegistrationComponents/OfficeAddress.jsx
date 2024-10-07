import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useRegistration } from '../RegistrationContext';

const OfficeAddress = () => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const { region, province, cityTown, barangay, street } = registrationData.officeAddress;

  const regionOptions = [
    { label: 'Region 1', value: 'region1' },
    { label: 'Region 2', value: 'region2' },
    { label: 'Region 3', value: 'region3' }
  ];

  const provinceOptions = [
    { label: 'Province 1', value: 'province1' },
    { label: 'Province 2', value: 'province2' },
    { label: 'Province 3', value: 'province3' }
  ];

  const cityOptions = [
    { label: 'City 1', value: 'city1' },
    { label: 'City 2', value: 'city2' },
    { label: 'City 3', value: 'city3' }
  ];

  const barangayOptions = [
    { label: 'Barangay 1', value: 'barangay1' },
    { label: 'Barangay 2', value: 'barangay2' },
    { label: 'Barangay 3', value: 'barangay3' }
  ];

  const handleInputChange = (field, value) => {
    updateRegistrationData('officeAddress', { [field]: value });
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
            onChange={(e) => handleInputChange('region', e.target.value)}
            placeholder="Select a province" 
            className="ring-0 w-full p-inputtext-md font-medium rounded-md border border-gray-300" />
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="province" className="block mb-2 text-sm font-medium text-gray-700">Province</label>
          <Dropdown 
            id="province" 
            value={province} 
            options={provinceOptions} 
            onChange={(e) => handleInputChange('province', e.target.value)}
            placeholder="Select a province" 
            className="ring-0 w-full p-inputtext-md font-medium rounded-md border border-gray-300"/>
        </div>
        
        <div>
          <label htmlFor="cityTown" className="block mb-2 text-sm font-medium text-gray-700">City / Town</label>
          <Dropdown 
            id="cityTown" 
            value={cityTown} 
            options={cityOptions} 
            onChange={(e) => handleInputChange('cityTown', e.target.value)}
            placeholder="Select a city" 
            className="ring-0 w-full p-inputtext-md font-medium rounded-md border border-gray-300"/>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="barangay" className="block mb-2 text-sm font-medium text-gray-700">Barangay</label>
          <Dropdown 
            id="barangay" 
            value={barangay} 
            options={barangayOptions} 
            onChange={(e) => handleInputChange('barangay', e.target.value)} 
            placeholder="Select a barangay" 
            className="ring-0 w-full p-inputtext-md font-medium rounded-md border border-gray-300"/>
        </div>

        <div className="mb-4">
          <label htmlFor="street" className="block mb-2 text-sm font-medium text-gray-700">Street</label>
          <InputText 
            id="street" 
            value={street} 
            onChange={(e) => handleInputChange('street', e.target.value)} 
            className="ring-0 w-full p-inputtext-sm p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium" 
            placeholder="#123 Sample Street" />
        </div>
      </div>


    </form>
  );
};

export default OfficeAddress;