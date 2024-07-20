import React from 'react';

import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Card } from 'primereact/card';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';

import UserLayout from '../../Layouts/UserLayout';
function Home() {
    const [carouselItems] = React.useState([
        {
            title: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing",
            image: "path-to-rice-field-image.jpg"
        },
        {
            title: "Second slide title",
            description: "Second slide description",
            image: "path-to-second-image.jpg"
        },
        {
            title: "Third slide title",
            description: "Third slide description",
            image: "path-to-third-image.jpg"
        }
    ]);

    const carouselTemplate = (item) => {
        return (
            <div className="relative rounded-lg overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center px-8">
                    <div className="text-green-400 mb-2">Latest News</div>
                    <h1 className="text-white text-4xl font-bold mb-2">{item.title}</h1>
                    <p className="text-white mb-4">{item.description}</p>
                </div>
            </div>
        );
    };

    return (
        <UserLayout activePage="Home">
            {/* 
            <div className="bg-gray-100 min-h-screen">
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex-grow mx-8">
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-search" />
                            <InputText placeholder="Tap to search" className="w-full" />
                        </span>
                        </div>
                        <div className="flex items-center">
                        <i className="pi pi-bell text-gray-600 mr-4 text-xl"></i>
                        <Avatar image="path-to-john-doe-image.jpg" shape="circle" />
                        <div class="flex flex-col ml2">
                            <span className="ml-2">John Doe</span>
                            <span className="ml-2">NFA Procurement</span>
                        </div>
                        </div>
                    </div>
                </header>
        
                <main className="container mx-auto px-4 py-8">
                    <section className="mb-8">
                        <Carousel 
                            value={carouselItems} 
                            numVisible={1} 
                            numScroll={1} 
                            className="custom-carousel" 
                            itemTemplate={carouselTemplate}
                            showIndicators = {true}
                            showNavigators={true}
                            autoplayInterval={5000}
                        />
                    </section>
            
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Dashboard', 'Inventory', 'Sales', 'Profile'].map((item, index) => (
                            <Card key={index} className="shadow-sm">
                            <div className="flex flex-col items-center">
                                <i className={`pi ${['pi-th-large', 'pi-box', 'pi-chart-line', 'pi-user'][index]} text-3xl text-green-500 mb-2`}></i>
                                <span>{item}</span>
                            </div>
                            </Card>
                        ))}
                        </div>
                    </section>
                </main>
            </div> */}
            <div className='bg-white p-4 rounded'>Facilities</div>
        </UserLayout>
    );
  }
  
  export default Home;