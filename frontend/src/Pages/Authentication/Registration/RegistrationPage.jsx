import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Stepper, Step, StepLabel } from '@mui/material';
import { CircleUserRound, Contact, SlidersVertical, CircleCheckBig } from 'lucide-react';
import { Toast } from 'primereact/toast';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import PersonalInformation from './RegistrationComponents/PersonalInformation';
import AccountDetails from './RegistrationComponents/AccountDetails';
import OfficeAddress from './RegistrationComponents/OfficeAddress';
import Finishing from './RegistrationComponents/Finishing';
import { RegistrationProvider, useRegistration } from './RegistrationContext';


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
      className={`flex items-center justify-center -translate-x-3
                  w-12 h-12 rounded-full transition-all
                  ${isActive 
                    ? 'bg-white text-secondary scale-110' 
                    : 'bg-transparent text-white border-2 border-white'
                  }`}
    >
      {React.cloneElement(icon, { 
        size: isActive ? 28 : 24,
        className: 'transition-all'
      })}
    </div>
  );
};

const RegistrationPageContent = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const { registrationData } = useRegistration();
  const toast = useRef(null);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [selectedFile, setSelectedFile ] = useState(null);

  const handleFileUpload = async () => {
    if (!selectedFile) return null;

    const fileName = `${uuidv4()}_${selectedFile.name}`;
    const storageRef = ref(storage, `validIds/${fileName}`);

    try {
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return { downloadURL };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  if (!confirmPasswordValid) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Passwords do not match.', life: 3000 });
    return;
  }

  try {
    const fileData = await handleFileUpload();
    let updatedAccountDetails = { ...registrationData.accountDetails };

    if (fileData) {
      updatedAccountDetails = {
        ...updatedAccountDetails,
        validId: fileData.downloadURL
      };
    }

    const registrationPayload = {
      ...registrationData.personalInfo,
      ...updatedAccountDetails,
      ...registrationData.officeAddress,
      ...registrationData.finishingDetails,
    };

    const res = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'API-Key': `${apiKey}`
      },
      body: JSON.stringify(registrationPayload),
    });

    if (!res.ok) {
      throw new Error('Error registering user');
    }

    navigate('/login');
    localStorage.removeItem('registrationData');
  } catch (error) {
    console.log(error.message);
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Registration failed. Please try again.', life: 3000 });
  }
};

  const LoginButton = (e) => {  
    localStorage.removeItem('registrationData'); 
    e.preventDefault();
    navigate('/login');
  }

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInformation />;
      case 1:
        return <AccountDetails setSelectedFile={setSelectedFile}/>;
      case 2:
        return <OfficeAddress />;
      case 3:
        return <Finishing setConfirmPasswordValid={setConfirmPasswordValid}/>;
      default:
        return null;
    }
  };

  return (
    <div className="font-poppins flex h-screen w-screen bg-gray-100">
      <Toast ref={toast} />

      {/* Left Side */}
      <div className="md:flex md:w-[40%] relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('Registration-leftBG.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-[#00c26170] to-transparent"></div>
        </div>

        <div className="flex flex-col justify-between w-full z-10 p-8 text-white">
          <div>
            <h2 className="text-3xl font-bold mb-6 flex justify-center items-center drop-shadow-lg">Registration</h2>
            
            <Stepper orientation="vertical" activeStep={activeStep} className="mb-8 mt-12 ml-8">
              {steps.map(({ label, icon }, index) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={() => <CustomStepLabel icon={icon} isActive={index === activeStep} />}>
                    <div className={`text-white transition-all ${index === activeStep ? 'text-lg font-semibold' : 'text-base'}`}>
                      <span>Step {index + 1}</span><br />
                      {label}
                    </div>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
          

          <div className="flex justify-center items-center pt-24">
            <img src="favicon.ico" alt="AgriCTRL+ Logo" className="h-16 mr-2" />
            <span className="text-4xl font-bold">AgriCTRL+</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-2/3 p-8 flex flex-col justify-between relative">
        <div className="flex-grow">
          {renderStep()}
        </div>

        <div className="absolute bottom-16 left-32 right-24 flex justify-between m-2 p-2">
          <Button 
            className='border-2 border-secondary bg-transparent py-1 px-16 text-secondary transition duration-200 hover:bg-secondary hover:text-white ring-0' 
            label="Previous" 
            onClick={handleBack} disabled={activeStep === 0} />
          <Button
            className='border-2 border-secondary bg-transparent py-1 px-16 text-secondary transition duration-200 hover:bg-secondary hover:text-white ring-0'
            label={activeStep === steps.length - 1 ? "Submit" : "Next"}
            onClick={activeStep === steps.length - 1 ? handleRegister : handleNext}
          />
        </div>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <a onClick={LoginButton} className="text-sm text-primary hover:underline">Login here</a>
        </div>
      </div>
    </div>
  );
};

const RegistrationPage = (props) => (
  <RegistrationProvider>
    <RegistrationPageContent {...props} />
  </RegistrationProvider>
);

export default RegistrationPage;
