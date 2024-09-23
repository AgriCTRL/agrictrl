import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password'; // Import Password from primereact

const Finishing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <form className="h-full w-full p-10 bg-red-500">
      <h2 className="text-2xl font-bold mb-2 text-teal-800">Finishing</h2>
      <p className="mb-6 text-gray-600">You're almost done! Please provide your email and create a secure password to complete your registration.</p>
      
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-inputtext-sm" placeholder="Enter your email" />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask className="w-full p-inputtext-sm" placeholder="Enter your password" />
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
        <Password id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask className="w-full p-inputtext-sm" placeholder="Confirm your password" />
      </div>
    </form>
  );
};

export default Finishing;
