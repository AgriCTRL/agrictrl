import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import CardComponent from '@/Components/CardComponent';

function Dashboard() {
    return (
        <UserLayout activePage="Dashboard">
            <CardComponent>
                Dashboard
            </CardComponent>
        </UserLayout>
    );
}

export default Dashboard;