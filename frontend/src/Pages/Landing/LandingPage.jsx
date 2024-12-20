import { React, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useNavigate } from 'react-router-dom';

import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import OurMissionSection from './components/OurMissionSection';
import CompanyNameSection from './components/CompanyNameSection';
import TimelineSection from './components/TimelineSection';
import TestimonialsSection from './components/TestimonialsSection';
import AboutUs from './components/AboutUs';
import Faqs from './components/Faqs';
import { AuthClient } from "@dfinity/auth-client";

const LandingPage = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    // useEffect(() => {
    // const checkUserAndRedirect = async () => {
    //     try {
    //         const authClient = await AuthClient.create();
    //         const isAuthenticated = await authClient.isAuthenticated();
    //         if (isAuthenticated) {
    //             const identity = authClient.getIdentity();
    //             const principal = identity.getPrincipal().toText();
    //             const res = await fetch(`${apiUrl}/nfapersonnels/principal/${principal}`);
    //             const data = await res.json();
    //             if (data === null) {
    //                 navigate('/register');
    //             } else {
    //                 navigate('/admin');
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // };
    // checkUserAndRedirect();
    // }, []);

    return (
        <AppLayout>
            <div className="font-poppins w-screen">
                <HeroSection />
                <FeatureSection />
                <AboutUs />
                <OurMissionSection />
                <Faqs />
                <TimelineSection />
                <CompanyNameSection />
                <TestimonialsSection />
            </div>
        </AppLayout>
    );
};

export default LandingPage;