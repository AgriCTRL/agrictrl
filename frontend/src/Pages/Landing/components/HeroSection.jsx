import { React } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthClient } from "@dfinity/auth-client";
import { Wheat, Search, Coins, Truck } from 'lucide-react';

const HeroSection = () => {
    const identityUrl = import.meta.env.VITE_INTERNET_IDENTITY_URL;
    const navigate = useNavigate();

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

    return (
        <section 
            className="relative w-screen h-screen flex items-start bg-cover bg-center" 
            style={{ 
                backgroundImage: 'url("/Landing-HeroBg.jpg")', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
            <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dark overlay */}
            
            {/* Flexbox layout instead of container */}
            <div className="w-full h-full flex flex-row items-start mt-[10vh] justify-between px-[5vw]">
                {/* Text Section */}
                <div className="z-50">
                    <p className="mb-2 text-primary font-bold tracking-widest text-[2vw]">REVOLUTIONIZING</p>
                    <h1 className="text-[4vw] md:text-[6xl] text-white font-bold mb-4">Rice Supply Chain</h1>
                    <h1 className="text-[4vw] md:text-[6xl] text-white font-bold mb-4">Transparency</h1>
                    <p className="mb-8 text-[2vw] md:text-[16px] font-normal leading-[1.5] text-left text-white">
                        Empowering farmers, ensuring fair prices, and providing <br />
                        consumers with peace of mind through <br />
                        blockchain-powered traceability.
                    </p>
                    <div className='flex flex-row justify-center'>
                        <button className="bg-primary px-[4vw] py-[2vh] text-white font-bold rounded-lg flex justify-items-center items-center"
                                onClick={loginButton1}>
                            Get Started
                            <Wheat className="h-5 w-5 mx-3"/>
                        </button>
                        <button className="border border-white ml-3 px-[4vw] py-[2vh] text-white font-bold rounded-lg flex justify-items-center items-center"
                                onClick={handleTnTClick}>
                            Start Tracking!
                        </button>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="flex flex-col space-y-[15vh] mr-28">
                    <div className="flex flex-row space-x-[5vw]">
                         {/* Buy button */}
                        <div className="relative w-full lg:w-auto translate-y-14">
                            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg transform translate-x-10 translate-y-7"></div>
                            <div className="relative flex flex-col bg-white/30 backdrop-blur-sm rounded-lg px-[4vw] py-[2vh]">
                                <Coins className="text-white m-1"/>
                                <h1 className="font-semibold mb-2 text-white text-[2vw]">Buy</h1>
                            </div>
                        </div>

                        {/* Find button */}
                        <div className="relative w-full lg:w-auto translate-y-4">
                            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg transform translate-x-10 translate-y-7"></div>
                            <div className="relative flex flex-col bg-white/30 backdrop-blur-sm rounded-lg px-[4vw] py-[2vh]">
                                <Search className="text-white m-1"/>
                                <h1 className="font-semibold mb-2 text-white text-[2vw]">Find</h1>
                            </div>
                        </div>
                    </div>

                    {/* Trace your rice section */}
                    <div className="backdrop-blur-sm w-full px-[5vw] py-3 bg-white/30 rounded-lg relative pb-20 translate-x-20">
                        <div className="flex flex-col">
                            <Truck className="text-white mr-2"/>
                            <h3 className="font-semibold mb-2 text-white text-[2vw]">Trace your rice</h3>
                        </div>
                        
                        <p className="text-sm text-white">Trace the history of your rice.</p>
                        <p className="text-sm text-white">Discover its journey from farm to your plate.</p>
                        <p className="text-sm text-white">Appreciate the people who work to serve you with your food.</p>
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
