import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/Authentication/Login/AuthContext';

import Navbar from '../Components/Staff/Navbar';
import RightSidebar from '../Components/Staff/RightSidebar';
import LeftSidebar from '../Components/Staff/LeftSidebar';

import { 
    CheckCircle2, 
    Loader2, 
    Undo2 
} from 'lucide-react';

function StaffLayout({ children, activePage, user, leftSidebar, isRightSidebarOpen, isLeftSidebarOpen, rightSidebar }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userFullName] = useState(`${user.first_name} ${user.last_name}`);

    const navItems = [
        { text: 'Home', link: '/staff' },
        { text: 'Procurement', link: '/staff/buy' },
        { text: 'Warehouse', link: '/staff/warehouse' },
        { text: 'Processing', link: '/staff/processing' },
        { text: 'Distribution', link: '/staff/distribution' },
    ];

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen);
    };

    const profileClick = () => {
        navigate('/staff/profile');
    }

    const handleLogoutBtn = async () => {
        try {
            await logout();
            navigate('/');
        }
        catch (error) {
            console.log(error.message);
        }
    }

    const personalStats = [
        { icon: <Loader2 size={18} />, title: "Palay Bought", value: 9 },
        { icon: <Undo2 size={18} />, title: "Processed", value: 4 },
        { icon: <CheckCircle2 size={18} />, title: "Distributed", value: 2 },
    ];

    return (
        <div className="flex flex-col w-screen bg-background">
            {/* Header */}
            <Navbar 
                navItems={navItems}
                user={user}
                activePage={activePage}
                userFullName={userFullName}
                profileClick={profileClick}
                navigate={navigate}
                handleLogoutBtn={handleLogoutBtn}
            />

            {/* Main content and right sidebar */}
            <div className="flex flex-1 p-4 sm:p-6 gap-4 bg-background">
                {/* Left sidebar */}
                <LeftSidebar 
                    leftSidebar={leftSidebar}  
                    isLeftSidebarOpen={isLeftSidebarOpen}
                />

                {/* Main content */}
                <main className="flex-1 overflow-auto transition-all duration-300">
                    {children}
                </main>

                {/* Right sidebar */}
                <RightSidebar 
                    isRightSidebarOpen={isRightSidebarOpen}
                    rightSidebar={rightSidebar}
                />
            </div>
        </div>
    );
}

export default StaffLayout;