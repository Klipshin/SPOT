"use client";

import React, { useState } from 'react'
import Link from 'next/link';
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#82C3C1] to-white overflow-hidden">
        <div className="absolute top-0 right-0 w-200 h-200 bg-green-400 opacity-30 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-200 h-200 bg-green-400 opacity-30 rounded-full filter blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="z-10 w-full max-w-6xl h-auto flex overflow-hidden bg-white rounded-r-4xl">
            <div className="w-2/5 overflow-hidden">
                <img
                    src="/snake-login.png"
                    alt="Snake login"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative flex-1 flex flex-col items-center justify-start p-2">
                <div className="flex items-center">
                    <img 
                        src="/spot icon.svg"
                        alt="SPOT logo"
                        className="w-11 h-11"
                    />
                    <h5 className="font-poppins-black bg-gradient-to-b from-[#95AB33] via-[#23732F] via-70% to-[#082E0D] bg-clip-text text-transparent">
                        SPOT
                    </h5>
                </div>

                <div className="relative w-fit">
                    <img 
                        src="/brush-stroke.png"
                        className="w-50 h-auto"
                    />
                    <h3 className="absolute inset-0 flex items-center justify-center text-4xl font-poppins-bold text-[#082E0DB0]">
                        Log In
                    </h3>
                </div>

                <div className="mt-4">
                    <div className="relative w-fit">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="border border-[#082E0D8F] outline-none focus:border-black p-3 px-5 w-100 rounded-lg cursor-text"
                            autoComplete="off"
                        />
                        <div className="absolute left-5 -top-3">
                            <label
                                htmlFor="email"
                                className="bg-white text-sm px-2 font-poppins-italic pointer-events-none"
                            >
                                Email
                            </label>
                        </div>

                    </div>

                    <div className="relative w-fit mt-5">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="border border-[#082E0D8F] outline-none focus:border-black p-3 px-5 w-100 rounded-lg cursor-text transition-colors duration-600 ease-in-out"
                            autoComplete="off"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 bg-white cursor-pointer"
                        >
                            {showPassword ? (
                                <PiEyeBold className="text-2xl" />
                            ) : (
                                <PiEyeClosedBold className="text-2xl" />
                            )}
                        </button>
                        <div className="absolute left-5 -top-3">
                            <label
                                htmlFor="password"
                                className="bg-white text-sm px-2 font-poppins-italic pointer-events-none"
                            >
                                Password
                            </label>
                        </div>
                    </div>

                    <div className="text-left py-1 px-5">
                        <button className="font-poppins-italic text-sm text-[#082E0D8F] hover:text-black transition-colors duration-300 ease-in-out cursor-pointer">
                            Forgot password?
                        </button>
                    </div>
                </div>

                <button className="w-65 mt-3 rounded-lg font-poppins-bold text-2xl p-2 text-[#082E0D] bg-[#95AB33B2] 
                    shadow-[0_4px_8px_rgba(0,0,0,0.3)] hover:bg-[#082E0D] hover:text-[#95AB33B2] transition-colors ease-in-out duration-300 cursor-pointer">
                    Log In
                </button>

                <div className="relative w-fit my-6 flex items-center justify-center">
                    <div className="absolute w-100 h-[1px] bg-gray-400"></div>
                    <div className="relative px-2 bg-white text-sm font-poppins text-gray-400">
                        or continue with
                    </div>
                </div>

                <div className="flex flex-row items-center gap-5 w-100">
                    <button className="w-full relative rounded-lg font-poppins-semibold text-base py-2 px-5  text-gray-500 bg-white flex items-center justify-center
                        shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:bg-[#082E0D] hover:text-[#95AB33B2] transition-colors ease-in-out duration-300 cursor-pointer border border-gray-400">
                        <FcGoogle className="absolute left-5 text-2xl" />
                        Google
                    </button>

                    <button className="w-full relative rounded-lg font-poppins-semibold text-base py-2 px-5  text-gray-500 bg-white flex items-center justify-center
                        shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:bg-[#082E0D] hover:text-[#95AB33B2] transition-colors ease-in-out duration-300 cursor-pointer border border-gray-400">
                        <FaFacebookSquare className="absolute left-5 text-2xl text-blue-600" />
                        Facebook
                    </button>
                </div>

                <div className="absolute bottom-0 mb-10 flex items-center gap-3 ">
                    <p className="text-sm text-gray-400 font-poppins">{"Don't have an account yet?"}</p>
                    <Link 
                        href="/auth/signup"
                        className="text-lg font-poppins-bold text-[#082E0D] hover:text-[#95AB33B2] transition-colors ease-in-out duration-300 cursor-pointer">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}
