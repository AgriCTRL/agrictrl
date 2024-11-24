import React from "react";

import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";

import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

import StepWrapper from "../StepWrapper";

const PersonalInformation = ({
    personalInfo,
    updateRegistrationData,
    nextBtnIsClicked,
}) => {
    const { firstName, lastName, gender, birthDate, contactNumber } =
        personalInfo;

    const maxDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - 18)
    );

    const genderOptions = [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" },
    ];

    const handleInputChange = (field, value) => {
        personalInfo[field] = value;
        updateRegistrationData("personalInfo", { [field]: value });
    };

    return (
        <StepWrapper
            heading="Personal Information"
            subHeading="Please provide your personal information."
        >
            <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-1/2">
                    <label
                        htmlFor="firstName"
                        className="block text-sm text-black"
                    >
                        First Name
                    </label>
                    <InputText
                        id="firstName"
                        value={firstName}
                        onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                        }
                        className="w-full focus:ring-0 focus:border-primary hover:border-primary"
                        placeholder="First name"
                        invalid={!personalInfo.firstName && nextBtnIsClicked}
                        keyfilter={/^[a-zA-Z\s]/}
                        maxLength={50}
                    />
                    {!personalInfo.firstName && nextBtnIsClicked && (
                        <small className="p-error">
                            Please input your first name.
                        </small>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-1/2">
                    <label
                        htmlFor="lastName"
                        className="block text-sm text-black"
                    >
                        Last Name
                    </label>
                    <InputText
                        id="lastName"
                        value={lastName}
                        onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                        }
                        className="w-full focus:ring-0 focus:border-primary hover:border-primary"
                        placeholder="Last name"
                        invalid={!personalInfo.lastName && nextBtnIsClicked}
                        keyfilter={/^[a-zA-Z\s]/}
                        maxLength={50}
                    />
                    {!personalInfo.lastName && nextBtnIsClicked && (
                        <small className="p-error">
                            Please input your last name.
                        </small>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-1/2">
                    <label
                        htmlFor="gender"
                        className="block text-sm text-black"
                    >
                        Gender
                    </label>
                    <Dropdown
                        id="gender"
                        value={gender}
                        options={genderOptions}
                        onChange={(e) => handleInputChange("gender", e.value)}
                        placeholder="Select Gender"
                        className="ring-0 w-full focus:border-primary hover:border-primary"
                        invalid={!personalInfo.gender && nextBtnIsClicked}
                    />
                    {!personalInfo.gender && nextBtnIsClicked && (
                        <small className="p-error">
                            Please input your gender.
                        </small>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                    <label
                        htmlFor="birthDate"
                        className="block text-sm text-black"
                    >
                        Birth Date
                    </label>
                    <Calendar
                        id="birthDate"
                        value={birthDate ? new Date(birthDate) : null}
                        onChange={(e) => handleInputChange("birthDate", e.value ? e.value.toISOString().split("T")[0] : null)}
                        dateFormat="mm/dd/yy"
                        placeholder="MM/DD/YYYY"
                        className="ring-0 w-full focus:shadow-none custom-calendar focus:border-primary hover:border-primary"
                        showIcon
                        invalid={!personalInfo.birthDate && nextBtnIsClicked}
                        maxDate={maxDate}
                    />
                    {!personalInfo.birthDate && nextBtnIsClicked && (
                        <small className="p-error">
                            Please input your birthdate.
                        </small>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
                <label
                    htmlFor="contactNumber"
                    className="block text-sm text-black"
                >
                    Contact Number
                </label>
                <InputMask
                    id="contactNumber"
                    mask="(+63) 9** *** ****"
                    placeholder="(+63) 9** *** ****"
                    value={contactNumber}
                    onChange={(e) =>
                        handleInputChange("contactNumber", e.target.value)
                    }
                    className="w-full focus:ring-0 focus:border-primary hover:border-primary"
                    invalid={!personalInfo.contactNumber && nextBtnIsClicked}
                />
                {!personalInfo.contactNumber && nextBtnIsClicked && (
                    <small className="p-error">
                        Please input your contact number.
                    </small>
                )}
            </div>
        </StepWrapper>
    );
};

export default PersonalInformation;