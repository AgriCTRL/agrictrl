import { React } from 'react';
import { Link as ScrollLink } from 'react-scroll';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

import SimpleParallax from "simple-parallax-js";
import AppNavbar from '../Components/AppNavbar';
import SocialsSection from '../Pages/Landing/components/SocialsSection';

function UserLayout({ children }) {
    const identityUrl = import.meta.env.VITE_INTERNET_IDENTITY_URL;

    return (
        <div>
            <div> 
                {/* Header */}
                <AppNavbar />

                <main className="main-content min-h-screen">
                    {children}
                </main>

                {/* Footer */}
                <footer id="footer"
                    className="relative h-fit w-screen 
                    px-6 sm:px-12 lg:px-24 
                    pt-28 lg:pt-40"
                >
                    <SocialsSection />

                    <img src={"/Landing-HeroBg.jpg"} alt={"image"} className="absolute inset-0 object-cover h-full w-full" />

                    <div className="absolute inset-0 bg-[#000000]/80"> </div>

                    <div className='flex flex-col sm:flex-row justify-between gap-10 relative text-white mb-24'>
                        <div className="flex flex-col gap-6 items-center sm:items-start">
                            <div className="flex items-center gap-4">
                                <Image 
                                    src='favicon.ico' 
                                    alt='AgriCTRL+ Logo' 
                                    width={50} 
                                    height={50}>
                                </Image>       
                                <p className='text-[32px] text-white'>AgriCTRL+</p>
                            </div>
                            <p className='text-center sm:text-start'>Improving transparency in rice supply chain through blockchain technology.</p>
                        </div>
                        
                        <div className="flex flex-col gap-6 text-center sm:text-start">
                            <h3 className="text-lg font-semibold">Partner Organizations</h3>
                            <ul>
                                <li>National Food Authority</li>
                                <li>Department of Agriculture</li>
                                <li>Polytechnic University of the Philippines</li>
                                <li>Internet Computer Protocol Hub PH</li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-6 text-center sm:text-start">
                            <h3 className="text-lg font-semibold">Quick Links</h3>
                            <div className="links">
                                <ScrollLink 
                                    to="offerSection" 
                                    smooth={true}
                                    duration={500}
                                    className="hover:text-primary cursor-pointer"
                                >
                                    <p>About Us</p>
                                </ScrollLink>
                                <ScrollLink 
                                    to="featureSection" 
                                    smooth={true}
                                    duration={500}
                                    className="hover:text-primary cursor-pointer"
                                >
                                    <p>Services</p>
                                </ScrollLink>
                                <ScrollLink 
                                    to="footer" 
                                    smooth={true}
                                    duration={500}
                                    className="hover:text-primary cursor-pointer"
                                >
                                    <p>Contact Us</p>
                                </ScrollLink>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full border-t border-white py-8">
                        <p className="text-center text-white">Copyright © 2022 AgriCTRL+. All Rights Reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default UserLayout;