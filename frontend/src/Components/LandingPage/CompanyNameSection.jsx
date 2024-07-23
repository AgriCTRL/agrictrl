import { React } from 'react';

const CompanyNameSection = () => {
    return (
        <section className="bg-[#2A2A2A] text-white py-4 z-30 relative overflow-hidden">
            <div className="container mx-auto items-center relative">
                {/* Left gradient */}
                <div className="absolute left-0 top-0 bottom-0 w-[50%] bg-gradient-to-r from-[#2A2A2A] to-transparent z-20"></div>
                        
                {/* Right gradient */}
                <div className="absolute right-0 top-0 bottom-0 w-[50%] bg-gradient-to-l from-[#2A2A2A] to-transparent z-20"></div>
                        
                {/* Items */}
                <div className="flex justify-between items-center relative z-10">
                <span className="p-10 text-4xl">AgriCTRL+</span>
                <div className="bg-white w-[2px] h-[90px]"></div>
                <span className="p-10 text-4xl">AgriCTRL+</span>
                <div className="bg-white w-[2px] h-[90px]"></div>
                <span className="p-10 text-4xl">AgriCTRL+</span>
                <div className="bg-white w-[2px] h-[90px]"></div>
                <span className="p-10 text-4xl">AgriCTRL+</span>
                </div>
            </div>
        </section>
    );
};

export default CompanyNameSection;