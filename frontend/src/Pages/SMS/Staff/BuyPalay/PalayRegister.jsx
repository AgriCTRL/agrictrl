import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

import { Wheat, UserIcon, CheckIcon, TruckIcon } from 'lucide-react';

import { Stepper, Step, StepLabel } from '@mui/material';
import { InputText } from 'primereact/inputtext';

// Reusable Input Component
const InputField = ({ label, id, value, onChange, placeholder, type = "text" }) => (
    <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-inputtext-sm p-2 rounded-md border border-gray-300 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-0 focus:border-primary"
        />
    </div>
);

const initialFormData = {
    // Farmer Info
    category: '',
    name: '',
    birthdate: null,
    gender: '',
    email: '',
    phoneNumber: '',
    houseAddress: {
        region: '',
        province: '',
        city: '',
        barangay: '',
        street: '',
    },
    // Palay Info
    variety: '',
    totalWeight: '',
    pricePerKg: '',
    qualityType: '',
    moistureContent: '',
    purity: '',
    damaged: '',
    farmOrigin: {
        region: '',
        province: '',
        city: '',
        barangay: '',
        street: '',
    },
    farmSize: '',
    datePlanted: null,
    dateHarvested: null,
    estimatedCapital: '',
    // Logistics
    boughtAt: '',
    transportedBy: '',
    description: '',
    sendToWarehouse: '',
    facility: '',
};

function PalayRegister({ visible, onHide, onPalayRegistered }) {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        // Farmer Info
        category: '',
        name: '',
        birthdate: null,
        gender: '',
        email: '',
        phoneNumber: '',
        houseAddress: {
            region: '',
            province: '',
            city: '',
            barangay: '',
            street: '',
        },
        // Palay Info
        variety: '',
        totalWeight: '',
        pricePerKg: '',
        qualityType: '',
        moistureContent: '',
        purity: '',
        damaged: '',
        farmOrigin: {
            region: '',
            province: '',
            city: '',
            barangay: '',
            street: '',
        },
        farmSize: '',
        datePlanted: null,
        dateHarvested: null,
        estimatedCapital: '',
        // Logistics
        boughtAt: '',
        transportedBy: '',
        description: '',
        sendToWarehouse: '',
    });

    useEffect(() => {
        if (visible) {
            setActiveStep(0);
        }
    }, [visible]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddressChange = (addressType, e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [addressType]: {
                ...prevState[addressType],
                [name]: value
            }
        }));
    };

    const renderFarmerInfo = () => (
        <div className="flex flex-col gap-4 h-full">
            <div className="w-full">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Dropdown
                    id="category"
                    name="category"
                    value={formData.category}
                    options={[{ label: 'Individual Farmer', value: 'individual' }, { label: 'Cooperative', value: 'coop' }]}
                    onChange={handleInputChange}
                    placeholder="select category"
                    className="ring-0 w-full placeholder:text-gray-400"
                />
            </div>

            <div className="flex flex-row w-full gap-4">
                <div className="w-1/2">
                    <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <InputText
                        label="Name"
                        id="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name" 
                        className='w-full'
                    />
                </div>

                <div className="flex flex-row w-1/2 gap-4">
                    <div className="w-3/5">
                        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                        <Calendar
                            id="birthdate"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleInputChange}
                            placeholder="Select birthdate"
                            className="ring-0 w-full rounded-md border-gray-300 placeholder:text-gray-400 placeholder:font-light"
                        />
                    </div>

                    <div className="w-2/5">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <Dropdown
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Others', value: 'others' }]}
                            onChange={handleInputChange}
                            placeholder="gender"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
            
            <div className="flex flex-row w-full gap-4">
                <div className="w-1/2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <InputText
                        label="Email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email here"
                        className='w-full'
                    />
                </div>

                <div className="w-1/2">
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <InputText
                        label="Phone Number"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className='w-full'
                    />
                </div>
            </div>
            <div className="w-full">
                <label htmlFor="houseAddress" className="block text-sm mb-1 font-medium text-gray-700">House Address</label>
                <div className="flex gap-4 w-full flex-wrap">
                    {['region', 'province', 'city', 'barangay', 'street'].map((field) => (
                        <InputText
                            key={field}
                            id={field}
                            value={formData.houseAddress[field]}
                            onChange={(e) => handleAddressChange('houseAddress', e)}
                            placeholder={field}
                            className='flex-1'
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPalayInfo = () => (
        <div className="flex flex-col h-full px-16">
            <div className="w-full flex flex-row mb-1 space-x-2">
                <InputField
                    label="Variety"
                    id="variety"
                    value={formData.variety}
                    onChange={handleInputChange}
                    placeholder="enter variety"
                />

                <InputField
                    label="Total Weight (kg)"
                    id="totalWeight"
                    value={formData.totalWeight}
                    onChange={handleInputChange}
                    placeholder="enter weight in KG"
                />

                <InputField
                    label="Price / kg"
                    id="pricePerKg"
                    value={formData.pricePerKg}
                    onChange={handleInputChange}
                    placeholder="enter price"
                />
            </div>

            <div className="w-full">
                <label htmlFor="qualityType" className="block text-sm font-medium text-gray-700 mb-1">Quality Type</label>
                <Dropdown
                    id="qualityType"
                    name="qualityType"
                    value={formData.qualityType}
                    options={[{ label: 'Grade A', value: 'gradeA' }, { label: 'Grade B', value: 'gradeB' }, { label: 'Grade C', value: 'gradeC' }]}
                    onChange={handleInputChange}
                    placeholder="select quality type"
                    className="mb-1 ring-0 w-full p-inputtext-md font-normal rounded-md border border-gray-300 placeholder:text-gray-400"
                />
            </div>
            
            <div className="w-full flex flex-row space-x-2 mb-1">
                <InputField
                    label="Moisture Content"
                    id="moistureContent"
                    value={formData.moistureContent}
                    onChange={handleInputChange}
                    placeholder="enter moisture content"
                />

                <div className="flex flex-row w-1/2 space-x-2">
                    <InputField
                        label="Purity"
                        id="purity"
                        value={formData.purity}
                        onChange={handleInputChange}
                        placeholder="enter purity"
                    />

                    <InputField
                        label="Damaged"
                        id="damaged"
                        value={formData.damaged}
                        onChange={handleInputChange}
                        placeholder="enter damaged"
                    />
                </div>
            </div>
            
            <div className="mb-1 w-full">
                <label htmlFor="farmOrigin" className="block text-sm mb-1 font-medium text-gray-700">Farm Origin</label>
                <div className="flex flex-row space-x-2">
                    {['region', 'province', 'city', 'barangay', 'street'].map((field) => (
                        <InputField
                            key={field}
                            id={field}
                            value={formData.farmOrigin[field]}
                            onChange={(e) => handleAddressChange('farmOrigin', e)}
                            placeholder={field}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full flex flex-row space-x-2 mb-1">
                <InputField
                    label="Farm Size"
                    id="farmSize"
                    value={formData.farmSize}
                    onChange={handleInputChange}
                    placeholder="enter farm size"
                />

                <div className="w-full">
                    <label htmlFor="datePlanted" className="block text-sm font-medium text-gray-700 mb-1">Date Planted</label>
                    <Calendar
                        id="datePlanted"
                        name="datePlanted"
                        value={formData.datePlanted}
                        onChange={handleInputChange}
                        placeholder="select date"
                        className="ring-0 w-full p-inputtext-sm rounded-md placeholder:text-gray-400 placeholder:font-light"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="dateHarvested" className="block text-sm font-medium text-gray-700 mb-1">Date Harvested</label>
                    <Calendar
                        id="dateHarvested"
                        name="dateHarvested"
                        value={formData.dateHarvested}
                        onChange={handleInputChange}
                        placeholder="select date"
                        className="ring-0 w-full p-inputtext-sm rounded-md placeholder:text-gray-400 placeholder:font-light"
                    />
                </div>

                <InputField
                    label="Estimated Capital"
                    id="estimatedCapital"
                    value={formData.estimatedCapital}
                    onChange={handleInputChange}
                    placeholder="enter capital"
                />
            </div>
        </div>
    );

    const renderLogistics = () => (
        <div className="flex flex-col h-full w-full px-16">
            <div className="w-full">
                <label htmlFor="boughtAt" className="block text-sm font-medium text-gray-700 mb-1">Bought at</label>
                <Dropdown
                    id="boughtAt"
                    name="boughtAt"
                    value={formData.boughtAt}
                    options={[{ label: 'Station A', value: 'stationA' }, { label: 'Station B', value: 'stationB' }, { label: 'Station C', value: 'stationC' }]}
                    onChange={handleInputChange}
                    placeholder="select buying station"
                    className="mb-1 ring-0 w-full p-inputtext-md font-normal rounded-md border border-gray-300 placeholder:text-gray-400"
                />
            </div>
            
            <InputField
                label="Transported by"
                id="transportedBy"
                value={formData.transportedBy}
                onChange={handleInputChange}
                placeholder="enter transport"
            />

            <div className="w-full">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <InputTextarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="enter description"
                    className="ring-0 w-full p-inputtext-sm p-2 rounded-md border border-gray-300 placeholder:text-gray-400 placeholder:font-normal"
                />
            </div>

            <div className="w-full">
                <label htmlFor="sendToWarehouse" className="block text-sm font-medium text-gray-700 mb-1">Send to</label>

                <div className="flex flex-row w-full space-x-2">
                    <Dropdown
                        id="sendToWarehouse"
                        name="sendToWarehouse"
                        value={formData.sendToWarehouse}
                        options={[{ label: 'Warehouse', value: 'warehouse' }, { label: 'Dryer', value: 'dryer' }, { label: 'Miller', value: 'miller' }]}
                        onChange={handleInputChange}
                        placeholder="select location"
                        className="mb-1 ring-0 w-[35%] p-inputtext-md font-normal rounded-md border border-gray-300 placeholder:text-gray-400"
                    />

                    <Dropdown
                        id="facility"
                        name="facility"
                        value={formData.facility}
                        options={[{ label: 'Facility A', value: 'facilityA' }, { label: 'Facility B', value: 'facilityB' }, { label: 'Facility C', value: 'facilityC' }]}
                        onChange={handleInputChange}
                        placeholder="select facility"
                        className="mb-1 ring-0 w-full p-inputtext-md font-normal rounded-md border border-gray-300 placeholder:text-gray-400"
                    />
                </div>
            </div>
        </div>
    );

    const steps = [
        { label: 'Farmer', icon: <UserIcon /> },
        { label: 'Palay Info', icon: <CheckIcon /> },
        { label: 'Logistics', icon: <TruckIcon /> }
    ];

    const CustomStepIcon = ({ icon, active }) => {
        return (
            <div 
                className={`flex items-center justify-center -translate-y-2
                            w-10 h-10 rounded-full transition-all
                            ${active 
                                ? 'bg-primary text-white scale-110' 
                                : 'bg-white text-primary border-2 border-primary'
                            }`}
            >
                {React.cloneElement(icon, { 
                    size: active ? 26 : 20,
                    className: 'transition-all'
                })}
            </div>
        );
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        } else {
            // Submit the form
            console.log(formData);
            onPalayRegistered(formData);
            setFormData(initialFormData);
            setActiveStep(0);
            onHide();
        }
    };

    const handlePrevious = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const customDialogHeader = (
        <div className="flex items-center space-x-2">
            <Wheat size={22} className="text-black" />
            <h3 className="text-md font-bold text-black">Add new</h3>
        </div>
    );

    return (
        <Dialog 
            visible={visible} 
            onHide={onHide} 
            header={customDialogHeader} 
            modal 
            style={{ minWidth: '60vw', maxWidth: '60vw'}}
            footer={
                <div className="flex justify-between">
                    <Button 
                        label="Previous" 
                        onClick={handlePrevious} 
                        disabled={activeStep === 0} 
                        className="py-2 px-14 bg-primary"
                    />
                    <Button 
                        label={activeStep === steps.length - 1 ? 'Submit' : 'Next'} 
                        onClick={handleNext} 
                        className="py-2 px-14 bg-primary"
                    />
                </div>
            }
        >
            <div className="w-full px-4 pt-5 ">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map(({ label, icon }, index) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={({ active }) => <CustomStepIcon icon={icon} active={active}/>}>
                                <div className={`text-base text-primary -translate-y-4 ${index === activeStep ? 'font-semibold' : ''}`}>
                                    {label}
                                </div>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
            <div className="">
                {activeStep === 0 && renderFarmerInfo()}
                {activeStep === 1 && renderPalayInfo()}
                {activeStep === 2 && renderLogistics()}
            </div>
        </Dialog>
    );
}

export default PalayRegister;