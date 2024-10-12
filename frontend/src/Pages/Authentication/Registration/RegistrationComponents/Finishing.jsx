import React from 'react';
import { InputText } from 'primereact/inputtext';
import CustomPasswordInput from '../../../../Components/Form/PasswordComponent';
import { useRegistration } from '../RegistrationContext';

const Finishing = ({setConfirmPasswordValid}) => {
  const { registrationData, updateRegistrationData, confirmPassword, updateConfirmPassword } = useRegistration();
  const { email, password } = registrationData.finishingDetails;

  const handleInputChange = (field, value) => {
    updateRegistrationData('finishingDetails', { [field]: value });
  };

  const handleConfirmPasswordChange = (value) => {
    updateConfirmPassword(value);
    setConfirmPasswordValid(value === password); // Check if passwords match
  };

  return (
    <form className="h-full w-full px-16">
      <h2 className="text-4xl font-medium mb-2 text-secondary">Finishing</h2>
      <p className="mb-6 font-medium text-black">You're almost done! Please provide your email and create a secure password to complete your registration.</p>
      
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <InputText 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => handleInputChange('email', e.target.value)}  
          placeholder="Enter your email" 
          className="w-full focus:ring-0"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <CustomPasswordInput 
          id="password" 
          value={password} 
          onChange={(e) => handleInputChange('password', e.target.value)} 
          placeholder="Enter your password" 
          className="focus:border-[#14b8a6] hover:border-[#14b8a6] w-full p-inputtext-sm p-3 rounded-md border placeholder:text-gray-400 placeholder:font-normal"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
        <CustomPasswordInput 
          id="confirmPassword" 
          value={confirmPassword} 
          onChange={(e) => handleConfirmPasswordChange(e.target.value)}  
          placeholder="Confirm your password" 
          className="focus:border-[#14b8a6] hover:border-[#14b8a6] w-full p-inputtext-sm p-3 rounded-md border border-gray-300 placeholder:text-gray-400 placeholder:font-normal"
        />
      </div>
    </form>
  );
};

export default Finishing;