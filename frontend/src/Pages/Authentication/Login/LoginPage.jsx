import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Wheat, Link, Map, FileStack, MapPinned, Facebook, Mail, Linkedin} from 'lucide-react';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { useAuth } from './AuthContext';
import { AuthClient } from "@dfinity/auth-client";

// Login function
const loginUser = async (email, password, userType) => {
  const authClient = await AuthClient.create();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const internetIdentityUrl = import.meta.env.VITE_INTERNET_IDENTITY_URL;
  
  const identityLogIn = async () => {
    const width = 500;
    const height = 500;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2) - 25;
    await new Promise((resolve, reject) => {
      authClient.login({
          identityProvider: `${internetIdentityUrl}`,
          onSuccess: resolve,
          onError: reject,
          windowOpenerFeatures: `width=${width},height=${height},left=${left},top=${top}`
      });
    });
  }

  const getPrincipal = async () => {
    try {
        const isAuthenticated = await authClient.isAuthenticated();
        if (isAuthenticated) {
            const identity = authClient.getIdentity();
            return identity.getPrincipal().toText();
        }
    } catch (error) {
        console.log(error.message);
    }
  };
  
  try {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'API-Key': `${apiKey}`
      },
      body: JSON.stringify({ email, password, userType })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const user = await response.json();

    if (user) {
      if(userType === 'Admin') {
        await identityLogIn();
        const newPrincipal = await getPrincipal();

        if (newPrincipal) {
          if (user.principal === null) {
            const res = await fetch(`${apiUrl}/users/update`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'API-Key': `${apiKey}`
              },
              body: JSON.stringify({ id: user.id, principal: newPrincipal })
            });

            if (!res.ok) {
              throw new Error('Failed to update user principal');
            }
            
            user.principal = newPrincipal;
          } else if (user.principal !== newPrincipal) {
            return { success: false, message: 'Principal mismatch' };
          }
        } else {
          return { success: false, message: 'Failed to get principal' };
        }
      }
      return { success: true, user };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const userTypes = [
    { label: 'NFA Branch Staff', value: 'NFA Branch Staff' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Rice Recipient', value: 'Rice Recipient' },
    { label: 'Private Miller', value: 'Private Miller' }
  ];

  const loginButton = async () => {
    if (!email || !password || !userType) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password, userType);
    setLoading(false);

    if (result.success) {
      login({ ...result.user, userType });

      switch (userType) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'NFA Branch Staff':
          navigate('/staff');
          break;
        case 'Rice Recipient':
          navigate('/recipient');
          break;
        case 'Private Miller':
          navigate('/miller');
          break;
        default:
          alert('Invalid user type');
      }
    } else {
      alert(result.message);
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

  const footer = (
		<>
			<Divider />
			<p className="mt-2">Suggestions</p>
			<ul className="pl-2 ml-2 mt-0 line-height-3">
				<li>At least one lowercase</li>
				<li>At least one uppercase</li>
				<li>At least one numeric</li>
				<li>Minimum 8 characters</li>
			</ul>
		</>
	);

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
						<Password
							id="password"
							value={password}
							footer={footer}
							toggleMask 
							feedback={false}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							inputClassName='w-full ring-0'
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
            label={loading ? 'Logging in...' : 'Login'}
            onClick={loginButton}
            disabled={loading}
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