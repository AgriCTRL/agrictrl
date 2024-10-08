import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

function Processing() {
    return (
        <StaffLayout activePage="Processing">
            <div className="p-4 bg-purple-500 h-full">
                <h1 className="text-2xl font-bold">Processing Page</h1>
                {/* Add your home page content here */}
            </div>
        </StaffLayout>
    );
}

export default Processing;