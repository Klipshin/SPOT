import Image from 'next/image'
import React from 'react'

type FeedProps = {
    reporterProfile: string,
    reporterUsername: string,
    reportedProfile: string,
    reportedUsername: string,
    date: string,
    reportedContent: React.ReactNode
}

export default function FeedCell({
    reporterProfile,
    reporterUsername,
    reportedProfile,
    reportedUsername,
    date,
    reportedContent
}: FeedProps ) {
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

        <div className="grid grid-cols-[2fr_2fr_2fr_1fr] items-center justify-center">
            <div className="flex flex-col justify-start items-start space-y-5">
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
                        <div className="font-poppins text-base">{date}</div>
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <div className="font-poppins-italic text-base">
                        Reported:
                    </div>

                    <div className="w-75 flex flex-row justify-start items-center space-x-3 px-3 py-2 bg-[#2B442E] rounded-lg">
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
        </div>
    </div>
  )
}
