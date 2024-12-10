import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "@/Components/InfiniteMovingCards.jsx";
import {
    Link,
    ShieldPlus,
    HandCoins,
    Wheat,
    Search,
    Tractor,
    Tag,
    Truck,
    MapPin,
    Anvil,
    Thermometer,
} from "lucide-react";
import CardGrids from "@/Components/CardGrids.jsx";

const features = [
    {
        title: "Palay Inventory Management",
        description: "Real-time monitoring of unmilled rice stocks.",
        icon: <HandCoins className="text-primary size-5 md:size-8" />,
    },
    {
        title: "Rice Inventory Insights",
        description: "Ensure accurate tracking of rice supplies.",
        icon: <Link className="text-primary size-5 md:size-8" />,
    },
    {
        title: "Warehouse Capacity Overview",
        description: "Optimize space utilization across facilities.",
        icon: <ShieldPlus className="text-primary size-5 md:size-8" />,
    },
    {
        title: "Milling and Drying Monitoring",
        description: "Track progress and operations.",
        icon: <HandCoins className="text-primary size-5 md:size-8" />,
    },
    {
        title: "Distribution Tracking",
        description: "Simplify logistics and reduce wastage.",
        icon: <HandCoins className="text-primary size-5 md:size-8" />,
    },
];

const testimonials = [
    {
        label: "Farmer",
        icon: <Tractor className="size-5 md:size-8" />,
    },
    {
        label: "Palay",
        icon: <Wheat className="size-5 md:size-8" />,
    },
    {
        label: "Price",
        icon: <Tag className="size-5 md:size-8" />,
    },
    {
        label: "Bigas",
        icon: <Wheat className="size-5 md:size-8" />,
    },
    {
        label: "Delivery",
        icon: <Truck className="size-5 md:size-8" />,
    },
    {
        label: "Track/Trace",
        icon: <MapPin className="size-5 md:size-8" />,
    },
    {
        label: "Miller",
        icon: <Anvil className="size-5 md:size-8" />,
    },
    {
        label: "Dryer",
        icon: <Thermometer className="size-5 md:size-8" />,
    },
    {
        label: "Transparent",
        icon: <Search className="size-5 md:size-8" />,
    },
];

const FeatureSection = () => {
    return (
        <section
            id="featureSection"
            className="relative h-auto w-screen flex flex-col lg:flex-row gap-12 overflow-hidden 
            px-4 sm:px-12 lg:px-24 
            pt-12 lg:pt-16 
            pb-24 lg:pb-48 
            items-center"
        >
            {/* Right Section */}
            <section className="w-full lg:w-1/2 flex gap-2 lg:gap-4 justify-between [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)] h-[30rem] md:h-[35rem]">
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
            <section className="w-full lg:w-1/2 flex flex-col gap-6">
                <div className="title font-semibold text-primary flex items-center gap-4">
                    <Wheat className="size-5 md:size-8" />
                    <p className="text-sm md:text-base">Features</p>
                </div>
                <h1 className="text-black text-2xl sm:text-4xl font-bold">
                    What AgriCTRL+ Offers
                </h1>
                <CardGrids 
                    items={features} 
                    className="grid-cols-2 lg:grid-cols-3" 
                />
            </section>
        </section>
    );
};

export default FeatureSection;