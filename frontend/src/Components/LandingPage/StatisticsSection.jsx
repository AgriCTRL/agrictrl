import { React } from 'react';
import { Wheat, Coins, Users, UtensilsCrossed} from 'lucide-react';

const StatisticsSection = () => {
    return (
        <section className="bg-gradient-to-r from-[#005155] to-[#00C261] 
                            rounded-lg h-44 mx-28 z-30 px-10 flex flex-row items-center 
                            justify-between align-middle text-white -translate-y-20">
            {/* Rice Tracked */}
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
            {/* Farmers */}
            <div className="flex flex-row items-center p-10">
                <UtensilsCrossed className="text-white h-14 w-14 mx-2"/>
                <div className="flex flex-col justify-start">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm">Farmers</div>
                </div>
            </div>
            {/* Rice Sellers */}
            <div className="flex flex-row items-center p-10">
                <Coins className="text-white h-14 w-14 mx-2"/>
                <div className="flex flex-col justify-start">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm">Rice</div>
                    <div className="text-sm">Sellers</div>
                </div>
            </div>
            {/* Customers */}
            <div className="flex flex-row items-center p-10">
                <Users className="text-white h-14 w-14 mx-2"/>
                <div className="flex flex-col justify-start">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm">Customers</div>
                </div>
            </div>
        </section>
    );
};

export default StatisticsSection;