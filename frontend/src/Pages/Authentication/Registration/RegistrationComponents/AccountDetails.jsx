import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';

const AccountDetails = () => {
  const [userType, setUserType] = useState(null);
  const [organizationName, setOrganizationName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [region, setRegion] = useState(null);
  const [branchOffice, setBranchOffice] = useState('');

  const userTypeOptions = [
    { label: 'NFA Branch Staff', value: 'nfaBranchStaff' },
    { label: 'Other', value: 'other' }
  ];

  const regionOptions = [
    { label: 'Region 1', value: 'region1' },
    { label: 'Region 2', value: 'region2' },
    { label: 'Region 3', value: 'region3' }
  ];

  return (
    <form className="h-full w-full p-10 bg-red-500">
      <h2 className="text-2xl font-bold mb-2 text-teal-800">Account Details</h2>
      <p className="mb-6 text-gray-600">To set up your account, please select your user type first, then fill up the form, and upload a valid ID of your organization.</p>
      
      <div className="mb-4">
        <label htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-700">User Type</label>
        <Dropdown id="userType" value={userType} options={userTypeOptions} onChange={(e) => setUserType(e.value)} className="w-full p-inputtext-sm" placeholder="Select user type" />
      </div>

      <div className="mb-4">
        <label htmlFor="organizationName" className="block mb-2 text-sm font-medium text-gray-700">Organisation Name</label>
        <InputText id="organizationName" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className="w-full p-inputtext-sm" placeholder="National Food Authority" />
      </div>

      <div className="mb-4">
        <label htmlFor="jobTitle" className="block mb-2 text-sm font-medium text-gray-700">Job Title / Position</label>
        <InputText id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full p-inputtext-sm" placeholder="Procurement Officer" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="region" className="block mb-2 text-sm font-medium text-gray-700">Region</label>
          <Dropdown id="region" value={region} options={regionOptions} onChange={(e) => setRegion(e.value)} className="w-full p-inputtext-sm" placeholder="Select region" />
        </div>
        <div>
          <label htmlFor="branchOffice" className="block mb-2 text-sm font-medium text-gray-700">Branch Office</label>
          <InputText id="branchOffice" value={branchOffice} onChange={(e) => setBranchOffice(e.target.value)} className="w-full p-inputtext-sm" placeholder="Nueva Ecija" />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="validId" className="block mb-2 text-sm font-medium text-gray-700">Valid ID</label>
        <FileUpload mode="basic" name="validId" url="/api/upload" accept="image/*" maxFileSize={1000000} chooseLabel="Select Image" className="w-full" />
      </div>
    </form>
  );
};

export default AccountDetails;