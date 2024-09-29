import { React } from 'react';
import AppNavbar from '../Components/AppNavbar';

function UserLayout({ children }) {
    const identityUrl = import.meta.env.VITE_INTERNET_IDENTITY_URL;

    return (
        <div >
            <div> 
                {/* Header */}
                <AppNavbar />

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