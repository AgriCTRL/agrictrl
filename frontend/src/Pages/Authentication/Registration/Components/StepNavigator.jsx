import React from "react";
import { Button } from "primereact/button";
import { useRegistration } from "../RegistrationContext";
import { LoaderCircle } from "lucide-react";

const StepNavigator = ({
    activeStep,
    prevStep,
    nextStep,
    handleBack,
    handleNext,
    handleRegister,
    isSubmitting,
}) => {
    const { steps } = useRegistration();
    const isLastStep = activeStep === steps.length - 1;

    const getButtonText = (type) => {
        if (isSubmitting) return type === "main" ? "Submitting..." : "Wait!";
        if (isLastStep) return type === "main" ? "Submit" : "Done!";
        return type === "main" ? nextStep : "Next step";
    };

    const buttonStyles = `transition ring-0 border-lightest-grey hover:border-primary w-1/2 flex-col`;

    return (
        <div className="flex gap-4 justify-between">
            <Button
                className={`${buttonStyles} items-start`}
                onClick={handleBack}
                disabled={activeStep === 0 || isSubmitting}
                outlined
            >
                <small className="text-black">Previous step</small>
                <p className="font-semibold text-primary">{prevStep}</p>
            </Button>

            <Button
                className={`${buttonStyles} items-end`}
                onClick={isLastStep ? handleRegister : handleNext}
                disabled={isSubmitting}
                outlined
            >
                <small className="text-black">{getButtonText("secondary")}</small>
                <div className="flex items-center gap-2 text-primary">
                    {isSubmitting && <LoaderCircle size={20} className="animate-spin" />}
                    <p className="font-semibold">{getButtonText("main")}</p>
                </div>
            </Button>
        </div>
    );
};

export default StepNavigator;