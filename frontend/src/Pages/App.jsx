import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Register from "./Register";
import Landing from "./Landing";
import TraderHome from "./Trader/Home";
import AboutUs from "./AboutUs";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        // TODO: Replace with actual authentication
        const user = localStorage.getItem("user");
        setIsAuthenticated(!!true);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/register" element={<Register />} />
                <Route path="/trader/*" element={isAuthenticated ? <TraderHome /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
