import React from 'react'
import { cn } from '@/lib/utils';

const CardGrids = ({ items, className }) => {
    return (
        <div className={`grid relative z-10 max-w-7xl mx-auto ${className}`}>
            {items.map((item, index) => (
                <Card
                    key={index.title}
                    {...item}
                    index={index}
                    itemsLength={items.length}
                />
            ))}
        </div>
    )
}
const Card = ({ title, description, icon, index, itemsLength }) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r  py-4 lg:py-8 relative group/feature dark:border-tag-grey",
                (index === 0 || index === 3) &&
                    "lg:border-l dark:border-tag-grey",
                (itemsLength > 3 && index < 3) && "lg:border-b dark:border-tag-grey"
            )}
        >
            {index < 3 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-primary/40 to-transparent pointer-events-none" />
            )}
            {index >= 3 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-primary/40 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-4 lg:px-8 text-black dark:text-neutral-400">
                {icon}
            </div>
            <div className="text-lg font-semibold mb-2 relative z-10 px-4 lg:px-8">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-black">
                    {title}
                </span>
            </div>
            <p className="text-sm md:text-base text-black relative z-10 px-4 lg:px-8">
                {description}
            </p>
        </div>
    );
};

export default CardGrids