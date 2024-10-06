import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const UserDetails = ({ userType, visible, onHide }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setActiveIndex(0);
    }
  }, [visible]);

  // Static data for testing
  const userData = {
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      birthDate: new Date('1990-01-01'),
      contactNumber: '09123456789',
    },
    accountDetails: {
      userType: 'NFA Branch Staff',
      organizationName: 'NFA Branch Office',
      jobTitle: 'Manager',
      region: 'Region 1',
      branchOffice: 'Office 1',
    },
    officeAddress: {
      region: 'Region 1',
      province: 'Province 1',
      cityTown: 'City 1',
      barangay: 'Barangay 1',
      street: '123 Main St.',
    },
    validId: 'Valid ID Data',
  };

  const tabs = [
    { header: 'Personal Information', key: 'personal' },
    { header: 'Account Details', key: 'account' },
    { header: 'Office Address', key: 'office' },
    { header: userType === 'pending' ? 'Verify' : 'Status', key: 'status' },
  ];

  const renderPersonalInformation = () => (
    <div className="grid grid-cols-2 gap-4 h-full">
        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">First Name</label>
          <InputText value={userData.personalInfo.firstName} disabled className="w-full p-2 border rounded-md border-gray-300" />
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Last Name</label>
          <InputText value={userData.personalInfo.lastName} disabled className="w-full p-2 border rounded-md border-gray-300" />
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Gender</label>
          <InputText value={userData.personalInfo.gender} disabled className="w-full p-2 border rounded-md border-gray-300" />
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Birth Date</label>
          <Calendar value={userData.personalInfo.birthDate} disabled className="w-full p-2 border rounded-md border-gray-300" />
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Contact Number</label>
          <InputText value={userData.personalInfo.contactNumber} disabled className="w-full p-2 border rounded-md border-gray-300" />
        </div>
    </div>
  );

  const renderAccountDetails = () => (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">User Type</label>
        <InputText value={userData.accountDetails.userType} disabled className="w-full p-2 border rounded-md border-gray-300" />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Organization Name</label>
        <InputText value={userData.accountDetails.organizationName} disabled className="w-full p-2 border rounded-md border-gray-300" />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Job Title/Position</label>
        <InputText value={userData.accountDetails.jobTitle} disabled className="w-full p-2 border rounded-md border-gray-300" />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Region</label>
        <InputText value={userData.accountDetails.region} disabled className="w-full p-2 border rounded-md border-gray-300" />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Branch Office</label>
        <InputText value={userData.accountDetails.branchOffice} disabled className="w-full p-2 border rounded-md border-gray-300" />
      </div>
    </div>
  );

  const renderOfficeAddress = () => (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Region</label>
        <InputText value={userData.officeAddress.region} disabled className="w-full p-2 border rounded-md border-gray-300" />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Province</label>
        <InputText value={userData.officeAddress.province} disabled className="w-full p-2 border rounded-md border-gray-300" />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">City/Town</label>
        <InputText value={userData.officeAddress.cityTown} disabled className="w-full p-2 border rounded-md border-gray-300" />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Barangay</label>
        <InputText value={userData.officeAddress.barangay} disabled className="w-full p-2 border rounded-md border-gray-300" />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Street</label>
        <InputText value={userData.officeAddress.street} disabled className="w-full p-2 border rounded-md border-gray-300" />
      </div>
    </div>
  );

  const renderVerify = () => (
    <div className='h-full'>
      <label className="block mb-2 text-md font-medium text-gray-700">Valid ID</label>
      <div className="w-full h-40 bg-green-200 flex items-center justify-center border rounded-md border-gray-300">
        {userData.validId}
      </div>
    </div>
  );

  const renderFooter = () => {
    const isLastTab = activeIndex === tabs.length - 1;
    const nextLabel = isLastTab
      ? userType === 'pending'
        ? 'Verify'
        : userType === 'active'
        ? 'Make Inactive'
        : 'Make Active'
      : 'Next';

      return (
        <div className="flex justify-between mt-4">
          <Button
            label="Previous"
            onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeIndex === 0}
            className="px-6 py-2 rounded-md text-white bg-primary disabled:opacity-50"
          />
          <Button
            label={nextLabel}
            onClick={() => {
              if (isLastTab) {
                console.log(`Performing ${nextLabel} action for user:`, userData);
                onHide();
              } else {
                setActiveIndex((prev) => Math.min(tabs.length - 1, prev + 1));
              }
            }}
            className="px-10 py-2 rounded-md text-white bg-primary"
          />
        </div>
      );
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white flex flex-col justify-between rounded-lg p-6 shadow-lg relative">
        <button onClick={onHide} className="absolute top-4 right-4 z-50 text-gray-600 hover:text-gray-800">
          ✕
        </button>

        <TabView
          className="flex-grow flex flex-col"
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {tabs.map((tab, index) => (
            <TabPanel
              key={tab.key}
              header={tab.header}
              headerClassName={`flex-1 text-center py-2 justify-center ${
                activeIndex === index
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-500 border-b-2 border-gray-300'
              }`}
              contentClassName="flex-grow overflow-y-auto p-4"
            >
              <div className="h-full">
                {index === 0 && renderPersonalInformation()}
                {index === 1 && renderAccountDetails()}
                {index === 2 && renderOfficeAddress()}
                {index === 3 && renderVerify()}
              </div>
            </TabPanel>
          ))}
        </TabView>


        {renderFooter()}
      </div>
    </div>
  );
};

export default UserDetails;
