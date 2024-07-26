import { React, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useNavigate } from 'react-router-dom';

import HeroSection from '@/Components/LandingPage/HeroSection';
import FeatureSection from '@/Components/LandingPage/FeatureSection';
import OfferSection from '@/Components/LandingPage/OfferSection';
import WorkingProcessSection from '@/Components/LandingPage/WorkingProcessSection';
import CompanyNameSection from '@/Components/LandingPage/CompanyNameSection';
import TestimonialsSection from '@/Components/LandingPage/TestimonialsSection';
import { AuthClient } from "@dfinity/auth-client";

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
    const checkUserAndRedirect = async () => {
        try {
            const authClient = await AuthClient.create();
            const isAuthenticated = await authClient.isAuthenticated();
            if (isAuthenticated) {
                const identity = authClient.getIdentity();
                const principal = identity.getPrincipal().toText();
                const res = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/nfapersonnels/principal/${principal}`);
                const data = await res.json();
                if (data === null) {
                    navigate('/register');
                } else {
                    navigate('/trader');
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    checkUserAndRedirect();
    }, []);

    return (
        <AppLayout>
            <div className="font-poppins">
                <HeroSection />
                <FeatureSection />
                <OfferSection />
                <WorkingProcessSection />
                <CompanyNameSection />
                <TestimonialsSection />
            </div>
        </AppLayout>
    );
};

export default LandingPage;