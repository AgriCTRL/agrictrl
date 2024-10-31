import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import CardComponent from '@/Components/CardComponent';

import { 
    Warehouse
} from "lucide-react";

import Stats from '@/Components/Admin/Dashboard/Stats';
import UserDemographic from '@/Components/Admin/Dashboard/UserDemographic';
import NfaFacilities from '@/Components/Admin/Dashboard/NfaFacilities';
import MillingStatusChart from '@/Components/Admin/Dashboard/MillingStatusChart';
import ProcessingStatusChart from '@/Components/Admin/Dashboard/ProcessingStatusChart';
import WetDryInventoryChart from '@/Components/Admin/Dashboard/WetDryInventoryChart';

function Dashboard() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    
    // State for Statistics
    const [partnerFarmersCount, setPartnerFarmersCount] = useState(0);
    const [totalPalaysCount, setTotalPalaysCount] = useState(0);
    const [totalRiceCount, setTotalRiceCount] = useState(0);
    const [riceSoldCount, setRiceSoldCount] = useState(0);

    // State for Palay Inventory
    const [dryCount, setDryCount] = useState(0);
    const [wetCount, setWetCount] = useState(0);
    const [palayBatches, setPalayBatches] = useState([]);

    // State for Supplier Category
    const [supplierCategories, setSupplierCategories] = useState({
        individual: 0,
        coop: 0
    });

    // State for NFA Facilities
    const [warehousesCount, setWarehousesCount] = useState(0);
    const [dryersCount, setDryersCount] = useState(0);
    const [millersCount, setMillersCount] = useState(0);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Partner Farmers Count (unique by Fname and Lname)
                const partnerFarmersRes = await fetch(`${apiUrl}/palaySuppliers/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const partnerFarmersData = await partnerFarmersRes.json();
                setPartnerFarmersCount(partnerFarmersData);

                // Fetch Total Palays Count
                const totalPalaysRes = await fetch(`${apiUrl}/palaybatches/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const totalPalaysData = await totalPalaysRes.json();
                setTotalPalaysCount(totalPalaysData);

                // Fetch Total Rice Count
                const totalRiceRes = await fetch(`${apiUrl}/ricebatches/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const totalRiceData = await totalRiceRes.json();
                setTotalRiceCount(totalRiceData);

                // Fetch Rice Sold Count
                const riceSoldRes = await fetch(`${apiUrl}/riceorders/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const riceSoldData = await riceSoldRes.json();
                setRiceSoldCount(riceSoldData);

                // Fetch Palay Inventory (Wet/Dry)
                const palayInventoryRes = await fetch(`${apiUrl}/palaybatches`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const palayInventoryData = await palayInventoryRes.json();
                setPalayBatches(palayInventoryData);

                // Fetch Supplier Categories
                const suppliersRes = await fetch(`${apiUrl}/palaysuppliers`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const suppliersData = await suppliersRes.json();
                const individualCount = suppliersData.filter(supplier => supplier.category === 'individual').length;
                const coopCount = suppliersData.filter(supplier => supplier.category === 'coop').length;
                setSupplierCategories({ individual: individualCount, coop: coopCount });

                // Fetch NFA Facilities Counts
                const warehousesRes = await fetch(`${apiUrl}/warehouses/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const warehousesData = await warehousesRes.json();
                setWarehousesCount(warehousesData);

                const millersRes = await fetch(`${apiUrl}/millers/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const millersData = await millersRes.json();
                setMillersCount(millersData);

                const dryersRes = await fetch(`${apiUrl}/dryers/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const dryersData = await dryersRes.json();
                setDryersCount(dryersData);
            }
            catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, [])

    return (
        <AdminLayout activePage="Dashboard">
            <div className="flex flex-col gap-4">
                <Stats 
                    partnerFarmersCount={partnerFarmersCount}
                    totalPalaysCount={totalPalaysCount}
                    totalRiceCount={totalRiceCount}
                    riceSoldCount={riceSoldCount}
                />

                <div className='grid grid-flow-col grid-rows-2 grid-cols-3 gap-4'>
                    {/* <PalayInventory palayBatches={palayBatches} /> */}

                    <UserDemographic supplierCategories={supplierCategories} />

                    <NfaFacilities 
                        warehousesCount={warehousesCount}
                        dryersCount={dryersCount}
                        millersCount={millersCount}
                    />

                    <CardComponent className="bg-white transition hover:shadow-lg">
                        <MillingStatusChart palayBatches={palayBatches} />
                    </CardComponent>

                    <CardComponent className="bg-white col-span-1 transition hover:shadow-lg">
                        <WetDryInventoryChart palayBatches={palayBatches} />
                    </CardComponent>

                    <CardComponent className="bg-white transition hover:shadow-lg">
                        <ProcessingStatusChart palayBatches={palayBatches} />
                    </CardComponent>
                    
                    {/* <CardComponent className="bg-white transition hover:shadow-lg row-start-2 row-end-4">
                        <CardComponent className="bg-white w-full flex-col gap-4">
                            <div className='w-full flex justify-between'>
                                <div className="title flex gap-4 text-black">
                                    <Warehouse size={20}/>
                                    <p className='font-bold'>Warehouse Capacity</p>
                                </div>
                            </div>
                            <div className='graph'>
                            </div>
                        </CardComponent>
                    </CardComponent> */}
                </div>
            </div>
        </AdminLayout>
    );
}

export default Dashboard;