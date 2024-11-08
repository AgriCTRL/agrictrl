import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Carousel } from 'primereact/carousel';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Accordion, AccordionTab } from 'primereact/accordion';
        
import { 
    Loader2, 
    Undo2, 
    CheckCircle2, 
    User,
    ChevronRight,
    HandHelping,
    Wheat,
    WheatOff,
    ArrowRightLeft,
    DivideCircle
} from "lucide-react";

import { useAuth } from '../../Authentication/Login/AuthContext';
import StaffLayout from '@/Layouts/StaffLayout';


function Home({ isRightSidebarOpen }) {
    const { user } = useAuth();
    const [userFullName] = useState(`${user.first_name} ${user.last_name}`);

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [palayCount, setPalayCount] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [distributedCount, setDistributedCount] = useState(0);
    const [totalPalayBought, setTotalPalayBought] = useState(0);
    const [totalPalayWarehouse, setTotalPalayWarehouse] = useState(0);
    const [totalPalayProcessed, setTotalPalayProcessed] = useState(0);
    const [totalRiceWarehouse, setTotalRiceWarehouse] = useState(0);
    const [totalRiceDelivered, setTotalRiceDelivered] = useState(0);
    const [currentDate, setCurrentDate] = useState(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');   
    
        return `${month}/${day}/${year}`;
    });

    const viewAllTransactions = () => {
        navigate('/staff/warehouse')
    }

    const toProcurement = () => {
        navigate('/staff/buy')
    }

    const fetchData = async () => {
        const palayCountRes = await fetch(`${apiUrl}/palaybatches/count`);
        setPalayCount(await palayCountRes.json());
        const millingCountRes = await fetch(`${apiUrl}/millingbatches/count`);
        const millingCount = await millingCountRes.json();
        const dryingCountRes = await fetch(`${apiUrl}/dryingbatches/count`);
        const dryingCount = await dryingCountRes.json();
        setProcessedCount( millingCount + dryingCount );
        const distributeCountRes = await fetch(`${apiUrl}/riceorders/received/count`);
        setDistributedCount(await distributeCountRes.json());
    }

    const fetchTotalPalayBought = async () => {
        const res = await fetch(`${apiUrl}/palaybatches/totals/quantity-bags`);
        const count = await res.json();
        setTotalPalayBought(count.total);
    }

    const fetchTotalPalayWarehouse = async () => {
        const res = await fetch(`${apiUrl}/palaybatches/totals/palay-quantity-bags`);
        const count = await res.json();
        setTotalPalayWarehouse(count.total);
    }

    const fetchTotalPalayProcessed = async () => {
        const dryingRes = await fetch(`${apiUrl}/dryingbatches/totals/quantity-bags`);
        const dryingCount = await dryingRes.json();
        const millingRes = await fetch(`${apiUrl}/millingbatches/totals/quantity-bags`);
        const millingCount = await millingRes.json();
        setTotalPalayProcessed(dryingCount.total + millingCount.total);
    }

    const fetchTotalRiceWarehouse = async () => {
        const res = await fetch(`${apiUrl}/ricebatches/totals/current-capacity`);
        const count = await res.json();
        setTotalRiceWarehouse(count.total);
    }

    const fetchTotalRiceDelivered = async () => {
        const res = await fetch(`${apiUrl}/riceorders/totals/quantity-bags`);
        const count = await res.json();
        setTotalRiceDelivered(count.total);
    }

    useEffect(() => {
        fetchData();
        fetchTotalPalayBought();
        fetchTotalPalayWarehouse();
        fetchTotalPalayProcessed();
        fetchTotalRiceWarehouse();
        fetchTotalRiceDelivered();
    }, []);

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
        { icon: <Wheat size={18} />, title: "Total Palay Bought", date: "MM/DD/YYYY", value: 100 },
        { icon: <Wheat size={18} />, title: "Total Palay in Warehouse", date: "MM/DD/YYYY", value: 500 },
        { icon: <Wheat size={18} />, title: "Total Palay Processed", date: "MM/DD/YYYY", value: 1000 },
        { icon: <Wheat size={18} />, title: "Total Rice in Warehouse", date: "MM/DD/YYYY", value: 1500 },
        { icon: <Wheat size={18} />, title: "Total Rice Delivered", date: "MM/DD/YYYY", value: 800 },
    ];

    const personalStats = [
        { icon: <Loader2 size={18} />, title: "Palay Bought", value: 9 },
        { icon: <Undo2 size={18} />, title: "Processed", value: 4 },
        { icon: <CheckCircle2 size={18} />, title: "Distributed", value: 2 },
    ];

    const leftSidebar = () => {
        return (
            <div className={`flex flex-col items-center`}>
                {/* Gradient background */}
                <div className="relative w-full bg-gradient-to-r from-secondary to-primary h-16 rounded-t-lg flex items-center justify-center">
                    {/* Avatar */}
                    <Avatar 
                        size="xlarge"
                        image={user.avatar ?? null} 
                        icon={<User size={24} />}
                        shape="circle"
                        className="cursor-pointer border-2 border-white text-primary bg-tag-grey absolute bottom-0 translate-y-1/2 shadow-lg"
                    />
                </div>
                <div className="w-full rounded-b-md bg-white flex flex-col gap-2 pt-12 px-4 pb-4">
                    {/* Name and Position */}
                    <div className="flex flex-col items-center pb-2">
                        <h1 className="text-lg font-medium text-black">{(user.first_name && user.last_name) ? userFullName : 'username'}</h1>
                        <p className="text-sm text-gray-400">{user.userType.toLowerCase()}</p>
                    </div>

                    <Divider className='my-0'/>
                    
                    {/* Stat Items */}
                    <div className="flex flex-col w-full">
                        {personalStats.map((stat, index) => (
                            <div className="flex items-center hover:bg-background rounded-md pr-5">
                                <Button
                                    text
                                    className="cursor-default pr-0 ring-0 w-full bg-transparent text-black flex justify-between"
                                >
                                    <div className="flex gap-4 items-center">
                                        {stat.icon}
                                        <p>{stat.title}</p>
                                    </div>
                                </Button>
                                <Badge value={stat.value} className="ml-auto bg-primary" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

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
                    <DivideCircle className='my-0'/>
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
                                onClick={() => navigate('/staff/buy')}
                            >
                                Add new palay batch
                            </Button>
                        </div>
                    )}
                    {rightSidebarItems.length > 0 && (
                        <Button
                            text
                            className="ring-0 transition-all gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-end"
                            onClick={() => navigate('/staff/buy')}
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
        <StaffLayout activePage="Home" user={user} leftSidebar={leftSidebar()} isRightSidebarOpen={true} isLeftSidebarOpen={true} rightSidebar={rightSidebar()}>
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
                            onClick={() => navigate('/staff/buy')}
                        >
                            <p className='text-md font-medium'>Add new palay batch</p>
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
                                <div className="absolute bg-gradient-to-r from-[#2A2A2A] to-transparent inset-0 flex flex-col gap-4 p-8">
                                    <div className="text-green-400 flex items-center gap-4">
                                        <HandHelping size={20} />
                                        <p>What We Offer</p>
                                    </div>
                                    <h1 className="text-white text-heading font-semibold">{item.title}</h1>
                                    <p className="text-white">{item.description}</p>
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
                            <h1 className="text-xl font-medium">Transactions</h1>
                            <Button
                                text
                                className="ring-0 transition-all gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-between"
                                onClick={() => navigate('/staff/buy')}
                            >
                                <p className='text-md font-medium'>View All</p>
                                <ChevronRight size={18} />
                            </Button>
                        </div>

                        {/* Carousel for Statistics */}
                        <Carousel 
                            value={statistics} 
                            numVisible={3} 
                            numScroll={1}
                            className="custom-carousel staff-transactions-carousel relative"
                            itemTemplate={(stat) => (
                                <div className="flex overflow-hidden h-full">
                                    <div className="flex flex-col h-full w-full p-4 gap-2 rounded-md bg-white">
                                        <div className="w-fit p-4 rounded-lg bg-background text-primary">
                                            {stat.icon}
                                        </div>

                                        <div className="flex flex-col text-black">
                                            <h1 className="font-semibold">{stat.title}</h1>
                                            <h1 className="text-sm font-light">
                                                as of {stat.date}
                                            </h1>
                                        </div>

                                        <Tag value={stat.value} className='bg-tag-grey text-black w-1/2'></Tag>
                                    </div>
                                </div>
                            )}
                            showIndicators={false}
                            showNavigators={true}
                        />
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}

export default Home;