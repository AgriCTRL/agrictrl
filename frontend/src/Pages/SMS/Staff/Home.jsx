import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Carousel } from 'primereact/carousel';
import { Wheat, Fan } from "lucide-react";

function Home() {
    const [carouselItems] = React.useState([
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

    const StatisticsCard = ({ icon: Icon, title, date, value }) => (
        <div className="flex flex-col h-full w-full rounded-md p-2 bg-blue-500">
            <Icon className="text-primary mb-1"/>
            <h1 className="font-semibold">{title}</h1>
            <div className="flex flex-row space-x-2 mb-2">
                <h1 className="text-sm font-light">as of</h1>
                <h1 className="text-sm font-light">{date}</h1>
            </div>
            <div className="flex flex-row justify-center rounded-lg font-semibold space-x-1 p-2 mx-14 bg-gray-300">
                <h1>{value}</h1>
                <h1>mt</h1>
            </div>
        </div>
    );

    const statisticsTemplate = (stat) => (
        <div className="w-full px-2">
            <StatisticsCard {...stat} />
        </div>
    );

    return (
        <StaffLayout activePage="Home">
            <div className="flex flex-row p-2 bg-[#F1F5F9] h-full">
                <div className="flex flex-col justify-center items-center w-[20%] h-fit p-5 rounded-md mr-3 bg-white">
                    <h1 className="text-xl font-bold">Palay Bought</h1>
                    <h1 className="text-xl font-bold">Processed</h1>
                    <h1 className="text-xl font-bold">Distributed</h1>
                </div>

                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col items-center">
                            <h1 className="text-xl">Welcome Back,</h1>
                            <h1 className="text-2xl font-bold">Juan!</h1>
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
                                        <Wheat />
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
                    numVisible={4} 
                    numScroll={1}
                    className="flex-grow justify-center"
                    itemTemplate={(stat) => (
                        <div className="flex-grow flex-col h-full w-full p-1">
                            <div className="flex flex-col h-full w-full rounded-md bg-white">
                            <Fan className="text-primary ml-4 mt-1"/>
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
                    showIndicators={false}  // Optional: Hide indicators if not needed
                    showNavigators={true}   // Use PrimeReact's built-in navigation arrows
                />
                    
                </div>
            </div>
        </StaffLayout>
    );
}

export default Home;