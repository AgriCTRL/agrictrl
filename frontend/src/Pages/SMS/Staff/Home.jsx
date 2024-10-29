import React, { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Carousel } from 'primereact/carousel';
import { Fan, Loader2, Undo2, CheckCircle2 } from "lucide-react";
import { useAuth } from '../../Authentication/Login/AuthContext';

function Home({ isRightSidebarOpen }) {
    const { user } = useAuth(); 
    const [carouselItems] = useState([
        {
            title: "Traceability Power",
            description: "Discover where is the source of the rice you consume, the processes it took before the palay become a bigas.",
            image: "palay.png"
        },
        {
            title: "Decentralized Records", 
            description: "Utilizing ICP Blockchain Backend and Frontend Services, we can securely save and collect data.",
            image: "palay.png"
        },
        {
            title: "Supply Chain Management",
            description: "Manage the entire supply chain of rice through simple to understand user interfaces.",
            image: "palay.png"
        }
    ]);

    const statistics = [
        { icon: Fan, title: "Total Palay Bought", date: "MM/DD/YYYY", value: 100 },
        { icon: Fan, title: "Total Palay in Warehouse", date: "MM/DD/YYYY", value: 500 },
        { icon: Fan, title: "Total Palay Processed", date: "MM/DD/YYYY", value: 1000 },
        { icon: Fan, title: "Total Rice in Warehouse", date: "MM/DD/YYYY", value: 1500 },
        { icon: Fan, title: "Total Rice Delivered", date: "MM/DD/YYYY", value: 800 },
    ];

    const personalStats = [
        { icon: Loader2, title: "Palay Bought", value: 9 },
        { icon: Undo2, title: "Processed", value: 4 },
        { icon: CheckCircle2, title: "Distributed", value: 2 },
    ];

    return (
        <StaffLayout activePage="Home" user={user}>
            <div className={`flex flex-row p-2 bg-[#F1F5F9] h-full ${isRightSidebarOpen ? 'pr-[20%]' : ''}`}>
                
                {/* Personal Stats Section */}
                <div className={`flex flex-col items-center h-fit p-2 rounded-md ${
                    window.innerWidth <= 1366 ? 'w-[20%]' : 'w-[15%]'
                }`}>
                    {/* Gradient background */}
                    <div className="relative w-full bg-gradient-to-r from-primary to-secondary h-14 rounded-t-md">
                        {/* Avatar */}
                        <img 
                            src="/profileAvatar.png"
                            alt="Juan Pablo" 
                            className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                        />
                    </div>
                    <div className="w-full rounded-b-md bg-white">
                        {/* Name and Position */}
                        <div className="flex flex-col items-center pt-12 pb-2">
                            <h1 className="text-lg font-bold">{user.firstName + ' ' + user.lastName}</h1>
                            <h2 className="text-sm text-gray-500">{user.jobTitlePosition}</h2>
                        </div>

                        <hr className="mx-2 pb-1"/>
                        
                        {/* Stat Items */}
                        <div className="flex flex-col w-full">
                            {personalStats.map((stat, index) => (
                                <div key={index} className="flex items-center justify-between p-2 w-full">
                                    <stat.icon className="w-5 h-5" />
                                    <h1 className="text-sm font-medium">{stat.title}</h1>
                                    <div className="flex items-center justify-center w-6 h-6 bg-primary text-white text-xs rounded-full">{stat.value}+</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className={`flex flex-col ${
                    window.innerWidth <= 1366 ? 'w-[80%]' : 'w-[85%]'
                } h-full`}>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col items-center">
                            <h1 className="text-xl">Welcome Back,</h1>
                            <h1 className="text-2xl font-bold">{user.firstName}!</h1>
                        </div>

                        <h1 className="text-md font-medium text-primary">Add new palay batch {'>'} </h1>
                    </div>

                    {/* Carousel for Image Section */}
                    <Carousel 
                        value={carouselItems} 
                        numVisible={1} 
                        numScroll={1} 
                        className="custom-carousel" 
                        itemTemplate={(item) => (
                            <div className="relative rounded-lg overflow-hidden mb-2 md:h-70 sm:h-64">
                                <div className='h-full'>
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute bg-gradient-to-r from-[#2A2A2A] to-transparent inset-0 flex flex-col gap-4 p-10">
                                    <div className="text-green-400 flex items-center gap-4">
                                        <Fan />
                                        <p>What We Offer</p>
                                    </div>
                                    <h1 className="text-white text-heading font-bold mb-2">{item.title}</h1>
                                    <p className="text-white mb-4">{item.description}</p>
                                </div>
                            </div>
                        )}
                        showIndicators={true}
                        showNavigators={false}
                        autoplayInterval={7000}
                        pt={{
                            root: {},
                            indicators: {
                                className: 'absolute w-100 bottom-0 flex justify-content-center',
                            }
                        }}
                    />

                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-xl font-medium">Transactions at NFA Nueva Ecija</h1>
                        <h1 className="text-md font-medium text-primary">View all {'>'} </h1>
                    </div>

                    {/* Carousel for Statistics */}
                    <Carousel 
                        value={statistics} 
                        numVisible={3} 
                        numScroll={1}
                        className="custom-carousel"
                        itemTemplate={(stat) => (
                            <div className="flex overflow-hidden space-6 p-4 h-full">
                                <div className="flex flex-col h-full w-full p-2 rounded-md bg-white">
                                    <stat.icon className="text-primary ml-4 mt-1"/>
                                    <h1 className="font-semibold pl-4">{stat.title}</h1>
                                    
                                    <div className="flex flex-row space-x-2 pl-4 mb-2">
                                        <h1 className="text-sm font-light">as of</h1>
                                        <h1 className="text-sm font-light">{stat.date}</h1>
                                    </div>

                                    <div className="flex flex-row justify-center rounded-lg font-semibold space-x-1 p-1 mb-2 mx-14 bg-gray-300">
                                        <h1>{stat.value}</h1>
                                        <h1>mt</h1>
                                    </div>
                                </div>
                            </div>
                        )}
                        showIndicators={false}
                        showNavigators={true}
                    />
                </div>
            </div>
        </StaffLayout>
    );
}

export default Home;