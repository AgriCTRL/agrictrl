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
    remarks: '',
    palayBatch: ''
};

function PalayRegister({ visible, onHide, onPalayRegistered }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const { user } = useAuth();

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
        remarks: '',
        palayBatch: ''
    });

    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [sameAsHomeAddress, setSameAsHomeAddress] = useState(false);

    const steps = [
        { label: 'Farmer', icon: <UserIcon /> },
        { label: 'Palay Info', icon: <CheckIcon /> },
        { label: 'Logistics', icon: <TruckIcon /> }
    ];

    const locationOptions = warehouseData
    .filter(warehouse => {
        // Check both capacity and warehouse name
        const canAccommodate = warehouse.status === 'active' && 
                             (warehouse.totalCapacity - warehouse.currentStock) >= parseInt(palayData.quantityBags || 0);
        const isPalayWarehouse = warehouse.facilityName.toLowerCase().includes('palay');
        
        return canAccommodate && isPalayWarehouse;
    })
    .map(warehouse => ({
        label: `${warehouse.facilityName} (Available: ${warehouse.totalCapacity - warehouse.currentStock} bags)`,
        name: warehouse.facilityName,
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

    const refreshData = () => {
        fetchUserData();
        fetchWarehouseData();
    }

    const fetchUserData = async () => {
        try {
            const res = await fetch(`${apiUrl}/users/${user.id}`);
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
            const res = await fetch(`${apiUrl}/warehouses`);
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
        
        setPalayData(prevState => {
            let updates = {
                ...prevState,
                [name]: value
            };
            
            // If checkbox is checked and home address fields are changed, update farm address
            if (sameAsHomeAddress && name.startsWith('palaySupplier')) {
                const farmField = name.replace('palaySupplier', 'farm');
                updates[farmField] = value;
            }
            
            // Handle quantity bags calculation as before
            if (name === 'quantityBags') {
                updates.grossWeight = value ? (parseInt(value) * 50).toString() : '';
                updates.netWeight = value ? (parseInt(value) * 50 - parseInt(value)).toString() : '';
                
                setTransactionData(prev => ({
                    ...prev,
                    toLocationId: '',
                }));
                
                updates.currentlyAt = '';
            }
            
            return updates;
        });
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

    const handleSameAddressChange = (e) => {
        const checked = e.target.checked;
        setSameAsHomeAddress(checked);
        
        if (checked) {
            // If checked, copy the home/office address values to farm address
            setPalayData(prev => ({
                ...prev,
                farmRegion: prev.palaySupplierRegion,
                farmProvince: prev.palaySupplierProvince,
                farmCityTown: prev.palaySupplierCityTown,
                farmBarangay: prev.palaySupplierBarangay,
                farmStreet: prev.palaySupplierStreet
            }));
        } else {
            // If unchecked, reset farm address fields
            setPalayData(prev => ({
                ...prev,
                farmRegion: '',
                farmProvince: '',
                farmCityTown: '',
                farmBarangay: '',
                farmStreet: ''
            }));
        }
    };
    
    const handleLocationId = (e) => {
        const selectedOption = locationOptions.find(option => option.value === e.value);
    
        setTransactionData(prevState => ({
            ...prevState,
            toLocationId: e.value,
        }));
    
        setPalayData(prevState => ({
            ...prevState,
            currentlyAt: selectedOption.name,
        }));
    };

    const handleNext = () => {
        const isValid = validateForm(activeStep);
        
        if (isValid && activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
    };
    
    const handlePrevious = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleSubmit = async () => {
        const isValid = validateForm(activeStep);
        if (!isValid) return;
        console.log(palayData);
    
        setIsLoading(true);
        try {
            // Step 1: Create palay data first
            const palayResponse = await fetch(`${apiUrl}/palaybatches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
            const palayId = palayResult.id;
    
            // Step 2: Create the transaction with the palay ID
            const transactionResponse = await fetch(`${apiUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...transactionData,
                    itemId: palayId
                })
            });
    
            if (!transactionResponse.ok) {
                throw new Error('Failed to submit transaction data');
            }
    
            // Step 3: Find the target warehouse and update its stock
            const targetWarehouse = warehouseData.find(warehouse => warehouse.id === transactionData.toLocationId);
            
            if (!targetWarehouse) {
                throw new Error('Target warehouse not found');
            }
    
            const newStock = Number(palayData.quantityBags) + Number(targetWarehouse.currentStock);
    
            const warehouseResponse = await fetch(`${apiUrl}/warehouses/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: transactionData.toLocationId,
                    currentStock: newStock
                })
            });
    
            if (!warehouseResponse.ok) {
                throw new Error('Failed to update warehouse stock');
            }
    
            // Reset states and show success message
            setPalayData(initialPalayData);
            setTransactionData(initialTransactionData);
    
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Records successfully created',
                life: 3000
            });
    
            onPalayRegistered(palayResult);
            onHide();
    
            refreshData();
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to create records',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderFarmerInfo = () => (
        <FarmerInfoForm 
            palayData={palayData}
            handlePalayInputChange={handlePalayInputChange}
            errors={errors}
        />
    );

    const renderPalayInfo = () => (
        <PalayInfoForm
            palayData={palayData}
            handlePalayInputChange={handlePalayInputChange}
            handleQualityTypeInputChange={handleQualityTypeInputChange}
            errors={errors}
            handleSameAddressChange={handleSameAddressChange}
            sameAsHomeAddress={sameAsHomeAddress}
        />
    );

    const renderLogistics = () => (
        <LogisticsInfoForm
            palayData={palayData}
            transactionData={transactionData}
            handlePalayInputChange={handlePalayInputChange}
            handleTransactionInputChange={handleTransactionInputChange}
            handleLocationId={handleLocationId}
            locationOptions={locationOptions}
            errors={errors}
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

    const validateForm = (step) => {
        let newErrors = {};
        if (step === 0) {
            // Farmer Info Validation
            if (!palayData.category.trim()) {
                newErrors.category = "Category is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Category is required', life: 5000});
            }
            if (!palayData.farmerName.trim()) {
                newErrors.farmerName = "Farmer name is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Farmer name is required', life: 5000});
            }
            if (palayData.category === 'individual') {
                if (!palayData.birthDate) {
                    newErrors.birthDate = "Birth date is required";
                    toast.current.show({severity:'error', summary: 'Error', detail:'Birth date is required', life: 5000});
                }
                if (!palayData.gender) {
                    newErrors.gender = "Gender is required";
                    toast.current.show({severity:'error', summary: 'Error', detail:'Gender is required', life: 5000});
                }
            } else {
                if (!palayData.numOfFarmer.trim()) {
                    newErrors.numOfFarmer = "Number of farmers is required";
                    toast.current.show({severity:'error', summary: 'Error', detail:'Number of farmers is required', life: 5000});
                }
            }
            if (!palayData.email) {
                newErrors.email = "Email is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Email is required', life: 5000});
            }
            if (!palayData.contactNumber.trim()) {
                newErrors.contactNumber = "Contact number is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Contact number is required', life: 5000});
            } else if (!/^\d{10,}$/.test(palayData.contactNumber)) {
                newErrors.contactNumber = "Invalid contact number format";
                toast.current.show({severity:'error', summary: 'Error', detail:'Invalid contact number format', life: 5000});
            }
            if (!palayData.palaySupplierRegion) {
                newErrors.palaySupplierRegion = "Region is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Region is required', life: 5000});
            }
            if (!palayData.palaySupplierProvince && palayData.palaySupplierRegion != 'National Capital Region') {
                newErrors.palaySupplierProvince = "Province is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Province is required', life: 5000});
            }
            if (!palayData.palaySupplierCityTown) {
                newErrors.palaySupplierCityTown = "City/Town is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'City/Town is required', life: 5000});
            }
            if (!palayData.palaySupplierBarangay) {
                newErrors.palaySupplierBarangay = "Barangay is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Barangay is required', life: 5000});
            }
            if (!palayData.palaySupplierStreet) {
                newErrors.palaySupplierStreet = "Street is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Street is required', life: 5000});
            }
        }
    
        else if (step === 1) {
            // Palay Info Validation
            if (!palayData.palayVariety) {
                newErrors.palayVariety = "Palay Variety is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Palay Variety is required', life: 5000});
            }
            if (!palayData.price) {
                newErrors.price = "Price is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Price is required', life: 5000});
            }
            if (!palayData.dateBought) {
                newErrors.dateBought = "Date bought is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Date bought is required', life: 5000});
            }
            if (!palayData.palayVariety.trim()) {
                newErrors.palayVariety = "Palay variety is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Palay variety is required', life: 5000});
            }
            if (!palayData.quantityBags.trim()) {
                newErrors.quantityBags = "Quantity in bags is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Quantity in bags is required', life: 5000});
            }
            if (!palayData.grossWeight.trim()) {
                newErrors.grossWeight = "Gross weight is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Gross weight is required', life: 5000});
            }
            if (!palayData.netWeight.trim()) {
                newErrors.netWeight = "Net weight is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Net weight is required', life: 5000});
            }
            if (!palayData.qualityType) {
                newErrors.qualityType = "Quality type is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Quality type is required', life: 5000});
            }
            if (!palayData.moistureContent) {
                newErrors.moistureContent = "Moisture Content is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Moisture Content is required', life: 5000});
            }
            if (!palayData.purity) {
                newErrors.purity = "Purity is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Purity is required', life: 5000});
            }
            if (!palayData.damaged) {
                newErrors.damaged = "Damaged is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Damaged is required', life: 5000});
            }
            if (!palayData.farmSize.trim()) {
                newErrors.farmSize = "Farm size is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Farm size is required', life: 5000});
            }
            if (!palayData.plantedDate) {
                newErrors.plantedDate = "Date planted is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Date planted is required', life: 5000});
            }
            if (!palayData.harvestedDate) {
                newErrors.harvestedDate = "Date harvested is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Date harvested is required', life: 5000});
            }
            
        
            // Farm Origin Validation
            if (!palayData.farmRegion) {
                newErrors.farmRegion = "Farm region is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Farm region is required', life: 5000});
            }
            if (!palayData.farmProvince && palayData.farmRegion != 'National Capital Region') {
                newErrors.farmProvince = "Farm province is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Farm province is required', life: 5000});
            }
            if (!palayData.farmCityTown) {
                newErrors.farmCityTown = "Farm city/town is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Farm city/town is required', life: 5000});
            }
            if (!palayData.farmBarangay) {
                newErrors.farmBarangay = "Farm barangay is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Farm barangay is required', life: 5000});
            }
            if (!palayData.farmStreet) {
                newErrors.farmStreet = "Farm street is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Farm street is required', life: 5000});
            }
            
            if (!palayData.estimatedCapital) {
                newErrors.estimatedCapital = "Estimated Capital is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Estimated Capital is required', life: 5000});
            }
        }
    
        else if (step === 2) {
            // Logistics Validation
            // if (!transactionData.buyingStationName) {
            //     newErrors.buyingStationName = "Buying Station is required";
            //     toast.current.show({severity:'error', summary: 'Error', detail:'Buying Station is required', life: 5000});
            // }
            // if (!transactionData.buyingStationLoc) {
            //     newErrors.buyingStationLoc = "Buying Station Location is required";
            //     toast.current.show({severity:'error', summary: 'Error', detail:'Buying Station Location is required', life: 5000});
            // }
            if (!transactionData.transporterName) {
                newErrors.transporterName = "Transporter is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Transporter is required', life: 5000});
            }
            if (!transactionData.transporterDesc) {
                newErrors.transporterDesc = "Transporter Description is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Transporter Description is required', life: 5000});
            }
            if (!transactionData.toLocationType) {
                newErrors.toLocationType = "Location type is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Location type is required', life: 5000});
            }
            if (!transactionData.toLocationId) {
                newErrors.toLocationId = "Destination location is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Destination location is required', life: 5000});
            }
            if (!transactionData.remarks.trim()) {
                newErrors.remarks = "Remarks is required";
                toast.current.show({severity:'error', summary: 'Error', detail:'Remarks is required', life: 5000});
            }
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <Dialog 
            visible={visible} 
            onHide={isLoading ? null : onHide} 
            header={customDialogHeader} 
            modal 
            style={{ minWidth: '60vw', maxWidth: '60vw'}}
            footer={
                <div className="flex justify-between">
                    <Button 
                        label="Previous" 
                        onClick={handlePrevious} 
                        disabled={activeStep === 0 || isLoading} 
                        className="py-2 px-14 bg-primary"
                    />
                    <Button 
                        label={activeStep === steps.length - 1 ? 'Buy Palay' : 'Next'} 
                        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                        disabled={isLoading} 
                        className="py-2 px-14 bg-primary"
                        loading={isLoading}
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