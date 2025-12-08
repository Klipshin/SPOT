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

export default function PendingVerficationCell({
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
    <div className="relative w-full flex flex-col py-5 px-10 bg-[#4A654D] rounded-xl justify-start items-start space-y-5">
      <div className="absolute top-0 right-0 flex flex-row items-center justify-center m-3 space-x-2">
        <Image 
            src="/user-warning.svg"
            alt="Pending Verification"
            width={25}
            height={25}
        />

        <div className="font-poppins-medium text-[#FFC048] text-lg">Pending</div>
      </div>

      <div className="flex flex-row justify-center items-center space-x-2">
        <Image 
          src={profile}
          alt={name}
          width={75}
          height={75}
          className="rounded-full self-center"
        />

        <div className="flex flex-col text-white">
          <div className="font-poppins-bold text-3xl">{name}</div>
          <div className="-mt-2 font-poppins text-lg">{username}</div>
        </div>
      </div>

      <div className="flex flex-col text-white justify-start items-start">
        <div className="font-poppins-bold text-2xl">{job}</div>
        
        <div className="flex flex-row justify-center items-center gap-1 font-poppins text-md">
          <FaLocationDot className="text-red-500"/>
          {location}
        </div>

        {link && (
          <div className="flex flex-row justify-center items-center gap-1 font-poppins text-md">
            <FaLink className="text-[#FFC048]"/>
            {link}
          </div>
        )}
      </div>

      <div className="w-full flex flex-col text-white justify-start items-start">
        <div className="font-poppins-medium-italic text-md">Submitted Documents:</div>

        <div className="w-full grid grid-cols-3 gap-4">
          <div className="w-full bg-[#E2E2E2] border-2 border-[#646464] rounded-lg py-3 px-5 flex flex-col text-[#646464]">
            <div className="font-poppins-bold text-lg">
              {`ID/Certificate`}
            </div>

            <div className="font-poppins-medium text-base">
              {certificateFile}
            </div>

            <button 
              className="mt-3 w-35 bg-[#646464] text-[#E2E2E2] cursor-pointer rounded-full text-lg font-poppins-bold
              flex flex-row items-center justify-center gap-2 py-1 hover:scale-105 transition-all duration-300 ease-in-out">
              <PiEyeBold className="text-xl"/> 
              View
            </button>
          </div>

          <div className="w-full bg-[#E2E2E2] border-2 border-[#646464] rounded-lg py-3 px-5 flex flex-col text-[#646464]">
            <div className="font-poppins-bold text-lg">
              {`Employment/Organization Proof`}
            </div>

            <div className="font-poppins-medium text-base">
              {employmentFile}
            </div>

            <button 
              className="mt-3 w-35 bg-[#646464] text-[#E2E2E2] cursor-pointer rounded-full text-lg font-poppins-bold
              flex flex-row items-center justify-center gap-2 py-1 hover:scale-105 transition-all duration-300 ease-in-out">
              <PiEyeBold className="text-xl"/> 
              View
            </button>
          </div>
          
          <div className="w-full bg-[#E2E2E2] border-2 border-[#646464] rounded-lg py-3 px-5 flex flex-col text-[#646464]">
            <div className="font-poppins-bold text-lg">
              {`Degree/Diploma`}
            </div>

            <div className="font-poppins-medium text-base">
              {diplomaFile}
            </div>

            <button 
              className="mt-3 w-35 bg-[#646464] text-[#E2E2E2] cursor-pointer rounded-full text-lg font-poppins-bold
              flex flex-row items-center justify-center gap-2 py-1 hover:scale-105 transition-all duration-300 ease-in-out">
              <PiEyeBold className="text-xl"/> 
              View
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-row space-x-3 font-poppins-bold">
        <button
            className="rounded-lg px-10 py-1 bg-[#F4FFC5] text-[#00600E] border-2 border-[#00600E] hover:bg-[#00600E] hover:text-[#F4FFC5] hover:scale-105
            cursor-pointer transition-all duration-200 ease-in-out"
        >
            Approve
        </button>

        <button
            className="rounded-lg px-10 py-1 bg-[#FFC8C9] text-[#BF0003] border-2 border-[#BF0003] hover:bg-[#BF0003] hover:text-[#FFC8C9] hover:scale-105
            cursor-pointer transition-all duration-200 ease-in-out"
        >
            Reject
        </button>
      </div>
    </div>
  )
}
