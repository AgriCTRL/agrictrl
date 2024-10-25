import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const PasswordComponent = ({ id, value, onChange, placeholder, className, disabled }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        if (!disabled) {
            setShowPassword(!showPassword);
        }
    };

    return (
        <div className="relative">
            <input
                id={id}
                type={showPassword ? 'text' : 'password'} // Toggle between text and password type
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none ${className}`}
                disabled={disabled} // Handle the disabled state
                style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '16px',
                }}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 flex items-center px-3 ${
                disabled ? 'cursor-not-allowed opacity-50' : 'text-gray-500 hover:text-gray-700'
                } focus:outline-none`}
                disabled={disabled} // Disable the button if input is disabled
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
