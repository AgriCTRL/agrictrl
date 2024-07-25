import { React } from 'react';
import { Wheat, Sprout, Microwave} from 'lucide-react';

import StatisticsSection from './StatisticsSection'

const OfferSection = () => {
    return (
        <section id="offerSection" className="bg-[#2A2A2A] h-screen text-white relative">
            <StatisticsSection />      

            {/* Left Side */}
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center -translate-y-14">
                <div className="md:w-1/2 z-10 p-10">
                    <h2 className="text-4xl font-bold">Our</h2>
                    <h2 className="text-5xl font-bold mb-10">Mission</h2>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <Wheat className="text-[#00C261] h-12 w-12 -translate-y-2"/>
                            <div>
                                <h3 className="font-semibold text-green-400">Consumers</h3>
                                <p className="text-gray-300 text-xl">Increase consumer confidence for rice that they purchase.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Sprout className="text-[#00C261] h-12 w-12 -translate-y-2"/>
                            <div>
                                <h3 className="font-semibold text-green-400">Farmers</h3>
                                <p className="text-gray-300 text-xl">Improve fair trade for farmers.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Microwave className="text-[#00C261] h-12 w-12 -translate-y-2"/>
                            <div>
                                <h3 className="font-semibold text-green-400">Regulators</h3>
                                <p className="text-gray-300 text-xl">Help the regulators for data driven decision and policy making.</p>
                            </div>
                        </div>
                        <div className="bg-white h-[1px]"></div>
                    </div>
                    {/* <button className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center">
                        Get Started
                        <Wheat className="text-white h-5 w-5 mx-2"/>
                    </button> */}
                </div>

                {/* Right Side */}
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
    );
};

export default OfferSection;