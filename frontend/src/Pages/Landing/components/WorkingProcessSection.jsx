import { React, useState } from 'react';
import {  
    HandCoins,
    Link,
    ShieldPlus,
    ShoppingCart,
    Wheat 
} from 'lucide-react';

import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const WorkingProcessSection = () => {
    const events = [
        { 
            code: 1,
            title: <p>AgriCTRL+<br/>TnT</p>, 
            date: '3RD QUARTER 2024', 
            icon: <HandCoins />,
        },
        { 
            code: 2,
            title: <p>AgriCTRL+<br/>SMS</p>,
            date: '3RD QUARTER 2024', 
            icon: <Link />,
        },
        { 
            code: 3,
            title: <p>AgriCTRL+<br/>eCommerce</p>, 
            date: '4TH QUARTER 2024', 
            icon: <ShoppingCart />, 
        },
        { 
            code: 4,
            title: <p>AgriCTRL+<br/>MIC</p>, 
            date: '1ST QUARTER 2025', 
            icon: <ShieldPlus />,
        },
        { 
            code: 5,
            title: <p>AgriCTRL+<br/>Finance</p>, 
            date: '2ND QUARTER 2025', 
            icon: <HandCoins />,
        }
    ];

    const customizedMarker = (item) => {
        return (
            <div className='size-12 p-2 bg-lightest-grey rounded-full'>
                <span className="w-full h-full p-2 text-white bg-gradient-to-tr from-secondary to-primary rounded-full flex items-center justify-center">
                    {item.icon}
                </span>
            </div>
        );
    };

    const customizedContent = (item) => {
        return (
            <div className="size-45 flex flex-col sm:flex-row p-4 hover:bg-lightest-grey transition-all rounded-lg gap-4 justify-center text-left">
                <p className='text-2xl text-primary font-semibold'>{item.code}</p>
                <div className="flex flex-col text-start justify-start">
                    <div className="text-primary font-semibold">{item.title}</div>
                    <div>{item.date}</div>
                </div>
            </div>
        );
    };

    return (
        <section className="relative h-fit w-screen flex flex-col gap-6 overflow-hidden px-6 sm:px-12 lg:px-24 pb-6 sm:pb-12 lg:pb-24 pt-2 sm:pt-6 items-center">
            <div className="title font-semibold text-primary flex items-center gap-4">
                <Wheat />
                <p>Project Roadmap</p>
            </div>
            <h1 className="text-black text-2xl sm:text-4xl font-bold text-center">Where Our Palay Journey Begins</h1>
            <Timeline value={events} align="alternate" layout='horizontal' className="pt-6 hidden lg:flex customized-timeline w-full" marker={customizedMarker} content={customizedContent} />
            <Timeline value={events} align="alternate" className="pt-4 flex lg:hidden customized-timeline w-full" marker={customizedMarker} content={customizedContent} />
        </section>
    );
};

export default WorkingProcessSection;