import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Pages/Authentication/Login/AuthContext";

import Navbar from "./Components/Navbar";
import RightSidebar from "./Components/RightSidebar";
import LeftSidebar from "./Components/LeftSidebar";

import { CheckCircle2, Loader2, Undo2 } from "lucide-react";

function StaffLayout({
    children,
    activePage,
    user,
    leftSidebar,
    isRightSidebarOpen,
    isLeftSidebarOpen,
    rightSidebar,
}) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userFullName] = useState(`${user.firstName} ${user.lastName}`);
    const position = user.jobTitlePosition;
    const [ requestNotifCount, setRequestNotifCount ] = useState(null);
    const [ storageNotifCount, setStorageNotifCount ] = useState(null);
    const [ warehouseId, setWarehouseId ] = useState(null);

    const fetchRequestNotifCount = async () => {
        try {
            const res = await fetch(`${apiUrl}/inventory/pending/count?userId=${user.id}`);
            if (!res.ok) {
                throw new Error ("Failed to fetch request notif count")
            }
            const count = await res.json();
            setRequestNotifCount(count === 0 ? null : count);
        } catch (error) {
            console.error("Error fetching notification count:", error);
        }
    };

    const fetchWarehouseId = async () => {
        try {
            const res = await fetch(`${apiUrl}/warehouses/user/${user.id}`);
            if (!res.ok) {
                throw new Error ("Failed to fetch warehouse id")
            }
            const warehouse = await res.json();
            setWarehouseId(warehouse.id);
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchStorageNotifCount = async () => {
        try {
            const res = await fetch(`${apiUrl}/piles/warehouse/${warehouseId}/filtered-piles`);
            if (!res.ok) {
                throw new Error ("Failed to fetch storage notif count")
            }
            const count = await res.json();
            setStorageNotifCount(count === 0 ? null : count);
        } catch (error) {
            console.error("Error fetching notification count:", error);
        }
    };

    useEffect(() => {
        fetchRequestNotifCount();
        fetchWarehouseId();

        // Add an event listener to update notification count after successful receive
        window.addEventListener("receiveSuccess", fetchRequestNotifCount);

        // Cleanup function to remove the event listener on component unmount
        return () => window.removeEventListener("receiveSuccess", fetchRequestNotifCount);
    }, []);

    useEffect(() => {
        if (warehouseId) {
            fetchStorageNotifCount();
        }
        window.addEventListener("sendSuccess", fetchStorageNotifCount);

        // Cleanup function to remove the event listener on component unmount
        return () => window.removeEventListener("sendSuccess", fetchStorageNotifCount);
    }, [warehouseId]);

    let navItems = [];

    switch (position) {
        case "Procurement Officer":
            navItems = [
                { text: "Home", link: "/staff" },
                { text: "Procurement", link: "/staff/procurement" },
            ];
            break;
        case "Warehouse Manager":
            navItems = [
                { text: "Home", link: "/staff" },
                // { text: "Warehouse", link: "/staff/warehouse" },
                { text: "Request", link: "/staff/request", badge: requestNotifCount },
                { text: "Storage", link: "/staff/storage", badge: storageNotifCount },
                { text: "Piles", link: "/staff/piles" },
            ];
            break;
        case "Processing Officer":
            navItems = [
                { text: "Home", link: "/staff" },
                { text: "Processing", link: "/staff/processing" },
                { text: "History", link: "/staff/history" },
            ];
            break;
        case "Distribution Officer":
            navItems = [
                { text: "Home", link: "/staff" },
                { text: "Distribution", link: "/staff/distribution" },
            ];
            break;
        default:
            navItems = [
                { text: "Home", link: "/staff" },
                { text: "Procurement", link: "/staff/procurement" },
                { text: "Warehouse", link: "/staff/warehouse" },
                { text: "Processing", link: "/staff/processing" },
                { text: "Distribution", link: "/staff/distribution" },
            ];
    }

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen);
    };

    const profileClick = () => {
        navigate("/staff/profile");
    };

    const handleLogoutBtn = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };

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
            <div className="flex flex-1 p-4 sm:p-6 mt-[82px] md:mt-[90px] gap-4 bg-background">
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
