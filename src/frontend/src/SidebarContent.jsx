import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'primereact/menu';

function SidebarContent() {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate('/home')
        },
        {
            label: 'Dashboard',
            icon: 'pi pi-chart-bar',
            command: () => navigate('/dashboard')
        },
        {
            label: 'Inventory',
            icon: 'pi pi-box',
            command: () => navigate('/inventory')
        },
        {
            label: 'Sales',
            icon: 'pi pi-dollar',
            command: () => navigate('/sales')
        },
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => navigate('/profile')
        }
    ];

    return (
        <div className="sidebar-content">
            <div className="sidebar-logo">
                <div className="logo-placeholder"></div>
                <h1>AppName</h1>
            </div>
            <Menu model={items} className="sidebar-menu" />
        </div>
    );
}

export default SidebarContent;