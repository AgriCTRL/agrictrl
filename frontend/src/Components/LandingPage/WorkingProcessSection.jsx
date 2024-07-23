import { React, useState } from 'react';
import { Button } from 'primereact/button';
import { Wheat, Coins, Sprout, Database, MoveRight } from 'lucide-react';

const WorkingProcessSection = () => {
    const [selectedButton, setSelectedButton] = useState('Farmers');

    return (
        <section className="bg-white h-screen py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center mb-4">
                        <Wheat className="text-[#00C261]"/>
                        <span className="text-[#00C261] font-semibold">Working Process</span>
                    </div>  
                    <h2 className="text-4xl text-[#444444] font-bold mb-8">Transparency With Rice Supply Chain</h2>
                            
                    {/* Stakeholder Selector */}
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
                            {/* stat 1 */}
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

                            {/* stat 2 */}
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

                            {/* stat 3 */}
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
    );
};

export default WorkingProcessSection;