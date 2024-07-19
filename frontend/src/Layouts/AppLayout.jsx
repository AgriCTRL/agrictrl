import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function UserLayout({ children }) {
    return (
        <div>
            <div className="main-content min-h-screen">
                {/* Header */}
                <header className="bg-transparent text-white p-4 fixed top-0 left-0 w-full z-50">
                    <div className="container mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold">AgriCTRL+</div>
                    <nav>
                        <a href="#" className="mx-2">Services</a>
                        <a href="#" className="mx-2">About Us</a>
                        <button className="bg-green-500 px-4 py-2 rounded">Login</button>
                    </nav>
                    </div>
                </header>

                <main>
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center mb-4">
                                <div className="bg-white w-8 h-8 mr-2"></div>
                                    <h3 className="text-xl font-bold">AgriCTRL+</h3>
                                </div>
                                <p className="text-sm text-gray-400">Propose mes services de plombier et petits travaux</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4">Company</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li>Item</li>
                                    <li>Item</li>
                                    <li>Item</li>
                                    <li>Item</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li>Item</li>
                                    <li>Item</li>
                                    <li>Item</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4">Newsletter</h3>
                                <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter</p>
                                <div className="flex-horizontal">
                                    <InputText placeholder="Enter your email" className="w-full text-black" />
                                    <Button label="SUBSCRIBE NOW" className="p-button-success" />
                                </div>
                            </div> 
                        </div>
                    </div>
                </footer>

                {/* Copyright  */}
                <div className="bg-gray-900 text-gray-400 text-center py-4 text-sm">
                    <p>Propose mes services de plombier et petits travaux</p>
                </div>
            </div>
        </div>
    );
}

export default UserLayout;