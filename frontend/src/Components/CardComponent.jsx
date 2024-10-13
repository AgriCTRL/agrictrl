function CardComponent({ children, className, onClick }) {
    return (
        <div 
            className={`bg-white flex rounded-lg p-4 ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}        

export default CardComponent;