import React, { useState, useEffect, useRef } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

import { Wheat, UserIcon, CheckIcon, TruckIcon } from 'lucide-react';

import { Stepper, Step, StepLabel } from '@mui/material';

import { useAuth } from '../../../Authentication/Login/AuthContext';
import { FarmerInfoForm } from './PalayRegisterForm/FarmerInfoForm';
import { PalayInfoForm } from './PalayRegisterForm/PalayInfoForm';
import { LogisticsInfoForm } from './PalayRegisterForm/LogisticsInfoForm';

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
    status: '',
};

const initialTransactionData = {
    item: 'Palay',
    itemId: '',
    senderId: '',
    fromLocationType: 'Procurement',
    fromLocationId: 0,
    transporterName: '',
    transporterDesc: '',
    receiverId: 0,
    receiveDateTime: '0',
    toLocationType: 'Warehouse',
    toLocationId: '',
    status: 'Pending',
    remarks: ''
};

function PalayRegister({ visible, onHide, onPalayRegistered }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const toast = useRef(null);
    const { user } = useAuth();

    const [palayId, setPalayId] = useState(null);
    const palayIdRef = useRef(null); 

    const [userData, setUserData] = useState(null);
    const [warehouseData, setWarehouseData] = useState([]);
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
        status: '',
    });
    const [transactionData, setTransactionData] = useState({
        item: 'Palay',
        itemId: '',
        senderId: '',
        fromLocationType: 'Procurement',
        fromLocationId: 0,
        transporterName: '',
        transporterDesc: '',
        receiverId: 0,
        receiveDateTime: '0',
        toLocationType: 'Warehouse',
        toLocationId: '',
        status: 'Pending',
        remarks: ''
    });

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setIsLoading] = useState(false);

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

    const locationOptions = warehouseData
    .filter(warehouse => warehouse.status === 'active')
    .map(warehouse => ({
        label: warehouse.facilityName,
        value: warehouse.id
    }));

    useEffect(() => {
        if (visible) {
            setActiveStep(0);
        }
    }, [visible]);

    useEffect(() => {
        fetchUserData();
        fetchWarehouseData();
    }, []);

    useEffect(() => {
        if (userData) {
            setTransactionData(prev => ({
                ...prev,
                senderId: user.id,
            }));
        }
    }, [userData]);

    const fetchUserData = async () => {
        try {
            const res = await fetch(`${apiUrl}/users/${user.id}`, {
                headers: { 'API-Key': `${apiKey}` },
            });
            const data = await res.json();
            setUserData({
                personalInfo: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    birthDate: data.birthDate ? new Date(data.birthDate) : null,
                    contactNumber: data.contactNumber,
                    validId: data.validId
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
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWarehouseData = async () => {
        try {
            const res = await fetch(`${apiUrl}/warehouses`, {
                headers: { 'API-Key': `${apiKey}` }
            });
            if (!res.ok) {
                throw new Error('Failed to fetch warehouse data');
            }
            const data = await res.json();
            setWarehouseData(data);
        } catch (error) {
            console.log(error.message);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch warehouse data', life: 3000 });
        }
    };

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
            status: value === 'Wet' ? 'To be Dry' : value === 'Dry' ? 'To be Mill' : prevState.status
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
        const selectedOption = locationOptions.find(option => option.value === e.value);
    
        setTransactionData(prevState => ({
            ...prevState,
            toLocationId: e.value,
        }));
    
        setPalayData(prevState => ({
            ...prevState,
            currentlyAt: selectedOption.label,
        }));
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        } else {
            // Submit the form
            console.log(palayData);
            onPalayRegistered(palayData);
            setActiveStep(0);
            onHide();
        }
    };

    const handlePrevious = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const palayResponse = await fetch(`${apiUrl}/palaybatches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': `${apiKey}`
                },
                body: JSON.stringify({
                    ...palayData,
                    dateBought: palayData.dateBought ? palayData.dateBought.toISOString().split('T')[0] : null,
                    birthDate: palayData.birthDate ? palayData.birthDate.toISOString().split('T')[0] : null,
                    plantedDate: palayData.plantedDate ? palayData.plantedDate.toISOString().split('T')[0] : null,
                    harvestedDate: palayData.harvestedDate ? palayData.harvestedDate.toISOString().split('T')[0] : null,
                })
            });
    
            if (!palayResponse.ok) {
                throw new Error('Failed to submit palay data');
            }
    
            const palayResult = await palayResponse.json();
            const newPalayId = palayResult.id;

            console.log("newPalayId is " + newPalayId);
            
            setPalayId(newPalayId);
            palayIdRef.current = newPalayId;
            setPalayData(initialPalayData);
    
            const transactionDataWithId = {
                ...transactionData,
                itemId: newPalayId
            };

            const transactionResponse = await fetch(`${apiUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': `${apiKey}`
                },
                body: JSON.stringify(transactionDataWithId)
            });
    
            if (!transactionResponse.ok) {
                throw new Error('Failed to submit transaction data');
            }
    
            const transactionResult = await transactionResponse.json();
            setTransactionData(initialTransactionData);
    
            // Show success message
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Records successfully created',
                life: 3000
            });
    
            onPalayRegistered(palayResult);
            setPalayId(null);
            palayIdRef.current = null;
            onHide();
    
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create records',
                life: 3000
            });
        }
    };
    
    const renderFarmerInfo = () => (
        <FarmerInfoForm 
            palayData={palayData}
            handlePalayInputChange={handlePalayInputChange}
        />
    );

    const renderPalayInfo = () => (
        <PalayInfoForm
            palayData={palayData}
            handlePalayInputChange={handlePalayInputChange}
            handleQualityTypeInputChange={handleQualityTypeInputChange}
        />
    );

    const renderLogistics = () => (
        <LogisticsInfoForm
            palayData={palayData}
            transactionData={transactionData}
            handlePalayInputChange={handlePalayInputChange}
            handleTransactionInputChange={handleTransactionInputChange}
            handleStationChange={handleStationChange}
            handleLocationType={handleLocationType}
            handleLocationId={handleLocationId}
            options={options}
            locationOptions={locationOptions}
        />
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