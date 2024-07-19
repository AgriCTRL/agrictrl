import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
    Navigate
} from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import Register from "./Register";
import LandingPage from "./LandingPage";
import SidebarComponent from "../Components/SidebarComponent";
import UserHome from "./Trader/Home"

function App() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const location = useLocation();

    const isLandingPage = location.pathname === "/";

    useEffect(() => {
        // Check if user is authenticated
        // TODO: Replace with actual authentication
        const user = localStorage.getItem("user");
        setIsAuthenticated(!!user);
    }, []);

    return (
        <div className="flex h-screen transition-transform duration-300">
            {!isLandingPage && (
            <Sidebar
                visible={isSidebarVisible}
                onHide={() => setIsSidebarVisible(false)}
                className="w-64"
            >
                <SidebarComponent />
            </Sidebar>
            )}
            <div
            className={`flex-grow overflow-auto ${
                isSidebarVisible && !isLandingPage ? "ml-64" : "ml-0"
            } transition-margin duration-300`}
            >
            {!isLandingPage && (
                <Button
                icon="pi pi-bars"
                onClick={() => setIsSidebarVisible(true)}
                className="p-button-text m-2"
                />
            )}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/trader/*" element={isAuthenticated ? <UserHome /> : <Navigate to="/" />} />
            </Routes>
            </div>
        </div>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
