import React from 'react'
import PageDoesNotExists from '../../Components/PageDoesNotExists';
import AppLayout from '../../Layouts/AppLayout';

const NoAdminPage = () => {
    return (
        <AppLayout activePage="Page Does Not Exists">
            <div className='w-full h-screen flex items-center justify-center'>
                <PageDoesNotExists />   
            </div>
        </AppLayout>
    )
}

export default NoAdminPage