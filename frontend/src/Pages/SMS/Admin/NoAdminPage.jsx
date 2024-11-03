import React from 'react'
import PageDoesNotExists from '../../../Components/PageDoesNotExists';
import AdminLayout from '../../../Layouts/AdminLayout';

const NoAdminPage = () => {
    return (
        <AdminLayout activePage="Page Does Not Exists">
            <PageDoesNotExists />
        </AdminLayout>
    )
}

export default NoAdminPage