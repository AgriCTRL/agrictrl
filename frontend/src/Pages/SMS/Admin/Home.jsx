import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'primereact/carousel';
import {
    LayoutDashboard,
    MapPin,
    Layers,
    Building2,
    Wheat,
    Users,
} from "lucide-react";
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import CardComponent from '@/Components/CardComponent';

function Home() {
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

    const carouselTemplate = (item) => {
        return (
            <div className="relative rounded-lg overflow-hidden md:h-80 sm:h-64">
                <div className='h-full'>
                    <img src={item.image} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bg-gradient-to-r from-[#1f1f1f] to-transparent inset-0 flex flex-col gap-4 p-10">
                    <div className="text-green-400 flex items-center gap-4">
                        <Wheat size={20} />
                        <p>What We Offer</p>
                    </div>
                    <h1 className="text-white text-heading font-bold mb-2">{item.title}</h1>
                    <p className="text-white">{item.description}</p>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout activePage="Home">
            <div className='flex flex-col gap-10'>
                <section>
                    <Carousel 
                        value={carouselItems} 
                        numVisible={1} 
                        numScroll={1} 
                        className="custom-carousel with-indicators relative" 
                        itemTemplate={carouselTemplate}
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
                </section>
        
                <section className='flex flex-col gap-4'>
                    <div>
                        <p className="font-bold text-black">Quick Links</p>
                        <small className="text-black">Access essential tools and information quickly and easily.</small>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <CardComponent 
                            className="bg-white text-primary cursor-pointer flex-col gap-2 py-4 items-center transition hover:bg-primary hover:text-white"
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            <LayoutDashboard size={30}/>
                            <span className='font-semibold'>Dashboard</span>
                        </CardComponent>
                        <CardComponent 
                            className="bg-white text-primary cursor-pointer flex-col gap-2 py-4 items-center transition hover:bg-primary hover:text-white"
                            onClick={() => navigate('/admin/tracking')}
                        >
                            <MapPin size={30}/>
                            <span className='font-semibold'>Tracking</span>
                        </CardComponent>
                        <CardComponent 
                            className="bg-white text-primary cursor-pointer flex-col gap-2 py-4 items-center transition hover:bg-primary hover:text-white"
                            onClick={() => navigate('/admin/inventory')}
                        >
                            <Layers size={30}/>
                            <span className='font-semibold'>Inventory</span>
                        </CardComponent>
                        <CardComponent 
                            className="bg-white text-primary cursor-pointer flex-col gap-2 py-4 items-center transition hover:bg-primary hover:text-white"
                            onClick={() => navigate('/admin/facilities')}
                        >
                            <Building2 size={30}/>
                            <span className='font-semibold'>Facilities</span>
                        </CardComponent>
                        <CardComponent 
                            className="bg-white text-primary cursor-pointer flex-col gap-2 py-4 items-center transition hover:bg-primary hover:text-white"
                            onClick={() => navigate('/admin/users')}
                        >
                            <Users size={30}/>
                            <span className='font-semibold'>Users</span>
                        </CardComponent>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

export default Home;
