import { React, useState, useRef } from 'react';
import { Carousel } from 'primereact/carousel';
import { Wheat, MoveRight, MoveLeft } from 'lucide-react';

import SocialsSection from './SocialsSection'

const TestimonialsSection = () => {

    const [testimonials] = useState([
    {
        name: 'Aling Maria',
        role: 'Karinderya Owner',
        image: 'https://i.pravatar.cc/301',
        quote: 'Gamit ang AgriCTRL+ mas madali namin makita kung saan galing ang mga bigas na ginagamit namin dito sa negosyo.',
        date: '4/4/18'
    },
    {
        name: 'Tomas Dela Cruz',
        role: 'Rice Farmer',
        image: 'https://i.pravatar.cc/302',
        quote: 'Salamat sa AgriCTRL+ mas madali namin naibebenta ang aming ani sa makataong presyo.',
        date: '4/4/18'
    },
    {
        name: 'Jennie Villanueva',
        role: 'Supermarket Manager',
        image: 'https://i.pravatar.cc/303',
        quote: 'Using this application we can assure our customer with fairness for rice products we sell.',
        date: '4/4/18'
    },
    {
        name: 'Ronnie Salazar',
        role: 'NFA Procurement Officer',
        image: 'https://i.pravatar.cc/304',
        quote: 'Sa pamamagitan ng AgriCTRL+, napadali and supply chain management ng aming ahensya.',
        date: '4/4/18'
    },
    ]);

    const carouselRef = useRef(null);

    return (
        <section className="bg-white pt-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center mb-8">
                        <Wheat className="text-primary h-5 w-5" />
                        <span className="text-primary font-semibold ml-2">Testimonials</span>
                    </div>
                    <h2 className="text-4xl text-[#444444] font-bold mb-12">What They Say to AgriCTRL+</h2>
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
                        prevIcon={<MoveLeft className="h-6 w-6 text-primary" />}
                        nextIcon={<MoveRight className="h-6 w-6 text-primary" />}
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