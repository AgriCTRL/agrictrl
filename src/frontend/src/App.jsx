import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

import Register from "./Register";
import Landing from './Trader/Landing';
import Home from './Trader/Home';
import Tracking from './Trader/Tracking';
import Inventory from './Trader/Inventory';
import Facilities from './Trader/Facilities';
import WarehouseFacility from './Trader/WarehouseFacility';
import DryerFacility from './Trader/DryerFacility';
import MillerFacility from './Trader/MillerFacility';
import Dashboard from './Trader/Dashboard';
import Profile from './Trader/Profile'
import Sales from './Trader/Sales';
import SidebarContent from './SidebarContent';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    return (
        <Router>
            <div className="flex h-screen transition-transform duration-300">
                <Sidebar 
                    visible={isSidebarVisible} 
                    onHide={() => setIsSidebarVisible(false)}
                    className="w-64"
                >
                    <SidebarContent />
                </Sidebar>
                <div className={`flex-grow overflow-auto ${isSidebarVisible ? 'ml-64' : 'ml-0'} transition-margin duration-300`}>
                    <Button 
                        icon="pi pi-bars" 
                        onClick={() => setIsSidebarVisible(true)} 
                        className="p-button-text m-2" 
                    />
                    <h1 className="text-2xl font-bold ml-4">Inventory</h1>
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/tracking" element={<Tracking />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/facilities" element={<Facilities />} />
                        <Route path="/facilities/warehouse" element={<WarehouseFacility />} />
                        <Route path="/facilities/dryer" element={<DryerFacility />} />
                        <Route path="/facilities/miller" element={<MillerFacility />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
