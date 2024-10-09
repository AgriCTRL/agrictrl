import React from 'react';
import RecipientLayout from '../../../Layouts/RecipientLayout';

function Home() {
    return (
        <RecipientLayout activePage="Home">
            <div className="p-4 bg-red-500 h-full">
                <h1 className="text-2xl font-bold">Home Page</h1>
                {/* Add your home page content here */}
            </div>
        </RecipientLayout>
    );
}

export default Home;