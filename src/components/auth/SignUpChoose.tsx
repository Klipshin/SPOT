"use client";

import { IoChevronBackCircle } from "react-icons/io5";
import React, { useState } from 'react'
import SignUpForm from "./SignUpForm";
import { useRouter } from "next/navigation";

export default function SignUpChoose() {
    const [selectedRole, setSelectedRole] = useState<'enthusiast' | 'expert' | null>(null);
    const router = useRouter();

    if (selectedRole){
        return <SignUpForm role={selectedRole} onBack={() => setSelectedRole(null)} />;
    }

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    }

  return (
    <div className="z-10 w-full max-w-6xl h-auto flex flex-col overflow-hidden bg-white rounded-b-4xl">
        <div className="w-fit overflow-hidden">
            <img
                src="/snake-header.png"
                className="w-full h-full object-cover"
            />
        </div>

        <div className="flex justify-between items-center px-5 py-3">
            <button 
                onClick={handleBack}
                className="rounded-full px-5 py-1 bg-[#D0E69069] shadow-[0_4px_8px_rgba(0,0,0,0.3)] text-base font-poppins-bold text-[#082E0DB0] flex items-center justify-center gap-2
                    hover:bg-[#95AB33B2] transition-colors dura ease-in-out cursor-pointer"
            >
                <IoChevronBackCircle className="pointer-events-none"/>
                back
            </button>
            <button 
                onClick={() => router.push("/auth/login")}
                className="rounded-full px-5 py-1 bg-[#D0E69069] shadow-[0_4px_8px_rgba(0,0,0,0.3)] text-base font-poppins-bold text-[#082E0DB0] flex items-center justify-center gap-2
                    hover:bg-[#95AB33B2] transition-colors dura ease-in-out cursor-pointer"
            >                
                Log In
            </button>
        </div>

        <div className="-mt-8 flex flex-row justify-center items-center">
            <div className="font-poppins-semibold text-3xl text-[#082E0DE3] flex items-center gap-2">
                <span>Help us personalize</span>

                <div className="flex items-center mx-1">
                <img 
                    src="/spot icon.svg"
                    alt="SPOT logo"
                    className="w-11 h-11"
                />
                <h5 className="font-poppins-black bg-gradient-to-b from-[#95AB33] via-[#23732F] via-70% to-[#082E0D] bg-clip-text text-transparent">
                    SPOT
                </h5>
                </div>
                <span>for you:</span>
            </div>
        </div>

        <div className="flex justify-center items-center gap-10 p-5 mb-5">
            <button 
                onClick={() => setSelectedRole("enthusiast")}
                className="flex flex-col items-center justify-center py-3 px-7 gap-2 rounded-4xl bg-[#3A617F80]
                    hover:-translate-y-3 duration-300 ease-in-out transition-transform cursor-pointer"
            >
                <h3 className="text-2xl text-[#0C2539] font-poppins-extrabold">Nature Enthusiast</h3>
                <img 
                    src="/nature-enthusiast.png" 
                    className="w-100 h-auto"
                />
                <p className="text-xs">{"I'm here to learn and share observations"}</p>
            </button>

            <p className="text-3xl text-[#082E0DB0] font-poppins-bold ">or</p>

            <button 
                onClick={() => setSelectedRole("expert")}
                className="flex flex-col items-center justify-center py-3 px-7 gap-2 rounded-4xl bg-[#521F2080]
                    hover:-translate-y-3 duration-300 ease-in-out transition-transform cursor-pointer"
            >
                <h3 className="text-2xl text-[#2E0506ED] font-poppins-extrabold">Wildlife Expert</h3>
                <img 
                    src="/wildlife-expert.png" 
                    className="w-100 h-auto"
                />
                <p className="text-xs">{"I have expertise in species identification"}</p>
            </button>
        </div>
    </div>
  )
}
