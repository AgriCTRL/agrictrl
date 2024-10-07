import React from 'react'

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

import { Link as ScrollLink } from 'react-scroll';
import { Menu } from 'lucide-react';

const AppMobileNav = () => {
    const [visible, setVisible] = React.useState(false);

    const customerHeader = (
        <ScrollLink href='/' className='flex items-center gap-2'>
            <Image 
                src='favicon.ico'
                alt='AgriCTRL+ logo'
                width={40} 
                height={40}>
            </Image>       
            <p className='text-[26px] font-extrabold'>AgriCTRL+</p>
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
                    <div className='flex h-full flex- flex-col gap-6 pt-4'>
                        {/* {sidebarLinks.map((link) => {
                            const isActive = pathname === link.route;

                            return (
                                <Link 
                                    href={link.route}
                                    key={link.label}
                                    onClick={() => setVisible(false)}
                                >
                                    <Button 
                                        className='w-[90%] flex gap-4 py-3 px-4 items-center text-start text-lg ring-0'
                                        text={!isActive}
                                    >
                                        {link.icon}
                                        <p className='font-semibold'>{link.label}</p>
                                    </Button>
                                </Link>
                            );
                        })} */}
                        <Button
                            className="border-0 ring-0 border-transparent text-primary"
                            label='Services'
                            text
                        ></Button>
                        <Button
                            className="border-0 ring-0 border-transparent text-primary"
                            label='About Us'
                            text
                        ></Button>
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