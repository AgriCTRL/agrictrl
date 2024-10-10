import React from 'react';
import PrivateMillerLayout from '../../../Layouts/PrivateMillerLayout';

function ManageMiller() {
    return (
        <PrivateMillerLayout activePage="Manage Miller">
            <div className="p-4 bg-purple-500 h-full">
                <h1 className="text-2xl font-bold">Manage Miller Page</h1>
                {/* Add your home page content here */}
            </div>
        </PrivateMillerLayout>
    );
}

export default ManageMiller;