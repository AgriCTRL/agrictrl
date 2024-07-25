import { React } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Wheat, Search, Coins, Truck } from 'lucide-react';

const HeroSection = () => {
    const navigate = useNavigate();

    const handleHistoryClick = () => {
        navigate('/history');
    }

    return (
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
                        <p className="mb-2 text-primary font-bold tracking-widest">REVOLUTIONIZING</p>
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
                            <button className="border border-white ml-3 px-16 py-3 text-white font-bold rounded-lg flex justify-items-center items-center"
                                    onClick={handleHistoryClick}>
                                Trace your Rice!
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
    );
};

export default HeroSection;