import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

const PersonalInformation = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [contactNumber, setContactNumber] = useState('');

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  return (
    <form className="h-full w-full p-10 bg-red-500">
      <h2 className="text-2xl font-bold mb-2 text-teal-800">Personal Information</h2>
      <p className="mb-6 text-gray-600">Please provide your basic details to get started.</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
          <InputText id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-inputtext-sm" placeholder="Juan" />
        </div>
        <div>
          <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
          <InputText id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-inputtext-sm" placeholder="Dela Cruz" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
          <Dropdown id="gender" value={gender} options={genderOptions} onChange={(e) => setGender(e.value)} className="w-full p-inputtext-sm" placeholder="Select gender" />
        </div>
        <div>
          <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-700">Birth Date</label>
          <Calendar id="birthDate" value={birthDate} onChange={(e) => setBirthDate(e.value)} className="w-full p-inputtext-sm" placeholder="Select date" />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="contactNumber" className="block mb-2 text-sm font-medium text-gray-700">Contact Number</label>
        <InputText id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full p-inputtext-sm" placeholder="+63 9" />
      </div>
    </form>
  );
};

export default PersonalInformation;