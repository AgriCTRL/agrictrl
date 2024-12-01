import React from 'react'

const LeftSidebar = ({ leftSidebar, isLeftSidebarOpen }) => {
    return (
        <div 
            className={`${isLeftSidebarOpen ? 'w-[20%]' : 'w-0 hidden'} transition-all h-fit duration-300 overflow-hidden bg-white rounded-lg`} 
        >
            {leftSidebar}
        </div>
    )
}

export default LeftSidebar