import React from 'react'

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

import { Menu } from 'lucide-react';

import { Link as ScrollLink } from 'react-scroll';
import { useNavigate } from 'react-router-dom';

const AppMobileNav = () => {
    const [visible, setVisible] = React.useState(false);
    const navigate = useNavigate();

    const loginButton1 = () => {
        navigate('/login');
    }

    const customerHeader = (
        <ScrollLink href='/' className='flex items-center gap-4'>
            <Image 
                src='favicon.ico'
                alt='AgriCTRL+ logo'
                width={40} 
                height={40}>
            </Image>       
            <p className='text-black text-xl font-semibold'>AgriCTRL+</p>
        </ScrollLink>
    );

    return (
        <section className='flex sm:hidden'>
            <Sidebar
                header={customerHeader} 
                visible={visible} 
                onHide={() => setVisible(false)}
                className='w-[20rem]'
            >
                <div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto'>
                    <div className='flex h-full flex- flex-col gap-2 pt-4'>
                        <ScrollLink 
                            to="featureSection" 
                            smooth={true} 
                            duration={500} 
                        >
                            <Button
                                className="border-0 ring-0 text-primary border-transparent hover:text-primary hover:rounded-none w-full"
                                label='Services'
                                text
                            >
                            </Button>
                        </ScrollLink>

                        <ScrollLink 
                            to="offerSection" 
                            smooth={true} 
                            duration={500} 
                        >
                            <Button
                                className="border-0 ring-0 text-primary border-transparent hover:text-primary hover:rounded-none w-full"
                                label='About Us'
                                text
                            ></Button>
                        </ScrollLink>

                        <Button 
                            className="font bg-gradient-to-r from-secondary to-primary px-6 sm:px-12 border-0"
                            onClick={ loginButton1 } 
                            label="Login" 
                        />
                    </div>
                </div>   
            </Sidebar>
            <Button 
                className='text-white hover:text-primary'
                icon={<Menu />} 
                onClick={() => setVisible(true)} 
                text
            />
        </section>
    )
}

export default AppMobileNav