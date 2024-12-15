import React, { useRef } from "react";

import { ChevronDown, LogOut, User } from "lucide-react";

import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { OverlayPanel } from "primereact/overlaypanel";
import UserMobileNav from "../../../Components/UserMobileNav";
import { Image } from "primereact/image";

const Navbar = ({
    navItems,
    user,
    activePage,
    userFullName,
    profileClick,
    navigate,
    handleLogoutBtn,
}) => {
    const op = useRef(null);

    return (
        <header className="w-full py-4 px-4 md:px-6 bg-white fixed z-50">
            <nav className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center w-fit gap-4 justify-start">
                        <Image
                            src="/favicon.ico"
                            className={`overflow-hidden transition-all cursor-pointer w-8 md:w-11`}
                            alt="AgriCTRL sibebar logo"
                            width="45"
                        />
                        <p className="hidden md:block text-2xl font-semibold text-primary">
                            AgriCTRL+
                        </p>
                        <p className="md:hidden font-semibold text-black">{activePage}</p>
                    </div>
                    <div className="hidden md:flex gap-2 items-center">
                        {navItems.map((item, index) => (
                            <div className="relative" key={index}>
                                <Button
                                    onClick={() => navigate(item.link)}
                                    className={`text-black border-none ring-0 ${
                                        activePage === item.text
                                            ? "text-white bg-primary"
                                            : "bg-transparent hover:bg-background"
                                    }`}
                                >
                                    <p>{item.text}</p>
                                </Button>
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        className="hidden md:flex p-2 gap-4 ring-0"
                        text
                        onClick={(e) => op.current.toggle(e)}
                    >
                        <Avatar
                            image={"/landingpage/nfa-logo.svg" ?? null}
                            icon={<User size={18} />}
                            shape="circle"
                            className="cursor-pointer border-primary border text-primary bg-tag-grey"
                        />
                        <div className="flex flex-col items-start">
                            <small className="font-semibold text-black">
                                {user.firstName && user.lastName
                                    ? userFullName
                                    : "username"}
                            </small>
                            <small className="text-light-grey">
                                NFA - {user.branchOffice}
                            </small>
                        </div>
                        <ChevronDown size={18} className="hidden md:block" />
                    </Button>
                    <UserMobileNav
                        items={navItems}
                        activePage={activePage}
                        user={user}
                        handleLogout={handleLogoutBtn}
                        profileClick={profileClick}
                    />
                </div>

                <OverlayPanel ref={op} className="w-60">
                    <div className="gap-4 flex flex-col">
                        <div className="flex items-center gap-4">
                            <Avatar
                                onClick={profileClick}
                                image={"/landingpage/nfa-logo.svg" ?? null}
                                icon={<User size={20} />}
                                shape="circle"
                                size="large"
                                className="cursor-pointer border-primary border text-primary bg-tag-grey"
                            />
                            <div className="flex flex-col items-start">
                                <p className="font-semibold text-black">
                                    {user.firstName && user.lastName
                                        ? userFullName
                                        : "username"}
                                </p>
                                <small className="text-light-grey">
                                    NFA - {user.branchOffice}
                                </small>
                            </div>
                        </div>
                        <Divider className="m-0" />
                        <Button
                            onClick={handleLogoutBtn}
                            className="w-full gap-4 border-none ring-0 text-black px-4 hover:text-white hover:bg-primary"
                            text
                        >
                            <LogOut size={20} />
                            <p>Logout</p>
                        </Button>
                    </div>
                </OverlayPanel>
            </nav>
        </header>
    );
};

export default Navbar;
