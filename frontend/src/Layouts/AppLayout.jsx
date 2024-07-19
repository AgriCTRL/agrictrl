import React from 'react';

function UserLayout({ children }) {
    return (
        <div>
            <h1>APP LAYOUTTT</h1>
            <div className="main-content">
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default UserLayout;