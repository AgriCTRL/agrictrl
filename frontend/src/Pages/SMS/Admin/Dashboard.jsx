import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import CardComponent from '@/Components/CardComponent';

import { 
    Warehouse
} from "lucide-react";

import Stats from '@/Components/Admin/Dashboard/Stats';
import PalayInventory from '@/Components/Admin/Dashboard/PalayInventory';
import UserDemographic from '@/Components/Admin/Dashboard/UserDemographic';
import MillingCapacity from '@/Components/Admin/Dashboard/MillingCapacity';
import NfaFacilities from '@/Components/Admin/Dashboard/NfaFacilities';

function Dashboard() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [warehousesCount, setWarehousesCount] = useState(0);
    const [dryersCount, setDryersCount] = useState(0);
    const [millersCount, setMillersCount] = useState(0);

    const facilitiesCount = warehousesCount + dryersCount + millersCount;
    
    useEffect(() => {
        const fetchRiceBatchesCount = async () => {
            try {
                const res = await fetch(`${apiUrl}/palaybatches/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const data = await res.json();
                stats.find((item) => item.label === "Total Rice").count = data;
            }
            catch (error) {
                console.log(error.message);
            }
        };
        const fetchTradersCount = async () => {
            try {
                const res = await fetch(`${apiUrl}/nfapersonnels/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setTradersCount(data);
                stats.find((item) => item.label === "Total Palay").count = data;
            }
            catch (error) {
                console.log(error.message);
            }
        };
        const fetchWarehousesCount = async () => {
            try {
                const res = await fetch(`${apiUrl}/warehouses/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setWarehousesCount(data);
            }
            catch (error) {
                console.log(error.message);
            }
        };
        const fetchDryersCount = async () => {
            try {
                const res = await fetch(`${apiUrl}/dryers/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setDryersCount(data);
            }
            catch (error) {
                console.log(error.message);
            }
        };
        const fetchMillersCount = async () => {
            try {
                const res = await fetch(`${apiUrl}/millers/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setMillersCount(data);
            }
            catch (error) {
                console.log(error.message);
            }
        };
        fetchRiceBatchesCount();
        fetchTradersCount();
        fetchWarehousesCount();
        fetchDryersCount();
        fetchMillersCount();
    }, [])

    return (
        <AdminLayout activePage="Dashboard">
            <div className="flex flex-col gap-8">
                <Stats stats={null} />

                <div className='grid grid-flow-col grid-rows-3 grid-cols-3 gap-4'>
                    <PalayInventory />

                    <CardComponent className="col-start-3 col-end-4 row-start-1 row-end-2 bg-gradient-to-t from-secondary to-primary">
                        <CardComponent className="w-full flex-col gap-4">
                        </CardComponent>
                    </CardComponent>
                    
                    <MillingCapacity />

                    <UserDemographic />

                    <NfaFacilities />
                    
                    <CardComponent className="bg-white transition hover:shadow-lg row-start-2 row-end-4">
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
                    </CardComponent>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Dashboard;