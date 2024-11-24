// import React from 'react';

// import { InputText } from 'primereact/inputtext';
// import { Password } from 'primereact/password';
// import { Divider } from 'primereact/divider';

// import StepWrapper from '../StepWrapper';

// const Finishing = ({
//   setConfirmPasswordValid,
//   finishingDetails,
//   updateRegistrationData,
//   nextBtnIsClicked
// }) => {
//   const { email, password, confirmPassword } = finishingDetails;

//   const handleInputChange = (field, value) => {
//     finishingDetails[field] = value;
//     updateRegistrationData('finishingDetails', { [field]: value });
//     if (field === 'password' || field === 'confirmPassword') {
//       setConfirmPasswordValid(finishingDetails.password === value);
//     }
//   };

//   const footer = (
//     <>
//       <Divider />
//       <p className="mt-2">Suggestions</p>
//       <ul className="pl-2 ml-2 mt-0 line-height-3">
//         <li>At least one lowercase</li>
//         <li>At least one uppercase</li>
//         <li>At least one numeric</li>
//         <li>Minimum 8 characters</li>
//       </ul>
//     </>
//   );

//   return (
//     <StepWrapper heading='Finishing' subHeading='Please input your email and create a secure password to complete your registration.'>
//         <div className="flex flex-col gap-2">
//           <label htmlFor="email" className="block text-sm text-black">Email</label>
//           <InputText
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => handleInputChange('email', e.target.value)}
//             placeholder="Enter your email"
//             className="w-full focus:ring-0 focus:border-primary hover:border-primary"
//             invalid={!finishingDetails.email && nextBtnIsClicked}
//             keyfilter={'email'}
//             maxLength={50}
//           />
//           {(!finishingDetails.email && nextBtnIsClicked) &&
//             <small className='p-error'>Please input your email.</small>
//           }
//         </div>

//         <div className="flex flex-col gap-2">
//           <label htmlFor="password" className="block text-sm text-black">Password</label>
//           <Password
//             id="password"
//             aria-describedby="password"
//             value={password}
//             footer={footer}
//             onChange={(e) => handleInputChange('password', e.target.value)}
//             placeholder="Enter your password"
//             className="w-full"
//             inputClassName='ring-0 focus:border-primary hover:border-primary'
//             toggleMask
//             maxLength={50}
//             minLength={8}
//             invalid={!finishingDetails.password && nextBtnIsClicked}
//           />
//           {(!finishingDetails.password && nextBtnIsClicked) &&
//             <small className='p-error'>Please input your password.</small>
//           }
//         </div>

//         <div className="flex flex-col gap-2">
//           <label htmlFor="confirmPassword" className="block text-sm text-black">Confirm Password</label>
//           <Password
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//             placeholder="Confirm your password"
//             className="w-full"
//             inputClassName='ring-0 focus:border-primary hover:border-primary'
//             feedback={false}
//             invalid={!finishingDetails.confirmPassword && nextBtnIsClicked}
//             toggleMask
//           />
//           {(!finishingDetails.confirmPassword && nextBtnIsClicked) &&
//             <small className='p-error'>Please input your password.</small>
//           }
//         </div>
//       </StepWrapper>
//   );
// };

// export default Finishing;

import React, { useMemo } from "react";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";

import StepWrapper from "../StepWrapper";

const Finishing = ({
    setConfirmPasswordValid,
    finishingDetails,
    updateRegistrationData,
    nextBtnIsClicked,
}) => {
    const { email, password, confirmPassword } = finishingDetails;

    const handleInputChange = (field, value) => {
        updateRegistrationData("finishingDetails", { [field]: value });
        if (field === "password" || field === "confirmPassword") {
            setConfirmPasswordValid(
                password === value || confirmPassword === value
            );
        }
    };

    const footer = useMemo(
        () => (
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
        ),
        []
    );

    return (
        <StepWrapper
            heading="Finishing"
            subHeading="Please input your email and create a secure password to complete your registration."
        >
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="block text-sm text-black">
                    Email
                </label>
                <InputText
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="w-full focus:ring-0 focus:border-primary hover:border-primary"
                    invalid={!finishingDetails.email && nextBtnIsClicked}
                    keyfilter={"email"}
                    maxLength={50}
                />
                {!finishingDetails.email && nextBtnIsClicked && (
                    <small className="p-error">Please input your email.</small>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="password" className="block text-sm text-black">
                    Password
                </label>
                <Password
                    id="password"
                    aria-describedby="password"
                    value={password}
                    footer={footer}
                    onChange={(e) =>
                        handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full"
                    inputClassName="ring-0 focus:border-primary hover:border-primary"
                    toggleMask
                    maxLength={50}
                    minLength={8}
                    invalid={!finishingDetails.password && nextBtnIsClicked}
                />
                {!finishingDetails.password && nextBtnIsClicked && (
                    <small className="p-error">
                        Please input your password.
                    </small>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm text-black"
                >
                    Confirm Password
                </label>
                <Password
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm your password"
                    className="w-full"
                    inputClassName="ring-0 focus:border-primary hover:border-primary"
                    feedback={false}
                    invalid={
                        !finishingDetails.confirmPassword && nextBtnIsClicked
                    }
                    toggleMask
                />
                {!finishingDetails.confirmPassword && nextBtnIsClicked && (
                    <small className="p-error">
                        Please input your password.
                    </small>
                )}
            </div>
        </StepWrapper>
    );
};

export default Finishing;
