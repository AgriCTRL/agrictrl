import React from 'react';
import { Button } from 'primereact/button';
import AppLayout from '../Layouts/AppLayout';
import { Wheat, Search, Coins, Truck } from 'lucide-react';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const LandingPage = () => {
    return (
        <AppLayout>
            <div className="font-poppins">
                {/* Hero Section */}
                <section 
                    className="relative bg-green-100 h-screen flex items-center bg-cover bg-center " 
                    style={{ 
                        backgroundImage: 'url("/Landing-HeroBg.jpg")', 
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}> {/* Background image */}
                    <div className="absolute inset-0 bg-black opacity-40 z-0"></div> {/* Dark overlay */}
                    <div className="container mx-auto flex flex-col lg:flex-row items-center relative z-10">
                        {/* Text Section */}
                        <div className="text-center ml-20 lg:text-left lg:w-1/2 mt-[-8rem]">
                            <p className="mb-2 text-custom-green font-bold tracking-widest">REVOLUTIONIZING</p>
                            <h1 className="text-6xl text-white font-bold mb-4">Rice Supply Chain</h1>
                            <h1 className="text-6xl text-white font-bold mb-4">Transparency</h1>
                            <p className="mb-8 text-[19px] font-normal leading-[30px] text-left text-white">
                                Empowering farmers, ensuring fair prices, and providing consumers with
                                peace of mind through blockchain-powered traceability.
                            </p>
                            <div className='flex flex-row '>
                                <div className="bg-[#00C261]  mr-3 rounded-xl shadow-lg">
                                    <div className="flex flex-row p-4 px-12">
                                        <Button className="mx-2 p-button-success p-button-rounded text-white tracking-widest" label="Get Started" />
                                        <Wheat className="text-white h-5 w-5"/>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-white p-3 px-16 shadow-lg  ml-3">
                                    <Button className=" p-button-outlined p-button-success text-white tracking-widest" label="Read More" />
                                </div>
                            </div>
                            
                        </div>
                        {/* Buttons Section */}
                        <div className="mt-8 lg:mt-0 lg:w-1/2 flex flex-col items-center lg:items-start space-y-5">
                            {/* Buy button */}
                            <div className="relative w-full lg:w-auto translate-x-72 translate-y-24">
                                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg transform translate-x-10 translate-y-7"></div>
                                <div className="relative flex flex-col bg-white/30 backdrop-blur-sm rounded-lg px-16 py-10">
                                    <Coins className="text-white m-1"/>
                                    <Button className="p-button-text w-full lg:w-auto text-white" label="Buy"/>
                                </div>
                            </div>

                            {/* Find button */}
                            <div className="relative w-full lg:w-auto -translate-x-5 translate-y-20 z-10">
                                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg transform -translate-x-10 translate-y-7"></div>
                                <div className="relative flex flex-col bg-white/30 backdrop-blur-sm rounded-lg px-16 py-10">
                                    <Search className="text-white m-1"/>
                                    <Button className="p-button-text w-full lg:w-auto text-white" label="Find"/>
                                </div>
                            </div>

                            {/* Trace your rice section */}
                            <div className="backdrop-blur-sm ml-40 mr-40 px-10 py-3 pb-20 bg-white/30 rounded-lg w-full lg:w-auto -translate-x-8 z-1">
                                <div className="flex felx-col">
                                    <Truck className="text-white mr-2"/>
                                    <h3 className="font-semibold mb-2 text-white">Trace your rice</h3>
                                </div>
                                
                                <p className="text-sm text-white">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation.
                                </p>
                            </div>
                        </div>
                    </div>
                    <img
                        src="/Landing-HeroSection.png"
                        alt="Decorative"
                        className="absolute bottom-0 -mb-1 left-0 w-full h-auto z-10"
                    />
                </section>

                {/* Features Section */}
                <section className="relative bg-white h-screen">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 gap-8">
                    {/* Left side: Search Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button className="p-4 border rounded text-center flex flex-col items-center">
                        <i className="pi pi-search mb-2"></i>
                        Sales Receipt
                        </Button>
                        <Button className="p-4 border rounded text-center flex flex-col items-center">
                        <i className="pi pi-search mb-2"></i>
                        Credit Memo
                        </Button>
                        <Button className="p-4 border rounded text-center flex flex-col items-center">
                        <i className="pi pi-search mb-2"></i>
                        Delayed Charge
                        </Button>
                        <Button className="p-4 border rounded text-center flex flex-col items-center">
                        <i className="pi pi-search mb-2"></i>
                        Statement
                        </Button>
                        <Button className="p-4 border rounded text-center flex flex-col items-center">
                        <i className="pi pi-search mb-2"></i>
                        Invoice
                        </Button>
                        <Button className="p-4 border rounded text-center flex flex-col items-center">
                        <i className="pi pi-search mb-2"></i>
                        Estimate
                        </Button>
                        <Button className="p-4 border rounded text-center flex flex-col items-center">
                        <i className="pi pi-search mb-2"></i>
                        Payment
                        </Button>
                    </div>
                    {/* Right side: Features Section */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Know Where You're Getting Your Rice</h2>
                        <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Preview Dialer</h3>
                            <p>The world's largest e-store, has returned more than 79% from Oct 28, 2019, to Oct 28, 2020, and more</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Text-to-speech</h3>
                            <p>The sole product manufacturer of the group, has returned more than 82% over from Oct 28, 2019, to Oct</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Omnichannel</h3>
                            <p>The social media maestro, owner of Instagram, WhatsApp, and its namesake website. It has returned mo</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </section>


                {/* Statistics */}
                <section className="bg-gradient-to-r from-teal-600 to-green-500 text-white py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                    <i className="pi pi-shopping-bag text-2xl"></i>
                    <div>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm">Rice Tracked</div>
                    </div>
                    </div>
                    <div className="flex items-center space-x-4">
                    <i className="pi pi-users text-2xl"></i>
                    <div>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm">Farmers</div>
                    </div>
                    </div>
                    <div className="flex items-center space-x-4">
                    <i className="pi pi-clock text-2xl"></i>
                    <div>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm">Rice Sellers</div>
                    </div>
                    </div>
                    <div className="flex items-center space-x-4">
                    <i className="pi pi-user text-2xl"></i>
                    <div>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm">Customers</div>
                    </div>
                    </div>
                </div>
                </section>

                {/* Process Section */}
                <section className="bg-gray-900 text-white py-16 relative overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 z-10">
                    <h2 className="text-4xl font-bold mb-6">Transparency With Rice Supply Chain</h2>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                        <i className="pi pi-chart-line text-green-400 text-2xl mt-1"></i>
                        <div>
                            <h3 className="font-semibold text-green-400">Preview Dialer</h3>
                            <p className="text-gray-300">The world's largest e-store, has returned more than 79% from Oct 28, 2018, to Oct 28, 2020, and more</p>
                        </div>
                        </div>
                        <div className="flex items-start space-x-4">
                        <i className="pi pi-volume-up text-green-400 text-2xl mt-1"></i>
                        <div>
                            <h3 className="font-semibold text-green-400">Text-to-speech</h3>
                            <p className="text-gray-300">The sole product manufacturer of the group, has returned more than 82% over from Oct 28, 2018, to Oc</p>
                        </div>
                        </div>
                    </div>
                    <button className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full flex items-center">
                        Get Started
                        <i className="pi pi-arrow-right ml-2"></i>
                    </button>
                    </div>
                    <div className="md:w-1/2 relative mt-8 md:mt-0">
                    <div className="grid grid-cols-2 gap-4">
                        <img src="/path-to-image1.jpg" alt="Rice field" className="rounded-lg shadow-lg"/>
                        <img src="/path-to-image2.jpg" alt="Farmer" className="rounded-lg shadow-lg mt-8"/>
                        <img src="/path-to-image3.jpg" alt="Rice plants" className="rounded-lg shadow-lg col-span-2"/>
                    </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                </section>

                {/* Testimonials */}
                <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center mb-4">
                    <i className="pi pi-chart-line text-green-500 mr-2"></i>
                    <span className="text-green-500 font-semibold">Working Process</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-8">Transparency With Rice Supply Chain</h2>
                    
                    <div className="flex mb-8">
                    <Button label="Farmers" className="p-button-success mr-2" />
                    <Button label="Cooperatives" className="p-button-outlined p-button-success mr-2" />
                    <Button label="Consumers" className="p-button-outlined p-button-success" />
                    </div>
                    
                    <div className="flex">
                    <div className="w-1/3">
                        <img src="/path-to-farmer-image.jpg" alt="Farmer" className="w-full" />
                    </div>
                    <div className="w-2/3 pl-8">
                        <div className="flex items-start mb-8">
                        <div className="bg-blue-100 rounded-lg p-4 mr-4">
                            <span className="text-blue-600 font-bold text-xl">1</span>
                            <h3 className="font-semibold">Plant</h3>
                            <p>Farmers plant and sow rice.</p>
                        </div>
                        <i className="pi pi-arrow-right text-green-500 text-2xl mt-8"></i>
                        <div className="bg-green-100 rounded-lg p-4 mr-4">
                            <span className="text-green-600 font-bold text-xl">2</span>
                            <h3 className="font-semibold">Store</h3>
                            <p>Farmers store rice data on the blockchain.</p>
                        </div>
                        <i className="pi pi-arrow-right text-green-500 text-2xl mt-8"></i>
                        <div className="bg-green-100 rounded-lg p-4">
                            <span className="text-green-600 font-bold text-xl">3</span>
                            <h3 className="font-semibold">Sell</h3>
                            <p>Farmers sell their hard earned rice.</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </section>

                {/* Company Names */}
                <section className="bg-gray-800 text-white py-4">
                <div className="container mx-auto">
                    <div className="flex justify-between">
                    <span>AgriCTRL+</span>
                    <span>AgriCTRL+</span>
                    <span>AgriCTRL+</span>
                    <span>AgriCTRL+</span>
                    </div>
                </div>
                </section>

                {/* Connect with us */}
                <section className="bg-green-500 text-white py-4">
                <div className="container mx-auto text-center">
                    <h3 className="text-xl font-bold mb-4">Connect with us</h3>
                    <div className="flex justify-center space-x-4">
                    <Button icon="pi pi-facebook" className="p-button-rounded p-button-text" />
                    <Button icon="pi pi-envelope" className="p-button-rounded p-button-text" />
                    <Button icon="pi pi-linkedin" className="p-button-rounded p-button-text" />
                    </div>
                </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default LandingPage;