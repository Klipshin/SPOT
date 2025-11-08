import React from 'react'
import DefaultAvatars from './DefaultAvatars'

export default function SetupProfile() {
  return (
    <div className="relative z-10 flex flex-col items-left justify-center gap-5 w-full px-50 ">
        <div className="absolute top-4/5 -right-80 transform -translate-y-1/2 pointer-events-none">
            <img 
                src="/spotmascot.svg"
                className="w-200 h-auto rotate-12"
            />
        </div>
        <div className="ml-15 font-poppins-black text-4xl text-[#2E0506ED]">Setup Your Profile</div>
        <div className="flex flex-col w-full items-center justify-center px-20 py-10 rounded-4xl bg-[#F1EEE5] gap-5">

            <div className="flex items-center justify-center w-3/5 gap-3">
                <img 
                    src="/binoculars.png"
                    className="w-10 h-auto"
                />
                <div className="relative w-full flex items-center">
                    <div className="absolute left-3 top-1/2 -translate-y-3/5 font-poppins-semibold text-[#145D1F] text-2xl">@</div>
                    <input 
                        className="w-full pl-10 p-2 border border-gray-500 rounded-xl text-xl bg-white"
                    />
                </div>
                <button
                    className="rounded-full p-3 hover:bg-gray-300 cursor-pointer transition-colors duration-300 ease-in-out"
                >
                    <img 
                        src="/user-avatar.png"
                        className="w-10 h-auto"
                    />
                </button>
            </div>

            <div className="flex flex-row items-center w-full justify-center gap-5">
                <div className="flex w-full flex-col items-center justify-center">
                    <h3 className="text-xl font-poppins-semibold">Choose your explorer look</h3>
                    <div className="relative mt-5">
                        <img 
                            src="/empty-profile.png"
                            className="w-30 h-auto"
                        />
                        <button
                            className="absolute bottom-0 right-0 cursor-pointer"
                        >
                            <img 
                                src="/image-picker.png"
                                className="w-8 h-auto"
                            />
                        </button>
                    </div>

                    <div className="mt-6 w-full flex items-center justify-center gap-2">
                        <div className="flex-1 h-[1px] bg-gray-300"></div>
                        <div className="whitespace-nowrap text-center px-2 text-xs font-poppins text-gray-300">
                            or choose your character
                        </div>
                        <div className="flex-1 h-[1px] bg-gray-300"></div>
                    </div>

                    <div className="mt-3">
                        <DefaultAvatars />
                    </div>

                </div>

                <div className="m-5 w-[1px] h-full bg-black" />

                <div className="flex flex-col w-full items-center justify-center mr-25">
                    <img 
                        src="/location.png"
                        className="w-10 h-auto"
                    />
                    <h3 className="text-xl font-poppins-semibold">Where are you located?</h3>
                    <p className="text-sm text-[#082E0DBF] text-center">Helps other explorers find people in their area and build communities</p>
                    <div className="relative w-full flex items-center m-3">
                        <img
                            src="/location-input.png"
                            className="absolute left-3 top-1/2 -translate-y-1/2 font-poppins-semibold text-[#145D1F] text-2xl"
                        />    
                        <input 
                            className="w-full pl-12 p-2 border border-gray-500 rounded-xl text-xl bg-white"
                        />
                    </div>
                    <div className=" text-sm font-poppins-italic text-gray-400">You can update this anytime</div>
                    <button 
                        className="m-10 w-full rounded-full px-20 py-2 bg-[#C3DEE1CC] shadow-[0_4px_8px_rgba(0,0,0,0.3)] text-xl font-poppins-bold text-[#034CBCBA] flex items-center justify-center gap-2
                            hover:bg-[#034CBCBA] hover:text-[#C3DEE1CC] transition-colors dura ease-in-out cursor-pointer"
                    >
                        Start Exploring!
                        <img
                            src="/binoculars-two.png"
                            className="text-3xl pointer-events-none scale-x-[-1]"
                        />
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}
