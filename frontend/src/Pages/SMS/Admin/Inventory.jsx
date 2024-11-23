import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FilterMatchMode } from 'primereact/api';
import { Download, Wheat } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import pdfLandscapeExport from '../../../Components/Pdf/pdfLandscapeExport';
import EmptyRecord from '../../../Components/EmptyRecord';

function Inventory() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [inventoryData, setInventoryData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [showDetails, setShowDetails] = useState(false);
    const [selectedPalay, setSelectedPalay] = useState(null);
    
    // Update filters when search value changes
    useEffect(() => {
        const newFilters = {
            global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
        };
        setFilters(newFilters);
    }, [globalFilterValue]);

    useEffect(() => {
        fetchInventoryData(Math.floor(first / 10), globalFilterValue);
    }, [first, globalFilterValue]);

    const fetchInventoryData = async (page = 0, searchValue = '') => {
        try {
            const limit = 10;
            const offset = page * limit;

            let url = `${apiUrl}/palaybatches?limit=${limit}&offset=${offset}`;

            if (searchValue) {
                url = `${apiUrl}/palaybatches/search?id=${searchValue}&limit=${limit}&offset=${offset}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch inventory data');
            }

            const { data, total } = await response.json();
            setInventoryData(data);
            setTotalRecords(total);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            
        }
    };

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
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
    };

    const handleItemClick = (item) => {
        setSelectedPalay(item);
        setShowDetails(true);
    };

    const itemTemplate = (item) => {
        return (
            <div
                className="flex items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg mb-4"
                onClick={() => handleItemClick(item)}
            >
                <div className="flex-none mr-4">
                    <Wheat size={40} className="text-gray-400" />
                </div>
                <div className="flex-grow">
                    <div className="text-xl font-semibold mb-1">
                        Palay Batch #{item.wsr}
                    </div>
                    <div className="text-gray-600 mb-2">
                        {formatDate(item.dateBought)} || age: {item.age}
                    </div>
                    <div className="text-sm text-gray-500">{item.quantityBags} bags</div>
                </div>
                <div className="flex-none flex flex-col items-center">
                    <Tag
                        value={item.status}
                        severity={getSeverity(item.status)}
                        className="text-sm px-2 rounded-md"
                    />
                </div>
            </div>
        );
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

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toISOString().split('T')[0];
    };

    return (
        <AdminLayout activePage="Inventory">
            <div className="flex flex-col h-full gap-4">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <IconField iconPosition="left" className="w-1/2">
                        <InputIcon className="pi pi-search text-light-grey" />
                        <InputText
                            placeholder="Search inventory..."
                            type="search"
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            className="w-full ring-0 hover:border-primary focus:border-primary placeholder:text-light-grey"
                        />
                    </IconField>
                    <div className="flex justify-end w-1/2">
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

                {/* DataView Container */}
                <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                    <div className="flex-grow overflow-hidden bg-white">
                        <div className="relative flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
                            <DataView
                                value={inventoryData}
                                itemTemplate={itemTemplate}
                                emptyMessage={<EmptyRecord label={'No Inventory Data'}/>}
                                lazy
                                paginator
                                rows={10}
                                first={first}
                                onPage={(e) => setFirst(e.first)}
                                totalRecords={totalRecords}
                                className="overflow-y-auto pb-16 p-4"
                                paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            />
                        </div>
                    </div>
                </div>

                {/* Details Dialog */}
                <Dialog
                visible={showDetails}
                onHide={() => setShowDetails(false)}
                header={`Batch #${selectedPalay?.wsr} Details`}
                className="w-full max-w-4xl"
            >
                {selectedPalay && (
                    <div className="grid grid-cols-3 gap-4">
                        {/* Basic Information */}
                        <div className="col-span-3 border-b pb-2">
                            <h3 className="font-semibold">Basic Information</h3>
                        </div>
                        <div>
                            <p className="text-gray-600">Quantity (Bags)</p>
                            <p>{selectedPalay.quantityBags}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Gross Weight</p>
                            <p>{selectedPalay.grossWeight} Kg</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Net Weight</p>
                            <p>{selectedPalay.netWeight} Kg</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Quality Type</p>
                            <p>{selectedPalay.qualityType}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Price/Kg</p>
                            <p>₱{selectedPalay.price}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Estimated Capital</p>
                            <p>₱{selectedPalay.estimatedCapital}</p>
                        </div>

                        {/* Dates Information */}
                        <div className="col-span-3 border-b pb-2 mt-4">
                            <h3 className="font-semibold">Important Dates</h3>
                        </div>
                        <div>
                            <p className="text-gray-600">Date Bought</p>
                            <p>{formatDate(selectedPalay.dateBought)}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Date Planted</p>
                            <p>{formatDate(selectedPalay.plantedDate)}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Date Harvested</p>
                            <p>{formatDate(selectedPalay.harvestedDate)}</p>
                        </div>

                        {/* Quality Specifications */}
                        <div className="col-span-3 border-b pb-2 mt-4">
                            <h3 className="font-semibold">Quality Specifications</h3>
                        </div>
                        <div>
                            <p className="text-gray-600">Moisture Content</p>
                            <p>{selectedPalay.qualitySpec.moistureContent}%</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Purity</p>
                            <p>{selectedPalay.qualitySpec.purity}%</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Damage</p>
                            <p>{selectedPalay.qualitySpec.damaged}%</p>
                        </div>

                        {/* Buying Station Information */}
                        <div className="col-span-3 border-b pb-2 mt-4">
                            <h3 className="font-semibold">Buying Station Information</h3>
                        </div>
                        <div>
                            <p className="text-gray-600">Station Name</p>
                            <p>{selectedPalay.buyingStationName}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Station Location</p>
                            <p>{selectedPalay.buyingStationLoc}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Current Location</p>
                            <p>{selectedPalay.currentlyAt}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Weigher</p>
                            <p>{selectedPalay.weighedBy}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Checker</p>
                            <p>{selectedPalay.correctedBy}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Classifier</p>
                            <p>{selectedPalay.classifiedBy}</p>
                        </div>

                        {/* Source Information */}
                        <div className="col-span-3 border-b pb-2 mt-4">
                            <h3 className="font-semibold">Source Information</h3>
                        </div>
                        <div>
                            <p className="text-gray-600">Farmer Name</p>
                            <p>{selectedPalay.palaySupplier.farmerName}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Contact Number</p>
                            <p>{selectedPalay.palaySupplier.contactNumber}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Email</p>
                            <p>{selectedPalay.palaySupplier.email}</p>
                        </div>

                        {/* Farm Information */}
                        <div className="col-span-3 border-b pb-2 mt-4">
                            <h3 className="font-semibold">Farm Information</h3>
                        </div>
                        <div>
                            <p className="text-gray-600">Farm Size</p>
                            <p>{selectedPalay.farm.farmSize} hectares</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-600">Complete Address</p>
                            <p>
                                {selectedPalay.farm.street}, {selectedPalay.farm.barangay}, {selectedPalay.farm.cityTown},{' '}
                                {selectedPalay.farm.province}, {selectedPalay.farm.region}
                            </p>
                        </div>
                    </div>
                )}
            </Dialog>
            </div>
        </AdminLayout>
    );
}

export default Inventory;