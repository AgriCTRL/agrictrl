import { React } from 'react';
import { Wheat, Coins, Users, UtensilsCrossed, CookingPot} from 'lucide-react';

const StatisticsSection = () => {
    return (
        <section className="absolute top-0 left-0 right-0 w-screen z-30 px-6 sm:px-12 lg:px-24
                            -translate-y-2/4 overflow-hidden">
            <div className="container bg-gradient-to-r from-secondary to-primary
                            flex gap-4 items-center rounded-lg shadow-2xl p-4 min-w-full
                            justify-between align-middle text-white">
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Wheat size={32} className='hidden md:flex' />
                    <Wheat className='flex md:hidden' />
                    <div className="flex flex-col justify-start">
                        <div className="text-2xl md:text-4xl font-bold">0</div>
                        <div>Rice Tracked</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <UtensilsCrossed size={32} className='hidden md:flex' />
                    <UtensilsCrossed className='flex md:hidden' />
                    <div className="flex flex-col justify-start">
                        <div className="text-2xl md:text-4xl font-bold">0</div>
                        <div>Partner Farmers</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Wheat size={32} className='hidden md:flex' />
                    <Wheat className='flex md:hidden' />
                    <div className="flex flex-col justify-start">
                        <div className="text-2xl md:text-4xl font-bold">0</div>
                        <div>Total Rice</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Coins size={32} className='hidden md:flex' />
                    <Coins className='flex md:hidden' />
                    <div className="flex flex-col justify-start">
                        <div className="text-2xl md:text-4xl font-bold">0</div>
                        <div>Rice Sold</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Users size={32} className='hidden md:flex' />
                    <Users className='flex md:hidden' />
                    <div className="flex flex-col justify-start">
                        <div className="text-2xl md:text-4xl font-bold">0</div>
                        <div>Rice Clients</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatisticsSection;