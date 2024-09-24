import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { AuthClient } from "@dfinity/auth-client";
import { useNavigate } from 'react-router-dom';
import { Stepper, Step, StepLabel } from '@mui/material';
import { CircleUserRound, Contact, SlidersVertical, CircleCheckBig } from 'lucide-react';

import PersonalInformation from './RegistrationComponents/PersonalInformation';
import AccountDetails from './RegistrationComponents/AccountDetails';
import OfficeAddress from './RegistrationComponents/OfficeAddress';
import Finishing from './RegistrationComponents/Finishing';

// Step configuration
const steps = [
  { number: 1, label: 'Personal Information', icon: <CircleUserRound /> },
  { number: 2, label: 'Account Details', icon: <Contact /> },
  { number: 3, label: 'Office Address', icon: <SlidersVertical /> },
  { number: 4, label: 'Finishing', icon: <CircleCheckBig /> },
];

const CustomStepLabel = ({ icon, isActive }) => {
  return (
    <div 
      className={`
        flex items-center justify-center -translate-x-3
        w-12 h-12 rounded-full transition-all
        ${isActive 
          ? 'bg-white text-secondary scale-110' 
          : 'bg-transparent text-white border-2 border-white'
        }
      `}
    >
      {React.cloneElement(icon, { 
        size: isActive ? 28 : 24,
        className: 'transition-all'
      })}
    </div>
  );
};

const RegistrationPage = ({ onRegisterSuccess }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [principal, setPrincipal] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [region, setRegion] = useState('');

  const [activeStep, setActiveStep] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrincipal = async () => {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal().toText();
      setPrincipal(principal);
    };
    fetchPrincipal();
  }, []);

  // Handle registration process
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !position || !region) {
      alert('All fields are required.');
      return;
    }

    const nfaPersonnel = {
      principal,
      firstName,
      lastName,
      position,
      region,
    };
    try {
      const res = await fetch(`${apiUrl}/nfapersonnels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nfaPersonnel),
      });
      if (!res.ok) {
        throw new Error('Error registering user');
      }
      onRegisterSuccess();
      navigate('/admin');
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInformation onNext={handleNext} />;
      case 1:
        return <AccountDetails onNext={handleNext} />;
      case 2:
        return <OfficeAddress onNext={handleNext} />;
      case 3:
        return <Finishing onNext={handleNext} />;
      default:
        return null;
    }
  };

  return (
    <div className="font-poppins flex h-screen w-screen bg-gray-100">
      {/* Left side with stepper and background image */}
      <div className="md:flex md:w-[40%] relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('Registration-leftBG.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-[#00c26170] to-transparent"></div>
        </div>
        <div className="relative w-full z-10 p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 flex justify-center items-center drop-shadow-lg">Registration</h2>
          
          {/* Vertical Stepper */}
          <Stepper orientation="vertical" activeStep={activeStep} className="mb-8 mt-12 ml-8">
            {steps.map(({ label, icon }, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={() => <CustomStepLabel icon={icon} isActive={index === activeStep} />}>
                  <div className={`text-white transition-all ${index === activeStep ? 'text-lg font-semibold' : 'text-base'}`}>
                    <span>Step {index + 1}</span><br />{/* Line break here */}
                    {label}
                  </div>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className="flex justify-center items-center pt-24">
            <img src="favicon.ico" alt="AgriCTRL+ Logo" className="h-16 mr-2" />
            <span className="text-4xl font-bold">AgriCTRL+</span>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-2/3 p-8 flex flex-col justify-between relative">
        {/* Form content */}
        <div className="flex-grow">
          {renderStep()}
        </div>

        {/* Buttons at the bottom */}
        <div className="absolute bottom-16 left-32 right-24 flex justify-between m-2 p-2">
          <Button 
            className='border-2 border-secondary py-1 px-16 text-secondary transition duration-200 hover:bg-secondary hover:text-white ring-0' 
            label="Previous" 
            onClick={handleBack} disabled={activeStep === 0} />
          <Button
            className='border-2 border-secondary py-1 px-16 text-secondary transition duration-200 hover:bg-secondary hover:text-white ring-0'
            label={activeStep === steps.length - 1 ? "Submit" : "Next"}
            onClick={activeStep === steps.length - 1 ? handleRegister : handleNext}
          />
        </div>

        {/* Login Here text */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center p-4">
          <p className="text-center">Login Here</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;