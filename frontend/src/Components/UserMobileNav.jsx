import React from 'react'

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

import { ChevronDown, LogOut, Menu, User, User2 } from 'lucide-react';

import { Link as ScrollLink } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import { Accordion, AccordionTab } from 'primereact/accordion';

const UserMobileNav = ({
    items,
    activePage,
    user, 
    handleLogout,
    profileClick
}) => {
    const [visible, setVisible] = React.useState(false);
    const navigate = useNavigate();

    const customerHeader = (
        <ScrollLink href='/' className='flex items-center gap-4'>
            <Image 
                src='favicon.ico'
                alt='AgriCTRL+ logo'
                className='w-8'
            />
            <p className='font-semibold text-black'>Menu</p>
        </ScrollLink>
    );

    return (
        <section className='flex md:hidden'>
            <Sidebar
                header={customerHeader} 
                visible={visible} 
                onHide={() => setVisible(false)}
                className='w-[20rem]'
                pt={{
                    header: 'bg-white p-4',
                    content: 'bg-background p-4'
                }}
            >
                <div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto'>
                    <div className='flex h-full flex- flex-col gap-2'>
                        <Accordion 
                            className="flex flex-col gap-2"
                        >
                            <AccordionTab 
                                header={
                                    <div className="flex gap-4 items-center">
                                        <Avatar 
                                            image={'/landingpage/nfa-logo.svg' ?? null}
                                            icon={<User size={18} />}
                                            shape="circle"
                                            className="cursor-pointer border-primary border text-primary bg-tag-grey"
                                        />
                                        <div className="flex gap-2 items-center">
                                            <p className='text-sm font-semibold text-black'>{(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : 'username'}</p>                        
                                            <Tag 
                                                className='bg-primary p-2 px-4'
                                            >
                                                <div className="font-normal flex items-center gap-1">
                                                    <User2 className='size-3'/>
                                                    <small>{user.userType}</small>
                                                </div>
                                            </Tag>
                                        </div>
                                    </div>
                                }
                                pt={{
                                    headerAction: {
                                        className: "p-4 border-lightest-grey hover:text-primary text-sm md:text-base bg-tag-grey/10 text-black font-semibold hover:text-tag-grey transition duration-300",
                                    },
                                    content: {
                                        className: "bg-transparent text-black",
                                    },
                                    headerIcon: {
                                        className: "absolute right-0 mr-4 text-primary",
                                    }
                                }}
                            >
                                <div className="flex flex-col gap-2">
                                    {user.userType === 'staff' && (
                                        <div className="flex items-center gap-2 text-sm pb-2">
                                            <p className='font-semibold'>Branch:</p>
                                            <p>{`${user.branchOffice ?? "branch name"}`}</p>
                                        </div>
                                    )}
                                    <Button 
                                        className='text-black text-sm ring-0 hover:bg-white'
                                        onClick={profileClick}
                                        outlined
                                    >
                                        <div className="flex items-center gap-2">
                                            <User2 className='size-5'/>
                                            <p className='font-semibold'>Profile</p>
                                        </div>
                                    </Button>
                                    <Button 
                                        className='text-red-500 text-sm ring-0 hover:bg-white'
                                        onClick={handleLogout} 
                                        outlined
                                    >
                                        <div className="flex items-center gap-2">
                                            <LogOut className='size-5'/>
                                            <p className='font-semibold'>Logout</p>
                                        </div>
                                    </Button>
                                </div>
                            </AccordionTab>
                        </Accordion>
                        {items.map((item, index) => (
                            <Button 
                                key={index}
                                className={`text-black text-sm border-none ring-0 ${activePage === item.text ? 'text-white bg-primary' : 'bg-transparent hover:bg-white'}`}
                                onClick={() => navigate(item.link)} 
                                label={item.text} 
                                text
                            />
                        ))}
                    </div>
                </div>   
            </Sidebar>
            <Button 
                className='text-primary'
                icon={<Menu className='size-5'/>} 
                onClick={() => setVisible(true)} 
                text
            />
        </section>
    )
}

export default UserMobileNav