import { React } from 'react';
import { Button } from 'primereact/button';
import {  Mail } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="bg-[#00C261] text-white py-5 rounded-lg mx-28 translate-y-14">
            <div className="container mx-auto text-center">
                <h3 className="text-4xl font-bold mb-4">Connect with us</h3>
                <div className="flex justify-center space-x-4">
                    <Button>
                        <Mail className="text-white h-9 w-9"/>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;