import { Image } from 'primereact/image'
import React from 'react'

const Loader = () => {
    return (
        <div className="loader-container flex items-center justify-center h-screen w-full">
            <span className="sun sunshine bg-primary/50">
            </span>
            <span className="sun flex items-center justify-center bg-tag-grey">
                <Image 
                    src='/favicon.ico' 
                    alt='logo' 
                    width={32} 
                    height={32}
                >
                </Image>
            </span>
        </div>
    )
}

export default Loader