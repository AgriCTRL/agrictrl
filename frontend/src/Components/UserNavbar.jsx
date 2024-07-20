import React, { useState } from 'react';
import { 
    Bell, 
    Search 
} from 'lucide-react';

import { Avatar } from 'primereact/avatar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

function UserNavbar({ items }) {
    return (
        <header className="w-full py-10">
            <nav className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">{items.title}</h1>
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