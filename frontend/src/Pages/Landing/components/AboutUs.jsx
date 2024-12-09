import React from "react";
import { useState } from "react";

import { BentoGrid, BentoGridItem } from "@/Components/BentoGrid.jsx";
import {
    IconClipboardCopy,
    IconFileBroken,
    IconSignature,
    IconTableColumn,
} from "@tabler/icons-react";
import { Blocks, MapPin, Play, Replace, Wheat } from "lucide-react";
import StatisticsSection from "./StatisticsSection";
import { Image } from "primereact/image";
import { Button } from "primereact/button";

const AboutUs = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    const handlePause = (e) => {
        console.log("dumadaan naman ba dito");
        console.log(e);
        setIsPlaying(false);
    };

    const items = [
        {
            image: <ImageBackground imagePath="/graphics/video-thumbnail.webp" />,
            className: "col-span-2",
        },
        {
            title: "A System Tailored for NFA's Needs",
            description: "A system that addresses challenges in palay and rice management.",
            image: <ImageBackground imagePath="" />,
            className: "md:col-span-1",
            icon: <IconClipboardCopy className="text-primary size-5 md:size-8" />,
        },
        {
            title: "Traceability Power",
            description: "Discover where is the source of the rice you consume, the processes it took before the palay become a bigas.",
            image: <ImageBackground imagePath="/graphics/traceability-graphic.webp" />,
            className: "md:col-span-1",
            icon: <MapPin className="text-primary size-5 md:size-8" />,
        },
        {
            title: "Decentralized Records",
            description: "Utilizing ICP Blockchain Backend and Frontend Services, we can securely save and collect data.",
            image: <ImageBackground imagePath="/graphics/icp-graphic.webp" />,
            className: "md:col-span-1",
            icon: <Blocks className="text-primary size-5 md:size-8" />,
        },
        {
            title: "Supply Chain Management",
            description: "Manage the entire supply chain of rice through simple to understand user interfaces.",
            image: <ImageBackground imagePath="/graphics/supply-chain-graphic.webp" />,
            className: "md:col-span-1",
            icon: <Replace className="text-primary size-5 md:size-8" />,
        },
    ];

    return (
        <section
            id="aboutUsSection"
            className="bg-[#1f1f1f] text-white relative h-auto w-screen flex flex-col gap-12 
            px-4 sm:px-12 lg:px-24
            pt-24 lg:pt-40 
            pb-6 sm:pb-12 lg:pb-24 relative"
        >
            <StatisticsSection />
            <div className="relative h-fit w-full flex flex-col gap-6 items-center">
                <div className="title font-semibold text-primary flex items-center gap-4">
                    <Wheat className="size-5 md:size-8" />
                    <p>About Us</p>
                </div>
                <h1 className="text-white text-2xl sm:text-4xl font-bold text-center">
                Revolutionizing rice tranparency
                </h1>
            </div>
            <BentoGrid className="">
                <BentoGridItem
                    description={items[0].description}
                    image={items[0].image}
                    className={items[0].className}
                >
                    <div className="group-hover/bento:bg-[#00000060] bg-[#00000040] transition duration-200 container flex flex-col gap-2 relative h-full items-center justify-center">
                        {!isPlaying && (
                            <div
                                onClick={handlePlayClick}
                                className="rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-md size-28 group-hover/bento:scale-[1.1] scale-100 transition duration-200 cursor-pointer"
                            >
                                <div className="flex items-center justify-center bg-gradient-to-b from-primary/30 to-primary shadow-md rounded-full size-20 transition-all ease-out duration-200 relative group-hover/bento:scale-[1.2] scale-100">
                                    <Play className="lucide lucide-play size-8 text-white fill-white group-hover/bento:scale-[1] scale-100 transition-transform duration-200 ease-out" />
                                </div>
                            </div>
                        )}
                        {isPlaying && (
                            <div className="relative w-full h-full">
                                <Button
                                    onClick={handlePause}
                                    className="absolute z-10 group-hover/bento:bg-primary bg-primary/50 border-0 ring-0 top-2 right-2 text-xs transition duration-200"
                                    label="Close"
                                />
                                <iframe
                                    src="https://drive.google.com/file/d/1iCaRp4z_Nc7aKYX_98MkLxn88m3av9zV/preview"
                                    allow="autoplay"
                                    title="About AgriCTRL+"
                                    className="w-full h-full"
                                />
                            </div>
                        )}
                    </div>
                </BentoGridItem>
                <BentoGridItem
                    description={items[1].description}
                    image={items[1].image}
                    className={items[1].className}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary to-primary h-full"></div>

                    <div className="group-hover/bento:translate-x-2 transition duration-200 container flex flex-col gap-2 relative h-full p-4 md:p-6 justify-end">
                        {/* {items[1].icon} */}
                        <div className="font-semibold text-lg md:text-4xl text-tag-grey dark:text-white">
                            {items[1].title}
                        </div>
                        <div className="font-normal text-sm md:text-base text-tag-grey dark:text-white">
                            {items[1].description}
                        </div>
                    </div>
                </BentoGridItem>
                <BentoGridItem
                    description={items[2].description}
                    image={items[2].image}
                    className={items[2].className}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000df] to-transparent h-full"></div>

                    <div className="group-hover/bento:translate-x-2 transition duration-200 container flex flex-col gap-2 relative h-full p-4 md:p-6 justify-end">
                        {items[2].icon}
                        <div className="font-semibold text-tag-grey dark:text-white">
                            {items[2].title}
                        </div>
                        <div className="font-normal text-sm md:text-base text-tag-grey dark:text-white">
                            {items[2].description}
                        </div>
                    </div>
                </BentoGridItem>
                <BentoGridItem
                    description={items[3].description}
                    image={items[3].image}
                    className={items[3].className}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000df] to-transparent h-full"></div>

                    <div className="group-hover/bento:translate-x-2 transition duration-200 container flex flex-col gap-2 relative h-full p-4 md:p-6 justify-end">
                        {items[3].icon}
                        <div className="font-semibold text-tag-grey dark:text-white">
                            {items[3].title}
                        </div>
                        <div className="font-normal text-sm md:text-base text-tag-grey dark:text-white">
                            {items[3].description}
                        </div>
                    </div>
                </BentoGridItem>
                <BentoGridItem
                    description={items[4].description}
                    image={items[4].image}
                    className={items[4].className}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000df] to-transparent h-full"></div>

                    <div className="group-hover/bento:translate-x-2 transition duration-200 container flex flex-col gap-2 relative h-full p-4 md:p-6 justify-end">
                        {items[4].icon}
                        <div className="font-semibold text-tag-grey dark:text-white">
                            {items[4].title}
                        </div>
                        <div className="font-normal text-sm md:text-base text-tag-grey dark:text-white">
                            {items[4].description}
                        </div>
                    </div>
                </BentoGridItem>
            </BentoGrid>
        </section>
    );
};
const ImageBackground = ({imagePath}) => (
    <Image
        src={imagePath}
        className="w-full h-full absolute inset-0"
        imageClassName="w-full h-full object-cover rounded-xl"
    />
);

export default AboutUs;
