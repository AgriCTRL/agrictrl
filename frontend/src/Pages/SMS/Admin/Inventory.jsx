import React, { useState, useEffect, useRef  } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
        
import { 
    Search, 
    CircleAlert, 
    Settings2, 
    FileX, 
    Download, 
    Filter, 
    PackageOpen 
} from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import EmptyRecord from '../../../Components/EmptyRecord';
import pdfLandscapeExport from '../../../Components/Pdf/pdfLandscapeExport';

function Inventory() { 
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [inventoryData, setInventoryData] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchInventoryData = async () => {
        try {
            const response = await fetch(`${apiUrl}/palaybatches`);

            if (!response.ok) {
                throw new Error('Failed to fetch inventory data');
            }

            const data = await response.json();
            setInventoryData(data);
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch inventory data',
                life: 3000
            });
        }
    };

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
    
    const actionBodyTemplate = (rowData) => (
        <CircleAlert 
            className="text-red-500"
            onClick={() => console.log('Edit clicked for:', rowData)}
        />
    );

    const dateBodyTemplate = (rowData) => {
        return new Date(rowData.dateBought).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const filterByGlobal = (value) => {
        setFilters({
            global: { value, matchMode: 'contains' }, // Keep 'contains' for flexible matching
        });
    };
    
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toISOString().slice(0, 10); // Gets the YYYY-MM-DD part
    };

    const exportPdf = () => {
        const columns = ['ID', 'Date Bought', 'Quantity in Bags', 'Quality Type', 'Price', 'Farmer', 'Origin Farm', 'Current Location', 'Status'];
        const data = inventoryData.map(inventory => [
            inventory.id,
            formatDate(inventory.dateBought),
            inventory.quantityBags,
            inventory.qualityType,
            inventory.price,
            inventory.palaySupplier.farmerName,
            inventory.farm.region,
            inventory.currentlyAt,
            inventory.status,
            
        ]);

        pdfLandscapeExport('Inventory Data Export', columns, data);
    };

    return (
        <AdminLayout activePage="Inventory">
            <div className="flex flex-col h-full gap-4">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <IconField iconPosition="left" className="w-1/2">
                        <InputIcon className="pi pi-search text-light-grey"></InputIcon>
                        <InputText 
                            placeholder="Tap to Search" 
                            type="search"
                            value={globalFilterValue} 
                            onChange={(e) => {
                                setGlobalFilterValue(e.target.value);
                                filterByGlobal(e.target.value); // Update filters on input change
                            }}
                            className='w-full ring-0 hover:border-primary focus:border-primary placeholder:text-light-grey' 
                        />
                    </IconField>
                    <div className="flex justify-end w-1/2">
                        {/* <Button 
                            type="button"
                            className="flex-center items-center gap-4 text-primary bg-white hover:bg-white/35 border border-lightest-grey ring-0"
                        >
                            <Filter size={20} />
                            <p className="font-semibold">Filters</p>
                        </Button> */}

                        <Button 
                            type="button"
                            className="flex flex-center justify-self-end items-center gap-4 bg-primary hover:bg-primaryHover border ring-0"
                            onClick={exportPdf}
                        >
                            <Download size={20} />
                            <p className="font-semibold">Export</p>
                        </Button>
                    </div>
                </div>

                {/* DataTable Container */}
                <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                    <div className="flex-grow overflow-hidden bg-white">
                        <DataTable 
                            value={inventoryData}
                            scrollable
                            scrollHeight="flex"
                            scrolldirection="both"
                            className="p-datatable-sm pt-5"
                            filters={filters}
                            globalFilterFields={['id', 'qualityType ', 'status', 'farmer']}
                            emptyMessage="No records found."
                            paginator
                            rows={30}
                            tableStyle={{ minWidth: '3100px' }}
                        >
                            <Column field="id" header="Batch ID" className="text-center" headerClassName="text-center" />
                            <Column field="plantedDate" body={dateBodyTemplate} header="Date Planted" className="text-center" headerClassName="text-center" />
                            <Column field="harvestedDate" body={dateBodyTemplate} header="Date Harvested" className="text-center" headerClassName="text-center" />
                            <Column field="dateBought" body={dateBodyTemplate} header="Date Bought" className="text-center" headerClassName="text-center" />
                            <Column field="quantityBags" header="Quantity in Bags" className="text-center" headerClassName="text-center" />
                            <Column field="grossWeight" header="Gross Weight" className="text-center" headerClassName="text-center" />
                            <Column field="netWeight" header="Net Weight" className="text-center" headerClassName="text-center" />
                            <Column field="qualityType" header="Quality Type" className="text-center" headerClassName="text-center" />
                            <Column field="qualitySpec.moistureContent" header="Moisture Content" className="text-center" headerClassName="text-center" />
                            <Column field="qualitySpec.purity" header="Purity" className="text-center" headerClassName="text-center" />
                            <Column field="qualitySpec.damaged" header="Damage" className="text-center" headerClassName="text-center" />
                            <Column field="price" header="Price/Kg" className="text-center" headerClassName="text-center" />
                            <Column field="palaySupplier.farmerName" header="Farmer" className="text-center" headerClassName="text-center" />
                            <Column 
                                field=""
                                header="Farm Origin" 
                                className="text-center" 
                                headerClassName="text-center"
                                body={(rowData) => `${rowData.farm.region}, ${rowData.farm.province}`}
                            />
                            <Column field="currentlyAt" header="Current Location" className="text-center" headerClassName="text-center" />
                            <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center" frozen alignFrozen="right" />
                            <Column body={actionBodyTemplate} exportable={false} className="text-center" headerClassName="text-center" frozen alignFrozen="right" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Inventory;
