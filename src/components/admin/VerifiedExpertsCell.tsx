import Image from 'next/image'
import React from 'react'
import { FaLink, FaLocationDot } from 'react-icons/fa6'
import { PiEyeBold } from 'react-icons/pi'

type ExpertProps = {
  profile: string,
  name: string,
  username: string,
  job: string,
  location: string,
  link?: string,
  certificateFile: string,
  employmentFile: string,
  diplomaFile: string
}

export default function VerifiedExpertsCell({
  profile,
  name,
  username,
  job,
  location,
  link,
  certificateFile,
  employmentFile,
  diplomaFile
}: ExpertProps) {
  return (
    <div className="relative w-full flex flex-col py-5 px-10 bg-white rounded-xl justify-start items-start space-y-5">
      <div className="absolute top-0 right-0 flex flex-row items-center justify-center m-3">
        <Image 
            src="/spot icon.svg"
            alt="Verified Expert"
            width={40}
            height={40}
        />

        <div className="font-poppins-bold text-[#082E0D] text-lg">Verified</div>
      </div>

      <div className="flex flex-row justify-center items-center space-x-2">
        <Image 
          src={profile}
          alt={name}
          width={75}
          height={75}
          className="rounded-full self-center"
        />

        <div className="flex flex-col text-black">
          <div className="font-poppins-bold text-3xl">{name}</div>
          <div className="-mt-2 font-poppins text-lg">{username}</div>
        </div>
      </div>

      <div className="flex flex-col text-black justify-start items-start">
        <div className="font-poppins-bold text-2xl">{job}</div>
        
        <div className="flex flex-row justify-center items-center gap-1 font-poppins text-md">
          <FaLocationDot className="text-[#BF0003]"/>
          {location}
        </div>

        {link && (
          <div className="flex flex-row justify-center items-center gap-1 font-poppins text-md">
            <FaLink className="text-[#00600E]"/>
            {link}
          </div>
        )}
      </div>

      <div className="w-full flex flex-col text-black justify-start items-start">
        <div className="font-poppins-medium-italic text-md">Submitted Documents:</div>

        <div className="w-full grid grid-cols-3 gap-4">
          <div className="w-full bg-[#F4FFC5] border-2 border-[#00600E] rounded-lg py-3 px-5 flex flex-col text-[#00600E]">
            <div className="font-poppins-bold text-lg">
              {`ID/Certificate`}
            </div>

            <div className="font-poppins-medium text-base">
              {certificateFile}
            </div>

            <button 
              className="mt-3 w-35 bg-[#00600E] text-[#F4FFC5] cursor-pointer rounded-full text-lg font-poppins-bold
              flex flex-row items-center justify-center gap-2 py-1 hover:scale-105 transition-all duration-300 ease-in-out">
              <PiEyeBold className="text-xl"/> 
              View
            </button>
          </div>

          <div className="w-full bg-[#F4FFC5] border-2 border-[#00600E] rounded-lg py-3 px-5 flex flex-col text-[#00600E]">
            <div className="font-poppins-bold text-lg">
              {`Employment/Organization Proof`}
            </div>

            <div className="font-poppins-medium text-base">
              {employmentFile}
            </div>

            <button 
              className="mt-3 w-35 bg-[#00600E] text-[#F4FFC5] cursor-pointer rounded-full text-lg font-poppins-bold
              flex flex-row items-center justify-center gap-2 py-1 hover:scale-105 transition-all duration-300 ease-in-out">
              <PiEyeBold className="text-xl"/> 
              View
            </button>
          </div>
          
          <div className="w-full bg-[#F4FFC5] border-2 border-[#00600E] rounded-lg py-3 px-5 flex flex-col text-[#00600E]">
            <div className="font-poppins-bold text-lg">
              {`Degree/Diploma`}
            </div>

            <div className="font-poppins-medium text-base">
              {diplomaFile}
            </div>

            <button 
              className="mt-3 w-35 bg-[#00600E] text-[#F4FFC5] cursor-pointer rounded-full text-lg font-poppins-bold
              flex flex-row items-center justify-center gap-2 py-1 hover:scale-105 transition-all duration-300 ease-in-out">
              <PiEyeBold className="text-xl"/> 
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
