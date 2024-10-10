import React from 'react';
import PrivateMillerLayout from '../../../Layouts/PrivateMillerLayout';

function Home() {
    return (
        <PrivateMillerLayout activePage="Home">
            <div className="p-4 bg-purple-500 h-full">
                <h1 className="text-2xl font-bold">Home Page</h1>
                {/* Add your home page content here */}
            </div>
        </PrivateMillerLayout>
    );
}

export default Home;