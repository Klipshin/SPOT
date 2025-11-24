import Image from 'next/image'
import React from 'react'

type HistoryProps = {
    reporterProfile: string,
    reporterUsername: string,
    reportedProfile: string,
    reportedUsername: string,
    date: string
}

export default function HistoryCell({
    reporterProfile,
    reporterUsername,
    reportedProfile,
    reportedUsername,
    date
}: HistoryProps ) {
  return (
    <div className="py-2 px-25 bg-[#4A654D] font-poppins-medium text-white text-lg rounded-xl grid grid-cols-[2fr_2fr_minmax(150px,250px)] items-center justify-center">
        <div className="flex flex-row justify-start items-center space-x-3">
            <Image 
                src={reporterProfile}
                alt={reporterUsername}
                width={50}
                height={50}
                className="rounded-full self-center"
            />

            <div className="text-center text-xl">
                {reporterUsername}
            </div>
        </div>

        <div className="flex flex-row justify-start items-center space-x-3">
            <Image 
                src={reportedProfile}
                alt={reportedUsername}
                width={50}
                height={50}
                className="rounded-full self-center"
            />

            <div className="text-center text-xl">
                {reportedUsername}
            </div>
        </div>

        <div className="text-center">
            {date}
        </div>
    </div>
  )
}
