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
                fetchCount("ricebatches/count"),
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
        <section className="absolute top-0 left-0 right-0 w-screen z-30 px-6 sm:px-12 lg:px-24
                            -translate-y-2/4 overflow-hidden">
            <div className="container bg-gradient-to-r from-secondary to-primary
                            flex gap-4 items-center rounded-lg shadow-2xl p-4 min-w-full
                            justify-between align-middle text-white">
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Wheat size={32} className='hidden md:flex' />
                    <Wheat className='flex md:hidden' />
                    <div className="flex flex-col justify-start">
                        <div className="text-2xl md:text-4xl font-bold">{riceTracked}</div>
                        <div>Rice Tracked</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <UtensilsCrossed size={32} className='hidden md:flex' />
                    <UtensilsCrossed className='flex md:hidden' />
                    <div className="flex flex-col justify-start">
                        <div className="text-2xl md:text-4xl font-bold">{partnerFarmers}</div>
                        <div>Partner Farmers</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Wheat size={32} className='hidden md:flex' />
                    <Wheat className='flex md:hidden' />
                    <div className="flex flex-col justify-start">
                        <div className="text-2xl md:text-4xl font-bold">{totalRice}</div>
                        <div>Total Rice</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Coins size={32} className='hidden md:flex' />
                    <Coins className='flex md:hidden' />
                    <div className="flex flex-col justify-start">
                        <div className="text-2xl md:text-4xl font-bold">{riceSold}</div>
                        <div>Rice Sold</div>
                    </div>
                </div>
                <div className="flex py-4 md:py-10 px-4 hover:bg-white/20 transition-all rounded-lg gap-4 justify-center">
                    <Users size={32} className='hidden md:flex' />
                    <Users className='flex md:hidden' />
                    <div className="flex flex-col justify-start">
                        <div className="text-2xl md:text-4xl font-bold">{riceClients}</div>
                        <div>Rice Clients</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatisticsSection;