import React, { useState, useEffect, useRef  } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { Search, CircleAlert, Settings2, FileX } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import pdfExport from '../../../Components/pdfExport';

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
            const response = await fetch(`${apiUrl}/palaybatches`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

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

    const exportPdf = () => {
        const columns = ['ID', 'Date Planted', 'Date Harvested', 'Date Bought', 'Quantity in Bags', 'Gross Weight', 'Net Weight', 'Quality Type', 'Moisture Content', 'Purity', 'Damaged', 'Price', 'Farmer', 'Origin Farm', 'Current Location', 'Status'];
        const data = inventoryData.map(inventory => [
            inventory.id,
            inventory.plantedDate,
            inventory.harvestedDate,
            inventory.dateBought,
            inventory.quantityBags,
            inventory.grossWeight,
            inventory.netWeight,
            inventory.qualityType,
            inventory.qualitySpec.moistureContent,
            inventory.qualitySpec.purity,
            inventory.price,
            inventory.palaySupplier.farmerName,
            inventory.farm.region,
            inventory.currentlyAt,
            inventory.status,
            
        ]);

        pdfExport('Inventory Data Export', columns, data);
    };

    return (
        <AdminLayout activePage="Inventory">
            <div className="flex flex-col h-full px-4 py-2">
                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <span className="p-input-icon-left w-1/2 mr-4">
                            <Search className="text-primary ml-2 -translate-y-1"/>
                            <InputText 
                                type="search"
                                value={globalFilterValue} 
                                onChange={(e) => setGlobalFilterValue(e.target.value)} 
                                placeholder="Tap to Search" 
                                className="w-full pl-10 pr-4 py-2 rounded-lg placeholder-gray-500 text-primary border border-gray-300 ring-0 placeholder:text-primary"
                            />
                        </span>

                        <div className="flex flex-row w-1/2 justify-between">
                            <Button 
                                icon={<Settings2 className="mr-2 text-primary" />}
                                label="Filters" 
                                className="p-button-success text-primary border border-gray-300 rounded-md bg-white p-2 w-1/16" />

                            <Button 
                                icon={<FileX className="mr-2" />} 
                                label="Export" 
                                onClick={exportPdf}
                                className="p-button-success text-primary border border-primary rounded-md bg-transparent p-2 w-1/16" />
                        </div>

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
                            globalFilterFields={['trackingId', 'qualityType', 'status', 'farmer', 'originFarm']}
                            emptyMessage="No inventory found."
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
