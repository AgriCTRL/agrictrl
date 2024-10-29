import React, { useState, useRef } from 'react';
import { 
    Bell, 
    ChevronDown, 
    Search, 
    User,
    ChevronFirst,
    ChevronLast,
    LogOut
} from 'lucide-react';

import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { OverlayPanel } from 'primereact/overlaypanel';
        
import { useAuth } from '../Pages/Authentication/Login/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminNavbarComponent({ items, expanded, onToggleExpanded }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const op = useRef(null);

    const handleLogoutBtn = async () => {
        try {
            await logout();
            navigate('/');
        }
        catch (error) {
            console.log(error.message);
        }
    }

    return (
        <header className="w-full py-4">
            <nav className="flex items-center justify-between">
                <div className='flex items-center gap-4'>
                    <Button
                        onClick={onToggleExpanded}
                        className="text-primary ring-0"
                        icon={expanded? <ChevronFirst size={20} strokeWidth={3}/> : <ChevronLast size={20} strokeWidth={3}/>}
                        text 
                    />
                    <h1 className="text-2xl font-semibold text-primary">{items.title}</h1>
                </div>
                <div className='flex items-center gap-4'>
                    <Button 
                        icon={<Bell size={20} />}
                        text
                        rounded
                        className='text-primary ring-0'
                    />
                    <Divider 
                        layout="vertical"
                        className='m-0 py-2' 
                    />
                    <Button 
                        className='p-2 gap-4 ring-0'
                        text
                        onClick={(e) => op.current.toggle(e)}
                    >
                        <Avatar 
                            image={items.avatar ?? null} 
                            icon={<User size={18} />}
                            shape="circle"
                            className="cursor-pointer border-primary border text-primary bg-tag-grey"
                        />
                        <div className="flex flex-col items-start">
                            <small className='font-semibold text-black'>{items.user ? items.user : 'username'}</small>                        
                            <small className='text-light-grey'>{items.user_type.toLowerCase()}</small>                        
                        </div>
                        <ChevronDown size={18} />
                    </Button>
                    <OverlayPanel ref={op} className='w-60'>
                        <div className='gap-4 flex flex-col'>
                            <div className='flex items-center gap-4'>
                                <Avatar 
                                    image={items.avatar ?? null} 
                                    icon={<User size={20} />}
                                    shape="circle"
                                    size='large'
                                    className="cursor-pointer border-primary border text-primary bg-tag-grey"
                                />
                                <div className="flex flex-col items-start">
                                    <p className='font-semibold text-black'>{items.user ? items.user : 'username'}</p>                        
                                    <small className='text-light-grey'>{items.user_type.toLowerCase()}</small>                        
                                </div>
                            </div>
                            <Divider className="m-0" />
                            <Button
                                onClick={handleLogoutBtn}
                                className="w-full gap-4 border-none ring-0 text-black px-4 hover:text-white hover:bg-primary"
                                text
                            >
                                <LogOut size={20} />
                                <p>Logout</p>
                            </Button>
                        </div>
                    </OverlayPanel>
                </div>
            </nav>
        </header>
    );
}

export default AdminNavbarComponent;