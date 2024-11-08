import React, { useRef } from 'react';

import { 
    ChevronDown, 
    LogOut, 
    User 
} from 'lucide-react';

import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { OverlayPanel } from 'primereact/overlaypanel';

const Navbar = ({ navItems, user, activePage, userFullName, profileClick, navigate, handleLogoutBtn }) => {
    const op = useRef(null);
    
    return (
        <header className="w-full py-4 px-6 bg-white">
            <nav className="flex items-center justify-between">
                <div className='flex items-center gap-8'>
                    <div className="flex items-center gap-4 justify-start" >
                        <img 
                            src='/favicon.ico'
                            className={`overflow-hidden transition-all cursor-pointer`} 
                            alt="AgriCTRL sibebar logo"
                            width="45"
                        />
                        <p className='text-2xl font-semibold text-primary'>AgriCTRL+</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        {navItems.map((item, index) => (
                            <Button 
                                onClick={() => navigate(item.link)} 
                                className={`text-black border-none ring-0 ${activePage === item.text ? 'text-white bg-primary' : 'bg-transparent hover:bg-background'}`}
                            >
                                <p>{item.text}</p>
                            </Button>
                        ))}
                    </div>
                </div>
                <Button 
                    className='p-2 gap-4 ring-0'
                    text
                    onClick={(e) => op.current.toggle(e)}
                >
                    <Avatar 
                        onClick={profileClick}
                        image={user.avatar ?? null} 
                        icon={<User size={18} />}
                        shape="circle"
                        className="cursor-pointer border-primary border text-primary bg-tag-grey"
                    />
                    <div className="flex flex-col items-start">
                        <small className='font-semibold text-black'>{(user.firstName && user.lastName) ? userFullName : 'username'}</small>                        
                        <small className='text-light-grey'>{user.userType.toLowerCase()}</small>                        
                    </div>
                    <ChevronDown size={18} />
                </Button>
                <OverlayPanel ref={op} className='w-60'>
                    <div className='gap-4 flex flex-col'>
                        <div className='flex items-center gap-4'>
                            <Avatar 
                                onClick={profileClick}
                                image={user.avatar ?? null} 
                                icon={<User size={20} />}
                                shape="circle"
                                size='large'
                                className="cursor-pointer border-primary border text-primary bg-tag-grey"
                            />
                            <div className="flex flex-col items-start">
                                <p className='font-semibold text-black'>{(user.first_name && user.last_name) ? userFullName : 'username'}</p>                        
                                <small className='text-light-grey'>{user.userType.toLowerCase()}</small>                        
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
            </nav>
        </header>
    )
}

export default Navbar