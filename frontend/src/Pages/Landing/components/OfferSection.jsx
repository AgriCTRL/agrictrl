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
        
const items = [
    {
        title: 'Customers',
        description: 'Increase consumer confidence for rice that they purchase.',
        icon: <HandCoins size={32} className="text-primary"/>,
    },
    {
        title: 'Farmers',
        description: 'Improve fair trade for farmers.',
        icon: <Sprout size={32} className="text-primary"/>,
    },
    {
        title: 'Regulators',
        description: 'Help the regulators for data driven decision and policy making.',
        icon: <Microwave size={32} className="text-primary"/>,
    },
];

const OfferSection = () => {
    const navigate = useNavigate();
    const handleGetStarted = async () => {   
        navigate('/login');
    }

    return (
        <section id="offerSection" className="bg-[#2A2A2A] text-white relative h-auto lg:h-screen w-screen flex flex-col lg:flex-row gap-12 px-6 sm:px-12 lg:px-24 pt-32 lg:pt-40 pb-24">

            <StatisticsSection />      
            <section className='w-full lg:w-3/5 flex flex-col gap-6'>
                <div className="title font-semibold text-primary flex items-center gap-4">
                    <Wheat size={24} />
                    <p>About Us</p>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold">Our Mission</h1>
                <ul className="flex flex-col gap-4 ps-4">
                    {items.map((item, idx) => (
                        <li
                            key={item.title}
                            className="flex gap-6 text-white"
                        >
                            <div>{item.icon}</div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-justify">{item.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <Divider />
                <Button
                    className="flex flex-center items-center gap-4 w-fit bg-primary hover:bg-primaryHover px-6 sm:px-12 border-0"
                    onClick={ handleGetStarted }
                >
                    <p className="font-semibold">Get Started</p>
                    <Wheat size={20}/>
                </Button>
            </section>

            {/* Right Side */}
            <section className='w-full lg:w-2/5 flex flex-col gap-6'>
                <div className='w-full h-full flex'>
                    <img src="landingpage/aboutus.png" alt="a farmer and palay collage image" className="w-full h-fit rounded-xl" />
                </div>
            </section>

            <img src="Landing-OfferSection.png" alt="process-section" className="absolute w-screen object-cover bottom-0 left-0" />
        </section>
    );
};

export default OfferSection;