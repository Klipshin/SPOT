import React from 'react'
import { FaFolder } from "react-icons/fa";
import FileUpload from './FileUpload';

export default function ExpertVerification() {
  return (
    <div className="z-10 w-full h-auto max-w-6xl bg-white rounded-l-4xl flex overflow-hidden">
        <div className="relative flex-1 flex flex-col items-center justify-start p-2">
            <div className="w-full flex items-center justify-between px-5">
                <button 
                    className="rounded-full px-5 py-1 bg-[#D0E69069] shadow-[0_4px_8px_rgba(0,0,0,0.3)] text-base font-poppins-bold text-[#082E0DB0] flex items-center justify-center gap-2
                        hover:bg-[#95AB33B2] transition-colors dura ease-in-out cursor-pointer"
                >
                    back
                </button>

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
            </div>

            <div className="relative w-full flex items-center justify-center -mt-7">
                <img 
                    src="/brush-stroke-two.png"
                    className="w-base h-auto"
                />
                <h3 className="absolute inset-0 flex items-center justify-center text-4xl font-poppins-bold text-[#082E0DB0]">
                    Verify Your Expertise
                </h3>
            </div>

            <div className="flex items-center justify-center gap-5">
                <h4 className="text-base font-poppins-medium-italic">{"Job/Occupation"}</h4>

                <div className="relative w-fit">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="border border-[#082E0D8F] outline-none focus:border-black py-1 px-2 w-75 rounded-lg cursor-text"
                        autoComplete="off"
                    />
                </div>
            </div>

            <div className="relative w-full flex flex-col items-center justify-center">
                <div className="w-4/5 h-[1px] mt-5 mb-2 bg-gray-400" />
                <p className="text-[11px] font-poppins-italic text-gray-400">{"Please provide one or more of the following (preferably all three) to confirm your expert status."}</p>
            </div>
        
            <div className="mt-4">
                <FileUpload 
                    label="ID/Certificate"
                    id="certificateFile"
                    acceptedFiles=".pdf,.jpg,.png"
                />
            </div>
        
                        <button 
                            className="w-65 mt-3 rounded-lg font-poppins-bold text-2xl p-2 text-[#082E0D] bg-[#95AB33B2] 
                                shadow-[0_4px_8px_rgba(0,0,0,0.3)] hover:bg-[#082E0D] hover:text-[#95AB33B2] transition-colors ease-in-out duration-300 cursor-pointer">
                            Sign Up
                        </button>
        
                        <div className="relative w-fit my-4 flex items-center justify-center">
                            <div className="absolute w-100 h-[1px] bg-gray-400"></div>
                            <div className="relative px-2 bg-white text-sm font-poppins text-gray-400">
                                or sign up with
                            </div>
                        </div>
        
                    </div>
        <div className="w-2/5 overflow-hidden">
            <img 
                src="/snake-verification.png"
                className="w-full h-full object-cover"
            />
        </div>
    </div>
  )
}
