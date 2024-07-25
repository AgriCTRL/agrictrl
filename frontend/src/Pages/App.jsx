import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useNavigate
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
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
        const fetchPrincipal = async () => {
            try {
                const authClient = await AuthClient.create();
                const identity = authClient.getIdentity();
                const principal = identity.getPrincipal().toText();
                if (principal !== "2vxsx-fae") {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if(!isAuthenticated) {
            fetchPrincipal();
        }
    }, []);

    return (
        <div className="flex h-screen transition-transform duration-300">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/history" element={<TransactionHistory />} />
                <Route path="/trader" element={isAuthenticated ? <UserHome /> : <Navigate to="/" replace />} />
                <Route path="/trader/dashboard" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/" replace />} />
                <Route path="/trader/tracking" element={isAuthenticated ? <UserTracking /> : <Navigate to="/" replace />} />
                <Route path="/trader/inventory" element={isAuthenticated ? <UserInventory /> : <Navigate to="/" replace />} />
                <Route path="/trader/facilities" element={isAuthenticated ? <UserFacilities /> : <Navigate to="/" replace />} />
                <Route path="/trader/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/" replace />} />
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

export default AppWrapper;
