import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
    Fan,
    Loader2,
    Undo2,
    CheckCircle2,
    ArrowRightLeft,
    WheatOff,
    ChevronRight,
    Wheat,
    Badge,
    HandHelping,
} from "lucide-react";

import { Carousel } from "primereact/carousel";
import { Divider } from "primereact/divider";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { useMountEffect } from "primereact/hooks";
import { Messages } from "primereact/messages";

import QuickLinks from "../Components/QuickLinks";
import RecipientLayout from "@/Layouts/Recipient/RecipientLayout";
import { useAuth } from "../../Authentication/Login/AuthContext";

function Home({ isRightSidebarOpen }) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { user } = useAuth();

    const navigate = useNavigate();
    const [carouselItems] = useState([
        {
            title: "Traceability Power",
            description:
                "Discover where is the source of the rice you consume, the processes it took before the palay become a bigas.",
            image: "palay.png",
        },
        {
            title: "Decentralized Records",
            description:
                "Utilizing ICP Blockchain Backend and Frontend Services, we can securely save and collect data.",
            image: "palay.png",
        },
        {
            title: "Supply Chain Management",
            description:
                "Manage the entire supply chain of rice through simple to understand user interfaces.",
            image: "palay.png",
        },
    ]);

    const [riceOrders, setRiceOrders] = useState([]);

    const viewAllOrders = () => {
        navigate("/recipient/order");
    };

    const fetchData = async () => {
        try {
            const res = await fetch(
                `${apiUrl}/riceorders?riceRecipientId=${user.id}&status=For%20Approval&status=In%20Transit`
            );
            const data = await res.json();
            setRiceOrders(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const msgs = useRef(null);
    useMountEffect(() => {
        if (msgs.current) {
            msgs.current.clear();
            msgs.current.show([
                {
                    severity: 'success',
                    sticky: true,
                    content: (
                        <React.Fragment>
                            <div className="flex items-center gap-2">
                                <img alt="logo" src="/landingpage/nfa-logo.svg" width="32" />
                                <Button
                                    text
                                    className="ring-0 transition-all gap-2 md:gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-between p-0"
                                    onClick={() => navigate("/recipient/order")}
                                >
                                    <p className='text-sm md:text-base font-medium'>
                                        Manage rice orders
                                    </p>
                                    <ChevronRight className='size-4 md:size-5' />
                                </Button>
                            </div>
                        </React.Fragment>
                    )
                }
            ]);
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (date) => {
        const formattedDate = new Date(date).toISOString().split("T")[0];

        return new Date(formattedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const Orders = riceOrders.map((order) => ({
        icon: Fan,
        title: `Order #${order.id}`,
        date: formatDate(order.orderDate),
        value: order.status,
    }));

    // RIGHT SIDEBAR DETAILS
    const [rightSidebarItems, setRightSidebarItems] = useState([]);

    const rightSidebar = () => {
        return (
            <div className="p-4 bg-white rounded-lg flex flex-col gap-4">
                <div className="header flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-black">
                        What's on the field
                    </h2>
                    <Divider className="my-0" />
                </div>
                <div className="flex flex-col gap-2">
                    {rightSidebarItems.length > 0 ? (
                        <Accordion
                            expandIcon="false"
                            collapseIcon="false"
                            className="right-sidebar-accordion"
                        >
                            {rightSidebarItems.map((item, index) => {
                                return (
                                    <AccordionTab
                                        key={index}
                                        header={
                                            <span className="flex items-center gap-4 w-full">
                                                <ArrowRightLeft size={18} />
                                                <div className="flex flex-col gap-2">
                                                    <span className="font-medium">
                                                        {item.batchId}
                                                    </span>
                                                    <small className="font-light">
                                                        {item.date_updated}
                                                    </small>
                                                </div>
                                                <Tag
                                                    value={item.status.toUpperCase()}
                                                    className="bg-light-grey font-semibold ml-auto"
                                                    rounded
                                                ></Tag>
                                            </span>
                                        }
                                        className="bg-none"
                                    ></AccordionTab>
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
                                onClick={() => navigate("/recipient/order")}
                            >
                                Add new palay batch
                            </Button>
                        </div>
                    )}
                    {rightSidebarItems.length > 0 && (
                        <Button
                            text
                            className="ring-0 transition-all gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-end"
                            onClick={() => navigate("/recipient/order")}
                        >
                            <p className="text-md font-medium">View All</p>
                            <ChevronRight size={18} />
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <RecipientLayout
            activePage="Home"
            user={user}
            isRightSidebarOpen={true}
            rightSidebar={null}
        >
            <div className={`flex flex-row bg-[#F1F5F9] h-full`}>
                {/* Main Content */}
                <div className={`flex flex-col w-full h-full gap-2 md:gap-4`}>
                    <div className="flex md:flex-row flex-col justify-between items-center">
                        <div className="flex md:flex-col text-black gap-2">
                            <h1 className="text-base md:text-xl">Welcome Back,</h1>
                            <h1 className="text-base md:text-2xl sm:text-4xl font-semibold">
                                {user.firstName ?? "User"}!
                            </h1>
                        </div>
                        <Button
                            text
                            className="ring-0 transition-all gap-2 md:gap-4 hover:gap-6 hover:bg-transparent text-primary hidden md:flex justify-between p-0"
                            onClick={() => navigate("/recipient/order")}
                        >
                            <p className='text-sm md:text-base font-medium'>
                                Manage rice orders
                            </p>
                            <ChevronRight className='size-4 md:size-5' />
                        </Button>
                        <Messages 
                            ref={msgs}
                            className='block md:hidden w-full'
                            pt={{
                                wrapper: {
                                    className: 'py-3 px-4'
                                }
                            }}
                        />
                    </div>

                    {/* Carousel for Image Section */}
                    <Carousel
                        value={carouselItems}
                        numVisible={1}
                        numScroll={1}
                        className="custom-carousel"
                        itemTemplate={(item) => (
                            <div className="relative rounded-lg overflow-hidden mb-2 h-52 md:h-80">
                                <div className="h-full">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute bg-gradient-to-r from-[#1f1f1f] to-transparent inset-0 flex flex-col gap-2 md:gap-4 p-4 md:p-8">
                                    <div className="text-primary flex items-center gap-2 md:gap-4">
                                        <HandHelping className='size-4 md:size-5' />
                                        <p className='text-sm md:text-base'>What We Offer</p>
                                    </div>
                                    <h1 className="text-white text-lg md:text-heading font-semibold">{item.title}</h1>
                                    <p className="text-sm md:text-base text-white">{item.description}</p>
                                </div>
                            </div>
                        )}
                        showIndicators={true}
                        showNavigators={false}
                        autoplayInterval={7000}
                        pt={{
                            root: {},
                            indicators: {
                                className:
                                    "absolute w-100 bottom-0 flex justify-content-center",
                            },
                        }}
                    />

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-base md:text-xl font-medium">Quick Links</h1>
                            <Button
                                text
                                className="ring-0 transition-all gap-2 md:gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-between p-0"
                                onClick={() => navigate("/recipient/orders")}
                            >
                                <p className='text-sm md:text-base font-medium'>View All</p>
                                <ChevronRight className='size-4 md:size-5' />
                            </Button>
                        </div>

                        {/* Carousel for Orders */}
                        <QuickLinks
                            items={[
                                {
                                    label: "Rice Order",
                                    link: "/recipient/order",
                                },
                                {
                                    label: "Rice Receive",
                                    link: "/recipient/receive",
                                },
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
