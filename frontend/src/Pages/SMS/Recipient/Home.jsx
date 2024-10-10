import React, { useState } from 'react';
import RecipientLayout from '../../../Layouts/RecipientLayout';
import { Carousel } from 'primereact/carousel';
import { Fan, Loader2, Undo2, CheckCircle2 } from "lucide-react";


function Home({ isRightSidebarOpen }) {
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

    const Orders = [
        { icon: Fan, title: "Order #1111", date: "MM/DD/YYYY", value: "preparing" },
        { icon: Fan, title: "Order #2222", date: "MM/DD/YYYY", value: "transporting" },
        { icon: Fan, title: "Order #3333", date: "MM/DD/YYYY", value: "preparing" },
        { icon: Fan, title: "Order #4444", date: "MM/DD/YYYY", value: "preparing" },
        { icon: Fan, title: "Order #5555", date: "MM/DD/YYYY", value: "transporting" },
    ];

    return (
        <RecipientLayout activePage="Home">
            <div className={`flex flex-row p-2 bg-[#F1F5F9] h-full ${isRightSidebarOpen ? 'pr-[20%]' : ''}`}>
                
                {/* Main Content */}
                <div className="flex flex-col w-full px-10">
                    <div className="flex justify-start">
                        <div className="flex flex-col items-center">
                            <h1 className="text-xl">Welcome Back,</h1>
                            <h1 className="text-2xl font-bold">Juan!</h1>
                        </div>
                    </div>

                    {/* Carousel for Image Section */}
                    <Carousel 
                        value={carouselItems} 
                        numVisible={1} 
                        numScroll={1} 
                        className="custom-carousel" 
                        itemTemplate={(item) => (
                            <div className="relative rounded-lg overflow-hidden mb-2 md:h-70 sm:h-72">
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
                        <h1 className="text-xl font-medium">Rice Orders</h1>
                        <h1 className="text-md font-medium text-primary">View all {'>'} </h1>
                    </div>

                    {/* Carousel for Orders */}
                    <Carousel 
                        value={Orders} 
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
                                    </div>
                                </div>
                            </div>
                        )}
                        showIndicators={false}
                        showNavigators={true}
                    />
                </div>
            </div>
        </RecipientLayout>
    );
}

export default Home;