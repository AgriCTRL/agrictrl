import { React, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import AppLayout from '../Layouts/AppLayout';
import { Wheat, Search, Coins, Truck, Sprout, Microwave, Package, Users, UtensilsCrossed, Database, MoveRight, MoveLeft, Mail } from 'lucide-react';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const LandingPage = () => {
    // Offer section
    const [selectedButton, setSelectedButton] = useState('Farmers');

    //testimonials
    const [testimonials] = useState([
    {
        name: 'Aldrin Abenoja',
        role: 'Nursing Assistant',
        image: '/path/to/devon-lane-image.jpg',
        quote: 'Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L.',
        date: '4/4/18'
    },
    {
        name: 'Joerel Belen',
        role: 'Nursing Assistant',
        image: '/path/to/devon-lane-image.jpg',
        quote: 'Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L.',
        date: '4/4/18'
    },
    {
        name: 'Jobert Mampusti',
        role: 'Nursing Assistant',
        image: '/path/to/devon-lane-image.jpg',
        quote: 'Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L.',
        date: '4/4/18'
    },
    {
        name: 'Harvy Pontillas',
        role: 'Nursing Assistant',
        image: '/path/to/devon-lane-image.jpg',
        quote: 'Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L.',
        date: '4/4/18'
    },
    ]);

    const carouselRef = useRef(null);

    return (
        <AppLayout>
            <div className="font-poppins">
                {/* Hero Section */}
                <section 
                    className="relative h-screen flex items-center bg-cover bg-center overflow-hidden" 
                    style={{ 
                        backgroundImage: 'url("/Landing-HeroBg.jpg")', 
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}>
                    <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dark overlay */}
                    <div className="container mx-auto flex flex-col lg:flex-row items-center relative">
                        {/* Text Section */}
                        <div className="text-center ml-20 lg:text-left lg:w-1/2 mt-[-8rem] relative z-50">
                        <p className="mb-2 text-custom-green font-bold tracking-widest">REVOLUTIONIZING</p>
                        <h1 className="text-6xl text-white font-bold mb-4">Rice Supply Chain</h1>
                        <h1 className="text-6xl text-white font-bold mb-4">Transparency</h1>
                        <p className="mb-8 text-[19px] font-normal leading-[30px] text-left text-white">
                            Empowering farmers, ensuring fair prices, and providing consumers with
                            peace of mind through blockchain-powered traceability.
                        </p>
                        <div className='flex flex-row'>
                            <button className="bg-[#00C261] px-10 text-white font-bold rounded-lg flex justify-items-center items-center">
                            Get Started
                            <Wheat className="h-5 w-5 mx-3"/>
                            </button>
                            <button className="border border-white ml-3 px-16 py-3 text-white font-bold rounded-lg flex justify-items-center items-center">
                            Read More
                            </button>
                        </div>
                        </div>
                        {/* Buttons Section */}
                        <div className="mt-8 lg:mt-0 lg:w-1/2 flex flex-col items-center lg:items-start space-y-5 relative z-30">
                        {/* Buy button */}
                        <div className="relative w-full lg:w-auto translate-x-72 translate-y-24">
                            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg transform translate-x-10 translate-y-7"></div>
                            <div className="relative flex flex-col bg-white/30 backdrop-blur-sm rounded-lg px-16 py-10">
                            <Coins className="text-white m-1"/>
                            <Button className="p-button-text w-full lg:w-auto text-white" label="Buy"/>
                            </div>
                        </div>

                        {/* Find button */}
                        <div className="relative w-full lg:w-auto -translate-x-5 translate-y-20 z-30">
                            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg transform -translate-x-10 translate-y-7"></div>
                            <div className="relative flex flex-col bg-white/30 backdrop-blur-sm rounded-lg px-16 py-10">
                            <Search className="text-white m-1"/>
                            <Button className="p-button-text w-full lg:w-auto text-white" label="Find"/>
                            </div>
                        </div>

                        {/* Trace your rice section */}
                        <div className="backdrop-blur-sm ml-40 mr-40 px-10 py-3 pb-20 bg-white/30 rounded-lg w-full lg:w-auto -translate-x-8 relative z-10">
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
                        className="absolute bottom-0 -mb-1 left-0 w-full h-auto z-30"
                    />
                </section>

                {/* Features Section */}
                <section className="relative bg-white h-screen pt-5 z-0">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-2 grid-rows-1 gap-8 justify-center">
                            {/* Left side: Search Buttons */}
                            <div className="relative">
                                <div className="grid grid-cols-3 justify-items-center ">
                                    <div 
                                        className="absolute inset-0 z-10 pointer-events-none" 
                                        style={{ 
                                        height: '250px',
                                        background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)'
                                        }}
                                    >
                                    </div>
                                    <div className="h-36 w-32 ml-10 my-2 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                        <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                        <p className="text-[#00C261] font-bold">Sales Receipt</p>
                                    </div>
                                    <div className="h-36 w-32 shadow-lg border rounded-lg flex flex-col items-center justify-center translate-y-20">
                                        <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                        <p className="text-[#00C261] font-bold">Credit Memo</p>
                                    </div>
                                    <div className="h-36 w-32 mr-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                        <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                        <p className="text-[#00C261] font-bold">Time Activity</p>
                                    </div>
                                    <div className="h-36 w-32 ml-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                        <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                        <p className="text-[#00C261] font-bold">Delayed</p>
                                        <p className="text-[#00C261] font-bold">Charge</p>
                                    </div>
                                    <div className="h-36 w-32 border shadow-lg rounded-lg flex flex-col items-center justify-center translate-y-20">
                                        <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                        <p className="text-[#00C261] font-bold">Delayed</p>
                                        <p className="text-[#00C261] font-bold">Charge</p>
                                    </div>
                                    <div className="h-36 w-32 mr-10 my-5 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                        <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                        <p className="text-[#00C261] font-bold">Statement</p>
                                    </div>
                                    <div className="h-36 w-32 ml-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                        <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                        <p className="text-[#00C261] font-bold">Invoice</p>
                                    </div>
                                    <div className="h-36 w-32 border shadow-lg rounded-lg flex flex-col items-center justify-center translate-y-20">
                                        <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                        <p className="text-[#00C261] font-bold">Payment</p>
                                    </div>
                                    <div className="h-36 w-32 mr-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                        <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                        <p className="text-[#00C261] font-bold">Estimate</p>
                                    </div>
                                    <div 
                                        className="absolute inset-0 z-10 pointer-events-none translate-y-80" 
                                        style={{ 
                                        height: '59%',
                                        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)'
                                        }}
                                    >
                                    </div>
                                </div>
                            </div>

                            {/* Right side: Features Section */}
                            <div>
                                <div className="flex flex-row pt-10">
                                    <Wheat className="text-[#00C261] h-5 w-5"/>
                                    <p className="text-s text-[#00C261] mb-2 px-2">Features</p>
                                </div>
                                <h2 className="text-4xl text-[#444444] font-bold">Know Where You're Getting</h2>
                                <h2 className="text-4xl text-[#444444] font-bold mb-8 ">Your Rice</h2>
                                <div className="space-y-8">
                                <div className="flex flex-row">
                                    <Sprout className="text-[#00C261] h-12 w-12 mr-8"/>
                                    <div className="flex flex-col mt-2">
                                        <h3 className="text-xl font-semibold mb-2">Preview Dialer</h3>
                                        <p>The world's largest e-store, has returned more than 79% from Oct 28, 2019, to Oct 28, 2020, and more</p>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <Microwave className="text-[#00C261] h-12 w-12 mr-8"/>
                                    <div className="flex flex-col mt-2">
                                        <h3 className="text-xl font-semibold mb-2">Text-to-speech</h3>
                                        <p>The sole product manufacturer of the group, has returned more than 82% over from Oct 28, 2019, to Oct</p>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <Package className="text-[#00C261] h-12 w-12 mr-8"/>
                                    <div className="flex flex-col mt-2">
                                        <h3 className="text-xl font-semibold mb-2">Omnichannel</h3>
                                        <p>The social media maestro, owner of Instagram, WhatsApp, and its namesake website. It has returned mo</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Offer Section */}
                <section className="bg-[#2A2A2A] h-screen text-white relative">
                    {/* Statistics */}
                    <section className="bg-gradient-to-r from-[#005155] to-[#00C261] 
                                        rounded-lg h-44 mx-28 z-30 px-10 flex flex-row items-center 
                                        justify-between align-middle text-white -translate-y-20">
                        <div className="flex flex-row items-center rounded-lg p-10 relative">
                            <div className="absolute inset-0 bg-white opacity-20 rounded-lg"></div>
                            <div className="relative z-10 flex flex-row items-center">
                                <Wheat className="text-white h-14 w-14 mx-2"/>
                                <div className="flex flex-col justify-start">
                                    <div className="text-2xl font-bold">0</div>
                                    <div className="text-sm">Rice</div>
                                    <div className="text-sm">Tracked</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center p-10">
                            <UtensilsCrossed className="text-white h-14 w-14 mx-2"/>
                            <div className="flex flex-col justify-start">
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-sm">Farmers</div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center p-10">
                            <Coins className="text-white h-14 w-14 mx-2"/>
                            <div className="flex flex-col justify-start">
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-sm">Rice</div>
                                <div className="text-sm">Sellers</div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center p-10">
                            <Users className="text-white h-14 w-14 mx-2"/>
                            <div className="flex flex-col justify-start">
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-sm">Customers</div>
                            </div>
                        </div>
                    </section>

                    {/* Process Section */}
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center -translate-y-14">
                        <div className="md:w-1/2 z-10 p-10">
                        <div className="flex flex-row pb-10">
                            <Wheat className="text-[#00C261] h-6 w-6"/>
                            <div className="text-[#00C261] text-md px-6 tracking-widest">What We offer</div>
                        </div>
                        <h2 className="text-4xl font-bold">Transparency With Rice</h2>
                        <h2 className="text-4xl font-bold mb-6">Supply Chain</h2>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <Sprout className="text-[#00C261] h-12 w-12 -translate-y-2"/>
                                <div>
                                    <h3 className="font-semibold text-green-400">Preview Dialer</h3>
                                    <p className="text-gray-300">The world's largest e-store, has returned more than 79% from Oct 28, 2018, to Oct 28, 2020, and more</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <Microwave className="text-[#00C261] h-12 w-12 -translate-y-2"/>
                                <div>
                                    <h3 className="font-semibold text-green-400">Text-to-speech</h3>
                                    <p className="text-gray-300">The sole product manufacturer of the group, has returned more than 82% over from Oct 28, 2018, to Oc</p>
                                </div>
                            </div>
                            <div className="bg-white h-[1px]"></div>
                        </div>
                        <button className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center">
                            Get Started
                            <Wheat className="text-white h-5 w-5 mx-2"/>
                        </button>
                        </div>
                        <div className="md:w-1/2 relative mt-8 md:mt-0">
                            {/* Farmer 1 */}
                            <div className="h-32 w-32 relative translate-x-5 translate-y-10 z-50">
                                <div className="absolute rounded-xl inset-[2px] bg-gradient-to-t opacity-70 from-black to-transparent z-30"></div>
                                <div className="absolute rounded-xl inset-[2px] z-20 flex justify-center items-center">
                                    <img src="Landing-Offer-Farmer1.png" alt="Centered" className="h-full rounded-xl object-cover" />
                                </div>
                                <div className="absolute rounded-xl inset-0 bg-gradient-to-t from-[#00C261] to-black/5 z-10"></div>
                            </div>
                            {/* Farmer 2 */}
                            <div className="h-64 w-96 relative translate-x-32 -translate-y-10">
                                <div className="absolute rounded-xl inset-[2px] bg-gradient-to-t opacity-70 from-black to-transparent z-30"></div>
                                <div className="absolute rounded-xl inset-[2px] z-20 flex justify-center items-center">
                                    <img src="Landing-Offer-Farmer2.png" alt="Centered" className="h-full w-full rounded-xl object-cover" />
                                </div>
                                <div className="absolute rounded-xl inset-0 bg-gradient-to-t from-[#00C261] to-black/5 z-10"></div>
                            </div>
                            {/* Farmer 3 */}
                            <div className="h-40 w-56 relative -translate-y-20">
                                <div className="absolute rounded-xl inset-[2px] bg-gradient-to-t opacity-70 from-black to-transparent z-30"></div>
                                <div className="absolute rounded-xl inset-[2px] z-20 flex justify-center items-center">
                                    <img src="Landing-Offer-Farmer3.png" alt="Centered" className="h-full w-full rounded-xl object-cover" />
                                </div>
                                <div className="absolute rounded-xl inset-0 bg-gradient-to-t from-[#00C261] to-black/5 z-10"></div>
                            </div>
                        </div>
                    </div>
                    <img src="Landing-OfferSection.png" alt="process-section" className="w-full object-cover -translate-y-20" />
                </section>

                {/* Working Process */}
                <section className="bg-white h-screen py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex items-center mb-4">
                                <Wheat className="text-[#00C261]"/>
                                <span className="text-[#00C261] font-semibold">Working Process</span>
                            </div>  
                            <h2 className="text-4xl text-[#444444] font-bold mb-8">Transparency With Rice Supply Chain</h2>
                            
                            <div className="flex bg-[#F5F5F5] p-3 mb-8 rounded-lg z-50">
                                {['Farmers', 'Cooperatives', 'Consumers'].map((label) => (
                                    <Button 
                                    key={label}
                                    label={label} 
                                    className={`mr-2 ${
                                        selectedButton === label
                                        ? 'px-8 py-3 tracking-widest bg-gradient-to-r from-[#005155] to-[#00C261] text-white rounded-lg'
                                        : 'px-14 py-3 tracking-widest'
                                    }`}
                                    onClick={() => setSelectedButton(label)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex">
                            {/* Image */}
                            <div className="w-5/3 h-[800px] -translate-y-64">
                                <img src="Landing-Process-farmer.png" alt="Farmer with conical hat" className="z-0 h-full w-full object-cover" />
                            </div>

                            {/* Stats */}
                            <div className="w-2/3 pl-8">
                                <div className="flex items-start">
                                    <div className="flex-1 mr-4">
                                        <div className="rounded-lg flex flex-col justify-center items-center p-4 mb-4">
                                            <div className="relative mb-2 z-50">
                                                <Sprout className="absolute text-[#00C261] h-10 w-10" />
                                                <MoveRight className="text-[#00C261] h-10 w-10  translate-x-24 translate-y-28"/>
                                            </div>  
                                            <div className="shadow-2xl bg-white rounded-lg pl-5 pr-12 pt-3 pb-7 z-40">
                                                <div className="flex items-center">
                                                    <div className="">
                                                        <div className="text-[#00C261] text-4xl font-bold">1</div>
                                                        <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                                    </div>
                                                    <h3 className="text-[#00C261] tracking-wider font-semibold">Plant</h3>
                                                </div>
                                                <div className="mb-5">
                                                    <p className="text-sm">Farmers plant</p>
                                                    <p className="text-sm">and sow rice.</p>
                                                </div>
                                            </div>
                                            <div className="h-20 w-20 z-0 bg-[#00C261] rounded-lg -translate-x-14 -translate-y-14"></div>
                                        </div>
                                    </div>

                                    <div className="flex-1 mr-4">
                                        <div className="rounded-lg flex flex-col justify-center items-center p-4 mb-4 translate-y-14 -translate-x-6">
                                            <div className="relative mb-2 z-50">
                                                <Database className="absolute text-[#00C261] h-10 w-10" />
                                                <MoveRight className="text-[#00C261] h-10 w-10  translate-x-24 translate-y-24"/>
                                            </div> 
                                            <div className="shadow-2xl bg-white rounded-lg pl-5 pr-10 pt-3 pb-5 z-50">
                                                <div className="flex items-center">
                                                    <div className="">
                                                        <div className="text-[#00C261] text-4xl font-bold">2</div>
                                                        <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                                    </div>
                                                    <h3 className="text-[#00C261] tracking-wider font-semibold">Store</h3>
                                                </div>
                                                <div className="mb-5">
                                                    <p className="text-sm">Farmers store</p>
                                                    <p className="text-sm">rice data on the</p>
                                                    <p className="text-sm">blockchain</p>
                                                </div>
                                            </div>
                                            <div className="h-20 w-20 z-0 bg-[#00C261] rounded-lg -translate-x-14 -translate-y-14"></div>
                                        </div>
                                    </div>

                                    <div className="flex-1 mr-4">
                                        <div className="rounded-lg flex flex-col justify-center items-center p-4 mb-4 translate-y-24 -translate-x-12">
                                            <Coins className="text-[#00C261] h-10 w-10 mb-2" />
                                            <div className="shadow-2xl bg-white rounded-lg pl-5 pr-14 pt-3 pb-5 z-50">
                                                <div className="flex items-center">
                                                    <div className="">
                                                        <div className="text-[#00C261] text-4xl font-bold">3</div>
                                                        <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                                    </div>
                                                    <h3 className="text-[#00C261] tracking-wider font-semibold">Sell</h3>
                                                </div>
                                                <div className="mb-5">
                                                    <p className="text-sm">Farmers sell</p>
                                                    <p className="text-sm">their hard</p>
                                                    <p className="text-sm">earned rice.</p>
                                                </div>
                                            </div>
                                            <div className="h-20 w-20 z-0 bg-[#00C261] rounded-lg -translate-x-14 -translate-y-14"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>   

                {/* Company Names */}
                <section className="bg-[#2A2A2A] text-white py-4 z-30 relative overflow-hidden">
                    <div className="container mx-auto items-center relative">
                        {/* Left gradient */}
                        <div className="absolute left-0 top-0 bottom-0 w-[50%] bg-gradient-to-r from-[#2A2A2A] to-transparent z-20"></div>
                        
                        {/* Right gradient */}
                        <div className="absolute right-0 top-0 bottom-0 w-[50%] bg-gradient-to-l from-[#2A2A2A] to-transparent z-20"></div>
                        
                        <div className="flex justify-between items-center relative z-10">
                        <span className="p-10 text-4xl">AgriCTRL+</span>
                        <div className="bg-white w-[2px] h-[90px]"></div>
                        <span className="p-10 text-4xl">AgriCTRL+</span>
                        <div className="bg-white w-[2px] h-[90px]"></div>
                        <span className="p-10 text-4xl">AgriCTRL+</span>
                        <div className="bg-white w-[2px] h-[90px]"></div>
                        <span className="p-10 text-4xl">AgriCTRL+</span>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="bg-white pt-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex items-center mb-8">
                                <Wheat className="text-[#00C261] h-5 w-5" />
                                <span className="text-[#00C261] font-semibold ml-2">Testimonials</span>
                            </div>
                            <h2 className="text-4xl text-[#444444] font-bold mb-12">What They Say About Us</h2>
                        </div>
                        

                        <div className="relative">
                            <Carousel
                                value={testimonials}
                                numVisible={1}
                                numScroll={1}
                                circular
                                showNavigators={true}
                                showIndicators={true}
                                className="z-50"
                                ref={carouselRef}
                                prevIcon={<MoveLeft className="h-6 w-6 text-[#00C261]" />}
                                nextIcon={<MoveRight className="h-6 w-6 text-[#00C261]" />}
                                itemTemplate={(item) => (
                                    <div className="bg-white rounded-lg shadow-lg p-8 my-5 mx-28">
                                        <div className="flex items-center mb-4">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full mr-4" />
                                            <div>
                                                <h3 className="font-bold text-lg">{item.name}</h3>
                                                <p className="text-gray-600">{item.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-800 mb-4">"{item.quote}"</p>
                                        <p className="text-gray-500 text-sm">{item.date}</p>
                                    </div>
                                )}
                                
                            />
                        </div>
                    </div>

                    {/* Connect with us */}
                    <section className="bg-[#00C261] text-white py-5 rounded-lg mx-28 translate-y-14">
                        <div className="container mx-auto text-center">
                            <h3 className="text-4xl font-bold mb-4">Connect with us</h3>
                            <div className="flex justify-center space-x-4">
                                <Button>
                                    <Mail className="text-white h-9 w-9"/>
                                </Button>
                            </div>
                        </div>
                    </section>
                </section>

                
            </div>
        </AppLayout>
    );
};

export default LandingPage;