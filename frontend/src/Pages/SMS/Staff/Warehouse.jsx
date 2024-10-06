import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

function Warehouse() {
    return (
        <StaffLayout activePage="Warehouse">
            <div className="p-4 bg-red-500 h-full">
                <h1 className="text-2xl font-bold">Warehouse Page</h1>
                {/* Add your home page content here */}
            </div>
        </StaffLayout>
    );
}

export default Warehouse;