import { PackageOpen } from 'lucide-react'
import React from 'react'

const EmptyRecord = ({ label }) => {
    return (
        <div className='p-10 flex flex-col justify-center text-black'>
            <PackageOpen />
            <p>{label}</p>
        </div>
    )
}

export default EmptyRecord