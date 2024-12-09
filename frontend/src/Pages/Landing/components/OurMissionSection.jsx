import { React } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    HandCoins, 
    Wheat, 
    Sprout, 
    Microwave, 
} from 'lucide-react';

import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

import StatisticsSection from './StatisticsSection'
import CardGrids from "@/Components/CardGrids.jsx";
        
const items = [
    {
        title: 'Customers',
        description: 'Increase consumer confidence for rice that they purchase.',
        icon: <HandCoins className="text-primary size-5 md:size-8"/>,
    },
    {
        title: 'Farmers',
        description: 'Improve fair trade for farmers.',
        icon: <Sprout className="text-primary size-5 md:size-8"/>,
    },
    {
        title: 'Regulators',
        description: 'Help the regulators for data driven decision and policy making.',
        icon: <Microwave className="text-primary size-5 md:size-8"/>,
    },
];

const OurMissionSection = () => {
    const navigate = useNavigate();
    const handleGetStarted = async () => {   
        navigate('/login');
    }

    return (
        <section id="ourMissionSection" 
            className="bg-white text-black relative h-auto w-screen flex flex-col lg:flex-row gap-12 
            px-4 sm:px-12 lg:px-24 
            pt-6 sm:pt-12 lg:pt-24 
            pb-6 sm:pb-12 lg:pb-24"
        >
            <section className='w-full h-fit lg:w-3/5 flex flex-col gap-2 md:gap-6'>
                <div className="title font-semibold text-primary flex items-center justify-center md:justify-start gap-2 md:gap-4">
                    <Wheat className='size-5 md:size-8' />
                    <p className='text-sm md:text-base'>Our Mission</p>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-center md:text-left">Our Mission</h1>
                <div className='max-w-2xl mx-auto h-full flex lg:hidden'>
                    <img src="landingpage/aboutus.png" alt="a farmer and palay collage image" className="w-full h-fit rounded-xl" />
                </div>
                <CardGrids 
                    items={items} 
                    className="grid-cols-2 lg:grid-cols-3" 
                />
                <Button
                    className="hidden lg:flex flex-center items-center gap-4 w-fit bg-primary hover:bg-primaryHover px-6 sm:px-12 border-0"
                    onClick={ handleGetStarted }
                >
                    <p className="font-medium text-sm md:text-base">Get Started</p>
                </Button>
            </section>

            {/* Right Side */}
            <section className='w-full h-fit lg:w-2/5 hidden lg:flex flex-col'>
                <div className='w-full flex'>
                    <img src="landingpage/aboutus.png" alt="a farmer and palay collage image" className="w-full h-fit rounded-xl" />
                </div>
            </section>
        </section>
    );
};

export default OurMissionSection;