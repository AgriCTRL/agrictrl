import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from "react-router-dom";

import RegistrationPage from "./Authentication/Registration/RegistrationPage";
import LandingPage from "./Landing/LandingPage";
import UserHome from "./SMS/Admin/Home";
import UserDashboard from "./SMS/Admin/Dashboard";
import UserTracking from "./SMS/Admin/Tracking";
import UserInventory from "./SMS/Admin/Inventory/Inventory";
import UserFacilities from "./SMS/Admin/Facilities/Category";
import UserProfile from "./SMS/Admin/Profile";
import TransactionHistory from "./TNT/TransactionHistory";
import { AuthClient } from "@dfinity/auth-client";

function App() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [registerAuth, setRegisterAuth] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const authClient = await AuthClient.create();
                const isAuthenticated = await authClient.isAuthenticated();
                setIsAuthenticated(isAuthenticated);
            } catch (error) {
                console.log(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const checkRegisterAuth = async () => {
            try {
                const authClient = await AuthClient.create();
                const identity = authClient.getIdentity();
                const principal = identity.getPrincipal().toText();
                const res = await fetch(`${apiUrl}/nfapersonnels/principal/${principal}`);
                const data = await res.json();
                if (data === null && principal !== '2vxsx-fae') {
                    setRegisterAuth(true);
                } else {
                    setRegisterAuth(false);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        checkAuthentication();
        checkRegisterAuth();
    }, []);

    const handleRegisterSuccess = () => {
        setIsAuthenticated(true);
        setRegisterAuth(false);
    };

    if (isLoading) {
        return <div></div>; // TODO: add loading modal
    }

    return (
        <div className="flex h-screen transition-transform duration-300">
            <Routes>
                <Route path="/" element={<LandingPage />} /> 
                <Route path="/register" element={registerAuth ? <RegistrationPage onRegisterSuccess={handleRegisterSuccess} /> : <Navigate to="/admin" replace />} />
                <Route path="/TnT" element={<TransactionHistory />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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

function AdminRoutes() {
    return (
        <Routes>
            <Route index element={<UserHome />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="tracking" element={<UserTracking />} />
            <Route path="inventory" element={<UserInventory />} />
            <Route path="facilities" element={<UserFacilities />} />
            <Route path="profile" element={<UserProfile />} />
        </Routes>
    );
}

export default AppWrapper;