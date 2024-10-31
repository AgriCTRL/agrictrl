import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import CustomPasswordInput from '../../../Components/Form/PasswordComponent';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import emailjs from 'emailjs-com';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);

  const sendVerificationCode = (email, code) => {
    const templateParams = {
      to_email: email,
      verification_code: code,
    };
  
    emailjs.send('service_cl7y98r', 'template_6csvcht', templateParams, 'bZ2aS5B6vgxk3J5LJ')
      .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
      }, (err) => {
        console.error('Failed to send email:', err);
      });
  };

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

  const getVerificationCodeAsString = () => {
    return verificationCode.join('').toUpperCase();
  };

  const generateCode = () => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
  
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
  
    return code;
  };

  const validatePassword = (password) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 8;

    return hasLowerCase && hasUpperCase && hasNumber && isLongEnough;
  };

  const handleEmailSubmit = async () => {    
    setIsLoading(true);
    const emailBody = { email };
    try {
      const res = await fetch(`${apiUrl}/users/forgotpassword`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(emailBody)
      });
      if (!res.ok) {
        throw new Error ('email is not existing')
      }
      const id = await res.json();
      
      const generatedCode = generateCode();

      sendVerificationCode(email, generatedCode);

      const codeBody = {
        id,
        code: generatedCode
      }
      
      const codeRes = await fetch(`${apiUrl}/users/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(codeBody)
      });
      if (!codeRes.ok) {
        throw new Error ('failed to update code')
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email does not exist!', life: 3000 });
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerifyCode = async () => {
    setIsLoading(true);
    const codeString = getVerificationCodeAsString();
    const body = { email, code: codeString };

    try {
      const res = await fetch(`${apiUrl}/users/verifycode`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })
      if(!res.ok) {
        throw new Error ('code cannot be verified')
      }
      setUserId(await res.json());
      setCurrentStep(currentStep + 1);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Wrong verification code, please try again.', life: 3000 });
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdatePassword = async () => {
    if (!validatePassword(password)) {
      toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 8 characters long.',
          life: 3000
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Password does not match.', life: 3000 });
      return;
    }

    setIsLoading(true);
    const passwordBody = { id: userId, password };
    try {
      const res = await fetch(`${apiUrl}/users/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(passwordBody)
      })
      if(!res.ok) {
        throw new Error ('failed to update password')
      }
      navigate('/login');
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const forgotPassButton = () => {
    if (currentStep === 1) {
      handleEmailSubmit();
    } else if (currentStep === 2) {
      handleVerifyCode();
    } else if (currentStep === 3) {
      handleUpdatePassword();
    }
  };

  const LoginButton = (e) => {
    e.preventDefault();
    navigate('/login');
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
              keyfilter="email"
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
              <Password
                id="password"
                value={password}
                footer={footer}
                toggleMask 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                inputClassName='w-full ring-0'
                maxLength={50}
              />
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
              <Password
                id="password"
                value={confirmPassword}
                toggleMask 
                feedback={false}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your password"
                inputClassName='w-full ring-0'
                maxLength={50}
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
      <Toast ref={toast}/>
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
            disabled={isLoading}
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