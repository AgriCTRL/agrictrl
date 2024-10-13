import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import CardComponent from '@/Components/CardComponent';
import { Divider } from 'primereact/divider';
import { 
    Wheat, 
    HeartHandshake,
    Tractor,
    Building2
} from "lucide-react";
function Dashboard() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [warehousesCount, setWarehousesCount] = useState(0);
    const [dryersCount, setDryersCount] = useState(0);
    const [millersCount, setMillersCount] = useState(0);
    const [stats] = useState([
        {
            label: "Partner Farmers",
            icon: <HeartHandshake size={20}/>,
            count: 0,
            className: "border-r border-lightest-grey",
        },
        {
            label: "Total Palays",
            icon: <Wheat size={20}/>,
            count: 0,
            className: "border-r border-lightest-grey",
        },
        {
            label: "Total Rice",
            icon: <Wheat size={20}/>,
            count: 0,
            className: "border-r border-lightest-grey",
        },
        {
            label: "Rice Sold",
            icon: <Building2 size={20}/>,
            count: 0,
        },
    ])

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
            <CardComponent>
                {stats.map((stat, index) => (
                    <CardComponent 
                        key={index} 
                        className={`flex-1 flex-col gap-4 justify-center rounded-none ${index === (stats.length - 1) ? '' : stat.className}`}
                    >
                        <div className='flex gap-4 text-black'>
                            {stat.icon}
                            <p className='font-bold'>{stat.label}</p>
                        </div>
                        <h1 className='text-heading text-primary text-center font-bold'>{stat.count}</h1>
                    </CardComponent>
                ))}
            </CardComponent>
        </AdminLayout>
    );
}

export default Dashboard;