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
import UserFacilities from "./Trader/Facilities";
import UserProfile from "./Trader/Profile";
import AuthClient from "@dfinity/auth-client";


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrincipal = async () => {
            try {
                const authClient = await AuthClient.create();
                const identity = authClient.getIdentity();
                const principal = identity.getPrincipal().toText();
                console.log(principal);
                if (principal !== "2vxsx-fae") {
                    // Check if the user exists in the user table
                    const res = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/users/principal/${principal}`);
                    const data = await res.json();
                    console.log(data);
                    if(data === null) {
                        // User does not exist, navigate to the register page
                        navigate('/register');
                    }
                    else if(data !== null) {
                        navigate('/trader');
                    }
                    else {
                        throw new Error('Error checking user existence');
                    }
                }
                else navigate('/');
            } catch (error) {
                console.error("Error fetching principal:", error.message);
            }
        };
        fetchPrincipal();
    }, []);
        // Check if user is authenticated
        // TODO: Replace with actual authentication
        // const user = localStorage.getItem("user");
    //     // setIsAuthenticated(!!user);
    // }, []);

    return (
        <div className="flex h-screen transition-transform duration-300">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
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
