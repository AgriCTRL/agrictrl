import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useLocation
} from "react-router-dom";
import { AuthProvider, useAuth } from './Authentication/Login/AuthContext';

import './Authentication/Registration/firebase';

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
import StaffProfile from "./SMS/Staff/Profile";

import RecipientHome from "./SMS/Recipient/Home";
import RecipientRiceOrder from "./SMS/Recipient/RiceOrder/RiceOrder";
import RecipientRiceReceive from "./SMS/Recipient/RiceReceive/RiceReceive";
import RecipientHistory from "./SMS/Recipient/History";
import RecipientProfile from "./SMS/Recipient/Profile";

import PrivateMillerHome from "./SMS/PrivateMiller/Home";
import PrivateMillerMillingTransactions from "./SMS/PrivateMiller/MillingTransactions";
import PrivateMillerManageMiller from "./SMS/PrivateMiller/ManageMiller";
import PrivateMillerHistory from "./SMS/PrivateMiller/History";
import PrivateMillerProfile from "./SMS/PrivateMiller/Profile";

const ProtectedRoute = ({ children, allowedUserTypes }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedUserTypes.includes(user.userType)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const UnauthenticatedRoute = ({ children }) => {
    const { user } = useAuth();
    
    if (user) {
        switch (user.userType) {
            case 'Admin':
                return <Navigate to="/admin" replace />;
            case 'NFA Branch Staff':
                return <Navigate to="/staff" replace />;
            case 'Rice Recipient':
                return <Navigate to="/recipient" replace />;
            case 'Private Miller':
                return <Navigate to="/miller" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }
    
    return children;
};

const AuthenticatedRedirect = () => {
    const { user } = useAuth();
    
    if (user) {
        switch (user.userType) {
            case 'Admin':
                return <Navigate to="/admin" replace />;
            case 'NFA Branch Staff':
                return <Navigate to="/staff" replace />;
            case 'Rice Recipient':
                return <Navigate to="/recipient" replace />;
            case 'Private Miller':
                return <Navigate to="/miller" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }
    
    return <LandingPage />;
};

function App() {
    return (
        <div className="flex h-screen transition-transform duration-300">
            <Routes>
                <Route path="/" element={<AuthenticatedRedirect />} />
                
                {/* Unauthenticated routes */}
                <Route path="/register" element={
                    <UnauthenticatedRoute>
                        <RegistrationPage />
                    </UnauthenticatedRoute>
                } />
                <Route path="/login" element={
                    <UnauthenticatedRoute>
                        <LoginPage />
                    </UnauthenticatedRoute>
                } />
                <Route path="/forgotpassword" element={
                    <UnauthenticatedRoute>
                        <ForgotPassword />
                    </UnauthenticatedRoute>
                } />
                <Route path="/TnT" element={
                    <UnauthenticatedRoute>
                        <TracknTrace />
                    </UnauthenticatedRoute>
                } />

                {/* Protected routes */}
                <Route path="/admin/*" element={
                    <ProtectedRoute allowedUserTypes={['Admin']}>
                        <AdminRoutes />
                    </ProtectedRoute>
                } />
                <Route path="/staff/*" element={
                    <ProtectedRoute allowedUserTypes={['NFA Branch Staff']}>
                        <StaffRoutes />
                    </ProtectedRoute>
                } />
                <Route path="/recipient/*" element={
                    <ProtectedRoute allowedUserTypes={['Rice Recipient']}>
                        <RecipientRoutes />
                    </ProtectedRoute>
                } />
                <Route path="/miller/*" element={
                    <ProtectedRoute allowedUserTypes={['Private Miller']}>
                        <PrivateMillerRoutes />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
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
            <Route path="profile" element={<StaffProfile />} />
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
            <Route path="profile" element={<RecipientProfile />} />
        </Routes>
    );
}

function PrivateMillerRoutes() {
    return (
        <Routes>
            <Route index element={<PrivateMillerHome />} />
            <Route path="transactions" element={<PrivateMillerMillingTransactions />} />
            <Route path="facility" element={<PrivateMillerManageMiller />} />
            <Route path="history" element={<PrivateMillerHistory />} />
            <Route path="profile" element={<PrivateMillerProfile />} />
        </Routes>
    );
}

function AppWrapper() {
    return (
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    );
}

export default AppWrapper;