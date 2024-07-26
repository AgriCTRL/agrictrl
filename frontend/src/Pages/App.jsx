import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from "react-router-dom";

import Register from "./Register";
import LandingPage from "./LandingPage";
import UserHome from "./Trader/Home";
import UserDashboard from "./Trader/Dashboard";
import UserTracking from "./Trader/Tracking";
import UserInventory from "./Trader/Inventory";
import UserFacilities from "./Trader/Facilities/Category";
import UserProfile from "./Trader/Profile";
import TransactionHistory from "./TransactionHistory";
import { AuthClient } from "@dfinity/auth-client";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isIIAuth, setIsIIAuth] = useState(false);

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

        const checkIIAuth = async () => {
            try {
                const authClient = await AuthClient.create();
                const identity = authClient.getIdentity();
                const principal = identity.getPrincipal().toText();
                const res = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/nfapersonnels/principal/${principal}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (principal !== '2vsxs-fae') {
                    setIsIIAuth(true);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        checkAuthentication();
        checkIIAuth();
    }, []);

    if (isLoading) {
        return <div></div>; // TODO: add loading modal
    }

    return (
        <div className="flex h-screen transition-transform duration-300">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={isIIAuth ? <Navigate to="/trader" replace /> : <Register />} />
                <Route path="/history" element={<TransactionHistory />} />
                <Route path="/trader/*" element={isAuthenticated ? <TraderRoutes /> : <Navigate to="/" replace />} />
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

function TraderRoutes() {
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
