import { PackageOpen } from 'lucide-react'
import React from 'react'

const EmptyRecord = ({ label }) => {
    return (
        <div className='p-10 flex flex-col gap-2 justify-center items-center text-black rounded-xl border border-lightest-grey'>
            <div className="bg-tag-grey text-primary rounded-full w-12 h-12 flex justify-center items-center">
                <PackageOpen />
            </div>
            <p>{label}</p>
        </div>
    )
}

export default EmptyRecord