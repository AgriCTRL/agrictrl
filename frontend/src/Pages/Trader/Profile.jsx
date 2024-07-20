import React from 'react';
import UserLayout from '../../Layouts/UserLayout';

function Profile() {
    return (
        <UserLayout activePage="Profile">
            <div className='bg-white p-4 rounded'>Profile</div>
        </UserLayout>
    );

}

export default Profile;