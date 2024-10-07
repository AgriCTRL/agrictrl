import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

import CustomPasswordInput from '../../../Components/Form/PasswordComponent'; 

function Profile() {
    // const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [activeTab, setActiveTab] = useState('personal');
    const [editing, setEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Static data for testing
    const [userData, setUserData] = useState({
        personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            gender: 'male',
            birthDate: new Date('1990-01-01'),
            contactNumber: '09123456789',
        },
        accountDetails: {
            userType: 'nfaBranchStaff',
            organizationName: 'NFA Branch Office',
            jobTitle: 'Manager',
            region: 'region1',
            branchOffice: 'office1',
        },
        officeAddress: {
            region: 'region1',
            province: 'province1',
            cityTown: 'city1',
            barangay: 'barangay1',
            street: '#123 Sample Street',
        },
        passwordInfo: {
            email: 'john.doe@example.com',
            password: 'asdasd123',
            confirmPassword: 'asdasd123',
        },
    });

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const authClient = await AuthClient.create();
    //             const identity = authClient.getIdentity();
    //             const principal = identity.getPrincipal().toText();
    //             const res = await fetch(`${apiUrl}/nfapersonnels/principal/${principal}`, {
    //                 method: 'GET',
    //                 headers: { 'Content-Type': 'application/json' }
    //             });
    //             const data = await res.json();
    //             setId(data.id);
    //             setFirstName(data.firstName);
    //             setLastName(data.lastName);
    //             setPosition(data.position);
    //             setRegion(data.region);
    //         } catch (error) {
    //             console.log(error.message);
    //         }
    //     };
    //     fetchUser();
    // }, []);

    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
    ];

    const userTypeOptions = [
        { label: 'NFA Branch Staff', value: 'nfaBranchStaff' },
        { label: 'Private Miller', value: 'privateMiller' },
        { label: 'Rice Recipient', value: 'riceRecipient' }
    ];
    
    const  accountRegionOptions = [
        { label: 'Region 1', value: 'region1' },
        { label: 'Region 2', value: 'region2' },
        { label: 'Region 3', value: 'region3' }
    ];
    
    const branchOfficeOptions = [
        { label: 'Office 1', value: 'office1' },
        { label: 'Office 2', value: 'office2' },
        { label: 'Office 3', value: 'office3' }
    ];

    const officeRegionOptions = [
        { label: 'Region 1', value: 'region1' },
        { label: 'Region 2', value: 'region2' },
        { label: 'Region 3', value: 'region3' }
    ];
    
    const provinceOptions = [
        { label: 'Province 1', value: 'province1' },
        { label: 'Province 2', value: 'province2' },
        { label: 'Province 3', value: 'province3' }
    ];
    
    const cityOptions = [
        { label: 'City 1', value: 'city1' },
        { label: 'City 2', value: 'city2' },
        { label: 'City 3', value: 'city3' }
    ];
    
    const barangayOptions = [
        { label: 'Barangay 1', value: 'barangay1' },
        { label: 'Barangay 2', value: 'barangay2' },
        { label: 'Barangay 3', value: 'barangay3' }
    ];

    const getUserTypeLabel = (value) => {
        const option = userTypeOptions.find(option => option.value === value);
        return option ? option.label : value;
    };

    const handleToggleEdit = () => {
        setEditing(prevState => !prevState);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log('Saving user data:', userData);
            setEditing(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderPersonalInformation = () => (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                <InputText
                    value={userData.personalInfo.firstName}
                    onChange={(e) => setUserData(prev => ({...prev, personalInfo: {...prev.personalInfo, firstName: e.target.value}}))}
                    disabled={!editing}
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                <InputText
                    value={userData.personalInfo.lastName}
                    onChange={(e) => setUserData(prev => ({...prev, personalInfo: {...prev.personalInfo, lastName: e.target.value}}))}
                    disabled={!editing}
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
                <Dropdown
                    value={userData.personalInfo.gender}
                    options={genderOptions}
                    onChange={(e) => setUserData(prev => ({...prev, personalInfo: {...prev.personalInfo, gender: e.target.value}}))}
                    disabled={!editing}
                    className="w-full border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Birth Date</label>
                <Calendar
                    value={userData.personalInfo.birthDate}
                    onChange={(e) => setUserData(prev => ({...prev, personalInfo: {...prev.personalInfo, birthDate: e.value}}))}
                    disabled={!editing}
                    className="w-full rounded-md"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Contact Number</label>
                <InputText
                    value={userData.personalInfo.contactNumber}
                    onChange={(e) => setUserData(prev => ({...prev, personalInfo: {...prev.personalInfo, contactNumber: e.target.value}}))}
                    disabled={!editing}
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>
        </div>
    );

    const renderAccountDetails = () => (
        <div className="grid grid-cols-2 gap-4">
            <div className='col-span-2'>
                <label className="block mb-2 text-sm font-medium text-gray-700">User Type</label>
                <Dropdown
                    value={userData.accountDetails.userType}
                    options={userTypeOptions}
                    onChange={(e) => setUserData(prev => ({...prev, accountDetails: {...prev.accountDetails, userType: e.target.value}}))}
                    disabled={!editing}
                    className="w-full border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Organization Name</label>
                <InputText
                    value={userData.accountDetails.organizationName}
                    onChange={(e) => setUserData(prev => ({...prev, accountDetails: {...prev.accountDetails, organizationName: e.target.value}}))}
                    disabled={!editing}
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Job Title/Position</label>
                <InputText
                    value={userData.accountDetails.jobTitle}
                    onChange={(e) => setUserData(prev => ({...prev, accountDetails: {...prev.accountDetails, jobTitle: e.target.value}}))}
                    disabled={!editing}
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Region</label>
                <Dropdown
                    value={userData.accountDetails.region}
                    options={accountRegionOptions}
                    onChange={(e) => setUserData(prev => ({...prev, accountDetails: {...prev.accountDetails, region: e.target.value}}))}
                    disabled={!editing}
                    className="w-full border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Branch Office</label>
                <Dropdown
                    value={userData.accountDetails.branchOffice}
                    options={branchOfficeOptions}
                    onChange={(e) => setUserData(prev => ({...prev, accountDetails: {...prev.accountDetails, branchOffice: e.target.value}}))}
                    disabled={!editing}
                    className="w-full border rounded-md border-gray-300"
                />
            </div>
        </div>
    );

    const renderOfficeAddress = () => (
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Region</label>
                <Dropdown 
                    value={userData.officeAddress.region}
                    options={officeRegionOptions}
                    onChange={(e) => setUserData(prev => ({...prev, officeAddress: {...prev.officeAddress, region: e.target.value}}))}
                    disabled={!editing}
                    className="w-full border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Province</label>
                <Dropdown
                    value={userData.officeAddress.province}
                    options={provinceOptions}
                    onChange={(e) => setUserData(prev => ({...prev, officeAddress: {...prev.officeAddress, province: e.target.value}}))}
                    disabled={!editing}
                    className="w-full border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">City/Town</label>
                <Dropdown
                    value={userData.officeAddress.cityTown}
                    options={cityOptions}
                    onChange={(e) => setUserData(prev => ({...prev, officeAddress: {...prev.officeAddress, cityTown: e.target.value}}))}
                    disabled={!editing}
                    className="w-full border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Barangay</label>
                <Dropdown
                    value={userData.officeAddress.barangay}
                    options={barangayOptions}
                    onChange={(e) => setUserData(prev => ({...prev, officeAddress: {...prev.officeAddress, barangay: e.target.value}}))}
                    disabled={!editing}
                    className="w-full border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Street</label>
                <InputText
                    value={userData.officeAddress.street}
                    onChange={(e) => setUserData(prev => ({...prev, officeAddress: {...prev.officeAddress, street: e.target.value}}))}
                    disabled={!editing}
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>
        </div>
    );

    const renderPassword = () => (
        <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                <InputText
                    value={userData.passwordInfo.email}
                    onChange={(e) => setUserData(prev => ({...prev, passwordInfo: {...prev.passwordInfo, email: e.target.value}}))}
                    disabled={!editing}
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                <CustomPasswordInput
                    value={userData.passwordInfo.password}
                    onChange={(e) => setUserData(prev => ({...prev, passwordInfo: {...prev.passwordInfo, password: e.target.value}}))}
                    disabled={!editing}
                    className="w-full p-2 border rounded-md border-gray-300"
                    toggleMask
                    feedback={false}
                />
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                <CustomPasswordInput
                    value={userData.passwordInfo.confirmPassword}
                    onChange={(e) => setUserData(prev => ({...prev, passwordInfo: {...prev.passwordInfo, confirmPassword: e.target.value}}))}
                    disabled={!editing}
                    className="w-full p-2 border rounded-md border-gray-300"
                    toggleMask
                    feedback={false}
                />
            </div>
        </div>
    );

    const tabs = [
        { id: 'personal', label: 'Personal Information', content: renderPersonalInformation },
        { id: 'account', label: 'Account Details', content: renderAccountDetails },
        { id: 'address', label: 'Office Address', content: renderOfficeAddress },
        { id: 'password', label: 'Password', content: renderPassword },
    ];

    return (
        <AdminLayout activePage="Profile">
            <div className='flex flex-row h-full w-full px-4 py-2 bg-white rounded-xl'>
                <div className='flex flex-col items-center justify-start h-full w-1/4 p-5'>
                    <img src="/profileAvatar.png" alt="Profile" className="w-20 h-20 rounded-full mr-4" />
                    <div>
                        <h1 className='text-2xl font-bold'>{userData.personalInfo.firstName} {userData.personalInfo.lastName}</h1>
                        <p className='text-sm text-gray-500'>{getUserTypeLabel(userData.accountDetails.userType)}</p>
                    </div>
                </div>

                <div className='flex justify-between flex-col w-full p-4'>
                    <div className="flex justify-between mb-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 w-full font-medium ${
                                    activeTab === tab.id
                                        ? 'text-green-500 border-b-2 border-green-500'
                                        : 'text-gray-500 border-b-2 border-gray-300 hover:text-green-500'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSave} className="flex flex-col justify-between h-full">
                        <div className="mt-4">
                            {tabs.find(tab => tab.id === activeTab).content()}
                        </div>
                        
                        <div className='flex justify-end'>
                            <Button
                                label={editing ? "Cancel" : "Edit"}
                                type="button"
                                onClick={handleToggleEdit}
                                className={`border h-12 w-24 text-white font-bold ${
                                    editing 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-green-500 hover:bg-green-600'
                                }`}
                            />
                            {editing && (
                                <Button
                                    label="Save Changes"
                                    disabled={isSubmitting}
                                    type="submit"
                                    className='ml-4 p-button-success border h-12 px-4 text-white font-bold bg-green-500 hover:bg-green-600'
                                />
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Profile;