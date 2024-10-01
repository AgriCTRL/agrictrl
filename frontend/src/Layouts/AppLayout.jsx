import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AuthClient } from "@dfinity/auth-client";
import { Link as ScrollLink } from 'react-scroll';

function UserLayout({ children }) {
    const identityUrl = import.meta.env.VITE_INTERNET_IDENTITY_URL;
    const navigate = useNavigate();

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

    return (
        <div >
            <div> 
                {/* Header */}
                <header className="fixed backdrop-blur-md font-poppins text-white w-screen p-3 z-50">
                    <div className="flex justify-between mx-10 items-center">
                        {/* Logo & title */}
                        <div className="flex items-center gap-2">
                            <img src="favicon.ico" alt="AgriCTRL+ Logo" className="h-12" />
                            <div className="text-2xl font-bold hover:text-primary letter-spacing-4 ml-2 tracking-wider">AgriCTRL+</div>
                        </div>

                        <nav className="flex items-center">
                            <ScrollLink to="featureSection" smooth={true} duration={500} className="tracking-wider mx-6 cursor-pointer hover:text-primary hover:underline hover:underline-offset-4 hover:font-bold">Services</ScrollLink>
                            <ScrollLink to="offerSection" smooth={true} duration={500} className="tracking-wider mx-6 cursor-pointer hover:text-primary hover:underline hover:underline-offset-4 hover:font-bold">About Us</ScrollLink>
                            <button onClick={handleTnTClick}>
                                <Search className="h-6 w-6 mx-6 hover:text-primary hover:underline hover:underline-offset-4 hover:font-bold"/>
                            </button>
                            
                            <button onClick={ loginButton1 } className="bg-gradient-to-r from-secondary to-primary px-20 py-3 rounded-lg">Login</button>
                        </nav>
                    </div>
                </header>

                <main className="main-content min-h-screen">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white pt-20 pb-10">

                    {/* <div className="flex flex-row justify-between mx-24 px-4">
                            <div className="">
                                <div className="flex items-center mb-4">
                                    <img src="AgriCTRLLogo.png" alt="AgriCTRL+ Logo" className="h-12 mr-2" />
                                    <h3 className="text-xl font-bold">AgriCTRL+</h3>
                                </div>
                                <p className="text-sm text-gray-400">Propose mes services de plombier et petits travaux</p>
                            </div>
                            <div className="px-10">
                                <h3 className="text-xl font-bold mb-4">Company</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li>Item</li>
                                    <li>Item</li>
                                    <li>Item</li>
                                    <li>Item</li>
                                </ul>
                            </div>
                            <div className="px-10">
                                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li>Item</li>
                                    <li>Item</li>
                                    <li>Item</li>
                                </ul>
                            </div>
                            <div className="flex flex-col justify-start">
                                <h3 className="text-xl font-bold mb-4">Newsletter</h3>
                                <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter</p>
                                <div className="flex flex-col justify-start">
                                    <InputText placeholder="Enter your email" className="w-44 text-black" />
                                    <Button label="SUBSCRIBE NOW" className="" />
                                </div>
                            </div> 
                    </div> */}

                    {/* Copyright  */}
                    <div className="bg-gray-900 text-gray-400 text-center pb-4 text-sm">
                        <p>Copyright @ 2024 All Rights Reserved</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default UserLayout;