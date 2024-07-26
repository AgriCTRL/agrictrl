import React, { useState, useEffect } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import CardComponent from '@/Components/CardComponent';
import { Divider } from 'primereact/divider';
import { 
    Wheat, 
    HeartHandshake,
    Tractor,
    Building2
} from "lucide-react";
function Dashboard() {
    const [riceBatchesCount, setRiceBatchesCount] = useState(0);
    const [tradersCount, setTradersCount] = useState(0);
    const [warehousesCount, setWarehousesCount] = useState(0);
    const [dryersCount, setDryersCount] = useState(0);
    const [millersCount, setMillersCount] = useState(0);

    const facilitiesCount = warehousesCount + dryersCount + millersCount;
    
    useEffect(() => {
        const fetchRiceBatchesCount = async () => {
            try {
                const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/ricebatches/count', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setRiceBatchesCount(data);
            }
            catch (error) {
                console.log(error.message);
            }
        };
        const fetchTradersCount = async () => {
            try {
                const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/nfapersonnels/count', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setTradersCount(data);
            }
            catch (error) {
                console.log(error.message);
            }
        };
        const fetchWarehousesCount = async () => {
            try {
                const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/warehouses/count', {
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
                const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/dryers/count', {
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
                const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millers/count', {
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
        <UserLayout activePage="Dashboard">
            <CardComponent>
                <CardComponent className='flex-1 flex-col gap-4 justify-center'>
                    <div className='flex gap-4 text-black'>
                        <Wheat />
                        <p className='font-bold'>Rice Tracked</p>
                    </div>
                    <h1 className='text-heading text-primary text-center font-bold'>{riceBatchesCount}</h1>
                </CardComponent>
                <Divider className='bg-lightest-grey w-px my-4' layout='vertical'/>
                <CardComponent className='flex-1 flex-col gap-4 justify-center'>
                    <div className='flex gap-4 text-black'>
                        <HeartHandshake />
                        <p className='font-bold'>Traders</p>
                    </div>
                    <h1 className='text-heading text-primary text-center font-bold'>{tradersCount}</h1>
                </CardComponent>
                <Divider className='bg-lightest-grey w-px my-4' layout='vertical'/>
                <CardComponent className='flex-1 flex-col gap-4 justify-center'>
                    <div className='flex gap-4 text-black'>
                        <Tractor />
                        <p className='font-bold'>Farmers</p>
                    </div>
                    <h1 className='text-heading text-primary text-center font-bold'>0</h1>
                </CardComponent>
                <Divider className='bg-lightest-grey w-px my-4' layout='vertical'/>
                <CardComponent className='flex-1 flex-col gap-4 justify-center'>
                    <div className='flex gap-4 text-black'>
                        <Building2 />
                        <p className='font-bold'>Facilities</p>
                    </div>
                    <h1 className='text-heading text-primary text-center font-bold'>{facilitiesCount}</h1>
                </CardComponent>
            </CardComponent>
        </UserLayout>
    );
}

export default Dashboard;