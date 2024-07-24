import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
function InputComponent({ value,inputIcon, styles, placeholder, onChange }) {
    return (
        <IconField 
            iconPosition="left"
            className={`bg-white rounded-md flex items-center ${styles}`}
        >
            <InputIcon className='top-auto left-auto m-0 ml-4 p-0 text-primary'>{inputIcon}</InputIcon>
            <input 
                className="p-4 pl-12 ring-1 ring-transparent hover:ring-primary transition-all focus:ring-primary focus:outline-none w-full text-sm leading-0 text-black font-medium placeholder-primary rounded-md" 
                type="text" 
                aria-label={placeholder} 
                placeholder={placeholder} 
                onChange={onChange}
                value={value}
            />
        </IconField>
    );
}   

export default InputComponent;