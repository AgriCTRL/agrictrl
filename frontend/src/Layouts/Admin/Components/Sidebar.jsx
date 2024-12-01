import React, { useContext, createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Tooltip } from 'primereact/tooltip';
import { Avatar } from 'primereact/avatar';

import { ChevronDown, ChevronFirst, ChevronLast, User } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../../Pages/Authentication/Login/AuthContext';
        
const SidebarContext = createContext()
function Sidebar({ children, expanded, items }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const logoutButton = async () => {
        try {
            await logout();
            navigate('/');
        }
        catch (error) {
            console.log(error.message);
        }
    }

    return (
        <aside className="h-full">
            <nav className={`h-full flex flex-col items-center py-4 px-6`}>
                <div className={`flex items-center w-full py-2 gap-4 ${expanded ? 'justify-start' : 'justify-center'}`}>
                    <img 
                        src='/favicon.ico'
                        className={`overflow-hidden transition-all cursor-pointer`} 
                        alt="AgriCTRL sibebar logo"
                        width="45"
                    />
                    {expanded &&
                        <p className='text-2xl font-semibold text-primary'>AgriCTRL+</p>
                    }
                </div>

                <Divider />

                <SidebarContext.Provider value={{ expanded }}>
                    <ul className={`flex-1 w-full flex flex-col gap-4`}>
                        {children}
                    </ul>
                </SidebarContext.Provider>
                
                <div className='w-full flex flex-col items-center'>
                    <Divider pt={{ 
                        root: { 
                            className: 'bg-primary h-px',
                        } 
                    }} />
                    <Button 
                        onClick={logoutButton}
                        className={`w-full gap-5 border-none ring-0 bg-transparent text-primary hover:text-white hover:bg-primary
                            ${expanded 
                                ? 'px-5' 
                                : 'p-4 justify-center'
                            }
                        `}
                    >
                        <LogOut size={20} />
                        {expanded && <p className='font-medium'>Logout</p>}
                    </Button>
                </div>
            </nav>
        </aside>
    );
}

function SidebarItem({ icon, text, active, link }) {
    const { expanded } = useContext(SidebarContext);
    const navigate = useNavigate();
    const [btnName] = useState(`sidebar-item-${text}`);
    
    return (
        <li className={`${expanded ? 'w-72' : 'w-full'}`}>
            <Button 
                onClick={() => navigate(link)}
                className={`${btnName} w-full gap-5 border-none ring-0
                    ${active
                        ? 'bg-gradient-to-r from-secondary to-primary text-white'
                        : 'hover:bg-primary hover:text-white text-primary bg-transparent'
                    }
                    ${expanded 
                        ? 'px-5' 
                        : 'p-4 justify-center'
                    }
                `}
            >
                {icon}
                {expanded && <p className='font-medium'>{text}</p>}
            </Button>
            {!expanded &&
                <Tooltip 
                    target={`.${btnName}`}
                    className='ml-5'
                >
                    <span className='p-4'>{text}</span>
                </Tooltip>
            }
        </li>
    );
}

export { SidebarItem, Sidebar };