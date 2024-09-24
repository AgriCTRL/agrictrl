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

  const branchOfficeOptions = [
    { label: 'Office 1', value: 'office1' },
    { label: 'Office 2', value: 'office2' },
    { label: 'Office 3', value: 'office3' }
  ];

  return (
    <form className="h-full w-full px-16 ">
      <h2 className="text-4xl font-medium mb-2 text-secondary">Account Details</h2>
      <p className="mb-2 font-medium text-black">To set up your account, please select your user type first, then fill up the form, and upload a valid ID of your organization.</p>

      <div className="mb-2">
        <label htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-700">User Type</label>
        <Dropdown 
          id="userType" 
          value={userType} 
          options={userTypeOptions} 
          onChange={(e) => setUserType(e.value)} 
          className="ring-0 w-full p-inputtext-sm font-medium rounded-md border border-gray-300"  
        />
      </div>

      <div className="mb-2">
        <label htmlFor="organizationName" className="block mb-2 text-sm font-medium text-gray-700">Organisation Name</label>
        <InputText 
          id="organizationName" 
          value={organizationName} 
          onChange={(e) => setOrganizationName(e.target.value)} 
          className="ring-0 w-full p-inputtext-sm p-1 rounded-md border border-gray-300" 
          placeholder="National Food Authority" 
        />
      </div>

      <div className="mb-2">
        <label htmlFor="jobTitle" className="block mb-2 text-sm font-medium text-gray-700">Job Title / Position</label>
        <InputText 
          id="jobTitle" 
          value={jobTitle} 
          onChange={(e) => setJobTitle(e.target.value)} 
          className="ring-0 w-full p-inputtext-sm p-1 rounded-md border border-gray-300" 
          placeholder="Procurement Officer" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label htmlFor="region" className="block mb-2 text-sm font-medium text-gray-700">Region</label>
          <Dropdown 
            id="region" 
            value={region} 
            options={regionOptions} 
            onChange={(e) => setRegion(e.value)} 
            className="ring-0 w-full p-inputtext-sm rounded-md border border-gray-300"
          />
        </div>
        <div>
          <label htmlFor="branchOffice" className="block mb-2 text-sm font-medium text-gray-700">Branch Office</label>
          <Dropdown 
            id="branchOffice" 
            value={branchOffice} 
            options={branchOfficeOptions} 
            onChange={(e) => setBranchOffice(e.value)} 
            className="ring-0 w-full p-inputtext-sm rounded-md border border-gray-300"
          />
        </div>
      </div>

      <div className="mb-2">
        <label htmlFor="validId" className="block mb-2 text-sm font-medium text-gray-700">Valid ID</label>
        <FileUpload 
          mode="basic" 
          name="validId" 
          url="/api/upload" 
          accept="image/*" 
          maxFileSize={1000000} 
          chooseLabel="Select Image" 
          className="w-full h-24 ring-0 flex justify-center items-center border border-gray-300 rounded-md"
          chooseOptions={{
            className: 'bg-transparent text-primary flex flex-col items-center ring-0'
          }}
        />
      </div>
    </form>
  );
};

export default AccountDetails;
