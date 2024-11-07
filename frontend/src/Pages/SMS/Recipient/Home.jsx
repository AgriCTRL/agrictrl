import React, { useEffect, useState } from 'react';
import RecipientLayout from '../../../Layouts/RecipientLayout';
import { Carousel } from 'primereact/carousel';
import { Fan, Loader2, Undo2, CheckCircle2, ArrowRightLeft, WheatOff, ChevronRight } from "lucide-react";
import { useAuth } from '../../Authentication/Login/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Divider } from 'primereact/divider';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';


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
            const res = await fetch(`${apiUrl}/riceorders?riceRecipientId=${user.id}&status=For%20Approval&status=In%20Transit`);
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
        value: order.status
    }));

    // RIGHT SIDEBAR DETAILS
    const [rightSidebarItems, setRightSidebarItems] = useState([
        {
            batchId: '123',
            date_updated: '2021-01-01',
            status: 'Processing',
        },
        {
            batchId: '456',
            date_updated: '2021-01-01',
            status: 'Processing',
        },
        {
            batchId: '789',
            date_updated: '2021-01-01',
            status: 'Processing',
        },
        {
            batchId: '456',
            date_updated: '2021-01-01',
            status: 'Processing',
        },
        {
            batchId: '789',
            date_updated: '2021-01-01',
            status: 'Processing',
        }
    ]) 

    const rightSidebar = () => {
        return (
            <div className="p-4 bg-white rounded-lg flex flex-col gap-4">
                <div className="header flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-black">What's on the field</h2>
                    <Divider className='my-0'/>
                </div>
                <div className="flex flex-col gap-2">
                    {rightSidebarItems.length > 0 ? (
                        <Accordion 
                            expandIcon="false"
                            collapseIcon="false"
                            className='right-sidebar-accordion'
                        >
                            {rightSidebarItems.map((item, index) => {
                                return (
                                    <AccordionTab
                                        key={index}
                                        header={
                                            <span className="flex items-center gap-4 w-full">
                                                <ArrowRightLeft size={18} />
                                                <div className="flex flex-col gap-2">
                                                    <span className="font-medium">{item.batchId}</span>
                                                    <small className='font-light'>{item.date_updated}</small>
                                                </div>
                                                <Tag value={item.status.toUpperCase()} className="bg-light-grey font-semibold ml-auto" rounded></Tag>
                                            </span>
                                        }
                                        className="bg-none"
                                    >
                                    </AccordionTab>
                                );
                            })}
                        </Accordion>
                    ) : (
                        <div className="w-full flex flex-col justify-center items-center gap-2">
                            <WheatOff size={24} className="text-primary" />
                            <p className="text-black">No data to show.</p>
                            <Button
                                outlined
                                className="w-full ring-0 text-primary border-primary hover:bg-primary hover:text-white flex justify-center"
                                onClick={() => navigate('/recipient/order')}
                            >
                                Add new palay batch
                            </Button>
                        </div>
                    )}
                    {rightSidebarItems.length > 0 && (
                        <Button
                            text
                            className="ring-0 transition-all gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-end"
                            onClick={() => navigate('/recipient/order')}
                        >
                            <p className='text-md font-medium'>View All</p>
                            <ChevronRight size={18} />
                        </Button>  
                    )}
                </div>
            </div>
        )
    }

    return (
        <RecipientLayout activePage="Home" user={user} isRightSidebarOpen={true} rightSidebar={rightSidebar()}>
            <div className={`flex flex-row bg-[#F1F5F9] h-full`}>
                {/* Main Content */}
                <div className={`flex flex-col w-full h-full gap-4`}>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col text-black">
                            <h1 className="text-xl">Welcome Back,</h1>
                            <h1 className="text-2xl sm:text-4xl font-semibold">{user.first_name ?? 'User'}!</h1>
                        </div>
                    </div>

                    {/* Carousel for Image Section */}
                    <Carousel 
                        value={carouselItems} 
                        numVisible={1} 
                        numScroll={1} 
                        className="custom-carousel" 
                        itemTemplate={(item) => (
                            <div className="relative rounded-lg overflow-hidden mb-2 md:h-80 sm:h-64">
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

                    <div className='flex flex-col gap-4'>
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-xl font-medium">Rice Orders</h1>
                            <Button
                                text
                                className="ring-0 transition-all gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-between"
                                onClick={() => navigate('/recipient/orders')}
                            >
                                <p className='text-md font-medium'>View All</p>
                                <ChevronRight size={18} />
                            </Button>
                        </div>

                        {/* Carousel for Orders */}
                        {Orders.length === 0 && (
                            <div className="flex flex-col justify-center items-center p-6 w-full rounded-lg border border-lightest-grey">
                                <WheatOff size={24} className="text-primary" />
                                <h1 className="text-black">No Rice Orders Found</h1>
                            </div>
                        )}  
                        {Orders.length > 0 && (
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
                        )}
                    </div>
                </div>
            </div>
        </RecipientLayout>
    );
}

export default Home;