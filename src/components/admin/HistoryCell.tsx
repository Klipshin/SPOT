import Image from 'next/image'
import React, { useMemo } from 'react'
import { profileService } from '@/src/lib/services'

function formatDate(dbDate: string) {
  if (!dbDate) return '';
  const date = new Date(dbDate);
  return date.toLocaleString('en-US', {
    month: 'short',   
    day: 'numeric',   
    year: 'numeric',  
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(dbDate: string) {
  if (!dbDate) return '';
  const date = new Date(dbDate);
  return date.toLocaleString('en-US', {
    month: 'short',   
    day: 'numeric',   
    year: 'numeric',  
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

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
  // Get profile picture URLs from Supabase bucket
  const reporterProfileUrl = useMemo(() => {
    return profileService.getProfilePictureUrl(reporterProfile) || "/avatar-capybara.png";
  }, [reporterProfile]);

  const reportedProfileUrl = useMemo(() => {
    return profileService.getProfilePictureUrl(reportedProfile) || "/avatar-capybara.png";
  }, [reportedProfile]);

  return (
    <div className="py-2 px-25 bg-[#4A654D] font-poppins-medium text-white text-lg rounded-xl grid grid-cols-[2fr_2fr_minmax(150px,250px)] items-center justify-center">
        <div className="flex flex-row justify-start items-center space-x-3">
            <Image 
                src={reporterProfileUrl}
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
                src={reportedProfileUrl}
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
            {formatDate(date)}
        </div>
    </div>
  )
}
