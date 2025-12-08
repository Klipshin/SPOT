import { contentViolations } from '@/src/lib/data/contentViolations'
import Image from 'next/image'
import React from 'react'

type FeedProps = {
    reporterProfile: string,
    reporterUsername: string,
    reportedProfile: string,
    reportedUsername: string,
    reportedAt: string,
    reportedContent: string,
    contentPostedAt: string
    contentViolation: string
}

export default function FeedCell({
    reporterProfile,
    reporterUsername,
    reportedProfile,
    reportedUsername,
    reportedAt,
    reportedContent,
    contentPostedAt,
    contentViolation
}: FeedProps ) {

    const violation = contentViolations.find(v => v.id === contentViolation);

  return (
    <div className="relative flex flex-row py-5 px-10 bg-[#4A654D] font-poppins-medium text-white text-lg rounded-xl">
        <div className="absolute top-0 right-0">
            <Image 
                src="/user-warning.svg"
                alt="Warning"
                width={30}
                height={30}
                className="m-2"
            />
        </div>

        <div className="grid grid-cols-[1.5fr_2fr_1.5fr_1fr] gap-5 items-center justify-center">
            <div className="w-full flex flex-col justify-start items-start space-y-5">
                <div className="flex flex-row justify-start items-center space-x-3">
                    <Image 
                        src={reporterProfile}
                        alt={reporterUsername}
                        width={60}
                        height={60}
                        className="rounded-full self-center"
                    />

                    <div className="flex flex-col text-white">
                        <div className="font-poppins-bold text-2xl">{reporterUsername}</div>
                        <div className="font-poppins text-base">{reportedAt}</div>
                    </div>
                </div>

                <div className="w-full flex flex-col space-y-2">
                    <div className="font-poppins-italic text-base">
                        Reported:
                    </div>

                    <div className="w-full flex flex-row justify-start items-center space-x-3 px-3 py-2 bg-[#2B442E] rounded-lg">
                        <Image 
                            src={reportedProfile}
                            alt={reportedUsername}
                            width={45}
                            height={45}
                            className="rounded-full self-center"
                        />

                        <div className="font-poppins-bold text-xl">{reportedUsername}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col bg-white p-3 rounded-lg justify-start items-start space-y-3">
                <div className="flex flex-row justify-start items-center space-x-3">
                    <Image 
                        src={reportedProfile}
                        alt={reportedUsername}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
        
                    <div className="flex flex-col text-black">
                        <div className="font-poppins-bold text-lg">{reportedUsername}</div>
                        <div className="font-poppins text-xs">{contentPostedAt}</div>
                    </div>
                </div>
        
                <div className="text-black text-center text-sm px-3">
                    {reportedContent}
                </div>
            </div>

            <div className="flex flex-col rounded-lg justify-start items-center space-y-2">
                <div className="text-white font-poppins-bold">
                    {violation ? violation.label : "Others"}
                </div>
        
                <div className="text-white/80 text-center text-xs p-5 bg-[#2B442E] rounded-lg">
                    {violation ? violation.description : "No description available."}
                </div>
            </div>

            <div className="flex flex-col space-y-1">
                <button
                    className="rounded-lg px-10 py-1 bg-[#FFC8C9] text-[#BF0003] border-2 border-[#BF0003] hover:bg-[#BF0003] hover:text-[#FFC8C9] hover:scale-105
                    cursor-pointer transition-all duration-200 ease-in-out"
                >
                    Suspend
                </button>

                <button
                    className="rounded-lg px-10 py-1 bg-[#E2E2E2] text-[#646464] border-2 border-[#646464] hover:bg-[#E2E2E2] hover:text-[#646464] hover:scale-105
                    cursor-pointer transition-all duration-200 ease-in-out"
                >
                    Dismiss
                </button>
            </div>
        </div>
    </div>
  )
}
