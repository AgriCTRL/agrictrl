import React from 'react';
import UserLayout from '@/Layouts/UserLayout';

function Dashboard() {
    return (
        <UserLayout activePage="Dashboard">
            <div className='bg-white p-4 rounded'>Dashboard</div>
        </UserLayout>
    );
}

export default Dashboard;