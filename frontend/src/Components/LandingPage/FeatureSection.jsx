import { React } from 'react';
import { Wheat, Search, Sprout, Microwave, Package } from 'lucide-react';

const FeatureSection = () => {
    return (
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
    );
};

export default FeatureSection;