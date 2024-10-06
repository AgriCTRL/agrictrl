import React from 'react';
import { Link } from 'react-router-dom';

function StaffNavbarComponents({ items, rightIcon }) {
    const navItems = [
        { text: 'Home', link: '/staff' },
        { text: 'Buy Palay', link: '/staff/buy' },
        { text: 'Warehouse', link: '/staff/warehouse' },
        { text: 'Processing', link: '/staff/processing' },
        { text: 'Orders', link: '/staff/orders' },
    ];

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                {navItems.map((item, index) => (
                    <Link key={index} to={item.link} >
                        {item.text}
                    </Link>
                ))}
            </div>
            <div className="flex items-center space-x-4">
                <span>{items.user}</span>
                <img src={items.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
                {rightIcon}
            </div>
        </nav>
    );
}

export default StaffNavbarComponents;