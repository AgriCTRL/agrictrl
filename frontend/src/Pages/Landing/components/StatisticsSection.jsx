import { React, useEffect, useState } from 'react';
import { Wheat, Coins, Users, UtensilsCrossed, CookingPot} from 'lucide-react';

const StatisticsSection = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [riceTracked, setRiceTracked] = useState(0);
    const [partnerFarmers, setPartnerFarmers] = useState(0);
    const [totalRice, setTotalRice] = useState(0);
    const [riceSold, setRiceSold] = useState(0);
    const [riceClients, setRiceClients] = useState(0);

    const fetchCount = async (endpoint) => {
        try {
            const response = await fetch(`${apiUrl}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch count from ${endpoint}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error.message);
            return 0;
        }
    };

    const fetchData = async () => {
        try {
            const [
                riceTrackedCount,
                partnerFarmersCount,
                totalRiceCount,
                riceSoldCount,
                riceClientsCount
            ] = await Promise.all([
                fetchCount("palaybatches/count"),
                fetchCount("palaysuppliers/count"),
                fetchCount("palaybatches/count/milled"),
                fetchCount("riceorders/received/count"),
                fetchCount("users/recipients/count")
            ]);

            setRiceTracked(riceTrackedCount);
            setPartnerFarmers(partnerFarmersCount);
            setTotalRice(totalRiceCount);
            setRiceSold(riceSoldCount);
            setRiceClients(riceClientsCount);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <section className="absolute top-0 left-0 right-0 w-screen z-30 px-4 sm:px-12 lg:px-24
                            -translate-y-2/4 overflow-hidden">
            <div className="container bg-gradient-to-r from-secondary to-primary
                            flex gap-4 items-center rounded-lg shadow-2xl p-4 min-w-full
                            justify-between align-middle text-white">
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Wheat className='hidden md:flex size-5 md:size-8' />
                    <div className="flex flex-col justify-start">
                        <div className="text-base md:text-4xl font-bold">{riceTracked}</div>
                        <div className="text-sm md:text-base">Rice Tracked</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <UtensilsCrossed className='hidden md:flex size-5 md:size-8' />
                    <div className="flex flex-col justify-start">
                        <div className="text-base md:text-4xl font-bold">{partnerFarmers}</div>
                        <div className="text-sm md:text-base">Partner Farmers</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Wheat className='hidden md:flex size-5 md:size-8' />
                    <div className="flex flex-col justify-start">
                        <div className="text-base md:text-4xl font-bold">{totalRice}</div>
                        <div className="text-sm md:text-base">Total Rice</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Coins className='hidden md:flex size-5 md:size-8' />
                    <div className="flex flex-col justify-start">
                        <div className="text-base md:text-4xl font-bold">{riceSold}</div>
                        <div className="text-sm md:text-base">Rice Sold</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Users size={32} className='hidden md:flex size-5 md:size-8' />
                    <div className="flex flex-col justify-start">
                        <div className="text-base md:text-4xl font-bold">{riceClients}</div>
                        <div className="text-sm md:text-base">Rice Clients</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatisticsSection;