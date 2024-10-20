import React, { useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { LogOut } from 'lucide-react';
import { useAuth } from '../Pages/Authentication/Login/AuthContext';
        
const SidebarContext = createContext()
function AdminSidebarComponent({ children, expanded }) {
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
            <nav className={`h-full flex flex-col items-center py-5 ${
                expanded ? 'px-10' : 'pl-4 pr-10'
            }`}>
                <div className="flex items-center justify-start w-full py-4">
                    <img 
                        src={`${expanded ? '/favicon_expanded.ico' : '/favicon.ico'}`} 
                        className={`overflow-hidden transition-all cursor-pointer ${
                            expanded ? 'w-[15rem]' : 'w-[52px]'
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
                    <Button onClick={logoutButton} className={`relative rounded-md flex text-primary bg-transparent border-none  items-center py-4 group ${
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
            transition-colors group z-50
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

export { SidebarItem, AdminSidebarComponent };