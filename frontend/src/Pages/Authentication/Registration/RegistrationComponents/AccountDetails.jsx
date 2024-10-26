import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { useRegistration } from '../RegistrationContext';
import { Divider } from 'primereact/divider';

const AccountDetails = ({ setSelectedFile, contactInfo }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const { userType, organizationName, jobTitlePosition, branchRegion, branchOffice, validId, validIdName } = registrationData.accountDetails;

  const userTypeOptions = [
    { label: 'NFA Branch Staff', value: 'NFA Branch Staff' },
    { label: 'Private Miller', value: 'Private Miller' },
    { label: 'Rice Recipient', value: 'Rice Recipient' }
  ];

  const [branchRegionOptions, setBranchRegionOptions] = useState([]);
  const [branchOfficeOptions, setBranchOfficeOptions] = useState([]);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (branchRegion) {
      const selectedRegion = branchRegionOptions.find(r => r.value === branchRegion);
      if (selectedRegion && selectedRegion.code === '130000000') {
        fetchCities();
      } else if (selectedRegion) {
        fetchProvinces(selectedRegion.code);
      }
    }
  }, [branchRegion, branchRegionOptions]);

  useEffect(() => {
    // Reset branchRegion and branchOffice to null if userType is not NFA Branch Staff
    if (userType !== 'NFA Branch Staff') {
      handleInputChange('branchRegion', null);
      handleInputChange('branchOffice', null);
    }
  }, [userType]);
  
  const fetchRegions = async () => {
    try {
      const res = await fetch('https://psgc.gitlab.io/api/regions/');
      const data = await res.json();
      const regions = data.map(region => ({
        label: region.regionName,
        value: region.regionName,
        code: region.code
      }));
      setBranchRegionOptions(regions);
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
      setBranchOfficeOptions(provinces);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch('https://psgc.gitlab.io/api/regions/130000000/cities/');
      const data = await res.json();
      const cities = data.map(city => ({
        label: city.name,
        value: city.name,
        code: city.code
      }));
      setBranchOfficeOptions(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleInputChange = (field, value) => {
    contactInfo[field] = value;

    const updatedData = {
      ...registrationData.accountDetails,
      [field]: value,
    };

    // Reset branchOffice when branchRegion changes
    if (field === 'branchRegion') {
      updatedData.branchOffice = null;
    }

    // If userType is changed and it's not NFA Branch Staff, reset branchRegion and branchOffice
    if (field === 'userType' && value !== 'NFA Branch Staff') {
      updatedData.branchRegion = null;
      updatedData.branchOffice = null;
    }

    updateRegistrationData('accountDetails', updatedData);
  };

  const handleFileSelect = (event) => {
    const file = event.files[0];
    setSelectedFile(file);
    handleInputChange('validIdName', file.name);
  };

  return (
    <form className="h-fit w-full flex flex-col gap-4">
      <h2 className="font-medium text-black text-2xl sm:text-4xl">Account Details</h2>
      <p className="text-md text-black">
        To set up your account, please select your user type first, then fill up the form, and upload a valid ID of your organization.
      </p>

      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="userType" className="block text-sm text-black">User Type</label>
          <Dropdown
            id="userType"
            value={userType}
            options={userTypeOptions}
            onChange={(e) => handleInputChange('userType', e.value)}
            placeholder="Select User Type"
            className="ring-0 w-full placeholder:text-gray-400"
            invalid={!contactInfo.userType}
          />
          {!contactInfo.userType &&
            <small className='p-error'>Please input your user type.</small>
          }
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="organizationName" className="block text-sm text-black">Organisation Name</label>
            <InputText
              id="organizationName"
              value={organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              placeholder="organization name"
              className="w-full focus:ring-0"
              invalid={!contactInfo.organizationName}
            />
            {!contactInfo.organizationName &&
              <small className='p-error'>Please input your organization name.</small>
            }
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="jobTitlePosition" className="block text-sm text-black">Job Title / Position</label>
            <InputText
              id="jobTitlePosition"
              value={jobTitlePosition}
              onChange={(e) => handleInputChange('jobTitlePosition', e.target.value)}
              placeholder="job title"
              className="w-full focus:ring-0"
              invalid={!contactInfo.jobTitlePosition}
            />
            {!contactInfo.jobTitlePosition &&
              <small className='p-error'>Please input your organization name.</small>
            }
          </div>
        </div>

        {userType === 'NFA Branch Staff' && (
          <div className="grid grid-cols-2 gap-4">
            <div className='flex flex-col gap-2'>
              <label htmlFor="branchRegion" className="block text-sm text-black">Region</label>
              <Dropdown
                id="branchRegion"
                value={branchRegion}
                options={branchRegionOptions}
                onChange={(e) => handleInputChange('branchRegion', e.value)}
                placeholder="Select Region"
                className="ring-0 w-full placeholder:text-gray-400"
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="branchOffice" className="block text-sm text-black">Branch Office</label>
              <Dropdown
                id="branchOffice"
                value={branchOffice}
                options={branchOfficeOptions}
                onChange={(e) => handleInputChange('branchOffice', e.value)}
                placeholder="Select Branch"
                className="ring-0 w-full placeholder:text-gray-400"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="validId" className="block text-sm text-black">Valid ID</label>
          <FileUpload
            mode="basic"
            name="validId"
            accept="image/*"
            maxFileSize={1000000}
            chooseLabel={validIdName || "Select Image"}
            className="w-full ring-0 flex justify-center items-center border-gray-300"
            chooseOptions={{
              className: 'bg-transparent text-primary flex flex-col items-center ring-0'
            }}
            onSelect={handleFileSelect}
            invalid={!contactInfo.validIdName}
          />
          {!contactInfo.validIdName && 
              <small className='p-error'>Please input a valid id.</small>
          }
        </div>
      </div>
    </form>
  );
};

export default AccountDetails;