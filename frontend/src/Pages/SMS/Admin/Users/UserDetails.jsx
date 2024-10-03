import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const UserDetails = ({ userType, visible, onHide, userData }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = [
    { header: 'Personal Information', key: 'personal' },
    { header: 'Account Details', key: 'account' },
    { header: 'Office Address', key: 'office' },
    { header: userType === 'pending' ? 'Verify' : 'Status', key: 'status' }
  ];

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
      <div>
        <Button
          label="Previous"
          onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
          disabled={activeIndex === 0}
          className="p-button-secondary mr-2"
        />
        <Button
          label={nextLabel}
          onClick={() => {
            if (isLastTab) {
              // Handle final action based on userType
              console.log(`Performing ${nextLabel} action for user:`, userData);
              onHide();
            } else {
              setActiveIndex((prev) => Math.min(tabs.length - 1, prev + 1));
            }
          }}
        />
      </div>
    );
  };

  return (
    <Dialog 
      header="User Details" 
      visible={visible} 
      style={{ width: '50vw' }} 
      onHide={onHide}
      footer={renderFooter()}
    >
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {tabs.map((tab) => (
          <TabPanel key={tab.key} header={tab.header}>
            <InputText placeholder={`Enter ${tab.header}`} className="w-full" />
          </TabPanel>
        ))}
      </TabView>
    </Dialog>
  );
};

export default UserDetails;