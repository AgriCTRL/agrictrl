import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from "react-router-dom";

import LandingPage from "./Landing/LandingPage";
import TracknTrace from "./TNT/TracknTrace";

import RegistrationPage from "./Authentication/Registration/RegistrationPage";
import LoginPage from "./Authentication/Login/LoginPage";
import ForgotPassword from "./Authentication/Forgot Password/ForgotPassword";

import AdminHome from "./SMS/Admin/Home";
import AdminDashboard from "./SMS/Admin/Dashboard";
import AdminTracking from "./SMS/Admin/Tracking";
import AdminInventory from "./SMS/Admin/Inventory/Inventory";
import AdminFacilities from "./SMS/Admin/Facilities/Category";
import AdminProfile from "./SMS/Admin/Profile";

function App() {
    return (
        <div className="flex h-screen transition-transform duration-300">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/TnT" element={<TracknTrace />} />
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
            <Route index element={<AdminHome />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tracking" element={<AdminTracking />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="facilities" element={<AdminFacilities />} />
            <Route path="profile" element={<AdminProfile />} />
        </Routes>
    );
}

export default AppWrapper;
