import { React, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Search } from 'lucide-react';
import { AuthClient } from "@dfinity/auth-client";

function UserLayout({ children }) {

    const loginButton = async () => {   
        try {
            const authClient = await AuthClient.create();

            const width = 500;
        const height = 500;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2) - 25;

            await new Promise((resolve, reject) => {
                authClient.login({
                    identityProvider: 'http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943/',
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
                <header className="fixed backdrop-blur-sm font-poppins text-white p-3 left-0 w-full z-50">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center">
                            <img src="AgriCTRLLogo.png" alt="AgriCTRL+ Logo" className="h-12 ml-10" />
                            <div className="text-3xl mx-10 tracking-wider">AgriCTRL+</div>
                        </div>
                        <nav className="flex items-center">
                            <a href="#" className="text-[#00C261] underline underline-offset-4 font-bold mx-6">Home</a>
                            <a href="#" className="mx-6">Services</a>
                            <a href="#" className="mx-6">About Us</a>
                            <Search className="h-6 w-6 mx-6 text-white"/>
                            <button onClick={ loginButton } className="bg-gradient-to-r from-[#005155] to-[#00C261] px-20 py-3 rounded-lg ml-2 mr-20">Login</button>
                        </nav>
                    </div>
                </header>

                <main className="main-content min-h-screen">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="flex flex-row justify-between mx-24 px-4">
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
                    </div>
                    {/* Copyright  */}
                    <div className="bg-gray-900 text-gray-400 text-center pb-4 text-sm">
                        <p>Propose mes services de plombier et petits travaux</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default UserLayout;