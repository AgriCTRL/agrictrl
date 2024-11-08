import React from 'react'

const RightSidebar = ({ isRightSidebarOpen, rightSidebar }) => {
    return (
        <div 
            className={`transition-all duration-300 overflow-hidden rounded-lg h-fit ${
                isRightSidebarOpen ? 'w-1/4' : 'w-0 hidden'
            }`}
        >
            {rightSidebar}
        </div>
    )
}

export default RightSidebar