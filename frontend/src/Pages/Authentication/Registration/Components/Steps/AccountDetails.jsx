import React, { useEffect, useState } from "react";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";

import StepWrapper from "../StepWrapper";

const AccountDetails = ({
    setSelectedFile,
    accountDetails,
    updateRegistrationData,
    nextBtnIsClicked,
}) => {
    const {
        userType,
        organizationName,
        jobTitlePosition,
        branchRegion,
        branchOffice,
        validId,
        validIdName,
    } = accountDetails;

    const userTypeOptions = [
        "NFA Branch Staff",
        "Private Miller",
        "Rice Recipient",
    ].map((userType) => ({ label: userType, value: userType}));

    const positionOptions = [
        "Procurement Officer",
        "Warehouse Manager",
        "Processing Officer",
        "Distribution Officer",
        "Maintenance Officer",
    ].map((position) => ({ label: position, value: position }));

    const [branchRegionOptions, setBranchRegionOptions] = useState([]);
    const [branchOfficeOptions, setBranchOfficeOptions] = useState([]);

    useEffect(() => {
        fetchOptions("https://psgc.gitlab.io/api/regions/", setBranchRegionOptions);
    }, []);

    useEffect(() => {
        if (branchRegion) {
            const selectedRegion = branchRegionOptions.find(
                (region) => region.value === branchRegion
            );
            if (selectedRegion?.code === "130000000") {
                fetchOptions(
                    "https://psgc.gitlab.io/api/regions/130000000/cities/",
                    setBranchOfficeOptions
                );
            } else if (selectedRegion) {
                fetchOptions(
                    `https://psgc.gitlab.io/api/regions/${selectedRegion.code}/provinces/`,
                    setBranchOfficeOptions
                );
            }
        }
    }, [branchRegion, branchRegionOptions]);

    const fetchOptions = async (url, setter) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const options = data.map((item) => ({
                label: item.name || item.regionName,
                value: item.name || item.regionName,
                code: item.code,
            }));
            setter(options);
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            setter([]);
        }
    };

    useEffect(() => {
        // Reset branchRegion and branchOffice to null if userType is not NFA Branch Staff
        if (userType !== "NFA Branch Staff") {
            handleInputChange("branchRegion", null);
            handleInputChange("branchOffice", null);
        }
    }, [userType]);

    const handleInputChange = (field, value) => {
        const updatedData = { ...accountDetails, [field]: value };

        if (field === "branchRegion") updatedData.branchOffice = null;
        if (field === "userType" && value !== "NFA Branch Staff") {
            updatedData.branchRegion = null;
            updatedData.branchOffice = null;
        }

        updateRegistrationData("accountDetails", updatedData);
    };

    const handleFileSelect = (event) => {
        const file = event.files[0];
        if (file) {
            setSelectedFile(file);
            handleInputChange("validIdName", file.name);
        }
    };

    return (
        <StepWrapper
            heading="Account Details"
            subHeading="To set up your account, please select your user type first, then fill up the form, and upload a valid ID of your organization."
        >
            <div className="flex flex-col gap-2">
                <label htmlFor="userType" className="block text-sm text-black">
                    User Type
                </label>
                <Dropdown
                    id="userType"
                    value={userType}
                    options={userTypeOptions}
                    onChange={(e) => handleInputChange("userType", e.value)}
                    placeholder="Select User Type"
                    className="ring-0 w-full placeholder:text-gray-400"
                    invalid={!accountDetails.userType && nextBtnIsClicked}
                />
                {!accountDetails.userType && nextBtnIsClicked && (
                    <small className="p-error">
                        Please input your user type.
                    </small>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="organizationName"
                        className="block text-sm text-black"
                    >
                        Organisation Name
                    </label>
                    <InputText
                        id="organizationName"
                        value={organizationName}
                        onChange={(e) =>
                            handleInputChange(
                                "organizationName",
                                e.target.value
                            )
                        }
                        placeholder="organization name"
                        className="w-full focus:ring-0"
                        invalid={
                            !accountDetails.organizationName && nextBtnIsClicked
                        }
                        maxLength={50}
                    />
                    {!accountDetails.organizationName && nextBtnIsClicked && (
                        <small className="p-error">
                            Please input your organization name.
                        </small>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="jobTitlePosition"
                        className="block text-sm text-black"
                    >
                        Job Title / Position
                    </label>
                    {userType === "NFA Branch Staff" ? (
                        <Dropdown
                            id="jobTitlePosition"
                            value={jobTitlePosition}
                            options={positionOptions}
                            onChange={(e) =>
                                handleInputChange("jobTitlePosition", e.value)
                            }
                            placeholder="job title"
                            className="w-full focus:ring-0"
                            invalid={
                                !accountDetails.jobTitlePosition &&
                                nextBtnIsClicked
                            }
                        />
                    ) : (
                        <InputText
                            id="jobTitlePosition"
                            value={jobTitlePosition}
                            onChange={(e) =>
                                handleInputChange(
                                    "jobTitlePosition",
                                    e.target.value
                                )
                            }
                            placeholder="job title"
                            className="w-full focus:ring-0"
                            invalid={
                                !accountDetails.jobTitlePosition &&
                                nextBtnIsClicked
                            }
                            keyfilter={/^[a-zA-Z\s0-9]/}
                            maxLength={50}
                        />
                    )}
                    {!accountDetails.jobTitlePosition && nextBtnIsClicked && (
                        <small className="p-error">
                            Please input your job title.
                        </small>
                    )}
                </div>
            </div>

            {userType === "NFA Branch Staff" && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="branchRegion"
                            className="block text-sm text-black"
                        >
                            Region
                        </label>
                        <Dropdown
                            id="branchRegion"
                            value={branchRegion}
                            options={branchRegionOptions}
                            onChange={(e) =>
                                handleInputChange("branchRegion", e.value)
                            }
                            placeholder="Select Region"
                            className="ring-0 w-full placeholder:text-gray-400"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="branchOffice"
                            className="block text-sm text-black"
                        >
                            Branch Office
                        </label>
                        <Dropdown
                            id="branchOffice"
                            value={branchOffice}
                            options={branchOfficeOptions}
                            onChange={(e) =>
                                handleInputChange("branchOffice", e.value)
                            }
                            placeholder="Select Branch"
                            className="ring-0 w-full placeholder:text-gray-400"
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label htmlFor="validId" className="block text-sm text-black">
                    Valid ID
                </label>
                <FileUpload
                    mode="basic"
                    name="validId"
                    accept="image/*"
                    maxFileSize={1000000}
                    chooseLabel={validIdName || "Select Image"}
                    className="w-full ring-0 flex justify-center items-center border-gray-300"
                    chooseOptions={{
                        className:
                            "bg-transparent text-primary flex flex-col items-center ring-0",
                    }}
                    onSelect={handleFileSelect}
                    invalid={!accountDetails.validIdName && nextBtnIsClicked}
                />
                {!accountDetails.validIdName && nextBtnIsClicked && (
                    <small className="p-error">Please input a valid id.</small>
                )}
            </div>
        </StepWrapper>
    );
};

export default AccountDetails;