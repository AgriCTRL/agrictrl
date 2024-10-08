import { cn } from "../../../../lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCardsHorizontal = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = false,
    className
}) => {
    const containerRef = React.useRef(null);
    const scrollerRef = React.useRef(null);

    useEffect(() => {
        addAnimation();
    }, []);
    const [start, setStart] = useState(false);
    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);

        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
            }
        });

        getDirection();
        getSpeed();
        setStart(true);
        }
    }
    const getDirection = () => {
        if (containerRef.current) {
        if (direction === "left") {
            containerRef.current.style.setProperty("--animation-direction", "forwards");
        } else {
            containerRef.current.style.setProperty("--animation-direction", "reverse");
        }
        }
    };
    const getSpeed = () => {
        if (containerRef.current) {
        if (speed === "fast") {
            containerRef.current.style.setProperty("--animation-duration", "20s");
        } else if (speed === "normal") {
            containerRef.current.style.setProperty("--animation-duration", "40s");
        } else {
            containerRef.current.style.setProperty("--animation-duration", "80s");
        }
        }
    };

    return (
        (<div
        ref={containerRef}
        className={cn(
            "scroller relative z-20 max-w-full md:max-w-7xl [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
            className
        )}>
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex min-w-full shrink-0 py-6 sm:py-8 w-max flex-nowrap",
                    start && "animate-horizontalScroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="flex items-center justify-center gap-4 text-primary border-r-2 border-white px-6 py-4 sm:px-12 w-fit"
                        key={item.name}
                    >
                        <div className="w-fit h-16">
                            <img src={item.logo} alt={item.name} className="h-full"/>
                        </div>
                        <p className="text-white text-2xl sm:text-4xl font-bold">{item.name}</p>
                    </li>
                ))}
            </ul>
        </div>)
    );
};
