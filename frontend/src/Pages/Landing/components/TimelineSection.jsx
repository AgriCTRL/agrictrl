import { Image } from "primereact/image";
import React from "react";
import { Timeline } from "@/Components/Timeline";
import { HandCoins, ShieldPlus, ShoppingCart } from "lucide-react";

const TimelineSection = () => {
    const data = [
        {
            title: "3rd Quarter 2024",
            icon: <HandCoins />,
            content: (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-base md:text-lg font-semibold text-black">
                            AgriCTRL+ TnT
                        </h3>
                        <Image
                            src="/illustrations/tnt.svg"
                            alt="image"
                            className="flex items-center justify-center h-32 sm:h-44"
                            imageClassName="h-full"
                        />
                        <p className="text-black text-sm md:text-base">
                            Empowering farmers and consumers with transparent
                            and traceable rice supply chain solutions.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-base md:text-lg font-semibold text-black">
                            AgriCTRL+ SMS
                        </h3>
                        <Image
                            src="/illustrations/sms.svg"
                            alt="image"
                            className="flex items-center justify-center h-32 sm:h-44"
                            imageClassName="h-full"
                        />
                        <p className="text-black text-sm md:text-base">
                            Revolutionizing the agricultural industry with
                            innovative SMS solutions for efficient communication
                            and data management.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "4th Quarter 2024",
            icon: <ShoppingCart />, 
            content: (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-base md:text-lg font-semibold text-black">
                            AgriCTRL+ E-commerce
                        </h3>
                        <Image
                            src="/illustrations/ecommerce.svg"
                            alt="image"
                            className="flex items-center justify-center h-32 sm:h-44"
                            imageClassName="h-full"
                        />
                        <p className="text-black text-sm md:text-base">
                            Connecting farmers directly to consumers, creating a
                            seamless online marketplace for high-quality, traceable
                            rice products.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "1st Quarter 2025",
            icon: <ShieldPlus />,
            content: (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-base md:text-lg font-semibold text-black">
                            AgriCTRL+ MIC
                        </h3>
                        <Image
                            src="/illustrations/mic.svg"
                            alt="image"
                            className="flex items-center justify-center h-32 sm:h-44"
                            imageClassName="h-full"
                        />
                        <p className="text-black text-sm md:text-base">
                            Elevating the rice milling industry with innovative
                            solutions for quality control, efficiency, and
                            sustainability.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "2nd Quarter 2025",
            icon: <HandCoins />,
            content: (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-base md:text-lg font-semibold text-black">
                            AgriCTRL+ Finance
                        </h3>
                        <Image
                            src="/illustrations/finance.svg"
                            alt="image"
                            className="flex items-center justify-center h-32 sm:h-44"
                            imageClassName="h-full"
                        />
                        <p className="text-black text-sm md:text-base">
                            Empowering farmers and businesses with financial
                            solutions tailored to the agricultural sector,
                            promoting growth and sustainability.
                        </p>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <section id="timelineSection" 
            className="w-screen h-auto flex flex-col gap-12 
            px-4 sm:px-12 lg:px-24 
            pt-6 sm:pt-12 lg:pt-24 
            pb-6 sm:pb-12 lg:pb-24"
        >
            <Timeline data={data} />
        </section>
    );
};

export default TimelineSection;
