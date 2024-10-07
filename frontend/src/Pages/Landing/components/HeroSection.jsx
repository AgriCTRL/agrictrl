import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthClient } from "@dfinity/auth-client";
import { Button } from 'primereact/button';
import { Wheat, Search, Coins, Truck } from 'lucide-react';
import SimpleParallax from "simple-parallax-js";

const HeroSection = () => {
    const identityUrl = import.meta.env.VITE_INTERNET_IDENTITY_URL;
    const navigate = useNavigate();
    const [overlayOpacity, setOverlayOpacity] = useState(false);
    const [scale, setScale] = useState(1);

    const handleTnTClick = () => {
        navigate('/TnT');
    }

    const loginButton1 = async () => {   
        navigate('/login');
    }

    const loginButton = async () => {   
        try {
            const authClient = await AuthClient.create();

            const width = 500;
        const height = 500;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2) - 25;

            await new Promise((resolve, reject) => {
                authClient.login({
                    identityProvider: `${identityUrl}/`,
                    onSuccess: resolve,
                    onError: reject,
                    windowOpenerFeatures: `width=${width},height=${height},left=${left},top=${top}`
                });
            });
            window.location.reload();
        }
        catch (error) {
            console.log(error.message);
        }
        return false;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setOverlayOpacity(true);
            setScale(1.5);
        }, 500);
    
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative h-screen w-screen overflow-hidden flex pt-16 lg:pt-24">
            <SimpleParallax scale={scale}>
                <img src={"/Landing-HeroBg.jpg"} alt={"image"} className="absolute inset-0 object-cover h-full" />
            </SimpleParallax>

            <div className={`absolute inset-0 bg-[#000000] ${ overlayOpacity ? 'opacity-30' : 'opacity-0'} transition-opacity duration-800`}> </div>
                
            <div className="min-w-full container flex flex-col gap-6 lg:flex-row relative px-6 sm:px-12 lg:px-24 h-full">
                {/* Right Section */}
                <section className="w-full lg:w-1/2 flex flex-col gap-4 md:gap-6 pt-6 lg:pt-16 text-center lg:text-left relative">
                    <p className="text-primary font-semibold tracking-widest">REVOLUTIONIZING</p>
                    <div className="head">
                        <h1 className="text-5xl md:text-6xl text-white font-bold">Rice Supply Chain</h1>
                        <h1 className="text-5xl md:text-6xl text-white font-bold">Transparency</h1>
                    </div>
                    <p className="font-normal text-left text-white">
                        Empowering farmers, ensuring fair prices, and providing transparency to consumers
                        with peace of mind through blockchain-powered traceability.
                    </p>
                    <div className='flex justify-center lg:justify-start gap-4 z-40'>
                        <Button 
                            className="flex flex-center items-center gap-4 bg-primary hover:bg-primaryHover px-6 sm:px-12 border-0"
                            onClick={ loginButton1 }
                        >
                            <p className="font-semibold">Get Started</p>
                            <Wheat size={20}/>
                        </Button>

                        <Button 
                            className="font-medium px-6 sm:px-12 text-white"
                            onClick={ handleTnTClick }
                            outlined
                        >
                            <p className="font-bold">Start Tracking!</p>
                        </Button>
                    </div>
                </section>

                {/* Left Section */}
                <section className="md:relative w-full lg:w-1/2 flex flex-row lg:flex-col gap-6 lg:gap-10 items-center lg:items-end lg:justify-end lg:h-full">
                    <div className="w-1/3 sm:w-auto absolute bottom-0 left-12 sm:left-auto z-40 sm:relative lg:bg-white/20 lg:backdrop-blur-sm rounded-lg sm:shadow-2xl mb-8 sm:mb-0">
                        <div className="flex self-end flex-col items-center gap-3 bg-white/20 backdrop-blur-sm text-white rounded-lg px-10 py-6 md:px-20 md:py-12 lg:-translate-x-8 lg:-translate-y-10 shadow-xl sm:shadow-2xl">
                            <Coins size={32} />
                            <p className='font-semibold'>Buy</p>
                        </div>
                    </div>
                    
                    <div className="relative backdrop-blur-sm p-8 pb-20 lg:mr-10 flex flex-col gap-4 bg-white/20 rounded-lg lg:w-7/12 h-screen sm:h-auto lg:h-1/2 shadow-2xl">
                        <div className="flex gap-4 items-center">
                            <Truck className="text-white"/>
                            <h3 className="font-semibold text-white">Trace your rice</h3>
                        </div>
                            
                        <p className="text-white">
                            Trace the history of your rice. Discover its journey from farm to your plate. 
                            Appreciate the people who work to serve you with your food.
                        </p>
                    </div>

                    <div className="w-1/3 sm:w-auto absolute bottom-0 right-12 sm:bottom-auto sm:right-auto z-40 sm:relative lg:absolute lg:self-start lg:bg-white/20 lg:backdrop-blur-sm rounded-lg lg:top-60 sm:shadow-2xl mb-8 sm:mb-0">
                        <div className="flex flex-col items-center gap-3 bg-white/20 backdrop-blur-sm text-white rounded-lg px-10 py-6 md:px-20 md:py-12 lg:translate-x-8 lg:-translate-y-10 shadow-xl sm:shadow-2xl">
                            <Search size={32} />
                            <p className='font-semibold'>Find</p>
                        </div>
                    </div>
                </section>
            </div>
            
            <img
                src="/Landing-HeroSection.png"
                alt="Decorative"
                className="absolute bottom-0 left-0 w-full h-auto z-30"
            />
        </section>
    );
};

export default HeroSection;