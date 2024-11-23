import { CircleCheckBig, CircleUserRound, Contact, SlidersVertical } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect } from 'react';

const RegistrationContext = createContext();

export const useRegistration = () => useContext(RegistrationContext);

export const RegistrationProvider = ({ children }) => {
  const [registrationData, setRegistrationData] = useState(() => {
    const savedData = localStorage.getItem('registrationData');
    const defaultData = {
      personalInfo: {},
      accountDetails: {},
      officeAddress: {},
      finishingDetails: {},
    };
  
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        return { ...defaultData, ...parsedData };
      } catch (error) {
        console.error("Error parsing registration data:", error);
      }
    }
  
    return defaultData;
  });
  

  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    localStorage.setItem('registrationData', JSON.stringify(registrationData));
  }, [registrationData]);

  const updateRegistrationData = (step, data) => {
    setRegistrationData(prevData => ({
      ...prevData,
      [step]: { ...prevData[step], ...data }
    }));
  };

  const updateConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const getRegistrationDataForSubmission = () => {
    const { finishingDetails, ...rest } = registrationData;
    const { confirmPassword, ...safeFinishingDetails } = finishingDetails;
    return { ...rest, finishingDetails: safeFinishingDetails };
  };

  const steps = [
    { number: 0, label: "Personal Information", icon: <CircleUserRound /> },
    { number: 1, label: "Account Details", icon: <Contact /> },
    { number: 2, label: "Office Address", icon: <SlidersVertical /> },
    { number: 3, label: "Finishing", icon: <CircleCheckBig /> },
  ];

  return (
    <RegistrationContext.Provider value={{ 
      registrationData, 
      updateRegistrationData, 
      confirmPassword, 
      updateConfirmPassword,
      getRegistrationDataForSubmission, 
      steps
    }}>
      {children}
    </RegistrationContext.Provider>
  );
};