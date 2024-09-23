import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import { CircleUserRound, Contact, SlidersVertical, CircleCheckBig } from 'lucide-react';

import PersonalInformation from './RegistrationComponents/PersonalInformation';
import AccountDetails from './RegistrationComponents/AccountDetails';
import OfficeAddress from './RegistrationComponents/OfficeAddress';
import Finishing from './RegistrationComponents/Finishing';

const RegistrationPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { number: 'Step 1', label: 'Personal Information' },
    { number: 'Step 2', label: 'Account Details' },
    { number: 'Step 3', label: 'Office Address' },
    { number: 'Step 4', label: 'Finishing' }
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <PersonalInformation onNext={() => setActiveStep(1)} />;
      case 1:
        return <AccountDetails onNext={() => setActiveStep(2)} onPrevious={() => setActiveStep(0)} />;
      case 2:
        return <OfficeAddress onNext={() => setActiveStep(3)} onPrevious={() => setActiveStep(1)} />;
      case 3:
        return <Finishing onPrevious={() => setActiveStep(2)} />;
      default:
        return 'Unknown step';
    }
  };

  const getStepIcon = (index) => {
    const isActive = index === activeStep;
    const icons = [<CircleUserRound />, <Contact />, <SlidersVertical />, <CircleCheckBig />];

    return (
      <div
        className={`flex items-center justify-center rounded-full border-2 transition-all duration-500 ${
          isActive ? 'bg-white text-secondary border-white scale-125' : 'bg-transparent text-white border-white'
        }`}
        style={{ width: '40px', height: '40px' }}
      >
        <div className={`transition-all duration-500 ${isActive ? 'text-2xl' : 'text-xl'}`}>
          {icons[index]}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-[35%_65%] grid-rows-1 h-screen w-screen bg-gray-100">
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="w-full max-w-4xl p-6 m-10 sm:p-10 bg-green-500 rounded-xl flex flex-col" style={{ minHeight: '80vh' }}>
          <h2 className="flex justify-center text-2xl font-bold mb-6 text-white">Registration</h2>

          <div className="flex-grow"></div>

          <div className="flex-grow my-6">
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() => getStepIcon(index)}
                    classes={{
                      root: 'flex items-center',
                      labelContainer: 'ml-4'
                    }}
                  >
                    <div className="text-white">
                      <div className="font-bold">{step.number}</div>
                      <div className="text-sm">{step.label}</div>
                    </div>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          <div className="flex-grow"></div>

          <div className="mt-auto flex flex-row justify-center items-center">
            <img src="favicon.ico" alt="AgriCTRL+ Logo" className="h-12 mr-2" />
            <span className="text-2xl font-bold text-white">AgriCTRL+</span>
          </div>
        </div>
      </div>

      <div className="w-full p-8 flex flex-col justify-between">
        {getStepContent(activeStep)}

        <div className="mt-8 flex justify-between">
          <Button
            variant="contained"
            color="secondary"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setActiveStep((prev) => prev + 1)}
            disabled={activeStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;