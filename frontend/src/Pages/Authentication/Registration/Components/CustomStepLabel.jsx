import React from "react";

const CustomStepLabel = ({ icon, isActive }) => (
    <div
        className={`flex items-center justify-center
            p-4 rounded-full transition-all
            ${
                isActive
                    ? "bg-white text-secondary scale-110"
                    : "bg-transparent text-white border-2 border-white"
            }`
        }
    >
        {React.cloneElement(icon, { size: 20, className: "transition-all" })}
    </div>
);

export default CustomStepLabel;