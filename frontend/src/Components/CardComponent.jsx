function CardComponent({ children, className, onClick }) {
    return (
        <div 
            className={`bg-white flex rounded-md p-4 ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}        

export default CardComponent;