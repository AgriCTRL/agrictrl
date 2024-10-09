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
import AdminUsers from "./SMS/Admin/Users/Users";
import AdminProfile from "./SMS/Admin/Profile";

import StaffHome from "./SMS/Staff/Home";
import StaffBuyPalay from "./SMS/Staff/BuyPalay/BuyPalay";
import StaffOrders from "./SMS/Staff/Orders";
import StaffProcessing from "./SMS/Staff/Processing";
import StaffWarehouse from "./SMS/Staff/Warehouse";

import RecipientHome from "./SMS/Recipient/Home";
import RecipientRiceOrder from "./SMS/Recipient/RiceOrder/RiceOrder";
import RecipientRiceReceive from "./SMS/Recipient/RiceReceive/RiceReceive";
import RecipientHistory from "./SMS/Recipient/History";

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
                <Route path="/staff/*" element={<StaffRoutes />} />
                <Route path="/recipient/*" element={<RecipientRoutes />} />
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
            <Route path="users" element={<AdminUsers />} />
            <Route path="profile" element={<AdminProfile />} />
        </Routes>
    );
}

function StaffRoutes() {
    return (
        <Routes>
            <Route index element={<StaffHome />} />
            <Route path="buy" element={<StaffBuyPalay />} />
            <Route path="orders" element={<StaffOrders />} />
            <Route path="processing" element={<StaffProcessing />} />
            <Route path="warehouse" element={<StaffWarehouse />} />
        </Routes>
    );
}

function RecipientRoutes() {
    return (
        <Routes>
            <Route index element={<RecipientHome />} />
            <Route path="order" element={<RecipientRiceOrder />} />
            <Route path="receive" element={<RecipientRiceReceive />} />
            <Route path="history" element={<RecipientHistory />} />
        </Routes>
    );
}

export default AppWrapper;
