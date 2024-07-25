import React from 'react';
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
    return (
        <UserLayout activePage="Dashboard">
            <CardComponent>
                <CardComponent className='flex-1 flex-col gap-4 justify-center'>
                    <div className='flex gap-4 text-black'>
                        <Wheat />
                        <p className='font-bold'>Rice Tracked</p>
                    </div>
                    <h1 className='text-heading text-primary text-center font-bold'>0</h1>
                </CardComponent>
                <Divider className='bg-lightest-grey w-px my-4' layout='vertical'/>
                <CardComponent className='flex-1 flex-col gap-4 justify-center'>
                    <div className='flex gap-4 text-black'>
                        <HeartHandshake />
                        <p className='font-bold'>Traders</p>
                    </div>
                    <h1 className='text-heading text-primary text-center font-bold'>0</h1>
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
                    <h1 className='text-heading text-primary text-center font-bold'>0</h1>
                </CardComponent>
            </CardComponent>
        </UserLayout>
    );
}

export default Dashboard;