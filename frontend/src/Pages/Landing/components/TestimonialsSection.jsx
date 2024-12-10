import React, { useState, useEffect, useRef } from 'react';
import { Wheat, MoveRight, MoveLeft, Quote } from 'lucide-react';

import SocialsSection from './SocialsSection'

import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';

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

    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        },
    ];

    const testimonialTemplate = (testimonial) => {
        return (
            <div className="flex flex-col gap-6 p-6 rounded-lg border-1 border-tag-grey mx-4">
                <div className="user-details flex justify-between">
                    <div className="flex sm:flex-row flex-col sm:gap-6 gap-2">
                        <Avatar image={ testimonial.image } shape="circle" size='xlarge' className='border-2 border-primary'/>
                        <div className="details flex flex-col gap-2 justify-center">
                            <p className='text-primary font-semibold text-sm md:text-base'>{ testimonial.name }</p>
                            <Tag value={ testimonial.role } className='bg-tag-grey text-black'></Tag>
                        </div>
                    </div>
                    <Quote className="text-primary" size={32} />
                </div>
                <div className="testimonial">
                    <p className='text-sm md:text-base'>"{ testimonial.quote }"</p>
                </div>
                <div className="date text-primary text-sm md:text-base">{ testimonial.date }</div>
            </div>
        );
    };

    return (
        <section id="testimonialSection" 
            className="relative h-auto w-screen flex flex-col gap-6 overflow-hidden 
            px-4 sm:px-12 lg:px-24 
            pt-6 sm:pt-12 lg:pt-24 
            pb-20 lg:pb-44 
            justify-center"
        >
            <div className="title font-semibold text-primary flex items-center justify-center gap-4 text-center">
                <Wheat />
                <p>Testimonials</p>
            </div>
            <h1 className="text-black text-2xl sm:text-4xl font-bold text-center">What They Say to AgriCTRL+</h1>
            <Carousel 
                value={testimonials} 
                numVisible={3} 
                numScroll={3} 
                responsiveOptions={responsiveOptions} 
                className="custom-carousel pt-4" 
                circular
                autoplayInterval={3000} 
                itemTemplate={testimonialTemplate} 
            />
        </section>
    );
};

export default TestimonialsSection;