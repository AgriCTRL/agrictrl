import { React, useState } from 'react';
import { Button } from 'primereact/button';
import {  ScanSearch , Link, ShoppingBasket, ShieldPlus, HandCoins } from 'lucide-react';

const WorkingProcessSection = () => {
    const [selectedButton, setSelectedButton] = useState('Farmers');

    return (
        <section className="bg-white h-screen py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center mb-4"></div>  
                    <h2 className="text-4xl text-[#444444] font-bold mb-8">Project Roadmap</h2>
                            
                    {/* Stakeholder Selector */}
                    {/* <div className="flex bg-[#F5F5F5] p-3 mb-8 rounded-lg z-50">
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
                    </div> */}
                </div>

                <div className="flex">
                    {/* Image */}
                    <div className="w-5/3 h-[800px] -translate-y-32 z-10">
                        <img src="Landing-Process-farmer.png" alt="Farmer with conical hat" className="z-0 h-full w-full object-cover" />
                    </div>

                    {/* Stats */}
                    <div className="w-2/3 pl-20 z-30">
                        <div className="flex flex-col items-start h-full bg-cover bg-center" 
                            style={{ 
                                backgroundImage: 'url("/Landing-RoadmapBG.png")', 
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                        }}>
                            <div className='flex flex-row'>
                                {/* Feature 1 */}
                                <div className='z-30 flex flex-col items-center'>
                                    <div className="relative mb-2 z-50">
                                        <ScanSearch  className="text-[#00C261] h-9 w-9" />
                                    </div>  
                                    <div className="h-36 w-36 flex flex-col items-center justify-center p-2 shadow-2xl bg-white border rounded-lg z-40">
                                        <div className="flex items-center">
                                            <div className="mr-2">
                                                <div className="text-[#00C261] text-2xl ml-2 font-bold">1</div>
                                                <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <h3 className="text-[#00C261] text-lg tracking-wider font-semibold">Agrictrl+</h3>
                                                <h3 className="text-[#00C261] text-lg tracking-wider font-semibold">TnT</h3>
                                            </div>
                                        </div>
                                        <div className="mb-5 flex flex-col items-center pt-2">
                                            <p className="text-md">3rd Quarter</p>
                                            <p className="text-md">2024</p>
                                        </div>
                                    </div>
                                    <div className="h-16 w-16 z-0 bg-[#00C261] rounded-lg -translate-x-14 -translate-y-10"></div>
                                </div>

                                {/* Feature 2 */}
                                <div className='z-30 flex flex-col items-center translate-x-16 translate-y-10'>
                                    <div className="relative mb-2 z-50">
                                        <Link className="text-[#00C261] h-9 w-9" />
                                    </div>  
                                    <div className="h-36 w-36 flex flex-col items-center justify-center p-2 shadow-2xl bg-white border rounded-lg z-40">
                                        <div className="flex items-center">
                                            <div className="mr-2">
                                                <div className="text-[#00C261] text-2xl ml-1 font-bold">2</div>
                                                <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <h3 className="text-[#00C261] text-lg tracking-wider font-semibold">Agrictrl+</h3>
                                                <h3 className="text-[#00C261] text-lg tracking-wider font-semibold">SMS</h3>
                                            </div>
                                        </div>
                                        <div className="mb-5 flex flex-col items-center pt-2">
                                            <p className="text-md">3rd Quarter</p>
                                            <p className="text-md">2024</p>
                                        </div>
                                    </div>
                                    <div className="h-16 w-16 z-0 bg-[#00C261] rounded-lg -translate-x-14 -translate-y-10"></div>
                                </div>

                                {/* Feature 3 */}
                                <div className='z-30 flex flex-col items-center translate-x-28 translate-y-20'>
                                    <div className="relative mb-2 z-50">
                                        <ShoppingBasket className="text-[#00C261] h-9 w-9" />
                                    </div>  
                                    <div className="h-36 w-36 flex flex-col items-center justify-center p-2 shadow-2xl bg-white border rounded-lg z-40">
                                        <div className="flex items-center">
                                            <div className="mr-2">
                                                <div className="text-[#00C261] text-2xl ml-1 font-bold">3</div>
                                                <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <h3 className="text-[#00C261] text-lg tracking-wider font-semibold">Agrictrl+</h3>
                                                <h3 className="text-[#00C261] text-sm tracking-wider font-semibold">eCommerce</h3>
                                            </div>
                                        </div>
                                        <div className="mb-5 flex flex-col items-center pt-2">
                                            <p className="text-md">4th Quarter</p>
                                            <p className="text-md">2024</p>
                                        </div>
                                    </div>
                                    <div className="h-16 w-16 z-0 bg-[#00C261] rounded-lg -translate-x-14 -translate-y-10"></div>
                                </div>
                            </div>

                            <div className='flex flex-row'>
                                {/* Feature 5 */}
                                <div className='z-30 flex flex-col items-center translate-x-10 translate-y-14'>
                                    <div className="relative mb-2 z-50">
                                        <HandCoins className="text-[#00C261] h-9 w-9" />
                                    </div>  
                                    <div className="h-36 w-36 flex flex-col items-center justify-center p-2 shadow-2xl bg-white border rounded-lg z-40">
                                        <div className="flex items-center">
                                            <div className="mr-2">
                                                <div className="text-[#00C261] text-2xl ml-1 font-bold">5</div>
                                                <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <h3 className="text-[#00C261] text-lg tracking-wider font-semibold">Agrictrl+</h3>
                                                <h3 className="text-[#00C261] text-lg tracking-wider font-semibold">Finance</h3>
                                            </div>
                                        </div>
                                        <div className="mb-5 flex flex-col items-center pt-2">
                                            <p className="text-md">2nd Quarter</p>
                                            <p className="text-md">2025</p>
                                        </div>
                                    </div>
                                    <div className="h-16 w-16 z-0 bg-[#00C261] rounded-lg -translate-x-14 -translate-y-10"></div>
                                </div>

                                {/* Feature 4 */}
                                <div className='z-30 flex flex-col items-center translate-x-24'>
                                    <div className="relative mb-2 z-50">
                                        <ShieldPlus className="text-[#00C261] h-9 w-9" />
                                    </div>  
                                    <div className="h-36 w-36 flex flex-col items-center justify-center p-2 shadow-2xl bg-white border rounded-lg z-40">
                                        <div className="flex items-center">
                                            <div className="mr-2">
                                                <div className="text-[#00C261] text-2xl ml-1 font-bold">4</div>
                                                <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <h3 className="text-[#00C261] text-lg tracking-wider font-semibold">Agrictrl+</h3>
                                                <h3 className="text-[#00C261] text-lg tracking-wider font-semibold">MIC</h3>
                                            </div>
                                        </div>
                                        <div className="mb-5 flex flex-col items-center pt-2">
                                            <p className="text-md">1st Quarter</p>
                                            <p className="text-md">2025</p>
                                        </div>
                                    </div>
                                    <div className="h-16 w-16 z-0 bg-[#00C261] rounded-lg -translate-x-14 -translate-y-10"></div>
                                </div>

                                
                            </div>
                            {/* stat 1 */}
                            {/* <div className="flex-1 bg-black">
                                <div className="rounded-lg flex flex-col justify-center items-center mb-4">
                                    <div className="relative mb-2 z-50">
                                        <Sprout className="absolute text-[#00C261] h-10 w-10" />
                                    </div>  
                                    <div className="shadow-2xl bg-white rounded-lg pl-5 pr-10 pt-3 pb-7 z-40">
                                        <div className="flex items-center">
                                            <div className="">
                                                <div className="text-[#00C261] text-4xl font-bold">1</div>
                                                <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                            </div>
                                            <h3 className="text-[#00C261] tracking-wider font-semibold">Track 'n Trace</h3>
                                        </div>
                                        <div className="mb-5">
                                            <p className="text-md">3rd Quarter</p>
                                            <p className="text-md">2024</p>
                                        </div>
                                    </div>
                                    <div className="h-20 w-20 z-0 bg-[#00C261] rounded-lg -translate-x-16 -translate-y-14"></div>
                                </div>
                            </div> */}

                            {/* stat 2 */}
                            {/* <div className="flex-1 mr-4">
                                <div className="rounded-lg flex flex-col justify-center items-center p-4 mb-4 translate-y-14 -translate-x-2">
                                    <div className="relative mb-2 z-50">
                                        <Database className="absolute text-[#00C261] h-10 w-10" />
                                        <MoveRight className="text-[#00C261] h-10 w-10 translate-x-28 translate-y-24"/>
                                    </div> 
                                    <div className="shadow-2xl bg-white rounded-lg pl-5 pr-8 pt-3 pb-5 z-50">
                                        <div className="flex items-center">
                                            <div className="">
                                                <div className="text-[#00C261] text-4xl font-bold">2</div>
                                                <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                            </div>
                                            <div className="text-[#00C261] text-sm tracking-wide font-semibold">E-commerce</div>
                                        </div>
                                        <div className="mb-5">
                                            <p className="text-sm">Integrating</p>
                                            <p className="text-sm">the e-commerce </p>
                                            <p className="text-sm">platform for farmers.</p>
                                        </div>
                                    </div>
                                    <div className="h-20 w-20 z-0 bg-[#00C261] rounded-lg -translate-x-16 -translate-y-14"></div>
                                </div>
                            </div> */}

                            {/* stat 3 */}
                            {/* <div className="flex-1 mr-4">
                                <div className="rounded-lg flex flex-col justify-center items-center p-4 mb-4 translate-y-24 -translate-x-4">
                                    <Coins className="text-[#00C261] h-10 w-10 mb-2" />
                                    <div className="shadow-2xl bg-white rounded-lg pl-5 pr-10 pt-3 pb-5 z-50">
                                        <div className="flex items-center">
                                            <div className="">
                                                <div className="text-[#00C261] text-4xl font-bold">3</div>
                                                <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                            </div>
                                            <h3 className="text-[#00C261] tracking-wider font-semibold">Insurance</h3>
                                        </div>
                                        <div className="mb-5">
                                            <p className="text-sm">Develop smart</p>
                                            <p className="text-sm"> contract-based</p>
                                            <p className="text-sm">insurance.</p>
                                        </div>
                                    </div>
                                    <div className="h-20 w-20 z-0 bg-[#00C261] rounded-lg -translate-x-16 -translate-y-14"></div>
                                </div>
                            </div> */}

                            {/* stat 4 */}
                            {/* <div className="flex-1 mr-4">
                                <div className="rounded-lg flex flex-col justify-center items-center p-4 mb-4">
                                    <div className="relative mb-2 z-50">
                                        <Sprout className="absolute text-[#00C261] h-10 w-10" />
                                        <MoveRight className="text-[#00C261] h-10 w-10  translate-x-28 translate-y-28"/>
                                    </div>  
                                    <div className="shadow-2xl bg-white rounded-lg pl-5 pr-10 pt-3 pb-7 z-40">
                                        <div className="flex items-center">
                                            <div className="">
                                                <div className="text-[#00C261] text-4xl font-bold">1</div>
                                                <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                            </div>
                                            <h3 className="text-[#00C261] tracking-wider font-semibold">Track 'n Trace</h3>
                                        </div>
                                        <div className="mb-5">
                                            <p className="text-sm">Building of</p>
                                            <p className="text-sm">tracing platform</p>
                                            <p className="text-sm">for consumers.</p>
                                        </div>
                                    </div>
                                    <div className="h-20 w-20 z-0 bg-[#00C261] rounded-lg -translate-x-16 -translate-y-14"></div>
                                </div>
                            </div> */}

                            {/* stat 5 */}
                            {/* <div className="flex-1 mr-4">
                                <div className="rounded-lg flex flex-col justify-center items-center p-4 mb-4">
                                    <div className="relative mb-2 z-50">
                                        <Sprout className="absolute text-[#00C261] h-10 w-10" />
                                        <MoveRight className="text-[#00C261] h-10 w-10  translate-x-28 translate-y-28"/>
                                    </div>  
                                    <div className="shadow-2xl bg-white rounded-lg pl-5 pr-10 pt-3 pb-7 z-40">
                                        <div className="flex items-center">
                                            <div className="">
                                                <div className="text-[#00C261] text-4xl font-bold">1</div>
                                                <div className="bg-[#00C261] w-6 h-[2px]"></div>
                                            </div>
                                            <h3 className="text-[#00C261] tracking-wider font-semibold">Track 'n Trace</h3>
                                        </div>
                                        <div className="mb-5">
                                            <p className="text-sm">Building of</p>
                                            <p className="text-sm">tracing platform</p>
                                            <p className="text-sm">for consumers.</p>
                                        </div>
                                    </div>
                                    <div className="h-20 w-20 z-0 bg-[#00C261] rounded-lg -translate-x-16 -translate-y-14"></div>
                                </div>
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>
        </section>  
    );
};

export default WorkingProcessSection;