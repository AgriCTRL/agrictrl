import React from 'react'

const StepWrapper = ({ children, heading, subHeading }) => {
    return (
        <form className='h-fit w-full flex flex-col gap-4'>
            <h2 className="font-medium text-black text-2xl sm:text-4xl">{heading}</h2>
            <p className="text-md text-black">{subHeading}</p>

            <div className="flex flex-col gap-4 pt-4">
                {children}
            </div>
        </form>
    )
}

export default StepWrapper