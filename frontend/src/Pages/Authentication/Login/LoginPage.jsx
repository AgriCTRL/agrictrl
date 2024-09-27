import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Search, MapPin, Edit3, Lightbulb, Mail, Share2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(null);
	const navigate = useNavigate();

  const userTypes = [
    { label: 'NFA Branch Staff', value: 'nfa' },
  ];

  const loginButton = () => {   
    navigate('/admin/');
  }

	const RegisterButton = (e) => {   
    e.preventDefault();
    navigate('/register');
  }

  return (
    <div className="h-screen w-screen flex flex-row">
      {/* Left side Login form */}
      <div className="flex flex-col items-center justify-between h-full w-[40%] bg-white p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Login</h1>
        <p className="text-sm text-gray-600 mb-6">Login by providing your user type and user credentials</p>

				<div className="h-full w-full flex flex-col justify-start my-10">
					<Dropdown
						value={userType}
						options={userTypes}
						onChange={(e) => setUserType(e.value)}
						placeholder="Select User Type"
						className="w-full mb-4"
					/>

					<div className="mb-4 w-full">
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<InputText
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email here"
							className="w-full p-inputtext-sm"
						/>
					</div>

					<div className="mb-4 w-full">
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<InputText
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password here"
							className="w-full p-inputtext-sm"
						/>
					</div>

					<div className="flex justify-between items-center mb-6 w-full">
						<div className="flex items-center">
							<input type="checkbox" id="remember" className="mr-2" />
							<label htmlFor="remember" className="text-sm text-gray-600">Remember Me</label>
						</div>
						<a href="#" className="text-sm text-green-600 hover:underline">Forgot Password</a>
					</div>

					<Button 
						label="Login"
						onClick={loginButton}
						className="w-full p-button-success" />
				</div>
        
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">No Account? </span>
          <a href="#" onClick={RegisterButton} className="text-sm text-green-600 hover:underline">Register here</a>
        </div>
      </div>

      {/* Right side CTRL with Links */}
			<div className="flex flex-col justify-between h-full w-[60%] bg-green-700 p-8 text-white">
				<div className="w-full flex flex-col items-center">
					<div className="flex justify-between items-center mb-8">
						<div className="flex items-center">
							<div className="bg-white w-10 h-10 rounded-md mr-4"></div>
							<h1 className="text-2xl font-bold">AppName</h1>
						</div>
					</div>

					<div className="text-center">
						<h2 className="text-4xl font-bold mb-4">Welcome back!</h2>
						<p className="text-xl mb-8">Revolutionizing Rice Supply Chain Transparency and Traceability</p>
					</div>

					<div className="grid grid-cols-4 gap-4 mb-8 w-full">
						<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
							<Search size={24} />
							<span className="mt-2">Chain</span>
						</div>

						<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
							<MapPin size={24} />
							<span className="mt-2">Trace</span>
						</div>

						<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
							<Edit3 size={24} />
							<span className="mt-2">Review</span>
						</div>

						<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
							<Edit3 size={24} />
							<span className="mt-2">Locate</span>
						</div>
					</div>
				</div>

				<div className="w-full flex flex-col items-center">
					<h3 className="text-xl font-semibold mb-4">Connect with us</h3>
					<div className="w-full flex justify-between items-center">
						<Button className="">
							<Lightbulb size={24} />
						</Button>

						<Button className="">
							<Mail size={24} />
						</Button>
						
						<Button className="">
							<Share2 size={24} />
						</Button>
					</div>
				</div>

			</div>
    </div>
  );
};

export default LoginPage;