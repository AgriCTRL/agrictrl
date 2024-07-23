import { React, useState, useRef } from 'react';
import { Carousel } from 'primereact/carousel';
import { Wheat, MoveRight, MoveLeft } from 'lucide-react';

import SocialsSection from './SocialsSection'

const TestimonialsSection = () => {

    const [testimonials] = useState([
    {
        name: 'Aldrin Abenoja',
        role: 'Nursing Assistant',
        image: '/path/to/devon-lane-image.jpg',
        quote: 'Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L.',
        date: '4/4/18'
    },
    {
        name: 'Joerel Belen',
        role: 'Nursing Assistant',
        image: '/path/to/devon-lane-image.jpg',
        quote: 'Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L.',
        date: '4/4/18'
    },
    {
        name: 'Jobert Mampusti',
        role: 'Nursing Assistant',
        image: '/path/to/devon-lane-image.jpg',
        quote: 'Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L.',
        date: '4/4/18'
    },
    {
        name: 'Harvy Pontillas',
        role: 'Nursing Assistant',
        image: '/path/to/devon-lane-image.jpg',
        quote: 'Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L.',
        date: '4/4/18'
    },
    ]);

    const carouselRef = useRef(null);

    return (
        <section className="bg-white pt-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center mb-8">
                        <Wheat className="text-[#00C261] h-5 w-5" />
                        <span className="text-[#00C261] font-semibold ml-2">Testimonials</span>
                    </div>
                    <h2 className="text-4xl text-[#444444] font-bold mb-12">What They Say About Us</h2>
                </div>

                <div className="relative">
                    <Carousel
                        value={testimonials}
                        numVisible={1}
                        numScroll={1}
                        circular
                        showNavigators={true}
                        showIndicators={true}
                        className="z-50"
                        ref={carouselRef}
                        prevIcon={<MoveLeft className="h-6 w-6 text-[#00C261]" />}
                        nextIcon={<MoveRight className="h-6 w-6 text-[#00C261]" />}
                        itemTemplate={(item) => (
                            <div className="bg-white rounded-lg shadow-lg p-8 my-5 mx-28">
                                <div className="flex items-center mb-4">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full mr-4" />
                                    <div>
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <p className="text-gray-600">{item.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-800 mb-4">"{item.quote}"</p>
                                <p className="text-gray-500 text-sm">{item.date}</p>
                            </div>
                        )}
                    />
                </div>
            </div>

            <SocialsSection />        
        </section>
    );
};

export default TestimonialsSection;