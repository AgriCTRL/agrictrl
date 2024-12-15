import { PackageOpen } from 'lucide-react'
import React from 'react'

const EmptyRecord = ({ label }) => {
    return (
        <div className='p-10 flex flex-col gap-2 justify-center items-center text-black rounded-xl border border-lightest-grey'>
            <div className="bg-tag-grey text-primary rounded-full size-10 md:size-12 flex justify-center items-center">
                <PackageOpen className='size-4 md:size-5'/>
            </div>
            <p className='text-sm md:text-base'>{label}</p>
        </div>
    )
}

export default EmptyRecord