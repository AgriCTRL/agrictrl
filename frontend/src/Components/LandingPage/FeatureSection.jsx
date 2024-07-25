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
                                <p className="text-[#00C261] font-bold">Farmer</p>
                            </div>
                            <div className="h-36 w-32 shadow-lg border rounded-lg flex flex-col items-center justify-center translate-y-20">
                                <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                <p className="text-[#00C261] font-bold">Palay</p>
                            </div>
                            <div className="h-36 w-32 mr-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                <p className="text-[#00C261] font-bold">Price</p>
                            </div>
                            <div className="h-36 w-32 ml-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                <p className="text-[#00C261] font-bold">Delivery</p>
                                <p className="text-[#00C261] font-bold">Bigas</p>
                            </div>
                            <div className="h-36 w-32 border shadow-lg rounded-lg flex flex-col items-center justify-center translate-y-20">
                                <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                <p className="text-[#00C261] font-bold">Track</p>
                                <p className="text-[#00C261] font-bold">Trace</p>
                            </div>
                            <div className="h-36 w-32 mr-10 my-5 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                <p className="text-[#00C261] font-bold">Kanin</p>
                            </div>
                            <div className="h-36 w-32 ml-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                <p className="text-[#00C261] font-bold">Miller</p>
                            </div>
                            <div className="h-36 w-32 border shadow-lg rounded-lg flex flex-col items-center justify-center translate-y-20">
                                <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                <p className="text-[#00C261] font-bold">Dryer</p>
                            </div>
                            <div className="h-36 w-32 mr-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-[#00C261]"/>
                                <p className="text-[#00C261] font-bold">Transparent</p>
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
                        <div className="flex flex-row py-10">
                            {/* <Wheat className="text-[#00C261] h-10 w-10"/> */}
                            <h2 className="text-4xl  text-[#00C261] font-bold">Features of AgriCTRL+</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="flex flex-row">
                                <Sprout className="text-[#00C261] h-12 w-12 mr-8"/>
                                <div className="flex flex-col mt-2">
                                    <h3 className="text-xl font-semibold mb-2">Traceability Power</h3>
                                    <p>Discover where is the source of the rice you consume, the processes it took before the palay become a bigas.</p>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <Microwave className="text-[#00C261] h-12 w-12 mr-8"/>
                                <div className="flex flex-col mt-2">
                                    <h3 className="text-xl font-semibold mb-2">Decentralized Records</h3>
                                    <p>Utilizing ICP Blockchain Backend and Frontend Services, we can securely save and collect data.</p>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <Package className="text-[#00C261] h-12 w-12 mr-8"/>
                                <div className="flex flex-col mt-2">
                                    <h3 className="text-xl font-semibold mb-2">Supply Chain Management</h3>
                                    <p>Manage the entire supply chain of rice through simple to understand user interfaces. </p>
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