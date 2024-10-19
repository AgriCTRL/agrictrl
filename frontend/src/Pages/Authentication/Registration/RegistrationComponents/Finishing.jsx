import React from 'react';
import { InputText } from 'primereact/inputtext';
import { useRegistration } from '../RegistrationContext';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';

const Finishing = ({setConfirmPasswordValid}) => {
  const { registrationData, updateRegistrationData, confirmPassword,} = useRegistration();
  const { email, password } = registrationData.finishingDetails;

  const handleInputChange = (field, value) => {
    updateRegistrationData('finishingDetails', { [field]: value });
    if (field === 'password') {
      setConfirmPasswordValid(value === confirmPassword);
    }
  };

  const footer = (
		<>
			<Divider />
			<p className="mt-2">Suggestions</p>
			<ul className="pl-2 ml-2 mt-0 line-height-3">
				<li>At least one lowercase</li>
				<li>At least one uppercase</li>
				<li>At least one numeric</li>
				<li>Minimum 8 characters</li>
			</ul>
		</>
	);

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
        <Password
          id="password"
          value={password}
          footer={footer}
          toggleMask 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          inputClassName='w-full p-3 ring-0'
        />
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
        <Password
          id="password"
          value={confirmPassword}
          toggleMask 
          feedback={false}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Enter your password"
          inputClassName='w-full p-3'
        />
      </div>
    </form>
  );
};

export default Finishing;