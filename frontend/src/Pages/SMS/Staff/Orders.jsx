import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

function Orders() {
    return (
        <StaffLayout activePage="Orders">
            <div className="p-4 bg-orange-500 h-full">
                <h1 className="text-2xl font-bold">Orders Page</h1>
                {/* Add your home page content here */}
            </div>
        </StaffLayout>
    );
}

export default Orders;