import { React } from 'react';
import { Button } from 'primereact/button';
import { Mail } from 'lucide-react';

const SocialsSection = () => {
    return (
        <section className="w-screen absolute top-0 left-0 right-0 text-white px-6 sm:px-12 lg:px-24 z-50 -translate-y-1/2 overflow-hidden">
            <div className="flex flex-col gap-4 container w-full text-center items-center bg-primary py-6 sm:py-8 rounded-lg shadow-2xl">
                <h3 className="text-2xl sm:text-4xl font-bold">Connect with us</h3>
                <Button 
                    rounded 
                    outlined 
                    aria-label="Gmail" 
                    className='text-white w-fit'
                >
                    <a href="mailto:agrictrl@gmail.com" className='flex items-center'>
                        <Mail size={24} />
                        <span className="ps-2">agrictrl@gmail.com</span>
                    </a>
                </Button>
            </div>
        </section>
    );
};

export default SocialsSection;