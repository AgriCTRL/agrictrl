import { Divider } from 'primereact/divider'
import { Image } from 'primereact/image'
import React from 'react'

const RightSidebar = ({ isRightSidebarOpen, rightSidebar }) => {
    return (
        <div 
            className={`hidden md:block transition-all duration-300 overflow-hidden rounded-lg h-fit ${
                isRightSidebarOpen ? 'w-1/4' : 'w-0 hidden'
            }`}
        >
            {rightSidebar}
            <Divider />
            <div className="contacts flex flex-col items-center gap-2 p-4 text-black w-full"> 
                <p className="text-center font-semibold">Reach us out here</p>
                <div className="flex items-center gap-4">
                    <a href="mailto:agrictrl@gmail.com" className='flex items-center'>
                        <small className="ps-2">agrictrl@gmail.com</small>
                    </a>
                </div>
                <small className='flex gap-2 items-center'>
                    <Image 
                        src='favicon.ico' 
                        alt='AgriCTRL+ Logo' 
                        height={20}
                        width={20}
                    />
                    AgriCTRL+ © 2024
                </small>
            </div>
        </div>
    )
}

export default RightSidebar