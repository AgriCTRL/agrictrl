import React, { useEffect, useState } from 'react';
import { Button } from "primereact/button";
import {
    House,
    LayoutDashboard,
    MapPin,
    Layers,
    Building2,
    User
} from "lucide-react";
import { SidebarComponent, SidebarItem } from "@/Components/SidebarComponent";
import UserNavbarComponent from '@/Components/UserNavbarComponent';
import { AuthClient } from "@dfinity/auth-client";

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
    const [name, setName] = useState('')

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const authClient = await AuthClient.create();
                const identity = authClient.getIdentity();
                const principal = identity.getPrincipal().toText();
                const res = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/nfapersonnels/principal/${principal}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setName(data.firstName);
            }
            catch (error) {
                console.log(error.message)
            }
        };
        fetchUser();
    }, []);

    const [expanded, setExpanded] = useState(true);
    const handleToggleExpanded = () => setExpanded(!expanded);

    const isItemActive = (text) => {
        return activePage?.toLowerCase() == text.toLowerCase();
    }
    return (
        <div className='flex font-poppins bg-background w-full'>
            <SidebarComponent expanded={expanded}>
                {sidebarItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        {...item}
                        active={isItemActive(item.text)}
                    />
                ))}
            </SidebarComponent>
            <div className='w-full pr-10'>
                <UserNavbarComponent 
                    items={{
                        user: name,
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