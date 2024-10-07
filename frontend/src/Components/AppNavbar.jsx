import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link as ScrollLink } from 'react-scroll';
import { Search } from 'lucide-react';
import { AuthClient } from "@dfinity/auth-client";
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import AppMobileNav from './AppMobileNav';
        
const AppNavbar = () => {
    const identityUrl = import.meta.env.VITE_INTERNET_IDENTITY_URL;
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    const handleTnTClick = () => {
        navigate('/TnT');
    }

    const loginButton1 = () => {
        navigate('/login');
    }

    const loginButton = async () => {   
        try {
            const authClient = await AuthClient.create();

            const width = 500;
        const height = 500;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2) - 25;

            await new Promise((resolve, reject) => {
                authClient.login({
                    identityProvider: `${identityUrl}/`,
                    onSuccess: resolve,
                    onError: reject,
                    windowOpenerFeatures: `width=${width},height=${height},left=${left},top=${top}`
                });
            });
            window.location.reload();
        }
        catch (error) {
            console.log(error.message);
        }
        return false;
    }

    useEffect(() => {
        const handleScroll = () => {
          setIsScrolled(window.scrollY > 50);
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`flex-between fixed z-50 w-screen px-6 sm:px-12 lg:px-24 py-4 transition-all duration-500 ${isScrolled ? 'bg-[#000000]/40 backdrop-blur-sm shadow-lg' : ''}`}>
            <ScrollLink href='/' className='flex items-center gap-4'>
                <Image 
                    src='favicon.ico' 
                    alt='AgriCTRL+ Logo' 
                    width={50} 
                    height={50}>
                </Image>       
                <p className='text-[32px] hidden md:block text-white'>AgriCTRL+</p>
            </ScrollLink>
            <div className="flex-between gap-4">
                <ScrollLink 
                    to="featureSection" 
                    smooth={true} 
                    duration={500} 
                    className='hidden sm:block'
                >
                    <Button
                        className="border-0 ring-0 text-white border-b-4 border-transparent hover:text-primary hover:border-primary hover:rounded-none"
                        label='Services'
                        text
                    ></Button>
                </ScrollLink>

                <ScrollLink 
                    to="offerSection" 
                    smooth={true} 
                    duration={500} 
                    className='hidden sm:block'
                >
                    <Button
                        className="border-0 ring-0 text-white border-b-4 border-transparent hover:text-primary hover:border-primary hover:rounded-none"
                        label='About Us'
                        text
                    ></Button>
                </ScrollLink>

                <Button 
                    className='text-white hover:text-primary ring-0'
                    onClick={handleTnTClick}
                    icon={<Search />}
                    rounded
                    text
                    aria-label="Search"
                />

                <AppMobileNav />

                <Button 
                    className="font-medium bg-gradient-to-r from-secondary to-primary px-6 sm:px-12 border-0"
                    onClick={ loginButton1 } 
                    label="Login" 
                />
            </div>     
        </nav>
    )
}

export default AppNavbar