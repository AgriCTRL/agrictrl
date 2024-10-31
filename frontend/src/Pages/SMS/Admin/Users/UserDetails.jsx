import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import CryptoJS from 'crypto-js';

const UserDetails = ({ userType, visible, onHide, selectedUser, onUserUpdated, onStatusUpdated }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const secretKey = import.meta.env.VITE_HASH_KEY;

  useEffect(() => {
    if (visible) {
      setActiveIndex(0);
      setImageError(false);
    }
  }, [visible]);

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
          <InputText 
            value={selectedUser.firstName} 
            disabled 
            className="w-full" 
            keyfilter={/^[a-zA-Z\s]/}
            maxLength={50}
          />
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Last Name</label>
          <InputText 
            value={selectedUser.lastName} 
            disabled 
            className="w-full" 
            keyfilter={/^[a-zA-Z\s]/}
            maxLength={50}
          />
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Gender</label>
          <InputText 
            value={selectedUser.gender} 
            disabled 
            className="w-full" 
            keyfilter="alpha"
            maxLength={15}
          />
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Birth Date</label>
          <InputText value={new Date(selectedUser.birthDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })} disabled className="w-full" 
          />
        </div>

        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Contact Number</label>
          <InputText 
            value={selectedUser.contactNumber} 
            disabled 
            className="w-full" 
            keyfilter="alphanum"
            maxLength={15}
          />
        </div>
    </div>
  );

  const renderAccountDetails = () => (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">User Type</label>
        <InputText 
          value={selectedUser.userType} 
          disabled 
          className="w-full" 
          keyfilter="alpha"
          maxLength={25}
        />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Organization Name</label>
        <InputText 
          value={selectedUser.organizationName} 
          disabled 
          className="w-full" 
          maxLength={50}
        />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Job Title/Position</label>
        <InputText 
          value={selectedUser.jobTitlePosition} 
          disabled 
          className="w-full" 
          maxLength={50}
          keyfilter="alphanum"
        />
      </div>
      { selectedUser.userType === 'NFA Branch Staff' && (
        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Region</label>
          <InputText 
            value={selectedUser.branchRegion} 
            disabled 
            className="w-full" 
            maxLength={50}
            keyfilter="alphanum"
          />
        </div>
      )}
      { selectedUser.userType === 'NFA Branch Staff' && (
        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Branch Office</label>
          <InputText 
            value={selectedUser.branchOffice} 
            disabled 
            className="w-full"
            maxLength={50}
            keyfilter="alphanum"
          />
        </div>
      )}
    </div>
  );

  const renderOfficeAddress = () => (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Region</label>
        <InputText 
          value={selectedUser.officeAddress.region} 
          disabled 
          className="w-full" 
          maxLength={50}
        />
      </div>
      { selectedUser.officeAddress.region !== 'National Capital Region' && (
        <div>
          <label className="block mb-2 text-md font-medium text-gray-700">Province</label>
          <InputText 
            value={selectedUser.officeAddress.province} 
            disabled 
            className="w-full" 
            maxLength={50}
          />
        </div>
      )}
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">City/Town</label>
        <InputText 
          value={selectedUser.officeAddress.cityTown} 
          disabled 
          className="w-full" 
          maxLength={50}
        />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Barangay</label>
        <InputText 
          value={selectedUser.officeAddress.barangay} 
          disabled 
          className="w-full" 
          maxLength={50}
        />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-700">Street</label>
        <InputText 
          value={selectedUser.officeAddress.street} 
          disabled 
          className="w-full" 
          maxLength={50}
        />
      </div>
    </div>
  );

  const renderVerify = () => (
    <div className='h-full'>
      <div className="space-y-2">
        <label className="block text-md font-medium text-gray-700">Valid ID</label>
        <p className="text-sm text-gray-500">{selectedUser.validIdName}</p>
        <div className="relative w-full h-96 border rounded-lg overflow-hidden bg-gray-50">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Failed to load image
            </div>
          ) : (
            <img
              src={selectedUser.validId}
              alt="Valid ID"
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>
    </div>
  );

  const updateUserStatus = async (newStatus) => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const newIsVerified = newStatus === 'Active';
      const payload = { id: selectedUser.id, status: newStatus, isVerified: newIsVerified };
      const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(payload), secretKey).toString();
      const response = await fetch(`${apiUrl}/users/update`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ encryptedPayload })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      onUserUpdated();
      onHide();
      onStatusUpdated();
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFooter = () => {
    const isLastTab = activeIndex === tabs.length - 1;
    const nextLabel = isLastTab
      ? userType === 'Pending'
        ? 'Verify'
        : selectedUser.status === 'Active'
        ? 'Make Inactive'
        : 'Make Active'
      : 'Next';

    return (
      <div className="flex justify-between mt-4">
        <Button
          label="Previous"
          onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
          disabled={activeIndex === 0 || isLoading}
          className="px-6 py-2 rounded-md text-white bg-primary disabled:opacity-50"
        />
        <Button
          label={nextLabel}
          onClick={() => {
            if (isLastTab) {
              if (userType === 'Pending') {
                updateUserStatus('Active');
              } else {
                const newStatus = selectedUser.status === 'Active' ? 'Inactive' : 'Active';
                updateUserStatus(newStatus);
              }
            } else {
              setActiveIndex((prev) => Math.min(tabs.length - 1, prev + 1));
            }
          }}
          disabled={isLoading}
          className="px-10 py-2 rounded-md text-white bg-primary disabled:opacity-50"
        />
      </div>
    );
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white flex flex-col justify-between rounded-lg p-6 shadow-lg relative">
        <button onClick={onHide} disabled={isLoading} className="absolute top-4 right-4 z-50 text-gray-600 hover:text-gray-800">
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
              headerClassName={`flex-1 text-center justify-center`}
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