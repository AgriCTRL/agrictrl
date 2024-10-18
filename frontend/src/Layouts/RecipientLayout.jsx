import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Avatar } from 'primereact/avatar';
import { AuthClient } from "@dfinity/auth-client";

function RecipientLayout({ children, activePage }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [name, setName] = useState(() => localStorage.getItem('userName') || '');
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { text: 'Home', link: '/recipient' },
        { text: 'Rice Order', link: '/recipient/order' },
        { text: 'Rice Receive', link: '/recipient/receive' },
        { text: 'History', link: '/recipient/history' }
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const authClient = await AuthClient.create();
                const identity = authClient.getIdentity();
                const principal = identity.getPrincipal().toText();

                localStorage.removeItem('userName');

                const res = await fetch(`${apiUrl}/nfapersonnels/principal/${principal}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setName(data.firstName);

                localStorage.setItem('userName', data.firstName);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchUser();

        const handleStorageChange = () => {
            setName(localStorage.getItem('userName') || '');
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen);
    };

    const profileClick = () => {
        navigate('/recipient/profile');
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-[#F1F5F9]">
            {/* Header */}
            <header className="w-full py-8 bg-white shadow-md">
                <nav className="flex items-center justify-between px-4">
                    <div className='flex items-center gap-10'>
                        <img 
                            src="/favicon_expanded.ico"
                            className="w-[15rem]"
                            alt="AgriCTRL+ logo"
                        />
                        {navItems.map((item, index) => (
                            <Link 
                                key={index} 
                                to={item.link} 
                                className={`text-black font-medium ${activePage === item.text ? 'font-bold text-white p-3 rounded-md bg-gradient-to-r from-secondary to-primary' : ''}`}
                            >
                                {item.text}
                            </Link>
                        ))}
                    </div>
                    <div className='flex items-center gap-10'>
                        <Bell 
                            className="cursor-pointer text-black" 
                            size={20} 
                            onClick={toggleRightSidebar} 
                        />
                        <div className='flex items-center gap-4'>
                            <Avatar 
                                image="/profileAvatar.png"
                                size="large" 
                                shape="circle"
                                onClick={profileClick}
                                className="cursor-pointer border-primary border-2"
                            />
                            <div>
                                <p className="font-bold text-primary">
                                    Juan Valencio
                                </p> 
                                <p>
                                    Recipient
                                </p>
                            </div> 
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main content and right sidebar */}
            <div className="flex flex-1 overflow-hidden">
                {/* Main content */}
                <main className={`flex-1 overflow-auto transition-all duration-300 ${isRightSidebarOpen ? 'w-3/4' : 'w-full'}`}>
                    {children}
                </main>

                {/* Right sidebar */}
                <div 
                    className={`bg-black shadow-lg transition-all duration-300 overflow-hidden ${
                        isRightSidebarOpen ? 'w-[20%]' : 'w-0'
                    }`}
                >
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
                        {/* Add your notification content here */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipientLayout;