import React from 'react';
import { InputText } from 'primereact/inputtext';
import CustomPasswordInput from '../../../../Components/Form/PasswordComponent';
import { useRegistration } from '../RegistrationContext';

const Finishing = ({ setConfirmPasswordValid, credsInfo }) => {
  const { registrationData, updateRegistrationData, confirmPassword, updateConfirmPassword } = useRegistration();
  const { email, password } = registrationData.finishingDetails;

  const handleInputChange = (field, value) => {
    credsInfo[field] = value;
    updateRegistrationData('finishingDetails', { [field]: value });
    if (field === 'password') {
      setConfirmPasswordValid(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value) => {
    updateConfirmPassword(value);
    setConfirmPasswordValid(value === registrationData.finishingDetails.password); // Check if passwords match
  };

  return (
    <form className="h-fit w-full flex flex-col gap-4">
      <h2 className="font-medium text-black text-2xl sm:text-4xl">Finishing</h2>
      <p className="text-md text-black">You're almost done! Please provide your email and create a secure password to complete your registration.</p>
      
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="block text-sm text-black">Email</label>
          <InputText 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => handleInputChange('email', e.target.value)}  
            placeholder="Enter your email" 
            className="w-full focus:ring-0 focus:border-primary hover:border-primary"
            invalid={!credsInfo.email}
          />
          {!credsInfo.email &&
            <small className='p-error'>Please input your email.</small>
          }
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="block text-sm text-black">Password</label>
          <CustomPasswordInput 
            id="password" 
            value={password} 
            onChange={(e) => handleInputChange('password', e.target.value)} 
            placeholder="Enter your password" 
            className="focus:border-[#14b8a6] hover:border-[#14b8a6] w-full p-inputtext-sm p-3 rounded-md border placeholder:text-gray-400 placeholder:font-normal"
            invalid={!credsInfo.password}
          />
          {!credsInfo.password &&
            <small className='p-error'>Please input your password.</small>
          }
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="block text-sm text-black">Confirm Password</label>
          <CustomPasswordInput 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}  
            placeholder="Confirm your password" 
            className="focus:border-[#14b8a6] hover:border-[#14b8a6] w-full p-inputtext-sm p-3 rounded-md border border-gray-300 placeholder:text-gray-400 placeholder:font-normal"
            invalid={!credsInfo.confirmPassword}
          />
          {!credsInfo.confirmPassword &&
            <small className='p-error'>Please input your password.</small>
          }
        </div>
      </div>
    </form>
  );
};

export default Finishing;