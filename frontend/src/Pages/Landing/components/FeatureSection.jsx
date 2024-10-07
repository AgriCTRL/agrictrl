import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { 
    Bean, 
    Link, 
    ShoppingBasket, 
    ShieldPlus, 
    HandCoins, 
    Wheat, 
    Search, 
    Sprout, 
    Microwave, 
    Package, 
    Tractor, 
    Tag, 
    Truck, 
    MapPin, 
    Anvil, 
    Thermometer 
} from 'lucide-react';

const features = [
    {
        title: 'AgriCTRL+TnT',
        description: 'Boosting consumer confidence by ensuring transparency and traceability in the rice supply chain, allowing informed choices on origin and quality.',
        icon: <HandCoins size={32} className="text-primary"/>,
    },
    {
        title: 'AgriCTRL+SMS',
        description: 'Promoting sustainable industrialization and innovation, the platform modernizes agricultural data management and the rice supply chain, driving the digital transformation of agriculture.',
        icon: <Link size={32} className="text-primary"/>,
    },
    {
        title: 'AgriCTRL+ MIC',
        description: 'By offering farmers affordable, accessible and mabilis na Smart Contract-based insurance for their crops.',
        icon: <ShieldPlus size={32} className="text-primary"/>,
    },
    {
        title: 'AgriCTRL+ Finance',
        description: 'Offering capital to our local farmer, in the form of NFT crowdfunding.',
        icon: <HandCoins size={32} className="text-primary"/>,
    },
];

const testimonials = [
    {
        label: "Farmer",
        icon: <Tractor size={32}/>,
    },
    {
        label: "Palay",
        icon: <Wheat size={32}/>,
    },        
    {
        label: "Price",
        icon: <Tag size={32}/>,
    },        
    {
        label: "Bigas",
        icon: <Wheat size={32}/>,
    },        
    {
        label: "Delivery",
        icon: <Truck size={32}/>,
    },        
    {
        label: "Track/Trace",
        icon: <MapPin size={32}/>,
    },
    {
        label: "Miller",
        icon: <Anvil size={32}/>,
    },
    {
        label: "Dryer",
        icon: <Thermometer size={32}/>,
    },
    {
        label: "Transparent",
        icon: <Search size={32}/>,
    },
];

const FeatureSection = () => {
    return (
        <section id="featureSection" 
            className="relative h-auto w-screen flex flex-col lg:flex-row gap-12 overflow-hidden 
            px-6 sm:px-12 lg:px-24 
            pt-12 lg:pt-16 
            pb-24 lg:pb-48 
            items-center"
        >
            {/* Right Section */}
            <section className='w-full lg:w-1/2 flex gap-2 lg:gap-4 justify-between [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)] h-[30rem] md:h-[35rem]'>
                <InfiniteMovingCards
                    items={testimonials}
                    direction="top"
                    speed="slow"
                />
                <InfiniteMovingCards
                    items={testimonials}
                    direction="bottom"
                    speed="slow"
                />
                <InfiniteMovingCards
                    items={testimonials}
                    direction="top"
                    speed="slow"
                />
            </section>

            {/* Left Section */}
            <section className='w-full lg:w-1/2 flex flex-col gap-6'>
                <div className="title font-semibold text-primary flex items-center gap-4">
                    <Wheat />
                    <p>Features</p>
                </div>
                <h1 className="text-black text-2xl sm:text-4xl font-bold">Know Where You’re Getting Your Rice</h1>
                <ul className="flex flex-col gap-4 ps-4">
                    {features.map((feature, idx) => (
                        <li
                            key={feature.title}
                            className="flex gap-6 text-black"
                        >
                            <div>{feature.icon}</div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                                <p className="text-justify">{feature.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
};

export default FeatureSection;