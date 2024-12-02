import { ArrowRight, Wheat } from 'lucide-react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickLinks = ({ items = [] }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {items.map((link, index) => (
                <LinkCard key={index} link={link} />
            ))}
        </div>
    );
};

const LinkCard = ({ link }) => {
    const navigate = useNavigate();

    return (
        <div className="flex overflow-hidden h-full">
            <div className="flex flex-col h-full w-full p-4 gap-2 rounded-md bg-white">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-lg bg-background text-primary">
                        <Wheat size={18} />
                    </div>
                    <h1 className="text-black font-semibold">{link?.label}</h1>
                </div>

                <Divider className="my-0" />

                <Button
                    text
                    className="px-0 text-black gap-2 italic"
                    onClick={() => navigate(link?.link)}
                >
                    <span className="font-light">{`Manage ${link?.label?.toLowerCase()}`}</span>
                    <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
};

export default QuickLinks;