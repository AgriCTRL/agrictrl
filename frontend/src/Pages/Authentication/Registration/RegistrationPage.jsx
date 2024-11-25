import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Stepper, Step, StepLabel, StepConnector } from "@mui/material";

import { storage } from "../../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

import PersonalInformation from "./Components/Steps/PersonalInformation";
import AccountDetails from "./Components/Steps/AccountDetails";
import OfficeAddress from "./Components/Steps/OfficeAddress";
import Finishing from "./Components/Steps/Finishing";
import CustomStepLabel from "./Components/CustomStepLabel";

import { RegistrationProvider, useRegistration } from "./RegistrationContext";
import StepNavigator from "./Components/StepNavigator";

const RegistrationPageContent = () => {
    const { registrationData, updateRegistrationData, steps } =
        useRegistration();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const secretKey = import.meta.env.VITE_HASH_KEY;
    const [activeStep, setActiveStep] = useState(0);
    const [prevStep, setPrevStep] = useState(null);
    const [nextStep, setNextStep] = useState(null);
    const [completedSteps] = useState([]);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [nextBtnClicked, setNextBtnClicked] = useState({
        personalInfo: false,
        accountDetails: false,
        officeAddress: false,
        finishing: false,
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const nextStepIndex = steps.findIndex(
            (step) => step.number === activeStep + 1
        );
        const prevStepIndex = steps.findIndex(
            (step) => step.number === activeStep - 1
        );

        setNextStep(nextStepIndex !== -1 ? steps[nextStepIndex].label : "");
        setPrevStep(prevStepIndex !== -1 ? steps[prevStepIndex].label : "");
    }, [activeStep]);

    const handleFileUpload = async () => {
        if (!selectedFile) return null;

        const fileName = `${uuidv4()}_${selectedFile.name}`;
        const storageRef = ref(storage, `validIds/${fileName}`);

        try {
            const snapshot = await uploadBytes(storageRef, selectedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);

            return { downloadURL };
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };

    const validatePasswordFields = () => {
        const { password, confirmPassword } = registrationData.finishingDetails;
        const validations = [
            {
                test: password.length >= 8,
                message: "Password must be at least 8 characters long",
            },
            {
                test: /[a-z]/.test(password),
                message: "Password must contain at least one lowercase letter",
            },
            {
                test: /[A-Z]/.test(password),
                message: "Password must contain at least one uppercase letter",
            },
            {
                test: /\d/.test(password),
                message: "Password must contain at least one number",
            },
            {
                test: password === confirmPassword,
                message: "Passwords do not match",
            },
        ];

        for (const { test, message } of validations) {
            if (!test) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: message,
                    life: 5000,
                });
                return false;
            }
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validatePasswordFields()) {
            return;
        }

        console.log("REGISTRATION DATA: ")
        console.log(registrationData);
        return;
        
        try {
            const fileData = await handleFileUpload();
            let updatedAccountDetails = { ...registrationData.accountDetails };

            if (fileData) {
                updatedAccountDetails = {
                    ...updatedAccountDetails,
                    validId: fileData.downloadURL,
                };
            }

            const registrationPayload = {
                ...registrationData.personalInfo,
                ...updatedAccountDetails,
                ...registrationData.officeAddress,
                ...registrationData.finishingDetails,
            };

            const encryptedPayload = CryptoJS.AES.encrypt(
                JSON.stringify(registrationPayload),
                secretKey
            ).toString();

            const res = await fetch(`${apiUrl}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ encryptedPayload }),
            });

            if (!res.ok) {
                const errorData = await res.json();

                if (res.status === 409) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "This email address is already registered. Please use a different email.",
                        life: 3000,
                    });
                    return;
                }

                throw new Error(errorData.message || "Error registering user");
            }

            navigate("/login");
            localStorage.removeItem("registrationData");
        } catch (error) {
            console.log(error.message);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Registration failed. Please try again.",
                life: 3000,
            });
        }
    };

    const LoginButton = (e) => {
        localStorage.removeItem("registrationData");
        e.preventDefault();
        navigate("/login");
    };

    const handleNext = () => {
        setIsValidating(true);

        if (activeStep === 0) {
            setNextBtnClicked((prevState) => ({
                ...prevState,
                personalInfo: true,
            }));
        } else if (activeStep === 1) {
            setNextBtnClicked((prevState) => ({
                ...prevState,
                accountDetails: true,
            }));
        } else if (activeStep === 2) {
            setNextBtnClicked((prevState) => ({
                ...prevState,
                officeAddress: true,
            }));
        } else if (activeStep === 3) {
            setNextBtnClicked((prevState) => ({
                ...prevState,
                finishingDetails: true,
            }));
        }

        const isValidated = validateInputs();
        if (isValidated) {
            setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
        setIsValidating(false);
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    const validateInputs = () => {
        if (activeStep === 0) {
            if (
                !registrationData.personalInfo.firstName ||
                !registrationData.personalInfo.lastName ||
                !registrationData.personalInfo.gender ||
                !registrationData.personalInfo.birthDate ||
                !registrationData.personalInfo.contactNumber
            ) {
                return false;
            }
        }
        if (activeStep === 1) {
            if (
                !registrationData.accountDetails.userType ||
                !registrationData.accountDetails.organizationName ||
                !registrationData.accountDetails.jobTitlePosition ||
                !registrationData.accountDetails.validIdName
            ) {
                return false;
            }
        }
        if (activeStep === 2) {
            if (
                !registrationData.officeAddress.region ||
                !registrationData.officeAddress.province ||
                !registrationData.officeAddress.cityTown ||
                !registrationData.officeAddress.barangay ||
                !registrationData.officeAddress.street
            ) {
                return false;
            }
        }
        if (activeStep === 3) {
            if (
                !registrationData.finishingDetails.email ||
                !registrationData.finishingDetails.password ||
                !registrationData.finishingDetails.confirmPassword
            ) {
                return false;
            }
        }

        completedSteps.push(activeStep);
        return true;
    };

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <PersonalInformation
                        personalInfo={registrationData.personalInfo}
                        updateRegistrationData={updateRegistrationData}
                        nextBtnIsClicked={nextBtnClicked.personalInfo}
                    />
                );
            case 1:
                return (
                    <AccountDetails
                        setSelectedFile={setSelectedFile}
                        accountDetails={registrationData.accountDetails}
                        updateRegistrationData={updateRegistrationData}
                        nextBtnIsClicked={nextBtnClicked.accountDetails}
                    />
                );
            case 2:
                return (
                    <OfficeAddress
                        officeAddress={registrationData.officeAddress}
                        updateRegistrationData={updateRegistrationData}
                        nextBtnIsClicked={nextBtnClicked.officeAddress}
                    />
                );
            case 3:
                return (
                    <Finishing
                        setConfirmPasswordValid={setConfirmPasswordValid}
                        finishingDetails={registrationData.finishingDetails}
                        updateRegistrationData={updateRegistrationData}
                        nextBtnIsClicked={nextBtnClicked.finishingDetails}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="font-poppins flex flex-col md:flex-row h-fit md:h-screen w-screen p-0 md:p-10 md:gap-10">
            <Toast ref={toast} />

            {/* Left Side */}
            <div className="md:flex md:w-[40%] relative md:rounded-2xl">
                <div
                    className="absolute inset-0 bg-cover bg-center md:rounded-2xl"
                    style={{
                        backgroundImage: "url('Registration-leftBG.png')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b373a] via-[#00c2617b] to-[#00c26100] md:rounded-2xl"></div>
                </div>

                <div className="flex flex-col justify-between w-full p-4 sm:p-6 md:p-10 text-white">
                    <h2 className="text-2xl md:text-4xl font-medium mb-6 flex justify-center items-center z-30">
                        Registration
                    </h2>

                    <Stepper
                        orientation="vertical"
                        activeStep={activeStep}
                        connector
                        className="z-30"
                    >
                        {steps.map(({ label, icon }, index) => (
                            <Step key={label}>
                                <StepLabel
                                    StepIconComponent={() => (
                                        <CustomStepLabel
                                            icon={icon}
                                            isActive={index === activeStep}
                                        />
                                    )}
                                >
                                    <div
                                        className={`text-white transition-all pl-4 ${
                                            index === activeStep
                                                ? "font-semibold"
                                                : "text-base"
                                        }`}
                                    >
                                        <span className="text-sm">
                                            STEP {index + 1}
                                        </span>
                                        <br />
                                        <p
                                            className={`${
                                                index === activeStep
                                                    ? "text-xl"
                                                    : ""
                                            }`}
                                        >
                                            {label.toLocaleUpperCase()}
                                        </p>
                                    </div>
                                </StepLabel>
                                {index === steps.length - 1 ? null : (
                                    <StepConnector
                                        style={{
                                            borderLeftWidth: 2,
                                            marginLeft: "1.5rem",
                                        }}
                                    />
                                )}
                            </Step>
                        ))}
                    </Stepper>

                    <div className="flex items-center justify-center cursor-pointer z-30">
                        <img
                            src="favicon.ico"
                            alt="AgriCTRL+ Logo"
                            className="h-12 mr-4"
                            onClick={() => navigate("/")}
                        />
                        <span className="text-2xl font-medium">AgriCTRL+</span>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full md:w-2/3 flex flex-col justify-between relative p-10 gap-4">
                <div className="flex flex-col gap-4 sm:gap-6">
                    {renderStep()}
                    <Divider className="m-0" />
                    <StepNavigator
                        handleBack={handleBack}
                        handleNext={handleNext}
                        handleRegister={handleRegister}
                        activeStep={activeStep}
                        prevStep={prevStep}
                        nextStep={nextStep}
                    />
                </div>

                <div className="text-center">
                    <span className="text-gray-600">
                        Already have an account?{" "}
                    </span>
                    <a
                        onClick={LoginButton}
                        className="font-medium text-primary hover:underline cursor-pointer"
                    >
                        Login here
                    </a>
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
