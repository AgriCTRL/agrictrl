import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/Pages/Authentication/Login/AuthContext";

import Navbar from "./Components/Navbar";
import RightSidebar from "./Components/RightSidebar";
import LeftSidebar from "./Components/LeftSidebar";

const PrivateMillerLayout = ({
    children,
    activePage,
    user,
    leftSidebar,
    isLeftSidebarOpen,
    rightSidebar,
    isRightSidebarOpen,
}) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userFullName] = useState(`${user.first_name} ${user.last_name}`);

    const navItems = [
        { text: "Home", link: "/miller" },
        { text: "Milling Transactions", link: "/miller/transactions" },
        { text: "Manage Miller", link: "/miller/facility" },
        { text: "History", link: "/miller/history" },
    ];

    const toggleRightSidebar = () => {
        isRightSidebarOpen = !isRightSidebarOpen;
    };

    const profileClick = () => {
        navigate("/miller/profile");
    };

    const handleLogoutBtn = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-[#F1F5F9]">
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
            <div className="flex flex-1 p-4 sm:p-6 mt-[90px] gap-4 bg-background">
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
};

export default PrivateMillerLayout;
