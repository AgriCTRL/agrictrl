import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const OfficeAddress = () => {
  const [region, setRegion] = useState(null);
  const [province, setProvince] = useState(null);
  const [cityTown, setCityTown] = useState('');
  const [barangay, setBarangay] = useState(null);
  const [street, setStreet] = useState('');

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

  const barangayOptions = [
    { label: 'Barangay 1', value: 'barangay1' },
    { label: 'Barangay 2', value: 'barangay2' },
    { label: 'Barangay 3', value: 'barangay3' }
  ];

  return (
    <form className="h-full w-full p-10 bg-red-500">
      <h2 className="text-2xl font-bold mb-2 text-teal-800">Office Address</h2>
      <p className="mb-6 text-gray-600">Enter your office address</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="region" className="block mb-2 text-sm font-medium text-gray-700">Region</label>
          <Dropdown id="region" value={region} options={regionOptions} onChange={(e) => setRegion(e.value)} className="w-full p-inputtext-sm" placeholder="Select a region" />
        </div>
        <div>
          <label htmlFor="province" className="block mb-2 text-sm font-medium text-gray-700">Province</label>
          <Dropdown id="province" value={province} options={provinceOptions} onChange={(e) => setProvince(e.value)} className="w-full p-inputtext-sm" placeholder="Select a province" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="cityTown" className="block mb-2 text-sm font-medium text-gray-700">City / Town</label>
          <InputText id="cityTown" value={cityTown} onChange={(e) => setCityTown(e.target.value)} className="w-full p-inputtext-sm" placeholder="Enter city/town" />
        </div>
        <div>
          <label htmlFor="barangay" className="block mb-2 text-sm font-medium text-gray-700">Barangay</label>
          <Dropdown id="barangay" value={barangay} options={barangayOptions} onChange={(e) => setBarangay(e.value)} className="w-full p-inputtext-sm" placeholder="Select a barangay" />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="street" className="block mb-2 text-sm font-medium text-gray-700">Street</label>
        <InputText id="street" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full p-inputtext-sm" placeholder="#123 Sample Street" />
      </div>
    </form>
  );
};

export default OfficeAddress;