import React, { useState } from 'react';
import { 
    Bell, 
    Search 
} from 'lucide-react';

import { Avatar } from 'primereact/avatar';
import { ChevronFirst, ChevronLast } from 'lucide-react';

function UserNavbar({ items, expanded, onToggleExpanded }) {
    return (
        <header className="w-full py-10">
            <nav className="flex items-center justify-between">
                <div className='flex items-center gap-10'>
                    <button
                        onClick={onToggleExpanded}
                        className="text-primary" 
                    >
                        {expanded? <ChevronFirst size={20} strokeWidth={3}/> : <ChevronLast size={20} strokeWidth={3}/>}
                    </button>
                    <h1 className="text-2xl font-bold text-primary">{items.title}</h1>
                </div>
                <div className='flex items-center gap-10'>
                    <Bell className="cursor-pointer text-primary" size={20} />
                    <div className='flex items-center gap-4'>
                        <Avatar 
                            image={items.avatar} 
                            size="large" 
                            shape="circle"
                            className="cursor-pointer border-primary border-2"
                        />
                        <div>
                            <p className="font-bold text-primary">
                                {items.user}
                            </p> 
                            <p>
                                {items.user_type}
                            </p>
                        </div> 
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default UserNavbar;