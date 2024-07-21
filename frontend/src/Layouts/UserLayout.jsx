import React, { useEffect, useState } from 'react';
import { Button } from "primereact/button";
import {
    House,
    LayoutDashboard,
    MapPin,
    Layers,
    Building2,
    User
} from "lucide-react"
import { Sidebar, SidebarItem } from "../Components/Sidebar";
import UserNavbar from '../Components/UserNavbar';

const sidebarItems = [
    { 
        icon: <House size={20} />, 
        text: 'Home', 
        link: '/trader' 
    },
    { 
        icon: <LayoutDashboard size={20} />, 
        text: 'Dashboard', 
        link: '/trader/dashboard' 
    },
    { 
        icon: <MapPin size={20} />, 
        text: 'Tracking', 
        link: '/trader/tracking' 
    },
    { 
        icon: <Layers size={20} />, 
        text: 'Inventory', 
        link: '/trader/inventory' 
    },
    { 
        icon: <Building2 size={20} />, 
        text: 'Facilities', 
        link: '/trader/facilities' 
    },
    { 
        icon: <User size={20} />, 
        text: 'Profile', 
        link: '/trader/profile' 
    },
];

function UserLayout({ children, activePage }) {
    const [expanded, setExpanded] = useState(true);
    const handleToggleExpanded = () => setExpanded(!expanded);

    const isItemActive = (text) => {
        return activePage?.toLowerCase() == text.toLowerCase();
    }
    return (
        <div className='flex bg-background w-full'>
            <Sidebar expanded={expanded}>
                {sidebarItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        {...item}
                        active={isItemActive(item.text)}
                    />
                ))}
            </Sidebar>
            <div className='w-full pr-10'>
                <UserNavbar 
                    items={{
                        user: 'John Doe',
                        avatar: 'https://i.pravatar.cc/300',
                        user_type: 'Trader',
                        title: activePage,
                    }}
                    expanded={expanded}
                    onToggleExpanded={handleToggleExpanded}
                />
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default UserLayout;