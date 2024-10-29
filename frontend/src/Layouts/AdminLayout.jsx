import React, { useEffect, useState } from 'react';
import {
    House,
    LayoutDashboard,
    MapPin,
    Layers,
    Building2,
    Users,
    User
} from "lucide-react";
import { AdminSidebarComponent, SidebarItem } from "@/Components/AdminSidebarComponent";
import AdminNavbarComponent from '@/Components/AdminNavbarComponent';
import { useAuth } from '../Pages/Authentication/Login/AuthContext';

const sidebarItems = [
    { 
        icon: <House size={20} />, 
        text: 'Home', 
        link: '/admin' 
    },
    { 
        icon: <LayoutDashboard size={20} />, 
        text: 'Dashboard', 
        link: '/admin/dashboard' 
    },
    { 
        icon: <MapPin size={20} />, 
        text: 'Tracking', 
        link: '/admin/tracking' 
    },
    { 
        icon: <Layers size={20} />, 
        text: 'Inventory', 
        link: '/admin/inventory' 
    },
    { 
        icon: <Building2 size={20} />, 
        text: 'Facilities', 
        link: '/admin/facilities' 
    },
    { 
        icon: <Users size={20} />, 
        text: 'Users', 
        link: '/admin/users' 
    },
    { 
        icon: <User size={20} />, 
        text: 'Profile', 
        link: '/admin/profile' 
    },
];
 
function AdminLayout({ children, activePage }) {
    const { user } = useAuth();
    const name = user.firstName + ' ' + user.lastName;

    const [expanded, setExpanded] = useState(() => {
        const storedState = localStorage.getItem('sidebarExpanded');
        if (storedState === null) {
            localStorage.setItem('sidebarExpanded', 'false');
            return true;
        }
        return storedState === 'true';
    });

    const handleToggleExpanded = () => {
        setExpanded((prevExpanded) => {
            const newExpanded = !prevExpanded;
            localStorage.setItem('sidebarExpanded', newExpanded);
            return newExpanded;
        });
    };

    const isItemActive = (text) => {
        return activePage?.toLowerCase() == text.toLowerCase();
    };

    return (
        <div className="flex h-screen w-screen bg-[#F1F5F9] pr-5">
            {/* Sidebar */}
            <AdminSidebarComponent expanded={expanded}> {/* Ensure full height */}
                {sidebarItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        {...item}
                        active={isItemActive(item.text)}
                    />
                ))}
            </AdminSidebarComponent>

            {/* Main content */}
            <div className="flex flex-col w-full h-screen overflow-hidden"> {/* Ensure full height */}
                {/* Header */}
                <AdminNavbarComponent
                    items={{
                        user: name,
                        avatar: '/profileAvatar.png',
                        user_type: user.userType,
                        title: activePage,
                    }}
                    expanded={expanded}
                    onToggleExpanded={handleToggleExpanded}
                />

                {/* Content with remaining space */}
                <main className="flex-1 overflow-auto mb-10">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
