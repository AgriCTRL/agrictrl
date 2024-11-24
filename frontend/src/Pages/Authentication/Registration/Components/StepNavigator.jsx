import React from "react";
import { Button } from "primereact/button";
import { useRegistration } from "../RegistrationContext";

const StepNavigator = ({ 
    activeStep, 
    prevStep,
    nextStep,
    handleBack, 
    handleNext, 
    handleRegister 
}) => {
    const { steps } = useRegistration();

    return (
        <div className="flex gap-4 justify-between">
            <Button
                className="transition ring-0 border-lightest-grey hover:border-primary w-1/2 flex-col items-start"
                onClick={handleBack}
                disabled={activeStep === 0}
                outlined
            >
                <small className="text-black">Previous step</small>
                <p className="font-semibold text-primary">{prevStep}</p>
            </Button>
            <Button
                className="transition ring-0 border-lightest-grey hover:border-primary w-1/2 flex-col items-end"
                onClick={
                activeStep === steps.length - 1 ? handleRegister : handleNext
                }
                outlined
            >
                <small className="text-black">{activeStep === steps.length - 1 ? "Done!" : "Next step"}</small>
                <p className="font-semibold text-primary">{activeStep === steps.length - 1 ? "Submit" : nextStep}</p>
            </Button>
        </div>
    );
};

export default StepNavigator;