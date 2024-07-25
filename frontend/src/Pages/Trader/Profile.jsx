import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import CardComponent from '@/Components/CardComponent';

function Profile() {
    return (
        <UserLayout activePage="Profile">
            <CardComponent>Profile</CardComponent>
        </UserLayout>
    );

}

export default Profile;