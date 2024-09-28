import { React } from 'react';
import { Button } from 'primereact/button';
import { Mail } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="bg-primary text-white py-5 rounded-lg mx-28 translate-y-14">
            <div className="container mx-auto text-center">
                <h3 className="text-3xl font-bold mb-4">Connect with us</h3>
                <h6 className="text-xl font-bold m-0">agrictrl@gmail.com</h6>
                {/* <div className="flex justify-center space-x-4">
                    <Button onClick={() => {
                        window.location.href = 'mailto:agrictrl@gmail.com';
                    }}>
                        <Mail className="text-white h-9 w-9" />
                    </Button>
                </div> */}
            </div>
        </section>
    );
};

export default HeroSection;