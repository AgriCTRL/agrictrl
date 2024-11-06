import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import {
  CircleUserRound,
  Contact,
  SlidersVertical,
  CircleCheckBig,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Toast } from "primereact/toast";
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import PersonalInformation from "./RegistrationComponents/PersonalInformation";
import AccountDetails from "./RegistrationComponents/AccountDetails";
import OfficeAddress from "./RegistrationComponents/OfficeAddress";
import Finishing from "./RegistrationComponents/Finishing";
import { RegistrationProvider, useRegistration } from "./RegistrationContext";
import { Divider } from "primereact/divider";
import CryptoJS from 'crypto-js';


// Step configuration
const steps = [
  { number: 0, label: "Personal Information", icon: <CircleUserRound /> },
  { number: 1, label: "Account Details", icon: <Contact /> },
  { number: 2, label: "Office Address", icon: <SlidersVertical /> },
  { number: 3, label: "Finishing", icon: <CircleCheckBig /> },
];

const CustomStepLabel = ({ icon, isActive }) => {
  return (
    <div
      className={`flex items-center justify-center
                  p-4 rounded-full transition-all
                  ${
                    isActive
                      ? "bg-white text-secondary scale-110"
                      : "bg-transparent text-white border-2 border-white"
                  }`}
    >
      {React.cloneElement(icon, {
        size: 20,
        className: "transition-all",
      })}
    </div>
  );
};

const RegistrationPageContent = () => {
	const apiUrl = import.meta.env.VITE_API_BASE_URL;
	const secretKey = import.meta.env.VITE_HASH_KEY;
	const [activeStep, setActiveStep] = useState(0);
	const [prevStep, setPrevStep] = useState(null);
	const [nextStep, setNextStep] = useState(null);
	const [completedSteps] = useState([])
	const navigate = useNavigate();
	const { registrationData } = useRegistration();
	const toast = useRef(null);
	const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
	const [isValidating, setIsValidating] = useState(false);
	const [selectedFile, setSelectedFile ] = useState(null);

	useEffect(() => {
		const nextStepIndex = steps.findIndex((step) => step.number === activeStep + 1);
		const prevStepIndex = steps.findIndex((step) => step.number === activeStep - 1);
	
		setNextStep(nextStepIndex !== -1 ? steps[nextStepIndex].label : "");
		setPrevStep(prevStepIndex !== -1 ? steps[prevStepIndex].label : "");
		}, [activeStep]);

	const [personalInfo] = useState({
		firstName: '',
		lastName: '',
		gender: '',
		birthDate: null,
		contactNumber: null,
	});

	const [contactInfo] = useState({
		userType: '',
		organizationName: '',
		jobTitlePosition: '',
		validIdName: null,
	});

	const [addressInfo] = useState({
		region: null,
		province: null,
		cityTown: null,
		barangay: null,
		street: null,
	});

	const [credsInfo] = useState({
		email: null,
		password: null,
		confirmPassword: null,
	});

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
			toast.current.show({
			severity: "error",
			summary: "Error",
			detail: "Passwords do not match.",
			life: 3000,
			});
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

			const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(registrationPayload), secretKey).toString();

			const res = await fetch(`${apiUrl}/users`, {
			method: "POST",
			headers: { 
				'Content-Type': 'application/json'
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
				
				throw new Error(errorData.message || 'Error registering user');
			}

			navigate('/login');
			localStorage.removeItem('registrationData');
		} catch (error) {
			console.log(error.message);
			toast.current.show({ severity: 'error', summary: 'Error', detail: 'Registration failed. Please try again.', life: 3000 });
		}
	};

	const LoginButton = (e) => {
		localStorage.removeItem("registrationData");
		e.preventDefault();
		navigate("/login");
	};

	const handleNext = () => {
		setIsValidating(true);
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
			if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.gender || !personalInfo.birthDate || !personalInfo.contactNumber) {
			return false;
			}
		} 
		if (activeStep === 1) {
			if (!contactInfo.userType || !contactInfo.organizationName || !contactInfo.jobTitlePosition || !contactInfo.validIdName) {
			return false;
			}
		}
		if (activeStep === 2) {
			if (!addressInfo.region || !addressInfo.province || !addressInfo.cityTown || !addressInfo.barangay || !addressInfo.street) {
			return false;
			}
		}
		if (activeStep === 3) {
		if (!credsInfo.email || !credsInfo.password || !credsInfo.confirmPassword) {
		return false;
		}
	}

	completedSteps.push(activeStep)
	return true;
	}

	const renderStep = () => {
		switch (activeStep) {
			case 0:
			return <PersonalInformation personalInfo={personalInfo} />;
			case 1:
			return <AccountDetails setSelectedFile={setSelectedFile} contactInfo={contactInfo} />;
			case 2:
			return <OfficeAddress addressInfo={addressInfo} />;
			case 3:
			return <Finishing setConfirmPasswordValid={setConfirmPasswordValid} credsInfo={credsInfo} />;
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
				style={{ backgroundImage: "url('Registration-leftBG.png')" }}
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
						<span className="text-sm">STEP {index + 1}</span>
						<br />
						<p className={`${index === activeStep ? 'text-xl' : ''}`}>{label.toLocaleUpperCase()}</p>
						</div>
					</StepLabel>
					{ index === steps.length - 1 ?  
						null :
						<StepConnector style={{ borderLeftWidth: 2, marginLeft: "1.5rem" }} />
					}
					</Step>
				))}
				</Stepper>

				<div className="flex items-center justify-center cursor-pointer z-30">
							<img src="favicon.ico" alt="AgriCTRL+ Logo" className="h-12 mr-4" onClick={() => navigate('/') } />
				<span className="text-2xl font-medium">AgriCTRL+</span>
				</div>
			</div>
			</div>

			{/* Right Side */}
			<div className="w-full md:w-2/3 flex flex-col justify-between relative p-10 gap-4">
			<div className="flex flex-col gap-4 sm:gap-6">
				{renderStep()}
				<Divider className='m-0'/>

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
