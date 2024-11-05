import React from 'react'
import { useNavigate } from 'react-router-dom';

const PageDoesNotExists = () => {
	const navigate = useNavigate();

    return (
        <div className='flex justify-center items-center w-full h-full p-6 gap-6'>
            <div className="flex flex-col gap-4">
                <div className="flex items-center cursor-pointer">
                    <img src="favicon.ico" alt="AgriCTRL+ Logo" className="h-12 mr-4" onClick={() => navigate('/admin') } />
                </div>
                <p className='text-lg font-semibold'>Error 404</p>
                <p>
                    The page you are looking for does not exist.<br /> 
                    Click&nbsp;
                    <span
                        onClick={() => navigate(-1) }
                        className='text-primary cursor-pointer underline hover:font-semibold'
                    >
                        here 
                    </span> 
                    &nbsp;to go back.
                </p>
            </div>
            <div className="flex items-center">
                <img src="illustrations/not-found.svg" alt="Empty Image" className="h-40 mr-4" />
            </div>
        </div>
    )
}

export default PageDoesNotExists