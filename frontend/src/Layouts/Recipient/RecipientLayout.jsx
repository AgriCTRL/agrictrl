import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Bell } from "lucide-react";

import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";

import Navbar from "./Components/Navbar";
import { useAuth } from "../../Pages/Authentication/Login/AuthContext";
import RightSidebar from "../../Components/Recipient/RightSidebar";

function RecipientLayout({
    children,
    activePage,
    user,
    isRightSidebarOpen,
    rightSidebar,
}) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userFullName] = useState(`${user.firstName} ${user.lastName}`);

    const navItems = [
        { text: "Home", link: "/recipient" },
        { text: "Rice Order", link: "/recipient/order" },
        { text: "Rice Receive", link: "/recipient/receive" },
        // { text: 'History', link: '/recipient/history' }
    ];

    const toggleRightSidebar = () => {
        isRightSidebarOpen = !isRightSidebarOpen;
    };

    const profileClick = () => {
        navigate("/recipient/profile");
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
                {/* Main content */}
                <main
                    className={`flex-1 overflow-auto transition-all duration-300 ${
                        isRightSidebarOpen ? "w-3/4" : "w-full"
                    }`}
                >
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

export default RecipientLayout;
