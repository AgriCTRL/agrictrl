import React from 'react';
import RecipientLayout from '../../../Layouts/RecipientLayout';

function History() {
    return (
        <RecipientLayout activePage="History">
            <div className="p-4 bg-purple-500 h-full">
                <h1 className="text-2xl font-bold">History Page</h1>
                {/* Add your home page content here */}
            </div>
        </RecipientLayout>
    );
}

export default History;