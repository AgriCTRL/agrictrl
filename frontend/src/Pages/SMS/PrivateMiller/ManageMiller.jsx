import React, { useState, useEffect } from 'react';
import PrivateMillerLayout from '../../../Layouts/PrivateMillerLayout';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

function ManageMiller() {
    const [activeTab, setActiveTab] = useState('personal');
    const [editing, setEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const [millerData, setMillerData] = useState({
        personalInfo: {
            firstName: '',
            lastName: '',
            gender: '',
            birthDate: null,
            contactNumber: ''
        },
        millerDetails: {
            millerName: '',
            capacity: '',
            millerType: ''
        },
        millerLocation: {
            region: '',
            province: '',
            cityTown: '',
            barangay: '',
            street: ''
        }
    });

    useEffect(() => {
        const storedMillerData = localStorage.getItem('millerData');


        if (storedMillerData) {
            setMillerData(JSON.parse(storedMillerData));
            setIsRegistered(true);
        } else {
            setShowRegistrationDialog(true);
        }

        localStorage.removeItem('millerData');
        setShowRegistrationDialog(true);
        setIsRegistered(false);
    }, []);

    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ];

    const millerTypeOptions = [
        { label: 'Small', value: 'Small' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Large', value: 'Large' }
    ];

    const regionOptions = [
        { label: 'Region 3', value: 'Region 3' },
        // Add more regions as needed
    ];

    const provinceOptions = [
        { label: 'Nueva Ecija', value: 'Nueva Ecija' },
        // Add more provinces as needed
    ];

    const barangayOptions = [
        { label: 'Brgy. Masagan', value: 'Brgy. Masagan' },
        // Add more barangays as needed
    ];

    const handleToggleEdit = () => {
        if (isRegistered) {
            setEditing(prevState => !prevState);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log('Saving miller data:', millerData);
            // localStorage.setItem('millerData', JSON.stringify(millerData));
            setEditing(false);
            setIsRegistered(true);
            setShowRegistrationDialog(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegistration = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log('Registering miller data:', millerData);
            // localStorage.setItem('millerData', JSON.stringify(millerData));
            setIsRegistered(true);
            setShowRegistrationDialog(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderPersonalInformation = (isRegistrationForm = false) => (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                <InputText
                    value={millerData.personalInfo.firstName}
                    onChange={(e) => setMillerData(prev => ({...prev, personalInfo: {...prev.personalInfo, firstName: e.target.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="w-full focus:ring-0"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                <InputText
                    value={millerData.personalInfo.lastName}
                    onChange={(e) => setMillerData(prev => ({...prev, personalInfo: {...prev.personalInfo, lastName: e.target.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="w-full focus:ring-0"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
                <Dropdown
                    value={millerData.personalInfo.gender}
                    options={genderOptions}
                    onChange={(e) => setMillerData(prev => ({...prev, personalInfo: {...prev.personalInfo, gender: e.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Birth Date</label>
                <Calendar
                    value={millerData.personalInfo.birthDate}
                    onChange={(e) => setMillerData(prev => ({...prev, personalInfo: {...prev.personalInfo, birthDate: e.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="w-full rounded-md"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Contact Number</label>
                <InputText
                    value={millerData.personalInfo.contactNumber}
                    onChange={(e) => setMillerData(prev => ({...prev, personalInfo: {...prev.personalInfo, contactNumber: e.target.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="w-full focus:ring-0"
                />
            </div>
        </div>
    );

    const renderMillerDetails = (isRegistrationForm = false) => (
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Miller Name</label>
                <InputText
                    value={millerData.millerDetails.millerName}
                    onChange={(e) => setMillerData(prev => ({...prev, millerDetails: {...prev.millerDetails, millerName: e.target.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="w-full focus:ring-0"
                />
            </div>
            <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Capacity</label>
                <InputText
                    value={millerData.millerDetails.capacity}
                    onChange={(e) => setMillerData(prev => ({...prev, millerDetails: {...prev.millerDetails, capacity: e.target.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="w-full focus:ring-0"
                />
            </div>
            <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Miller Type</label>
                <Dropdown
                    value={millerData.millerDetails.millerType}
                    options={millerTypeOptions}
                    onChange={(e) => setMillerData(prev => ({...prev, millerDetails: {...prev.millerDetails, millerType: e.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
        </div>
    );

    const renderMillerLocation = (isRegistrationForm = false) => (
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Region</label>
                <Dropdown
                    value={millerData.millerLocation.region}
                    options={regionOptions}
                    onChange={(e) => setMillerData(prev => ({...prev, millerLocation: {...prev.millerLocation, region: e.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Province</label>
                <Dropdown
                    value={millerData.millerLocation.province}
                    options={provinceOptions}
                    onChange={(e) => setMillerData(prev => ({...prev, millerLocation: {...prev.millerLocation, province: e.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">City/Town</label>
                <InputText
                    value={millerData.millerLocation.cityTown}
                    onChange={(e) => setMillerData(prev => ({...prev, millerLocation: {...prev.millerLocation, cityTown: e.target.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="w-full focus:ring-0"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Barangay</label>
                <Dropdown
                    value={millerData.millerLocation.barangay}
                    options={barangayOptions}
                    onChange={(e) => setMillerData(prev => ({...prev, millerLocation: {...prev.millerLocation, barangay: e.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Street</label>
                <InputText
                    value={millerData.millerLocation.street}
                    onChange={(e) => setMillerData(prev => ({...prev, millerLocation: {...prev.millerLocation, street: e.target.value}}))}
                    disabled={!editing && !isRegistrationForm}
                    className="w-full focus:ring-0"
                />
            </div>
        </div>
    );

    const tabs = [
        { id: 'personal', label: 'Owner Information', content: renderPersonalInformation },
        { id: 'details', label: 'Miller Details', content: renderMillerDetails },
        { id: 'location', label: 'Miller Location', content: renderMillerLocation },
    ];

    return (
        <PrivateMillerLayout activePage="Manage Miller">
            <div className='flex flex-col h-full w-full py-2 bg-white rounded-xl px-4'>
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary">
                    <h1 className="text-6xl text-white font-bold">Manage Miller</h1>
                </div>

                <div className='flex justify-between flex-col w-full h-full px-24 py-10'>
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
                            {isRegistered && (
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
                            )}
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

            <Dialog
                header="Miller Registration"
                visible={showRegistrationDialog}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!isRegistered) {
                        return;
                    }
                    setShowRegistrationDialog(false);
                }}
                footer={
                    <div>
                        <Button 
                            label="Register" 
                            icon="pi pi-check" 
                            onClick={handleRegistration} 
                            disabled={isSubmitting}
                            className='p-button-success'
                        />
                    </div>
                }
            >
                <form onSubmit={handleRegistration} className="flex flex-col space-y-4">
                    <h1 className='text-3xl'>Personal Information</h1>
                    {renderPersonalInformation(true)}
                    <h1 className='text-3xl'>Miller Details</h1>
                    {renderMillerDetails(true)}
                    <h1 className='text-3xl'>Miller Location</h1>
                    {renderMillerLocation(true)}
                </form>
            </Dialog>
        </PrivateMillerLayout>
    );
}

export default ManageMiller;