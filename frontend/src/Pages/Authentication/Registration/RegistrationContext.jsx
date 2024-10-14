import React, { createContext, useContext, useState, useEffect } from 'react';

const RegistrationContext = createContext();

export const useRegistration = () => useContext(RegistrationContext);

export const RegistrationProvider = ({ children }) => {
  const [registrationData, setRegistrationData] = useState(() => {
    const savedData = localStorage.getItem('registrationData');
    return savedData ? JSON.parse(savedData) : {
      personalInfo: {},
      accountDetails: {},
      officeAddress: {},
      finishingDetails: {}
    };
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
    // Create a copy of registrationData without confirmPassword
    const { finishingDetails, ...rest } = registrationData;
    const { confirmPassword, ...safeFinishingDetails } = finishingDetails;
    return { ...rest, finishingDetails: safeFinishingDetails };
  };

  return (
    <RegistrationContext.Provider value={{ 
      registrationData, 
      updateRegistrationData, 
      confirmPassword, 
      updateConfirmPassword,
      getRegistrationDataForSubmission 
    }}>
      {children}
    </RegistrationContext.Provider>
  );
};