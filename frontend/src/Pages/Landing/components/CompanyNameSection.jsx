import React, { useEffect, useState } from "react";
import { InfiniteMovingCardsHorizontal } from './ui/infinite-moving-cards-horizontal';

const testimonials = [
    {
        name: "ICP",
        logo: "landingpage/icp-logo.png",
    },
    {
        name: "DA",
        logo: "landingpage/da-logo.png",
    },
    {
        name: "DAR",
        logo: "landingpage/dar-logo.svg",
    },
    {
        name: "DOST",
        logo: "landingpage/dost-logo.png",
    },
    {
        name: "DOH",
        logo: "landingpage/doh-logo.png",
    },
    {
        name: "DSWD",
        logo: "landingpage/dswd-logo.png",
    },
    {
        name: "NFA",
        logo: "landingpage/nfa-logo.svg",
    },
];

const CompanyNameSection = () => {
    return (
        <div className="w-screen flex flex-col antialiased bg-[#2A2A2A] items-center justify-center relative overflow-hidden">
            <InfiniteMovingCardsHorizontal
                items={testimonials}
                direction="right"
                speed="slow"
            />
        </div>
    );
};

export default CompanyNameSection;