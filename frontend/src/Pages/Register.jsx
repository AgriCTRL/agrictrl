import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AuthClient } from "@dfinity/auth-client";
import { useNavigate } from 'react-router-dom';

const RegistrationPage = ({ onRegisterSuccess }) => {
  const [principal, setPrincipal] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastname] = useState('');
  const [position, setPosition] = useState('');
  const [region, setRegion] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrincipal = async () => {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal().toText();
      setPrincipal(principal);
    };
    fetchPrincipal();
  }, []);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    const nfaPersonnel = {
        principal,  
        firstName,
        lastName,
        position,
        region,
    };
    try {
        const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/nfapersonnels', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(nfaPersonnel)
        });
        if(!res.ok) {
            throw new Error('Error registering user');
        }
        onRegisterSuccess();
        navigate('/trader');
    }
    catch (error) {
        console.log(error.message);
    }
  }

  return (
    <div className="font-poppins flex h-screen w-screen bg-gray-100">
      {/* Left side with background image */}
      <div className="hidden md:flex md:w-[30%] bg-green-500 relative rounded-2xl mx-5 my-14 ">
        <div className="absolute inset-0 rounded-2xl bg-cover bg-center" style={{backgroundImage: "url('Registration-leftBG.png')"}}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#005155] to-[#00C26100]/5"></div>
        </div>
        <div className="relative w-full z-10 p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 flex justify-center items-center">Registration</h2>
          <div className="flex justify-center items-center pt-96">
            <img src="AgriCTRLLogo.png" alt="AgriCTRL+ Logo" className="h-12 mr-2" />
            <span className="text-2xl font-bold">AgriCTRL+</span>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-[#005155] mb-6">Personal Information</h2>
        <p className="mb-6 text-gray-600">Please fill out the information below.</p>
        <form onSubmit={ handleRegister } className="space-y-4 flex flex-col">
            <div className="flex flex-row mb-10">
                <div className="mr-5">
                    <label htmlFor="firstName" className="">First Name</label>
                    <InputText required value={firstName} onChange={(e) => setFirstName(e.target.value)} id="firstName" placeholder="enter your first name" className="Normal border rounded-lg w-full h-10 pl-3 pr-3 mt-2" />
                </div>
                <div>
                    <label htmlFor="lastName" className="">Last Name</label>
                    <InputText required value={lastName} onChange={(e) => setLastname(e.target.value)} id="lastName" placeholder="enter your last name" className="Normal border rounded-lg w-full h-10 pl-3 pr-3 mt-2" />
                </div>
            </div>
            
            <div className="">
                <label className="block mb-1">Position</label>
                <InputText required value={position} onChange={(e) => setPosition(e.target.value)} id="position" placeholder="enter your position" className="Normal border rounded-lg w-[48%] h-10 pl-3 pr-3 mt-2" />
            </div>
            <div className="">
                <label className="block mb-1">Region</label>
                <InputText required value={region} onChange={(e) => setRegion(e.target.value)} id="region" placeholder="enter your region" className="Normal border rounded-lg w-[48%] h-10 pl-3 pr-3 mt-2" />
            </div>
            <Button label="Register" className="ml-[450px] w-40 h-8 text-white bg-[#005155] border-[#005155] hover:bg-teal-700" />
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
