import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

function Home() {
    return (
        <StaffLayout activePage="Home">
            <div className="flex flex-row justify-between p-4 bg-green-500 h-full">
                <h1 className="text-2xl font-bold">Home Page</h1>
                <h1 className="text-2xl font-bold">END</h1>
            </div>
        </StaffLayout>
    );
}

export default Home;