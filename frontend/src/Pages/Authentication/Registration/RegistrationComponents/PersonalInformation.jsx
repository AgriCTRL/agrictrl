import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useRegistration } from '../RegistrationContext';

const PersonalInformation = () => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const { firstName, lastName, gender, birthDate, contactNumber } = registrationData.personalInfo;

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    updateRegistrationData('personalInfo', { [field]: value });
  };

  const handleContactNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      handleInputChange('contactNumber', value);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.value;
    if (selectedDate) {
      const offset = selectedDate.getTimezoneOffset();
      const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));

      const formattedDate = adjustedDate.toISOString().split('T')[0];
      handleInputChange('birthDate', formattedDate);
    } else {
      handleInputChange('birthDate', null);
    }
  };

  return (
    <form className="h-full w-full px-16">
      <h2 className="text-4xl font-medium mb-6 text-secondary">Personal Information</h2>
      <p className="mb-10 font-medium text-black">Please provide your basic details to get started.</p>
      
      <div className="flex flex-row space-x-2 mb-4">
        <div className="w-1/2">
          <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
          <InputText 
            id="firstName" 
            value={firstName} 
            onChange={(e) => handleInputChange('firstName', e.target.value)} 
            className="w-full focus:ring-0" 
            placeholder="First name" />
        </div>
        
        <div className="w-1/2">
          <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
          <InputText 
            id="lastName" 
            value={lastName} 
            onChange={(e) => handleInputChange('lastName', e.target.value)} 
            className="w-full focus:ring-0" 
            placeholder="Last name" />
        </div>
      </div>

      <div className="flex flex-row w-full space-x-2 mb-4">
        <div className="w-1/2">
          <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
          <Dropdown 
            id="gender" 
            value={gender} 
            options={genderOptions} 
            onChange={(e) => handleInputChange('gender', e.value)}
            placeholder="Select Gender"
            className="ring-0 w-full placeholder:text-gray-400" 
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-700">Birth Date</label>
          <Calendar 
            id="birthDate" 
            value={birthDate ? new Date(birthDate) : null} 
            onChange={handleDateChange} 
            dateFormat="mm/dd/yy"
            placeholder="MM/DD/YYYY" 
            className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar" 
            showIcon/>
        </div>
      </div>

      <div className="mb-4 w-full">
        <label htmlFor="contactNumber" className="block mb-2 text-sm font-medium text-gray-700">Contact Number</label>
        <InputText 
          id="contactNumber" 
          value={contactNumber} 
          onChange={handleContactNumberChange} 
          className="w-1/2 focus:ring-0" 
          placeholder="+63 9" 
          type="tel"/>
      </div>
    </form>
  );
};

export default PersonalInformation;