import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useRegistration } from '../RegistrationContext';

const PersonalInformation = () => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const { firstName, lastName, gender, birthDate, contactNumber } = registrationData.personalInfo;

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
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
            className="ring-0 w-full p-inputtext-sm p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium" 
            placeholder="first name" />
        </div>
        
        <div className="w-1/2">
          <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
          <InputText 
            id="lastName" 
            value={lastName} 
            onChange={(e) => handleInputChange('lastName', e.target.value)} 
            className="ring-0 w-full p-inputtext-sm p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium" 
            placeholder="last name" />
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
            className="ring-0 w-full p-inputtext-md font-medium rounded-md border border-gray-300" 
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-700">Birth Date</label>
          <Calendar 
            id="birthDate" 
            value={birthDate} 
            onChange={(e) => handleInputChange('birthDate', e.value)}
            placeholder="MM/DD/YYYY" 
            className="ring-0 w-full p-inputtext-sm rounded-md bg-white border-gray-300 placeholder:text-gray-500 placeholder:font-medium" 
            showIcon/>
        </div>
      </div>

      <div className="mb-4 w-full">
        <label htmlFor="contactNumber" className="block mb-2 text-sm font-medium text-gray-700">Contact Number</label>
        <InputText 
          id="contactNumber" 
          value={contactNumber} 
          onChange={handleContactNumberChange} 
          className="ring-0 w-1/2 p-inputtext-sm p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium" 
          placeholder="+63 9" 
          type="tel"/>
      </div>
    </form>
  );
};

export default PersonalInformation;