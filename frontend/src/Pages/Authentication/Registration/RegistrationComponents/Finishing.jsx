import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import CustomPasswordInput from '../../../../Components/Form/PasswordComponent';

const Finishing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
          className="ring-0 w-full p-inputtext-sm p-4 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <CustomPasswordInput 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter your password" 
          className="ring-0 w-full p-inputtext-sm p-4 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
        <CustomPasswordInput 
          id="confirmPassword" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirm your password" 
          className="ring-0 w-full p-inputtext-sm p-4 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
        />
      </div>
    </form>
  );
};

export default Finishing;