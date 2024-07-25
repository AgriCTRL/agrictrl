import React, { useState, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { LogOut } from 'lucide-react';
        
const SidebarContext = createContext()
function SidebarComponent({ children, expanded }) {
    return (
        <aside className="h-screen">
            <nav className={`h-full flex flex-col items-center py-5 ${
                expanded ? 'px-10' : 'pl-4 pr-10'
            }`}>
                <div className="flex items-center justify-start w-full pt-0 pb-3">
                    <img 
                        src="/sidebarLogo.png" 
                        className={`overflow-hidden transition-all cursor-pointer ${
                            expanded ? 'w-auto' : 'w-0'
                        }`} 
                        alt="AgriCTRL sibebar logo" 
                    />
                </div>
                
                <SidebarContext.Provider value={{ expanded }}>
                    <ul className='flex-1'>{children}</ul>
                </SidebarContext.Provider>
                
                <div className='w-full flex flex-col items-center'>
                <Divider pt={{ 
                    root: { 
                        className: 'bg-primary h-px',
                    } 
                }} />
                    <Button className={`relative rounded-md flex text-primary items-center py-4 group ${
                        expanded ? 'w-full px-10 gap-10' : 'px-4 w-fit gap-0'
                    }`} 
                        aria-label="Logout"
                    >
                        <LogOut size={20} />
                        
                        <span className={`overflow-hidden transition-all text-left text-primary
                            ${
                                expanded ? 'w-32' : 'w-0'
                            }
                        `}>
                            Logout
                        </span>
                    </Button>
                </div>
            </nav>
        </aside>
    );
}

function SidebarItem({ icon, text, active, link }) {
    const { expanded } = useContext(SidebarContext);
    const navigate = useNavigate();
    
    return (
        <li className={`
            relative flex items-center py-4 my-4 
            font-medium rounded-md cursor-pointer
            transition-colors group
            ${
                active
                    ? 'bg-gradient-to-r from-secondary to-primary text-white'
                    : 'hover:bg-primary hover:text-white text-primary'
            }
            ${
                expanded ? 'px-10 gap-10' : 'px-4 w-fit gap-0'
            }`}
            onClick={() => navigate(link)}
        >
            {icon}
            <span 
                className={`overflow-hidden transition-all ${
                    expanded ? "w-32" : "w-0"
                }`}
            >
                {text}
            </span>

            {!expanded && (
                <div 
                    className={`
                        absolute left-full rounded-md p-4
                        bg-primary tex-white text-sm
                        invisible opacity-20 translate-x-6 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-8
                    `}>
                        {text}
                </div>
            )}
        </li>
    );
}

export { SidebarItem, SidebarComponent };