import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { useRegistration } from '../RegistrationContext';

const AccountDetails = () => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const { userType, organizationName, jobTitle, region, branchOffice, validId, validIdName } = registrationData.accountDetails;

  const userTypeOptions = [
    { label: 'NFA Branch Staff', value: 'nfaBranchStaff' },
    { label: 'Private Miller', value: 'privateMiller' },
    { label: 'Rice Recipient', value: 'riceRecipient' }
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

  const handleInputChange = (field, value) => {
    updateRegistrationData('accountDetails', { [field]: value });
  };

  const handleFileUpload = (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      handleInputChange('validId', base64Data);
      handleInputChange('validIdName', file.name);
    };
    reader.readAsDataURL(file);
  };

  // Hide region and branchOffice if userType is privateMiller or riceRecipient
  const hideRegionAndBranchOffice = userType === 'privateMiller' || userType === 'riceRecipient';

  if (hideRegionAndBranchOffice) {
    // Clear values when hidden
    if (region || branchOffice) {
      handleInputChange('region', '');
      handleInputChange('branchOffice', '');
    }
  }

  return (
    <form className="h-full w-full px-16">
      <h2 className="text-4xl font-medium mb-2 text-secondary">Account Details</h2>
      <p className="mb-2 font-medium text-black">
        To set up your account, please select your user type first, then fill up the form, and upload a valid ID of your organization.
      </p>

      <div className="mb-2">
        <label htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-700">User Type</label>
        <Dropdown
          id="userType"
          value={userType}
          options={userTypeOptions}
          onChange={(e) => handleInputChange('userType', e.value)}
          placeholder="Select User Type"
          className="ring-0 w-full p-inputtext-sm font-medium rounded-md border border-gray-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-2">
          <label htmlFor="organizationName" className="block mb-2 text-sm font-medium text-gray-700">Organisation Name</label>
          <InputText
            id="organizationName"
            value={organizationName}
            onChange={(e) => handleInputChange('organizationName', e.target.value)}
            placeholder="organization name"
            className="ring-0 w-full p-inputtext-sm p-2 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-normal"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="jobTitle" className="block mb-2 text-sm font-medium text-gray-700">Job Title / Position</label>
          <InputText
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            placeholder="job title"
            className="ring-0 w-full p-inputtext-sm p-2 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-normal"
          />
        </div>
      </div>

      {!hideRegionAndBranchOffice && (
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label htmlFor="region" className="block mb-2 text-sm font-medium text-gray-700">Region</label>
            <Dropdown
              id="region"
              value={region}
              options={regionOptions}
              onChange={(e) => handleInputChange('region', e.value)}
              placeholder="Select Region"
              className="ring-0 w-full p-inputtext-sm rounded-md border border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="branchOffice" className="block mb-2 text-sm font-medium text-gray-700">Branch Office</label>
            <Dropdown
              id="branchOffice"
              value={branchOffice}
              options={branchOfficeOptions}
              onChange={(e) => handleInputChange('branchOffice', e.value)}
              placeholder="Select Branch"
              className="ring-0 w-full p-inputtext-sm rounded-md border border-gray-300"
            />
          </div>
        </div>
      )}

      <div className="mb-2">
        <label htmlFor="validId" className="block mb-2 text-sm font-medium text-gray-700">Valid ID</label>
        <FileUpload
          mode="basic"
          name="validId"
          accept="image/*"
          maxFileSize={1000000}
          chooseLabel={validIdName || "Select Image"} // Show file name or default label
          className="w-full ring-0 flex justify-center items-center border-gray-300"
          chooseOptions={{
            className: 'bg-transparent text-primary flex flex-col items-center ring-0'
          }}
          onSelect={handleFileUpload}
        />
      </div>
    </form>
  );
};

export default AccountDetails;
