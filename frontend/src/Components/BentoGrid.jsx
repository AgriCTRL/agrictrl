import { cn } from "../lib/utils";

export const BentoGrid = ({ className, children }) => {
    return (
        <div
            className={cn(
                "grid auto-rows-[15rem] md:auto-rows-[20rem] grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto overflow-hidden",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    children,
    image,
    className,
}) => {
    return (
        <div
            className={cn(
                "relative row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-[#1f1f1f] dark:border-light-grey bg-white border border-transparent justify-between flex flex-col overflow-hidden",
                className
            )}
        >
            {image}
                
            {children}
        </div>
    );
};