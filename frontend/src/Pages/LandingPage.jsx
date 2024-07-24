import { React } from 'react';
import AppLayout from '../Layouts/AppLayout';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import HeroSection from '@/Components/LandingPage/HeroSection';
import FeatureSection from '@/Components/LandingPage/FeatureSection';
import OfferSection from '@/Components/LandingPage/OfferSection';
import WorkingProcessSection from '@/Components/LandingPage/WorkingProcessSection';
import CompanyNameSection from '@/Components/LandingPage/CompanyNameSection';
import TestimonialsSection from '@/Components/LandingPage/TestimonialsSection';

const LandingPage = () => {
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