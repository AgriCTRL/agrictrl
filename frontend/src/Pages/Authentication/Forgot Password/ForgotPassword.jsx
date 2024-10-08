import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import CustomPasswordInput from '../../../Components/Form/PasswordComponent';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

	const handleVerificationCodeChange = (index, value, event) => {
		const newVerificationCode = [...verificationCode];
		newVerificationCode[index] = value;
		setVerificationCode(newVerificationCode);

		// Move to the next input if current one is filled
		if (value !== '' && index < 3) {
			document.getElementById(`code-${index + 1}`).focus();
		}

		// Delete
		if (event.key === 'Backspace' && value === '' && index > 0) {
			document.getElementById(`code-${index - 1}`).focus();
		}
	};

  const forgotPassButton = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/login');
    }
  };

  const LoginButton = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="mb-10 w-full">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email here"
              className="w-full focus:ring-0"
            />
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center mb-6 w-full justify-center">
            <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
            <div className="flex">
              {verificationCode.map((digit, index) => (
								<InputText
									key={index}
									id={`code-${index}`}
									value={digit}
									onChange={(e) => handleVerificationCodeChange(index, e.target.value, e)}
									onKeyDown={(e) => handleVerificationCodeChange(index, e.target.value, e)}
									className="flex text-center w-16 h-16 focus:ring-0 mx-1"
									maxLength={1}
								/>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <>
            <div className="mb-4 w-full">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <CustomPasswordInput 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                className="focus:border-[#14b8a6] hover:border-[#14b8a6] w-full p-inputtext-sm p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
              />
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
              <CustomPasswordInput 
                id="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}  
                placeholder="Confirm your password" 
                className="focus:border-[#14b8a6] hover:border-[#14b8a6] w-full p-inputtext-sm p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-row">
      {/* Left side */}
      <div className="flex flex-col justify-between h-full w-[45%] bg-green-700 p-8 text-white relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: 'url("/Login-BG.jpg")', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        {/* Filter Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-[#00c26170] to-transparent"></div>

        <div className="relative z-20 w-full flex flex-col items-center">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="favicon.ico" alt="AgriCTRL+ Logo" className="h-12 mr-4" />
              <h1 className="text-2xl font-bold">AgriCTRL+</h1>
            </div>
          </div>
        </div>

        <div className="relative z-20 w-full flex flex-col items-center">
          <h3 className="text-sm">Always make sure to keep your password secret.</h3>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-center justify-between h-full w-[55%] p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-6">
          {currentStep === 3 ? 'Change Password' : 'Reset Password'}
        </h1>
        
        <div className="h-full w-full flex flex-col justify-start items-center my-10">
          <p className="text-md font-medium text-black mb-10">
            {currentStep === 1 && "Please enter your registered email"}
            {currentStep === 2 && "Please enter the verification code sent to your email"}
            {currentStep === 3 && "Please enter your new password"}
          </p>

          {renderStep()}

          <Button 
            label={currentStep === 3 ? "Change Password" : "Continue"}
            onClick={forgotPassButton}
            className="w-full bg-gradient-to-r from-secondary to-primary text-white px-20 py-3 rounded-lg"
          />
        </div>
        
        <div className="mt-6 text-center">
          <span className="text-sm font-medium text-black">Remembered Password? </span>
          <a href="#" onClick={LoginButton} className="text-sm font-medium text-green-600 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;