import React, { useState, useEffect, useRef } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

import { Wheat, UserIcon, CheckIcon, TruckIcon } from 'lucide-react';

import { Stepper, Step, StepLabel } from '@mui/material';
import { InputText } from 'primereact/inputtext';

const initialPalayData = {
    // Farmer Info
    category: '',
    farmerName: '',
    numOfFarmer: '',
    birthDate: null,
    gender: '',
    email: '',
    contactNumber : '',
    // House Address
    palaySupplierRegion: '',
    palaySupplierProvince: '',
    palaySupplierCityTown: '',
    palaySupplierBarangay: '',
    palaySupplierStreet: '',
    // Palay Info
    dateBought: '',
    palayVariety: '',
    buyingStationName: '',
    buyingStationLoc: '',
    quantityBags: '',
    grossWeight: '',
    netWeight: '',
    qualityType: '',
    moistureContent: '',
    purity: '',
    damaged: '',
    price: '',
    // Farm Origin
    farmRegion: '',
    farmProvince: '',
    farmCityTown: '',
    farmBarangay: '',
    farmStreet: '',
    farmSize: '',
    plantedDate: null,
    harvestedDate: null,
    estimatedCapital: '',
    currentlyAt: '',
    status: 'to be dry',
};

const initialTransactionData = {
    item: 'asd',
        itemId: 123,
        senderId: 123,
        sendDateTime: '123',
        fromLocationType: 'procurement',
        fromLocationId: 123,
        transporterName: '',
        transporterDesc: '',
        receiverId: 123,
        receiveDateTime: '123',
        toLocationType: 'warehouse',
        toLocationId: '',
        status: 'pending',
        sendToWarehouse: 'asd',
        remarks: ''
};

function PalayRegister({ visible, onHide, onPalayRegistered }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const toast = useRef(null);
    
    const [activeStep, setActiveStep] = useState(0);
    const [palayData, setPalayData] = useState({
        // Farmer Info
        category: '',
        farmerName: '',
        numOfFarmer: '',
        birthDate: null,
        gender: '',
        email: '',
        contactNumber : '',
        // House Address
        palaySupplierRegion: '',
        palaySupplierProvince: '',
        palaySupplierCityTown: '',
        palaySupplierBarangay: '',
        palaySupplierStreet: '',
        // Palay Info
        dateBought: '',
        palayVariety: '',
        buyingStationName: '',
        buyingStationLoc: '',
        quantityBags: '',
        grossWeight: '',
        netWeight: '',
        qualityType: '',
        moistureContent: '',
        purity: '',
        damaged: '',
        price: '',
        // Farm Origin
        farmRegion: '',
        farmProvince: '',
        farmCityTown: '',
        farmBarangay: '',
        farmStreet: '',
        farmSize: '',
        plantedDate: null,
        harvestedDate: null,
        estimatedCapital: '',
        currentlyAt: '',
        status: 'to be dry',
    });
    const [transactionData, setTransactionData] = useState({
        item: 'asd',
        itemId: 123,
        senderId: 123,
        sendDateTime: '123',
        fromLocationType: 'procurement',
        fromLocationId: 123,
        transporterName: '',
        transporterDesc: '',
        receiverId: 123,
        receiveDateTime: '123',
        toLocationType: 'warehouse',
        toLocationId: '',
        status: 'pending',
        sendToWarehouse: 'asd',
        remarks: ''
    });

    useEffect(() => {
        if (visible) {
            setActiveStep(0);
        }
    }, [visible]);

    const steps = [
        { label: 'Farmer', icon: <UserIcon /> },
        { label: 'Palay Info', icon: <CheckIcon /> },
        { label: 'Logistics', icon: <TruckIcon /> }
    ];

    const options = [
        { label: 'Station A', value: 'stationA', location: 'loc 1' }, 
        { label: 'Station B', value: 'stationB', location: 'loc 2' }, 
        { label: 'Station C', value: 'stationC', location: 'loc 3' }
    ];

    const locationTypeOptions = [
        { label: 'Warehouse', value: 'warehouse' }, 
        { label: 'Dryer', value: 'dryer', }, 
        { label: 'Miller', value: 'miller' }
    ];

    const locationIdOptions = [
        { label: 'Facility A', value: 1 }, 
        { label: 'Facility B', value: 2 },
        { label: 'Facility C', value: 3 }
    ];

    const handlePalayInputChange = (e) => {
        const { name, value } = e.target;
        setPalayData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }; 

    const handleTransactionInputChange = (e) => {
        const { name, value } = e.target;
        setTransactionData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }; 

    const handleQualityTypeInputChange = (e) => {
        const { name, value } = e.target;
    
        setPalayData((prevState) => ({
            ...prevState,
            [name]: value,
            status: value === 'wet' ? 'To be Dry' : value === 'dry' ? 'To be Mill' : prevState.status
        }));
    };
    
    const handleStationChange = (e) => {
        const selectedStation = options.find(option => option.value === e.target.value);
        setPalayData(prevState => ({
            ...prevState,
            buyingStationName: e.target.value,
            location: selectedStation ? selectedStation.location : ''
        }));
    };
    
    const handleLocationType = (e) => {
        const selectedType = locationTypeOptions.find(option => option.value === e.target.value);
        setTransactionData(prevState => ({
            ...prevState,
            toLocationType: selectedType ? selectedType.label : '',
            [e.target.name]: e.target.value
        }));
    };
    
    const handleLocationId = (e) => {
        const selectedOption = locationIdOptions.find(option => option.value === e.value);
    
        setTransactionData(prevState => ({
            ...prevState,
            toLocationId: e.value,
        }));
    
        setPalayData(prevState => ({
            ...prevState,
            currentlyAt: selectedOption.label,
        }));
    };
    
    const renderFarmerInfo = () => (
        <div className="flex flex-col gap-4 h-full">
            <div className="w-full">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Dropdown
                    id="category"
                    name="category"
                    value={palayData.category}
                    options={[{ label: 'Individual Farmer', value: 'individual' }, { label: 'Cooperative', value: 'coop' }]}
                    onChange={handlePalayInputChange}  
                    placeholder="Select category"
                    className="w-full ring-0"
                />
            </div>

            <div className="flex flex-row w-full gap-4">
                <div className="w-1/2">
                    <label htmlFor="farmerName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <InputText
                        id="farmerName" 
                        name="farmerName"
                        value={palayData.farmerName}
                        onChange={handlePalayInputChange} 
                        placeholder="Enter your name" 
                        className="w-full ring-0"
                    />
                </div>

                {palayData.category === 'individual' ? (
                    <div className="flex flex-row w-1/2 gap-4">
                        <div className="w-3/5">
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                            <Calendar
                                id="birthDate"
                                name="birthDate"
                                value={palayData.birthDate}
                                onChange={handlePalayInputChange} 
                                placeholder="Select birthdate"
                                showIcon
                                className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                            />
                        </div>

                        <div className="w-2/5">
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <Dropdown
                                id="gender"
                                name="gender"
                                value={palayData.gender}
                                options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Others', value: 'others' }]}
                                onChange={handlePalayInputChange}  
                                placeholder="gender"
                                className="w-full ring-0"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="w-1/2">
                        <label htmlFor="numOfFarmer" className="block text-sm font-medium text-gray-700 mb-1">Number of Farmers</label>
                        <InputText
                            id="numOfFarmer"
                            name="numOfFarmer"
                            value={palayData.numOfFarmer}
                            onChange={handlePalayInputChange} 
                            placeholder="Enter number of farmers"
                            className="w-full ring-0"
                        />
                    </div>
                )}
            </div>
            
            <div className="flex flex-row w-full gap-4">
                <div className="w-1/2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <InputText
                        id="email"
                        name="email"
                        value={palayData.email}
                        onChange={handlePalayInputChange}  
                        placeholder="Enter your email"
                        className="w-full ring-0"
                    />
                </div>

                <div className="w-1/2">
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <InputText
                        id="contactNumber"
                        name="contactNumber"
                        value={palayData.contactNumber}
                        onChange={handlePalayInputChange} 
                        placeholder="Enter your phone number"
                        className="w-full ring-0"
                    />
                </div>
            </div>

            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">{palayData.category === 'individual' ? 'Home Address' : 'Office Address'}</label>
                <div className="flex gap-4">
                    <InputText
                        id="palaySupplierRegion"
                        name="palaySupplierRegion"
                        value={palayData.palaySupplierRegion}
                        onChange={handlePalayInputChange}  
                        placeholder="Region"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="palaySupplierProvince"
                        name="palaySupplierProvince"
                        value={palayData.palaySupplierProvince}
                        onChange={handlePalayInputChange}  
                        placeholder="Province"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="palaySupplierCityTown"
                        name="palaySupplierCityTown"
                        value={palayData.palaySupplierCityTown}
                        onChange={handlePalayInputChange}  
                        placeholder="City/Town"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="palaySupplierBarangay"
                        name="palaySupplierBarangay"
                        value={palayData.palaySupplierBarangay}
                        onChange={handlePalayInputChange}  
                        placeholder="Barangay"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="palaySupplierStreet"
                        name="palaySupplierStreet"
                        value={palayData.palaySupplierStreet}
                        onChange={handlePalayInputChange}  
                        placeholder="Street"
                        className="w-full ring-0"
                    />
                </div>
            </div>
        </div>
    );

    const renderPalayInfo = () => (
        <div className="flex flex-col gap-4">
            {/* Purchase Details */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label htmlFor="palayVariety" className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
                    <InputText
                        id="palayVariety"
                        name="palayVariety"
                        value={palayData.palayVariety}
                        onChange={handlePalayInputChange}  
                        placeholder="Enter Palay Variety"
                        className="w-full ring-0"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price per kg</label>
                    <InputText
                        id="price"
                        name="price"
                        value={palayData.price}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter price"
                        className="w-full ring-0"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="dateBought" className="block text-sm font-medium text-gray-700 mb-1">Date Bought</label>
                    <Calendar
                        id="dateBought"
                        name="dateBought"
                        value={palayData.dateBought}
                        onChange={handlePalayInputChange}  
                        showIcon
                        className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                    />
                </div>
            </div>
    
            {/* Quantity and Weight */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label htmlFor="quantityBags" className="block text-sm font-medium text-gray-700 mb-1">Quantity (Bags)</label>
                    <InputText
                        id="quantityBags"
                        name="quantityBags"
                        value={palayData.quantityBags}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter quantity"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="grossWeight" className="block text-sm font-medium text-gray-700 mb-1">Gross Weight (kg)</label>
                    <InputText
                        id="grossWeight"
                        name="grossWeight"
                        value={palayData.grossWeight}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter gross weight"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="netWeight" className="block text-sm font-medium text-gray-700 mb-1">Net Weight (kg)</label>
                    <InputText
                        id="netWeight"
                        name="netWeight"
                        value={palayData.netWeight}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter net weight"
                        className="w-full ring-0"
                    />
                </div>
            </div>
    
            {/* Quality Information */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label htmlFor="qualityType" className="block text-sm font-medium text-gray-700 mb-1">Quality Type</label>
                    <Dropdown
                        id="qualityType"
                        name="qualityType"
                        value={palayData.qualityType}
                        options={[
                            { label: 'Fresh/Wet', value: 'wet' },
                            { label: 'Clean/Dry', value: 'dry' },
                        ]}
                        onChange={handleQualityTypeInputChange}  
                        placeholder="Select quality"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="moistureContent" className="block text-sm font-medium text-gray-700 mb-1">Moisture Content (%)</label>
                    <InputText
                        id="moistureContent"
                        name="moistureContent"
                        value={palayData.moistureContent}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter moisture %"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="purity" className="block text-sm font-medium text-gray-700 mb-1">Purity (%)</label>
                    <InputText
                        id="purity"
                        name="purity"
                        value={palayData.purity}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter purity %"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="damaged" className="block text-sm font-medium text-gray-700 mb-1">Damaged (%)</label>
                    <InputText
                        id="damaged"
                        name="damaged"
                        value={palayData.damaged}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter damaged %"
                        className="w-full ring-0"
                    />
                </div>
            </div>
    
            {/* Price and Farm Details */}
            <div className="flex gap-4">
                <div className="w-full">
                    <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 mb-1">Farm Size (hectares)</label>
                    <InputText
                        id="farmSize"
                        name="farmSize"
                        value={palayData.farmSize}
                        onChange={handlePalayInputChange}  
                        type="number"
                        placeholder="Enter farm size"
                        className="w-full ring-0"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="plantedDate" className="block text-sm font-medium text-gray-700 mb-1">Date Planted</label>
                    <Calendar
                        id="plantedDate"
                        name="plantedDate"
                        value={palayData.plantedDate}
                        onChange={handlePalayInputChange}  
                        showIcon
                        className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="harvestedDate" className="block text-sm font-medium text-gray-700 mb-1">Date Harvested</label>
                    <Calendar
                        id="harvestedDate"
                        name="harvestedDate"
                        value={palayData.harvestedDate}
                        onChange={handlePalayInputChange}  
                        showIcon
                        className="rig-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
                    />
                </div>
            </div>
    
            {/* Farm Location */}
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Address</label>
                <div className="grid grid-cols-5 gap-4">
                    <InputText
                        id="farmRegion"
                        name="farmRegion"
                        value={palayData.farmRegion}
                        onChange={handlePalayInputChange}  
                        placeholder="Region"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="farmProvince"
                        name="farmProvince"
                        value={palayData.farmProvince}
                        onChange={handlePalayInputChange}  
                        placeholder="Province"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="farmCityTown"
                        name="farmCityTown"
                        value={palayData.farmCityTown}
                        onChange={handlePalayInputChange}  
                        placeholder="City/Town"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="farmBarangay"
                        name="farmBarangay"
                        value={palayData.farmBarangay}
                        onChange={handlePalayInputChange}  
                        placeholder="Barangay"
                        className="w-full ring-0"
                    />
                    <InputText
                        id="farmStreet"
                        name="farmStreet"
                        value={palayData.farmStreet}
                        onChange={handlePalayInputChange}  
                        placeholder="Street"
                        className="w-full ring-0"
                    />
                </div>
            </div>
    
            {/* Estimated Capital */}
            <div className="w-full">
                <label htmlFor="estimatedCapital" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Capital
                </label>
                <InputText
                    id="estimatedCapital"
                    name="estimatedCapital"
                    value={palayData.estimatedCapital}
                    onChange={handlePalayInputChange}  
                    type="number"
                    placeholder="Enter estimated capital"
                    className="w-full ring-0"
                />
            </div>
        </div>
    );

    const renderLogistics = () => (
        <div className="flex flex-col h-full w-full gap-2">
            <div className="flex w-full gap-4">
                <div className="w-full">
                    <label htmlFor="buyingStationName" className="block text-sm font-medium text-gray-700 mb-1">Bought at</label>
                    <Dropdown
                        id="buyingStationName"
                        name="buyingStationName"
                        value={palayData.buyingStationName}
                        options={options}
                        onChange={handleStationChange}
                        placeholder="Select buying station"
                        className="ring-0 w-full placeholder:text-gray-400"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="buyingStationLoc" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <InputText
                        id="buyingStationLoc"
                        name="buyingStationLoc"
                        value={palayData.buyingStationLoc}
                        onChange={handlePalayInputChange}  
                        className='w-full focus:ring-0'
                    />
                </div>
            </div>
            
            <div className="w-full">
                <label htmlFor="transporterName" className="block text-sm font-medium text-gray-700 mb-1">Transported by</label>
                <InputText
                    id="transporterName"
                    name="transporterName"
                    value={transactionData.transporterName}
                    onChange={handleTransactionInputChange}  
                    placeholder="Enter transport"
                    className='w-full focus:ring-0'
                />
            </div>

            <div className="w-full">
                <label htmlFor="transporterDesc" className="block text-sm font-medium text-gray-700 mb-1">Transport Description</label>
                <InputTextarea
                    id="transporterDesc"
                    name="transporterDesc"
                    value={transactionData.transporterDesc}
                    onChange={handleTransactionInputChange}  
                    placeholder="Enter description"
                    className="w-full ring-0"
                />
            </div>

            <div className="w-full">
                <label htmlFor="sendToWarehouse" className="block text-sm font-medium text-gray-700 mb-1">Send to</label>
                <div className="flex flex-row w-full space-x-2">
                    <Dropdown
                        id="sendToWarehouse"
                        name="sendToWarehouse"
                        value={transactionData.toLocationType}
                        options={locationTypeOptions}
                        onChange={handleLocationType} 
                        placeholder="Select location"
                        className="ring-0 w-full placeholder:text-gray-400"
                        disabled
                    />

                    <Dropdown
                        id="facility"
                        name="facility"
                        value={transactionData.toLocationId}
                        options={locationIdOptions}
                        onChange={handleLocationId}
                        placeholder="Select facility"
                        className="ring-0 w-full placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="w-full">
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <InputTextarea
                    id="remarks"
                    name="remarks"
                    value={transactionData.remarks}
                    onChange={handleTransactionInputChange} 
                    placeholder="Enter Remarks"
                    className="w-full ring-0"
                />
            </div>
        </div>
    );  

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
            console.log(palayData);
            onPalayRegistered(palayData);
            setPalayData(initialPalayData);
            setActiveStep(0);
            onHide();
        }
    };

    const handlePrevious = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleSubmit = () => {
        palaySubmit();
        transactionSubmit();
    };
    
    const palaySubmit = async () => {
        const transformedData = {
            ...palayData,
            dateBought: palayData.dateBought ? palayData.dateBought.toISOString().split('T')[0] : null,
            birthDate: palayData.birthDate ? palayData.birthDate.toISOString().split('T')[0] : null,
            plantedDate: palayData.plantedDate ? palayData.plantedDate.toISOString().split('T')[0] : null,
            harvestedDate: palayData.harvestedDate ? palayData.harvestedDate.toISOString().split('T')[0] : null,
        };
    
        console.log(transformedData);
    
        try {
            const response = await fetch(`${apiUrl}/palaybatches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': `${apiKey}`
                },
                body: JSON.stringify(transformedData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit palay data');
            }
    
            const result = await response.json();
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Palay record successfully created',
                life: 3000
            });
    
            onPalayRegistered(result);
            setPalayData(initialPalayData);
            onHide();
    
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create palay record',
                life: 3000
            });
        }
    };

    const transactionSubmit = async () => {
        const transformedData = {
            ...transactionData
        };
    
        console.log(transformedData);
    
        try {
            const response = await fetch(`${apiUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': `${apiKey}`
                },
                body: JSON.stringify(transformedData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit transaction data');
            }
    
            const result = await response.json();

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Transaction record successfully created',
                life: 3000
            });
    
            onPalayRegistered(result);
            setTransactionData(initialTransactionData);
            onHide();
    
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create transaction record',
                life: 3000
            });
        }
    };

    const customDialogHeader = (
        <div className="flex items-center space-x-2">
            <Wheat size={22} className="text-black" />
            <h3 className="text-md font-bold text-black">Buy Palay</h3>
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
                        label={activeStep === steps.length - 1 ? 'Buy Palay' : 'Next'} 
                        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} 
                        className="py-2 px-14 bg-primary"
                    />
                </div>
            }
        >
            <div className="w-full px-4 pt-5 ">
            <Toast ref={toast} />
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