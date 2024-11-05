import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { SelectButton } from "primereact/selectbutton";
import { Toast } from "primereact/toast";
import { Dialog } from 'primereact/dialog';
import CryptoJS from "crypto-js";
        
import {
  Wheat,
  Link,
  Map,
  FileStack,
  MapPinned,
  Facebook,
  Mail,
  Linkedin,
  ArrowDown,
  ArrowRight,
	UserSearch
} from "lucide-react";

import { useAuth } from "./AuthContext";
import { AuthClient } from "@dfinity/auth-client";
import { validate } from "uuid";

// Login function
const loginUser = async (email, password, userType) => {
  const authClient = await AuthClient.create();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const internetIdentityUrl = import.meta.env.VITE_INTERNET_IDENTITY_URL;
  const secretKey = import.meta.env.VITE_HASH_KEY;

  const identityLogIn = async () => {
    const width = 500;
    const height = 500;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2 - 25;

    return new Promise((resolve, reject) => {
      authClient.login({
        identityProvider: `${internetIdentityUrl}`,
        onSuccess: resolve,
        onError: () => reject(new Error("Failed to login internet identity.")),
        windowOpenerFeatures: `width=${width},height=${height},left=${left},top=${top}`,
      });
    });
  };

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
    return null; // Return null if no principal is found
  };

  const loginPayload = { email, password, userType };

  const encryptedPayload = CryptoJS.AES.encrypt(
    JSON.stringify(loginPayload),
    secretKey
  ).toString();

  try {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ encryptedPayload }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const encryptedResponse = await response.json();

    const bytes = CryptoJS.AES.decrypt(encryptedResponse.data, secretKey);
    const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    if (user) {
      if (userType === "Admin") {
        try {
          await identityLogIn(); // If login fails, it will throw an error
        } catch (error) {
          return { success: false, message: error.message };
        }

        const newPrincipal = await getPrincipal();

        if (newPrincipal) {
          if (user.principal === null) {
            const payload = { id: user.id, principal: newPrincipal };
            const encryptedPayload = CryptoJS.AES.encrypt(
              JSON.stringify(payload),
              secretKey
            ).toString();

            const res = await fetch(`${apiUrl}/users/update`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ encryptedPayload }),
            });

            if (!res.ok) {
              throw new Error("Failed to update user principal");
            }

            user.principal = newPrincipal;
          } else if (user.principal !== newPrincipal) {
            return { success: false, message: "Invalid internet identity" };
          }
        } else {
          return { success: false, message: "Failed to get principal" };
        }
      }
      return { success: true, user };
    } else {
      return { success: false, message: "Wrong credentials" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Invalid user type, email or password" };
  }
};

const LoginPage = () => {
  const toast = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [userTypeError, setUserTypeError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [underverificationVisible, setUnderverificationVisible] = useState(false);
  const secretKey = import.meta.env.VITE_HASH_KEY;

  // useEffect(() => {
  // 	const updatePayload = {
  // 		id: 1,
  // 		userType: "Admin",
  // 		isVerified: true,
  // 		status: "Active"
  // 	}
  // 	const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(updatePayload), secretKey).toString();
  // 	console.log({encryptedPayload});
  // }, []);

  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      const { email, password, userType } = JSON.parse(rememberedUser);
      setEmail(email);
      setPassword(password);
      setUserType(userType);
      setRememberMe(true);
    }
  }, []);

  const userTypes = [
    { label: "NFA Branch Staff", value: "NFA Branch Staff" },
    { label: "Admin", value: "Admin" },
    { label: "Rice Recipient", value: "Rice Recipient" },
    { label: "Private Miller", value: "Private Miller" },
  ];

  const loginButton = async () => {
    const isValidated = validateForm();

    if (isValidated) {
      setLoading(true);
      const result = await loginUser(email, password, userType);
      setLoading(false);

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem(
            "rememberedUser",
            JSON.stringify({
              email,
              password,
              userType,
            })
          );
        } else {
          localStorage.removeItem("rememberedUser");
        }
        login({ ...result.user, userType });

        switch (userType) {
          case "Admin":
            navigate("/admin");
            break;
          case "NFA Branch Staff":
            navigate("/staff");
            break;
          case "Rice Recipient":
            navigate("/recipient");
            break;
          case "Private Miller":
            navigate("/miller");
            break;
          default:
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Invalid user type",
              life: 3000,
            });
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.message,
          life: 3000,
        });
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

    if (!email || !password || !userType) {
      return false;
    }

    return true;
  };

  const RegisterButton = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  const forgotButton = (e) => {
    e.preventDefault();
    navigate("/forgotpassword");
  };

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

	const dialogHeader = () => {
		return (
			<div className="flex gap-4 items-center">
				<img src="favicon.ico" alt="AgriCTRL+ Logo" className='h-8'/>
				<p>Verification</p>
			</div>
		)
	}

	return (
		<div className="h-fit md:h-screen w-screen flex flex-col-reverse md:flex-row md:gap-10 p-0 md:p-10">
			<Toast 
				ref={toast} 
				pt={{
					root: { className: 'bg-opacity-100' },
					message: { className: 'bg-white shadow-lg' }
				}}
			/>
			<Dialog 
				header={dialogHeader()}
				footer={
					<Button className='w-full bg-primary hover:bg-primaryHover' label='Close' onClick={() => setUnderverificationVisible(false)} />
				}
				visible={underverificationVisible} 
				onHide={() => {if (!visible) return; setUnderverificationVisible(false); }}
				className="w-screen h-screen sm:w-1/3 sm:h-fit flex"
			>
				<div className="flex flex-col gap-4 items-center justify-center text-center h-full">
					<img src="illustrations/verification.svg" alt="Empty Image" className="h-32" />
					<p className='text-2xl font-semibold'>Under Verification</p>
					<p>We are verifying your account for <span className='text-primary font-semibold'>{email}</span>. Please try again later.</p>
				</div>
			</Dialog>
			{/* Left side */}
			<div className="flex flex-col items-center justify-between h-full w-full md:w-[45%] p-10 gap-4 rounded-2xl">
				<div className="h-full w-full flex flex-col justify-start gap-6">
					<div className="flex items-center cursor-pointer">
						<img src="favicon.ico" alt="AgriCTRL+ Logo" className="h-12 mr-4" onClick={() => navigate('/') } />
					</div>

          <div className="title text-center flex items-center gap-4">
            <h1 className="text-black text-2xl sm:text-4xl font-medium w-fit">
              Login an account
            </h1>
            <ArrowDown size={30} />
          </div>

          <p className="text-md text-black">
            Let's continue working together to build a sustainable future for
            Philippine agriculture.
          </p>

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
									sm:grid-cols-4 grid-cols-2
								p-1 rounded-lg items-center justify-between gap-1 ${
                  userTypeError && "ring-1 ring-[#e24c4c]"
                }`}
                optionValue="value"
                itemTemplate={(item) => (
                  <small className="text-center">{item.label}</small>
                )}
                pt={{
                  button: {
                    className:
                      "px-4 p-2 rounded-lg flex justify-center border-0 ring-0 w-full bg-transparent",
                  },
                }}
              />
              {userTypeError && (
                <small id="userType-help" className="p-error">
                  Please select your user type.
                </small>
              )}
            </div>

						<div className="flex flex-col gap-2">
							<label htmlFor="email" className='text-black text-sm'>Email</label>
							<InputText 
								id="email" 
								aria-describedby="email"
								value={email}
								onChange={(e) => {setEmail(e.target.value); setEmailError(false)}}
								placeholder="Enter your email"
								className="focus:border-primary hover:border-primary ring-0"
								required
								invalid={emailError}
								keyfilter="email"
								maxLength={50}
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
								inputClassName="ring-0"
								required
								invalid={passwordError}
								toggleMask
								feedback={false} 
								footer={footer}
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
                disabled={loading}
              >
                <p className="font-semibold">
                  {loading ? "Logging in..." : "Login"}
                </p>
                <ArrowRight />
              </Button>
              <a
                href="#"
                onClick={forgotButton}
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot Password
              </a>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-black">
                Remember Me
              </label>
            </div>
          </div>
        </div>

        <Divider className="m-0" />

        <div className="text-center">
          <span className="text-black">No Account? </span>
          <a
            href="#"
            onClick={RegisterButton}
            className="font-medium text-primary hover:underline"
          >
            Register here
          </a>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col justify-between h-full w-full md:w-[55%] p-10 text-white relative md:rounded-2xl">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center md:rounded-2xl w-full"
          style={{
            backgroundImage: 'url("/Login-BG.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Filter Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b373a] via-[#00c2617b] to-[#00c26100] md:rounded-2xl"></div>

        <div className="relative z-20 w-full flex flex-col items-center justify-center h-full gap-8">
          <div className="w-full flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-4xl font-medium">
                Welcome back!
              </h2>
              <p className="text-md">
                Revolutionizing Rice Supply Chain Transparency and Traceability
              </p>
            </div>

            <div
              className="grid gap-4 w-full 
							grid-cols-2 sm:grid-cols-4
							grid-rows-2 sm:grid-rows-1 
						"
            >
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
