import React, { useEffect, useState } from 'react';
import RecipientLayout from '@/Layouts/Recipient/RecipientLayout';
import { Carousel } from 'primereact/carousel';
import { Fan, Loader2, Undo2, CheckCircle2, ArrowRightLeft, WheatOff, ChevronRight, Wheat, Badge } from "lucide-react";
import { useAuth } from '../../Authentication/Login/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Divider } from 'primereact/divider';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import QuickLinks from '../Components/QuickLinks';

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
        <RecipientLayout activePage="Home" user={user} isRightSidebarOpen={true} rightSidebar={null}>
            <div className={`flex flex-row bg-[#F1F5F9] h-full`}>
                {/* Main Content */}
                <div className={`flex flex-col w-full h-full gap-4`}>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col text-black">
                            <h1 className="text-xl">Welcome Back,</h1>
                            <h1 className="text-2xl sm:text-4xl font-semibold">{user.firstName ?? 'User'}!</h1>
                        </div>
                        <Button
                            text
                            className="ring-0 transition-all gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-between"
                            onClick={() => navigate('/recipient/order')}
                        >
                            <p className='text-md font-medium'>
                                Manage rice orders
                            </p>
                            <ChevronRight size={18} />
                        </Button>
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
                            <h1 className="text-xl font-medium">Quick Links</h1>
                            <Button
                                text
                                className="ring-0 transition-all gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-between hidden"
                                onClick={() => navigate('/recipient/orders')}
                            >
                                <p className='text-md font-medium'>View All</p>
                                <ChevronRight size={18} />
                            </Button>
                        </div>

                        {/* Carousel for Orders */}
                        <QuickLinks items={[
                                { label: "Home", link: "/recipient" },
                                { label: "Rice Order", link: "/recipient/order" },
                                { label: "Rice Receive", link: "/recipient/receive" },
                                // { label: 'History', link: '/recipient/history' }
                            ]}  
                        />
                    </div>
                </div>
            </div>
        </RecipientLayout>
    );
}

export default Home;