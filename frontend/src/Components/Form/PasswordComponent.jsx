import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const PasswordComponent = ({ id, value, onChange, placeholder, className }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none ${
          showPassword ? '' : 'password-mask'
        } ${className}`}
        style={{
          fontFamily: 'Poppins, sans-serif', // Set Poppins as the font
          fontSize: '16px', // Optional: set font size
          '-webkit-text-security': showPassword ? 'none' : 'disc',
        }}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {showPassword ? (
          <EyeOffIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default PasswordComponent;
