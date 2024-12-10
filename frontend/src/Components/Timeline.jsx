import { useScroll, useTransform, motion } from "framer-motion";
import { Wheat } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 50%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div
            className="bg-white flex flex-col gap-6 max-w-7xl mx-auto"
            ref={containerRef}
        >
            {/* <div className="flex flex-col gap-6"> */}
            <div className="relative h-fit w-full flex flex-col gap-6 items-center">
                <div className="title font-semibold text-primary flex items-center gap-4">
                    <Wheat className="size-5 md:size-8"/>
                    <p className="text-sm md:text-base">Project Roadmap</p>
                </div>
                <h1 className="text-black text-2xl md:text-4xl font-bold text-center">
                    Where Our Palay Journey Begins
                </h1>
            </div>
            <div ref={ref} className="relative">
                {data.map((item, index) => (
                    <div key={index} className="flex justify-start gap-6 py-4">
                        <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                            <div className="size-12 absolute left-2 md:left-2 p-2 rounded-full bg-lightest-grey flex items-center justify-center">
                                <span className="w-full h-full p-2 text-white bg-gradient-to-tr from-secondary to-primary rounded-full flex items-center justify-center">
                                    {item.icon}
                                </span>
                            </div>
                            <h3 className="hidden md:block text-lg md:pl-20 md:text-4xl font-bold text-primary">
                                {item.title}
                            </h3>
                        </div>

                        <div className="relative pl-20 pr-4 md:pl-4 w-full">
                            <h3 className="md:hidden block text-xl mb-4 mt-2 text-left font-bold text-primary">
                                {item.title}
                            </h3>
                            {item.content}{" "}
                        </div>
                    </div>
                ))}
                <div
                    style={{
                        height: height + "px",
                    }}
                    className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
                >
                    <motion.div
                        style={{
                            height: heightTransform,
                            opacity: opacityTransform,
                        }}
                        className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-secondary via-primary to-transparent from-[0%] via-[10%] rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};
