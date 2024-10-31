import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
        
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useRegistration } from '../RegistrationContext';
import { Divider } from 'primereact/divider';

const PersonalInformation = ({ personalInfo }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const { firstName, lastName, gender, birthDate, contactNumber } = registrationData.personalInfo;

  let today = new Date();
  let year = today.getFullYear();
  let maxYear = year - 18;
  let maxDate = new Date();
  maxDate.setFullYear(maxYear);

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    personalInfo[field] = value;
    updateRegistrationData('personalInfo', { [field]: value });
  };

  const handleContactNumberChange = (e) => {
    const value = e.target.value;
    handleInputChange('contactNumber', value);
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
    <form className="h-fit w-full flex flex-col gap-4">
      <h2 className="font-medium text-black text-2xl sm:text-4xl">Personal Information</h2>
      <p className="text-md text-black">Please provide your basic details to get started.</p>
      
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="firstName" className="block text-sm text-black">First Name</label>
            <InputText 
              id="firstName" 
              value={firstName} 
              onChange={(e) => handleInputChange('firstName', e.target.value)} 
              className="w-full focus:ring-0 focus:border-primary hover:border-primary"
              placeholder="First name"
              invalid={!personalInfo.firstName}
              keyfilter={/^[a-zA-Z\s]/}
              maxLength={50}
            />
            {(!personalInfo.firstName) &&
              <small className='p-error'>Please input your first name.</small>
            }
          </div>
          
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="lastName" className="block text-sm text-black">Last Name</label>
            <InputText 
              id="lastName" 
              value={lastName} 
              onChange={(e) => handleInputChange('lastName', e.target.value)} 
              className="w-full focus:ring-0 focus:border-primary hover:border-primary" 
              placeholder="Last name"
              invalid={!personalInfo.lastName} 
              keyfilter={/^[a-zA-Z\s]/}
              maxLength={50}
            />
            {(!personalInfo.lastName) &&
              <small className='p-error'>Please input your last name.</small>
            }
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="gender" className="block text-sm text-black">Gender</label>
            <Dropdown 
              id="gender" 
              value={gender} 
              options={genderOptions} 
              onChange={(e) => handleInputChange('gender', e.value)}
              placeholder="Select Gender"
              className="ring-0 w-full focus:border-primary hover:border-primary" 
              invalid={!personalInfo.gender}
            />
            {(!personalInfo.gender) &&
              <small className='p-error'>Please input your gender.</small>
            }
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="birthDate" className="block text-sm text-black">Birth Date</label>
            <Calendar 
              id="birthDate" 
              value={birthDate ? new Date(birthDate) : null} 
              onChange={handleDateChange} 
              dateFormat="mm/dd/yy"
              placeholder="MM/DD/YYYY" 
              className="ring-0 w-full focus:shadow-none custom-calendar focus:border-primary hover:border-primary" 
              showIcon
              invalid={!personalInfo.birthDate}
              maxDate={maxDate}
            />
            {(!personalInfo.birthDate) &&
              <small className='p-error'>Please input your birthdate.</small>
            }
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="contactNumber" className="block text-sm text-black">Contact Number</label>
          <InputMask
            id="contactNumber"
            mask="(+63) 9** *** ****"
            placeholder="(+63) 9** *** ****"
            value={contactNumber}
            onChange={handleContactNumberChange}
            className="w-full focus:ring-0 focus:border-primary hover:border-primary"
            invalid={!personalInfo.contactNumber}
          />
          {(!personalInfo.contactNumber) &&
              <small className='p-error'>Please input your contact number.</small>
          }
        </div>
      </div>
    </form>
  );
};

export default PersonalInformation;