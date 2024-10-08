import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Wheat, Link, Map, FileStack, MapPinned, Facebook, Mail, Linkedin} from 'lucide-react';
import CustomPasswordInput from '../../../Components/Form/PasswordComponent';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(null);
	const navigate = useNavigate();

	const userTypes = [
		{ label: 'Staff', value: 'staff' },
		{ label: 'Admin', value: 'admin' },
		{ label: 'Recipient', value: 'recipient' },
		{ label: 'Private Miller', value: 'privateMiller' }
		];

  const loginButton = () => {
    if (userType === 'admin') {
      navigate('/admin');
    } else if (userType === 'staff') {
      navigate('/staff');
	} else if (userType === 'recipient') {
		navigate('/recipient');
	} else if (userType === 'privateMiller') {
		navigate('/miller');
    } else {
      alert('Please select a valid user type');
    }
  };

	const RegisterButton = (e) => {   
    e.preventDefault();
    navigate('/register');
  }

	const forgotButton = (e) => {
		e.preventDefault();   
    navigate('/forgotpassword');
  }

  return (
    <div className="h-screen w-screen flex flex-row">
      {/* Left side */}
      <div className="flex flex-col items-center justify-between h-full w-[45%] p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-6">Login</h1>

        <p className="text-md font-medium text-black mb-6">Login by providing your user type and user credentials</p>

				<div className="h-full w-full flex flex-col justify-start my-10">
					<label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
					<Dropdown
						value={userType}
						options={userTypes}
						onChange={(e) => setUserType(e.value)}
						placeholder="Select User Type"
						className="ring-0 w-full placeholder:text-gray-400 mb-4"
						valueTemplate={(option) => (
							<div className="flex items-center">
								<Wheat className="mr-2 text-secondary" />
								<span className="text-secondary">{option?.label || "Select User Type"}</span>
							</div>
						)}
						itemTemplate={(option) => (
							<div className="flex items-center">
								<Wheat className="mr-2 text-secondary" />
								<span className="text-secondary">{option.label}</span>
							</div>
						)}
					/>

					<div className="mb-4 w-full">
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<InputText
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email here"
							className="w-full focus:ring-0 p-3"
						/>
					</div>

					<div className="mb-4 w-full">
						<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
						<CustomPasswordInput 
							id="password" 
							value={password} 
							onChange={(e) => setPassword(e.target.value)} 
							placeholder="Enter your password" 
							className="focus:border-[#14b8a6] hover:border-[#14b8a6] w-full p-inputtext-sm p-3 rounded-md border border-gray-300 placeholder:text-gray-500 placeholder:font-medium"
						/>
					</div>

					<div className="flex justify-between items-center mb-6 w-full">
						<div className="flex items-center">
							<input type="checkbox" id="remember" className="mr-2" />
							<label htmlFor="remember" className="text-sm font-medium text-primary">Remember Me</label>
						</div>
						<a href="#" onClick={forgotButton} className="text-sm font-medium text-primary hover:underline">Forgot Password</a>
					</div>

					<Button 
						label="Login"
						onClick={loginButton}
						className="w-full bg-gradient-to-r from-secondary to-primary text-white px-20 py-3 rounded-lg" />
				</div>
        
        <div className="mt-6 text-center">
          <span className="text-sm font-medium text-black">No Account? </span>
          <a href="#" onClick={RegisterButton} className="text-sm font-medium text-primary hover:underline">Register here</a>
        </div>
      </div>

      {/* Right side */}
			<div className="flex flex-col justify-between h-full w-[55%] p-8 text-white relative">
				{/* Background Image */}
				<div 
					className="absolute inset-0 bg-cover bg-center z-0" 
					style={{ 
                  backgroundImage: 'url("/Login-BG.jpg")', 
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
				></div>

				{/* Filter Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-secondary via-[#00c26170] to-transparent"></div>

				<div className="relative z-20 w-full flex flex-col items-center">
						<div className="flex justify-between items-center mb-8">
								<div className="flex items-center">
										<img src="favicon.ico" alt="AgriCTRL+ Logo" className="h-12 mr-4" />
										<h1 className="text-2xl font-bold">AgriCTRL+</h1>
								</div>
						</div>

						<div className="text-center mb-8">
								<h2 className="text-3xl font-medium mb-4">Welcome back!</h2>
								<p className="text-md mb-8">Revolutionizing Rice Supply Chain Transparency and Traceability</p>
						</div>

						<div className="grid grid-cols-4 gap-4 mb-8 w-full">
								<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
										<Link size={24} />
										<span className="mt-2">Chain</span>
								</div>

								<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
										<Map size={24} />
										<span className="mt-2">Trace</span>
								</div>

								<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
										<FileStack size={24} />
										<span className="mt-2">Review</span>
								</div>

								<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
										<MapPinned size={24} />
										<span className="mt-2">Locate</span>
								</div>
						</div>
				</div>

				<div className="relative z-20 w-full flex flex-col items-center">
					<h3 className="text-xl font-semibold mb-4">Connect with us</h3>
					<div className="w-full flex justify-between items-center">
						<Button className="ring-0 bg-transparent border-none">
							<Facebook size={24} />
						</Button>

						<Button className="ring-0 bg-transparent border-none">
							<Mail size={24} />
						</Button>
								
						<Button className="ring-0 bg-transparent border-none">
							<Linkedin size={24} />
						</Button>
					</div>
				</div>
			</div>
    </div>
  );
};

export default LoginPage;