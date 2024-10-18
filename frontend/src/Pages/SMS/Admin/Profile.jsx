import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

import CustomPasswordInput from '../../../Components/Form/PasswordComponent'; 
import { useAuth } from '../../Authentication/Login/AuthContext';

function Profile() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');
    const [editing, setEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch(`${apiUrl}/users/${user.id}`);
            const data = await res.json();
            console.log(data);
            setUserData({
                personalInfo: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    birthDate: data.birthDate ? new Date(data.birthDate) : null,
                    contactNumber: data.contactNumber
                },
                accountDetails: {
                    userType: data.userType,
                    organizationName: data.organizationName,
                    jobTitlePosition: data.jobTitlePosition,
                    branchRegion: data.branchRegion,
                    branchOffice: data.branchOffice,
                },
                officeAddress: {
                    region: data.officeAddress.region,
                    province: data.officeAddress.province,
                    cityTown: data.officeAddress.cityTown,
                    barangay: data.officeAddress.barangay,
                    street: data.officeAddress.street,
                },
                passwordInfo: {
                    email: data.email,
                    password: null,
                    confirmPassword: null
                }
            });
        }
        catch {
            console.error(error.message)
        } finally {
            setIsLoading(false);
        }
    }

    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
    ];

    const userTypeOptions = [
        { label: 'Admin', value: 'admin' },
    ];
    
    const [branchRegionOptions, setBranchRegionOptions] = useState([]);
    const [branchOfficeOptions, setBranchOfficeOptions] = useState([]);
    const [regionOptions, setRegionOptions] = useState([]);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [barangayOptions, setBarangayOptions] = useState([]);

    useEffect(() => {
        fetchRegions();
    }, []);

  useEffect(() => {
    if (user.branchRegion) {
      const selectedRegion = branchRegionOptions.find(r => r.value === user.branchRegion);
      if (selectedRegion && selectedRegion.code === '130000000') {
        fetchCities();
      } else if (selectedRegion) {
        fetchProvinces(selectedRegion.code);
      }
    }
  }, [user.branchRegion, branchRegionOptions]);
  
  const fetchRegions = async () => {
    try {
      const res = await fetch('https://psgc.gitlab.io/api/regions/');
      const data = await res.json();
      const regions = data.map(region => ({
        label: region.regionName,
        value: region.regionName,
        code: region.code
      }));
      setBranchRegionOptions(regions);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const fetchProvinces = async (regionCode) => {
    try {
      const res = await fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`);
      const data = await res.json();
      const provinces = data.map(province => ({
        label: province.name,
        value: province.name,
        code: province.code
      }));
      setBranchOfficeOptions(provinces);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch('https://psgc.gitlab.io/api/regions/130000000/cities/');
      const data = await res.json();
      const cities = data.map(city => ({
        label: city.name,
        value: city.name,
        code: city.code
      }));
      setBranchOfficeOptions(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

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

    const handleInputChange = (section, field, value) => {
        setUserData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value
            }
        }));

        // Special handling for branchRegion
        if (section === 'accountDetails' && field === 'branchRegion') {
            const selectedRegion = branchRegionOptions.find(r => r.value === value);
            if (selectedRegion) {
                if (selectedRegion.code === '130000000') {
                    fetchCities();
                } else {
                    fetchProvinces(selectedRegion.code);
                }
            }
            // Reset branchOffice when branchRegion changes
            setUserData(prevData => ({
                ...prevData,
                accountDetails: {
                    ...prevData.accountDetails,
                    branchOffice: null
                }
            }));
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
                    className="w-full focus:ring-0"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                <InputText
                    value={userData.personalInfo.lastName}
                    onChange={(e) => setUserData(prev => ({...prev, personalInfo: {...prev.personalInfo, lastName: e.target.value}}))}
                    disabled={!editing}
                    className="w-full focus:ring-0"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
                <Dropdown
                    value={userData.personalInfo.gender}
                    options={genderOptions}
                    onChange={(e) => setUserData(prev => ({...prev, personalInfo: {...prev.personalInfo, gender: e.target.value}}))}
                    disabled={!editing}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Birth Date</label>
                <Calendar
                    value={userData.personalInfo.birthDate}
                    onChange={(e) => setUserData(prev => ({...prev, personalInfo: {...prev.personalInfo, birthDate: e.value}}))}
                    disabled={!editing}
                    dateFormat="mm/dd/yy"
                    className="w-full rounded-md"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Contact Number</label>
                <InputText
                    value={userData.personalInfo.contactNumber}
                    onChange={(e) => setUserData(prev => ({...prev, personalInfo: {...prev.personalInfo, contactNumber: e.target.value}}))}
                    disabled={!editing}
                    className="w-full focus:ring-0"
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
                    className="w-full focus:ring-0"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Job Title/Position</label>
                <InputText
                    value={userData.accountDetails.jobTitlePosition}
                    onChange={(e) => setUserData(prev => ({...prev, accountDetails: {...prev.accountDetails, jobTitlePosition: e.target.value}}))}
                    disabled={!editing}
                    className="w-full focus:ring-0"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Region</label>
                <Dropdown
                    value={userData.accountDetails.branchRegion}
                    options={branchRegionOptions}
                    onChange={(e) => handleInputChange('accountDetails', 'branchRegion', e.value)}
                    disabled={!editing}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Branch Office</label>
                <Dropdown
                    value={userData.accountDetails.branchOffice}
                    options={branchOfficeOptions}
                   onChange={(e) => handleInputChange('accountDetails', 'branchOffice', e.value)}
                    disabled={!editing}
                    className="ring-0 w-full placeholder:text-gray-400"
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
                    options={regionOptions}
                    onChange={(e) => setUserData(prev => ({...prev, officeAddress: {...prev.officeAddress, region: e.target.value}}))}
                    disabled={!editing}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Province</label>
                <Dropdown
                    value={userData.officeAddress.province}
                    options={provinceOptions}
                    onChange={(e) => setUserData(prev => ({...prev, officeAddress: {...prev.officeAddress, province: e.target.value}}))}
                    disabled={!editing}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">City/Town</label>
                <Dropdown
                    value={userData.officeAddress.cityTown}
                    options={cityOptions}
                    onChange={(e) => setUserData(prev => ({...prev, officeAddress: {...prev.officeAddress, cityTown: e.target.value}}))}
                    disabled={!editing}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Barangay</label>
                <Dropdown
                    value={userData.officeAddress.barangay}
                    options={barangayOptions}
                    onChange={(e) => setUserData(prev => ({...prev, officeAddress: {...prev.officeAddress, barangay: e.target.value}}))}
                    disabled={!editing}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Street</label>
                <InputText
                    value={userData.officeAddress.street}
                    onChange={(e) => setUserData(prev => ({...prev, officeAddress: {...prev.officeAddress, street: e.target.value}}))}
                    disabled={!editing}
                    className="w-full focus:ring-0"
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
                    className="w-full focus:ring-0"
                />
            </div>
            { editing && (
                <div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                        <CustomPasswordInput
                            value={userData.passwordInfo.password}
                            onChange={(e) => setUserData(prev => ({...prev, passwordInfo: {...prev.passwordInfo, password: e.target.value}}))}
                            disabled={!editing}
                            className="focus:border-[#14b8a6] hover:border-[#14b8a6] w-full p-2 border rounded-md border-gray-300"
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
                            className="focus:border-[#14b8a6] hover:border-[#14b8a6] w-full p-2 border rounded-md border-gray-300"
                            toggleMask
                            feedback={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const tabs = [
        { id: 'personal', label: 'Personal Information', content: renderPersonalInformation },
        { id: 'account', label: 'Account Details', content: renderAccountDetails },
        { id: 'address', label: 'Office Address', content: renderOfficeAddress },
        { id: 'password', label: 'Password', content: renderPassword },
    ];

    if (isLoading) {
        return (
            <AdminLayout activePage="Profile">
                <div className="flex items-center justify-center h-full">
                    <p>Loading...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!userData) {
        return (
            <AdminLayout activePage="Profile">
                <div className="flex items-center justify-center h-full">
                    <p>Error loading user data. Please try again later.</p>
                </div>
            </AdminLayout>
        );
    }

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