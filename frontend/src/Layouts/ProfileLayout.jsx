import React from 'react'

import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';
import { User, User2 } from 'lucide-react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

const ProfileLayout = ({ 
    user, 
    userData, 
    userFullName, 
    editing,
    handleToggleEdit,
    handleSave,
    activeTab,
    setActiveTab,
    logoutButton,
    isSubmitting,
    errors,
    handleInputChange,
    regionOptions,
    provinceOptions,
    cityTownOptions,
    barangayOptions,
    branchOfficeOptions,
    branchRegionOptions
}) => {
    let today = new Date();
    let year = today.getFullYear();
    let maxYear = year - 18;
    let maxDate = new Date();
    maxDate.setFullYear(maxYear);

    const userType = `NFA ${userData.accountDetails.branchOffice}`;

    const renderPersonalInformation = () => (
        <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    First Name
                </label>
                <InputText
                    value={userData.personalInfo.firstName}
                    onChange={(e) =>
                        handleInputChange(
                            "personalInfo",
                            "firstName",
                            e.target.value
                        )
                    }
                    disabled={!editing}
                    className="w-full focus:ring-0 text-sm md:text-base"
                    keyfilter={/^[a-zA-Z\s]/}
                    maxLength={50}
                />
                {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                    </p>
                )}
            </div>
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Last Name
                </label>
                <InputText
                    value={userData.personalInfo.lastName}
                    onChange={(e) =>
                        handleInputChange(
                            "personalInfo",
                            "lastName",
                            e.target.value
                        )
                    }
                    disabled={!editing}
                    className="w-full focus:ring-0 text-sm md:text-base"
                    keyfilter={/^[a-zA-Z\s]/}
                    maxLength={50}
                />
                {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                    </p>
                )}
            </div>
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Gender
                </label>
                <Dropdown
                    value={userData.personalInfo.gender}
                    options={genderOptions}
                    onChange={(e) =>
                        handleInputChange("personalInfo", "gender", e.value)
                    }
                    disabled={!editing}
                    className="ring-0 w-full text-sm md:text-base"
                />
                {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
            </div>
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Birth Date
                </label>
                <Calendar
                    value={
                        userData.personalInfo.birthDate
                            ? new Date(userData.personalInfo.birthDate)
                            : null
                    }
                    onChange={(e) =>
                        handleInputChange("personalInfo", "birthDate", e.value)
                    }
                    disabled={!editing}
                    dateFormat="mm/dd/yy"
                    className="w-full rounded-md"
                    inputClassName='text-sm md:text-base'
                    maxDate={maxDate}
                />
                {errors.birthDate && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.birthDate}
                    </p>
                )}
            </div>
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Contact Number
                </label>
                <InputText
                    value={userData.personalInfo.contactNumber}
                    onChange={(e) =>
                        handleInputChange(
                            "personalInfo",
                            "contactNumber",
                            e.target.value
                        )
                    }
                    disabled={!editing}
                    className="w-full focus:ring-0 text-sm md:text-base"
                    keyfilter="alphanum"
                    maxLength={25}
                />
                {errors.contactNumber && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.contactNumber}
                    </p>
                )}
            </div>
        </div>
    );

    const renderAccountDetails = () => (
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    User Type
                </label>
                <InputText
                    value={userData.accountDetails.userType}
                    disabled
                    className="w-full border text-sm md:text-base"
                    keyfilter="alphanum"
                    maxLength={25}
                />
            </div>
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Organization Name
                </label>
                <InputText
                    value={userData.accountDetails.organizationName}
                    onChange={(e) =>
                        handleInputChange(
                            "accountDetails",
                            "organizationName",
                            e.target.value
                        )
                    }
                    disabled={!editing}
                    className="w-full focus:ring-0 text-sm md:text-base"
                    maxLength={50}
                />
                {errors.organizationName && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.organizationName}
                    </p>
                )}
            </div>
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Job Title/Position
                </label>
                <InputText
                    value={userData.accountDetails.jobTitlePosition}
                    onChange={(e) =>
                        handleInputChange(
                            "accountDetails",
                            "jobTitlePosition",
                            e.target.value
                        )
                    }
                    disabled={!editing}
                    className="w-full focus:ring-0 text-sm md:text-base"
                    keyfilter="alphanum"
                    maxLength={50}
                />
                {errors.jobTitlePosition && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.jobTitlePosition}
                    </p>
                )}
            </div>
            {branchRegionOptions && (
                <div className='col-span-2 md:col-span-1'>
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Branch Region
                    </label>
                    <Dropdown
                        value={userData.accountDetails.branchRegion}
                        options={branchRegionOptions}
                        onChange={(e) => handleInputChange('accountDetails', 'branchRegion', e.value)}
                        disabled={!editing}
                        className="ring-0 w-full text-sm md:text-base"
                    />
                    {errors.branchRegion && <p className="text-red-500 text-xs mt-1">{errors.branchRegion}</p>}
                </div>
            )}
            {branchOfficeOptions && (
                <div className='col-span-2 md:col-span-1'>
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Branch Office
                    </label>
                    <Dropdown
                        value={userData.accountDetails.branchOffice}
                        options={branchOfficeOptions}
                        onChange={(e) => handleInputChange('accountDetails', 'branchOffice', e.value)}
                        disabled={!editing}
                        className="ring-0 w-full text-sm md:text-base"
                    />
                    {errors.branchOffice && <p className="text-red-500 text-xs mt-1">{errors.branchOffice}</p>}
                </div>  
            )}
        </div>
    );

    const renderOfficeAddress = () => (
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Region
                </label>
                <Dropdown
                    value={userData.officeAddress.region}
                    options={regionOptions}
                    onChange={(e) =>
                        handleInputChange("officeAddress", "region", e.value)
                    }
                    disabled={!editing}
                    className="ring-0 w-full text-sm md:text-base"
                />
                {errors.region && (
                    <p className="text-red-500 text-xs mt-1">{errors.region}</p>
                )}
            </div>
            {userData.officeAddress.region !== "National Capital Region" && (
                <div className='col-span-2 md:col-span-1'>
                    <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                        Province
                    </label>
                    <Dropdown
                        value={userData.officeAddress.province}
                        options={provinceOptions}
                        onChange={(e) =>
                            handleInputChange(
                                "officeAddress",
                                "province",
                                e.value
                            )
                        }
                        disabled={!editing}
                        className="ring-0 w-full text-sm md:text-base"
                    />
                    {errors.province && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.province}
                        </p>
                    )}
                </div>
            )}
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    City/Town
                </label>
                <Dropdown
                    value={userData.officeAddress.cityTown}
                    options={cityTownOptions}
                    onChange={(e) =>
                        handleInputChange("officeAddress", "cityTown", e.value)
                    }
                    disabled={!editing}
                    className="ring-0 w-full text-sm md:text-base"
                />
                {errors.cityTown && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.cityTown}
                    </p>
                )}
            </div>
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Barangay
                </label>
                <Dropdown
                    value={userData.officeAddress.barangay}
                    options={barangayOptions}
                    onChange={(e) =>
                        handleInputChange("officeAddress", "barangay", e.value)
                    }
                    disabled={!editing}
                    className="ring-0 w-full text-sm md:text-base"
                />
                {errors.barangay && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.barangay}
                    </p>
                )}
            </div>
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Street
                </label>
                <InputText
                    value={userData.officeAddress.street}
                    onChange={(e) =>
                        handleInputChange(
                            "officeAddress",
                            "street",
                            e.target.value
                        )
                    }
                    disabled={!editing}
                    className="w-full focus:ring-0 text-sm md:text-base"
                    maxLength={50}
                />
                {errors.street && (
                    <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                )}
            </div>
        </div>
    );

    const renderPassword = () => (
        <div className="grid grid-cols-1 gap-2 md:gap-4">
            <div className='col-span-2 md:col-span-1'>
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Email
                </label>
                <InputText
                    value={userData.passwordInfo.email}
                    onChange={(e) =>
                        handleInputChange(
                            "passwordInfo",
                            "email",
                            e.target.value
                        )
                    }
                    disabled={!editing}
                    className="w-full focus:ring-0 text-sm md:text-base"
                    keyfilter="email"
                    maxLength={50}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
            </div>
            {editing && (
                <div className='grid gap-2 md:gap-4'>
                    <div>
                        <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                            New Password
                        </label>
                        <Password
                            value={userData.passwordInfo.password}
                            footer={passwordFooter}
                            onChange={(e) =>
                                handleInputChange(
                                    "passwordInfo",
                                    "password",
                                    e.target.value
                                )
                            }
                            disabled={!editing}
                            inputClassName="w-full p-3 ring-0 text-sm md:text-base"
                            toggleMask
                            maxLength={50}
                            minLength={8}
                            className="w-full"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                            Confirm Password
                        </label>
                        <Password
                            value={userData.passwordInfo.confirmPassword}
                            onChange={(e) =>
                                handleInputChange(
                                    "passwordInfo",
                                    "confirmPassword",
                                    e.target.value
                                )
                            }
                            disabled={!editing}
                            inputClassName="w-full p-3 ring-0 text-sm md:text-base"
                            toggleMask
                            feedback={false}
                            className="w-full"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const passwordFooter = (
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
    );

    const genderOptions = [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" },
    ];

    const tabs = [
        {
            id: "personal",
            label: "Personal Information",
            content: renderPersonalInformation,
        },
        {
            id: "account",
            label: "Account Details",
            content: renderAccountDetails,
        },
        {
            id: "address",
            label: "Office Address",
            content: renderOfficeAddress,
        },
        { 
            id: "password", 
            label: "Password", 
            content: renderPassword 
        },
    ];
    
    return (
        <div className='flex flex-col h-full w-full bg-[#F1F5F9] rounded-xl'>
            <div className='flex flex-col w-full h-fit rounded-lg overflow-hidden'>
                <div className="relative inset-0 bg-cover bg-center p-8 w-full h-32 bg-gradient-to-r from-secondary to-primary">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary w-full h-32"></div>
                    <Avatar 
                        image={'/landingpage/nfa-logo.svg' ?? null} 
                        icon={<User className='size-4 md:size-6' />}
                        shape="circle"
                        className="cursor-pointer border-2 border-white text-primary bg-tag-grey absolute bottom-0 translate-y-1/2 md:translate-y-2/3 left-1/2 md:left-8 -translate-x-1/2 md:-translate-x-0 size-[8rem]"
                    />
                </div>

                <div className="ps-0 md:ps-48 py-4 pe-0 md:pe-4 pt-16 md:pt-4 gap-4 w-full flex flex-col md:flex-row justify-between items-center">
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className='text-2xl sm:text-4xl text-black font-semibold'>
                            {user.firstName} {user.lastName}
                        </h1>
                        <Tag 
                            className='bg-primary p-2 px-4 w-fit'
                        >
                            <div className="font-normal flex items-center gap-1">
                                <User2 className='size-3 md:size-4'/>
                                <p className='text-xs md:text-xs'>{userData.accountDetails.userType ?? "User Type"}</p>
                            </div>
                        </Tag>
                    </div>

                    <div className='w-full md:w-auto flex justify-end gap-2'>
                        <Button
                            label={editing ? "Cancel" : "Edit"}
                            type="button"
                            onClick={handleToggleEdit}
                            className={`w-1/2 md:w-auto text-sm md:text-base text-white border-0 ring-0 ${
                                editing 
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-green-500 hover:bg-green-600'
                            }`}
                        />
                        {editing && (
                            <Button
                                label="Save Changes"
                                disabled={isSubmitting}
                                onClick={handleSave}
                                type="submit"
                                className='w-1/2 md:w-auto text-sm md:text-base text-white bg-primary hover:bg-primaryHover'
                            />
                        )}
                        <Button
                            label="Logout" 
                            onClick={logoutButton} 
                            outlined
                            className='w-1/2 md:w-auto text-sm md:text-base text-red-500 flex justify-center h-fit'
                        />
                    </div>
                </div>
                <Divider className='mt-0 bg-red-600'/>
            </div>

            <div className='flex justify-between flex-col w-full'>
                <TabView className='sms-tabview overflow-hidden'>
                    {tabs.map((tab) => (
                        <TabPanel 
                            key={tab.id} 
                            header={tab.label}
                            pt={{
                                root: "p-0",
                                headerTitle: "text-sm md:text-base font-normal text-black",
                                headerAction: "p-4 h-fit border-b-2",
                            }}
                        >
                            {tab.content()}
                        </TabPanel>
                    ))}
                </TabView>
            </div>
        </div>
    )
}

export default ProfileLayout