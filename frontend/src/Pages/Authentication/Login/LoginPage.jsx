import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { SelectButton } from 'primereact/selectbutton';
import { Divider } from 'primereact/divider';
          
import { Wheat, Link, Map, FileStack, MapPinned, Facebook, Mail, Linkedin, ArrowDown, ArrowRight} from 'lucide-react';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [userType, setUserType] = useState(null);
	const [emailError, setEmailError] = useState(false);
	const [userTypeError, setUserTypeError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const navigate = useNavigate();

	const userTypes = [
		{ label: 'Staff', value: 'staff' },
		{ label: 'Admin', value: 'admin' },
		{ label: 'Recipient', value: 'recipient' },
		{ label: 'Private Miller', value: 'privateMiller' }
	];

	const loginButton = () => {
		validateForm()
		if (email && password) {
			if (userType === 'admin') {
				navigate('/admin');
			} else if (userType === 'staff') {
				navigate('/staff');
			} else if (userType === 'recipient') {
				navigate('/recipient');
			} else if (userType === 'privateMiller') {
				navigate('/miller');
			}	
		}
	};

	const validateForm = () => {
		setEmailError(false);
		setPasswordError(false);
		setUserTypeError(false);
		if (!email) setEmailError(true);
		if (!password) setPasswordError(true);
		if (!userType) setUserTypeError(true);
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
		<div className="h-fit md:h-screen w-screen flex flex-col-reverse md:flex-row md:gap-10 p-0 md:p-10">
			{/* Left side */}
			<div className="flex flex-col items-center justify-between h-full w-full md:w-[45%] p-10 gap-4 rounded-2xl">
				<div className="h-full w-full flex flex-col justify-start gap-6">
					<div className="flex items-center cursor-pointer">
						<img src="favicon.ico" alt="AgriCTRL+ Logo" className="h-12 mr-4" onClick={() => navigate('/') } />
					</div>

					<div className="title text-center flex items-center gap-4">
						<h1 className="text-black text-2xl sm:text-4xl font-medium w-fit">Login an account</h1>
						<ArrowDown size={30} />
					</div>

					<p className="text-md text-black">Let's continue working together to build a sustainable future for Philippine agriculture.</p>

					<div className="form flex flex-col gap-4">
						<div className="w-full">
							<SelectButton 
								invalid
								id="userType"
								value={userType} 
								onChange={(e) => setUserType(e.value)} 
								options={userTypes}
								className={`login-select-button w-full bg-tag-grey/50 
									grid sm:grid-rows-1 grid-flow-col-2
									sm:grid-cols-3 grid-cols-2
								p-1 rounded-lg items-center justify-between gap-1 ${userTypeError && 'ring-1 ring-[#e24c4c]'}`}
								optionValue="value" 
								itemTemplate={(item) => (
									<small className="text-center">{item.label}</small>
								)}
								pt={{
									button: {
										className: 'px-4 p-2 rounded-lg flex justify-center border-0 ring-0 w-full bg-transparent'
									}
								}}
							/>
							{userTypeError && 
								<small id="userType-help" className='p-error'>
									Please input your user type.
								</small>
							}
						</div>

						<div className="flex flex-col gap-2">
							<label htmlFor="email" className='text-black text-sm'>Email</label>
							<InputText 
								id="email" 
								aria-describedby="email"
								value={email}
								onChange={(e) => {setEmail(e.target.value); setEmailError(false)}}
								placeholder="Enter your email"
								className="focus:border-primary hover:border-primary"
								required
								invalid={emailError}
								keyfilter="email"
							/>
							{emailError && 
								<small id="email-help" className='p-error'>
									Please input a valid email.
								</small>
							}
						</div>

						<div className="flex flex-col gap-2">
							<label htmlFor="password" className='text-black text-sm'>Password</label>
							<Password 
								id="password" 
								aria-describedby="password"
								value={password}
								onChange={(e) => {setPassword(e.target.value); setPasswordError(false)}}
								placeholder="Enter your password"
								className="focus:border-primary hover:border-primary w-full"
								required
								invalid={passwordError}
								toggleMask
								feedback={false} 
							/>
							{passwordError && 
								<small id="password-help" className='p-error'>
									Please input your password.
								</small>
							}
						</div>

						<div className="flex justify-between items-center w-full gap-4">
							<Button 
								onClick={loginButton}
								className="w-3/4 bg-gradient-to-r from-secondary to-primary text-white px-20 py-3 rounded-lg ring-0 border-none hover:opacity-90 transition-all items-center justify-center gap-2" 
							>	
								<p className='font-semibold'>Login</p>
								<ArrowRight />
							</Button>
							<a href="#" onClick={forgotButton} className="text-sm font-medium text-primary hover:underline">Forgot Password</a>
						</div>
						<div className="flex items-center">
							<input type="checkbox" id="remember" className="mr-2" />
							<label htmlFor="remember" className="text-black">Remember Me</label>
						</div>
					</div>
				</div>
				
				<Divider className='m-0' />

				<div className="text-center">
					<span className="text-black">No Account? </span>
					<a href="#" onClick={RegisterButton} className="font-medium text-primary hover:underline">Register here</a>
				</div>
			</div>

			{/* Right side */}
			<div className="flex flex-col justify-between h-full w-full md:w-[55%] p-10 text-white relative md:rounded-2xl">
				{/* Background Image */}
				<div 
					className="absolute inset-0 bg-cover bg-center md:rounded-2xl w-full" 
					style={{ 
						backgroundImage: 'url("/Login-BG.jpg")', 
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat'
					}}
				></div>

				{/* Filter Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-[#0b373a] via-[#00c2617b] to-[#00c26100] md:rounded-2xl"></div>

				<div className="relative z-20 w-full flex flex-col items-center justify-center h-full gap-8">
					<div className='w-full flex flex-col gap-6'>
						<div className="text-center">
							<h2 className="text-2xl sm:text-4xl font-medium">Welcome back!</h2>
							<p className="text-md">Revolutionizing Rice Supply Chain Transparency and Traceability</p>
						</div>

						<div className="grid gap-4 w-full 
							grid-cols-2 sm:grid-cols-4
							grid-rows-2 sm:grid-rows-1 
						">
							<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/10 hover:bg-white/25 transition shadow-xl backdrop-blur-sm rounded-lg">
								<Link size={20} />
								<span className="mt-2">Chain</span>
							</div>

							<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/10 hover:bg-white/25 transition shadow-xl backdrop-blur-sm rounded-lg">
								<Map size={20} />
								<span className="mt-2">Trace</span>
							</div>

							<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/10 hover:bg-white/25 transition shadow-xl backdrop-blur-sm rounded-lg">
								<FileStack size={20} />
								<span className="mt-2">Review</span>
							</div>

							<div className="p-button-outlined p-button-secondary h-32 flex flex-col items-center justify-center bg-white/10 hover:bg-white/25 transition shadow-xl backdrop-blur-sm rounded-lg">
								<MapPinned size={20} />
								<span className="mt-2">Locate</span>
							</div>
						</div>

						<div className="w-full flex flex-col items-center">
							<h3 className="text-xl font-semibold">Connect with us</h3>
							<div className="w-full flex justify-between items-center">
								<Button className="ring-0 bg-transparent border-none">
									<Facebook size={20} />
								</Button>

								<Button className="ring-0 bg-transparent border-none">
									<Mail size={20} />
								</Button>
										
								<Button className="ring-0 bg-transparent border-none">
									<Linkedin size={20} />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;