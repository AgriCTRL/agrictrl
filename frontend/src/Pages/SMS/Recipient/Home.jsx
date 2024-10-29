import React, { useEffect, useState } from 'react';
import RecipientLayout from '../../../Layouts/RecipientLayout';
import { Carousel } from 'primereact/carousel';
import { Fan, Loader2, Undo2, CheckCircle2 } from "lucide-react";
import { useAuth } from '../../Authentication/Login/AuthContext';
import { useNavigate } from 'react-router-dom';


function Home({ isRightSidebarOpen }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { user } = useAuth();
    const navigate = useNavigate();
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

    const [riceOrders, setRiceOrders] = useState([]);

    const viewAllOrders = () => {
        navigate('/recipient/order')
    }

    const fetchData = async () => {
        try {
            const res = await fetch(`${apiUrl}/riceorders?riceRecipientId=${user.id}&status=For%20Approval`);
            const data = await res.json();
            setRiceOrders(data);
        }
        catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (date) => {
        const formattedDate = new Date(date).toISOString().split('T')[0];

        return new Date(formattedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
        });
    }

    const Orders = riceOrders.map(order => ({
        icon: Fan,
        title: `Order #${order.id}`,
        date: formatDate(order.orderDate),
        value: "For Approval"
    }));

    return (
        <RecipientLayout activePage="Home" user={user}>
            <div className={`flex flex-row p-2 bg-[#F1F5F9] h-full ${isRightSidebarOpen ? 'pr-[20%]' : ''}`}>
                
                {/* Main Content */}
                <div className="flex flex-col w-full px-10">
                    <div className="flex justify-start">
                        <div className="flex flex-col items-center">
                            <h1 className="text-xl">Welcome Back,</h1>
                            <h1 className="text-2xl font-bold">{user.firstName}</h1>
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
                        <h1 className="text-md font-medium text-primary hover:cursor-pointer" onClick={viewAllOrders}>View all {'>'} </h1>
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