import React from 'react';
import { Card } from 'primereact/card';
import { Carousel } from 'primereact/carousel';
import {
    House,
    LayoutDashboard,
    MapPin,
    Layers,
    Building2,
    Wheat,
} from "lucide-react";
import UserLayout from '../../Layouts/UserLayout';
function Home() {
    const [carouselItems] = React.useState([
        {
            title: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing",
            image: "http://picsum.photos/1000/400/"
        },
        {
            title: "Second slide title",
            description: "Second slide description",
            image: "http://picsum.photos/1000/400/"
        },
        {
            title: "Third slide title",
            description: "Third slide description",
            image: "http://picsum.photos/1000/400/"
        }
    ]);

    const carouselTemplate = (item) => {
        return (
            <div className="relative rounded-lg overflow-hidden md:h-80 sm:h-64">
                <div className='h-full'>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bg-gradient-to-r from-black to-transparent inset-0 flex flex-col gap-4 p-10">
                    <div className="text-green-400 flex items-center gap-4">
                        <Wheat />
                        <p>Latest News</p>
                    </div>
                    <h1 className="text-white text-4xl font-bold mb-2">{item.title}</h1>
                    <p className="text-white mb-4">{item.description}</p>
                </div>
            </div>
        );
    };

    return (
        <UserLayout activePage="Home">
            <div className='flex flex-col gap-10'>
                <section>
                    <Carousel 
                        value={carouselItems} 
                        numVisible={1} 
                        numScroll={1} 
                        className="custom-carousel" 
                        itemTemplate={carouselTemplate}
                        showIndicators = {true}
                        showNavigators={false}
                        autoplayInterval={5000}
                        pt={{
                            root: {
                                
                            },
                            indicators: {
                                className: 'absolute w-100 bottom-0 flex justify-content-center',
                            }
                        }}
                    />
                </section>
        
                <section className='flex flex-col gap-4'>
                    <p className="font-bold text-black">Quick Links</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="shadow-sm">
                            <div className="flex flex-col items-center">
                                <LayoutDashboard  size={40}/>
                                <span className='font-bold text-primary'>Dashboard</span>
                            </div>
                        </Card>
                        <Card className="shadow-sm">
                            <div className="flex flex-col items-center">
                                <MapPin  size={40}/>
                                <span className='font-bold text-primary'>Tracking</span>
                            </div>
                        </Card>
                        <Card className="shadow-sm">
                            <div className="flex flex-col items-center">
                                <Layers  size={40}/>
                                <span className='font-bold text-primary'>Inventory</span>
                            </div>
                        </Card>
                        <Card className="shadow-sm">
                            <div className="flex flex-col items-center">
                                <Building2  size={40}/>
                                <span className='font-bold text-primary'>Facilities</span>
                            </div>
                        </Card>
                    </div>
                </section>
            </div>
        </UserLayout>
    );
  }
  
  export default Home;