import React, { useState, useEffect, useRef  } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
        
import { 
    Settings2, 
    Search, 
    CircleAlert, 
    FileX, 
    RotateCw, 
    Plus, 
    Loader2,
    Undo2,
    CheckCircle2
} from "lucide-react";

import PalayRegister from './PalayRegister';
import { useAuth } from '../../../Authentication/Login/AuthContext';
import StaffLayout from '@/Layouts/StaffLayout';

function BuyPalay() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const { user } = useAuth();

    // const [user] = useState({ userType: 'NFA Branch Staff' });

    const [palayCount, setPalayCount] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [distributedCount, setDistributedCount] = useState(0);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [showRegisterPalay, setShowRegisterPalay] = useState(false);
    const [inventoryData, setInventoryData] = useState([]);

    useEffect(() => {
        fetchPalayData();
        fetchData();
    }, []);

    useEffect(() => {
        const newFilters = {
            global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
        };
        setFilters(newFilters);
    }, [globalFilterValue]);

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const fetchPalayData = async () => {
        try {
            const response = await fetch(`${apiUrl}/palaybatches`);

            if (!response.ok) {
                throw new Error('Failed to fetch palay data');
            }

            const data = await response.json();
            setInventoryData(data);
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch palay data',
                life: 3000
            });
        }
    };

    const fetchData = async () => {
        const palayCountRes = await fetch(`${apiUrl}/palaybatches/count`);
        setPalayCount(await palayCountRes.json());
        const millingCountRes = await fetch(`${apiUrl}/millingbatches/count`);
        const millingCount = await millingCountRes.json();
        const dryingCountRes = await fetch(`${apiUrl}/dryingbatches/count`);
        const dryingCount = await dryingCountRes.json();
        setProcessedCount( millingCount + dryingCount );
        const distributeCountRes = await fetch(`${apiUrl}/riceorders/received/count`);
        setDistributedCount(await distributeCountRes.json());
    }

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
          case 'to be dry': return 'success';
          case 'in drying': return 'success';
          case 'to be mill': return 'info';
          case 'in milling': return 'info';
          case 'milled': return 'primary';
          default: return 'danger';
        }
        // sucess - green
        // info - blue
        // warning - orange
        // danger - red 
        // primary - cyan
    };
    
    const statusBodyTemplate = (rowData) => (
        <Tag 
            value={rowData.status} 
            severity={getSeverity(rowData.status)} 
            style={{ minWidth: '80px', textAlign: 'center' }}
            className="text-sm px-2 rounded-md"
        />
    );

    const handleAddPalay = () => {
        setShowRegisterPalay(true);
    };

    const handlePalayRegistered = (newPalay) => {
        fetchPalayData();
        setShowRegisterPalay(false);
    };

    const dateBodyTemplate = (rowData) => {
        return new Date(rowData.dateBought).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const personalStats = [
        { icon: <Loader2 size={18} />, title: "Palay Bought", value: palayCount },
        { icon: <Undo2 size={18} />, title: "Processed", value: processedCount },
        { icon: <CheckCircle2 size={18} />, title: "Distributed", value: distributedCount },
    ];

    const totalValue = personalStats.reduce((acc, stat) => acc + stat.value, 0);

    const rightSidebar = () => {
        return (
            <div className="p-4 bg-white rounded-lg flex flex-col gap-4">
                <div className="header flex flex-col gap-4">
                    <div className='flex flex-col items-center justify-center gap-2'>
                        <p className="">Total</p>
                        <p className="text-2xl sm:text-4xl font-semibold text-primary">{totalValue}</p>
                    </div>
                    <div className="flex gap-2">
                        {personalStats.map((stat, index) => (
                            <div key={index} className="flex flex-col gap-2 flex-1 items-center justify-center">
                                <p className="text-sm">{stat.title}</p>
                                <p className="font-semibold text-primary">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <StaffLayout activePage="Procurement" user={user} isRightSidebarOpen={true} rightSidebar={rightSidebar()}>
            <Toast ref={toast} />
            <div className="flex flex-col h-full gap-4">
                <div className="flex flex-col justify-center gap-4 items-center p-8 rounded-lg bg-gradient-to-r from-primary to-secondary">
                    <h1 className="text-2xl sm:text-4xl text-white font-semibold">Palay Procurement</h1>
                    <span className="w-1/2">
                        <IconField iconPosition="left">
                            <InputIcon className=""> 
                                <Search className="text-white" size={18} />
                            </InputIcon>
                            <InputText 
                                className="ring-0 w-full rounded-full text-white bg-transparent border border-white placeholder:text-white" 
                                value={globalFilterValue} 
                                onChange={onGlobalFilterChange} 
                                placeholder="Tap to search" 
                            />
                        </IconField>
                    </span>
                </div>

                {/* Buttons & Search bar */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-row gap-2 items-center w-1/2">
                        {/* <Button 
                            className="font-medium text-white bg-primary hover:bg-primaryHover ring-0 border-0"
                        >
                            All
                        </Button>
                        <Button 
                            className="flex flex-center justify-between items-center gap-4 text-primary border border-gray-300 bg-white ring-0" 
                        >
                            <Settings2 size={18} />
                            <p className='font-medium'>Filters</p>
                        </Button> */}
                    </div>
                    
                    <div className="flex flex-row w-1/2 justify-end">
                        <Button 
                            className="ring-0 border-0 text-white bg-gradient-to-r from-primary to-secondary flex flex-center justify-between items-center gap-4"
                            onClick={handleAddPalay} 
                        >
                            <p className='font-medium'>Buy Palay</p>
                            <Plus size={18} />
                        </Button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex flex-col overflow-hidden rounded-lg">
                    <div className="overflow-hidden bg-white flex flex-col gap-4 p-5">
                        <div className='flex justify-between items-center'>
                            <p className='font-medium text-black'>Inventory</p>
                            <RotateCw size={18} 
                                onClick={fetchPalayData}
                                className='text-primary cursor-pointer hover:text-primaryHover'
                                title="Refresh data"                                
                            />
                        </div>
                        <DataTable 
                            value={inventoryData}
                            scrollable
                            scrollHeight="flex"
                            scrolldirection="both"
                            filters={filters}
                            globalFilterFields={['id', 'status']}
                            emptyMessage="No inventory found."
                            paginator
                            rows={30}
                            tableStyle={{ minWidth: '2450px' }}
                        >
                            <Column field="id" header="Batch ID" className="text-center" headerClassName="text-center" />
                            <Column field="dateBought" body={dateBodyTemplate} header="Date Bought" className="text-center" headerClassName="text-center" />
                            <Column field="quantityBags" header="Quantity in Bags" className="text-center" headerClassName="text-center" />
                            <Column field="grossWeight" header="Gross Weight(Kg)" className="text-center" headerClassName="text-center" />
                            <Column field="netWeight" header="Net Weight(Kg)" className="text-center" headerClassName="text-center" />
                            <Column field="qualityType" header="Quality Type" className="text-center" headerClassName="text-center" />
                            <Column field="qualitySpec.moistureContent" header="Moisture Content(%)" className="text-center" headerClassName="text-center" />
                            <Column field="qualitySpec.purity" header="Purity(%)" className="text-center" headerClassName="text-center" />
                            <Column field="qualitySpec.damaged" header="Damage(%)" className="text-center" headerClassName="text-center" />
                            <Column field="price" header="Price/Kg" className="text-center" headerClassName="text-center" />
                            <Column field="palaySupplier.farmerName" header="Supplier" className="text-center" headerClassName="text-center" />
                            <Column 
                                field=""
                                header="Farm Origin" 
                                className="text-center" 
                                headerClassName="text-center"
                                body={(rowData) => `${rowData.farm.region}, ${rowData.farm.province}`}
                            />
                            <Column field="currentlyAt" header="Current Location" className="text-center" headerClassName="text-center" />
                            <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center" frozen alignFrozen="right" />
                            {/* <Column body={actionBodyTemplate} exportable={false} className="text-center" headerClassName="text-center" frozen alignFrozen="right" /> */}
                        </DataTable>
                    </div>  
                </div>
            </div>

            <PalayRegister
                    visible={showRegisterPalay}
                    onHide={() => setShowRegisterPalay(false)}
                    onPalayRegistered={handlePalayRegistered}
                />
        </StaffLayout> 
    );
}

export default BuyPalay;