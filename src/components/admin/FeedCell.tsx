"use client";

import { contentViolations } from '@/src/lib/data/contentViolations'
import useAdmin from '@/src/lib/hooks/useAdmin';
import { profileService } from '@/src/lib/services';
import { Comment, Post } from '@/src/utils/supabase/models';
import Image from 'next/image'
import { useMemo } from 'react'

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

type FeedProps = {
    reportId: string,
    reporterProfile: string,
    reporterUsername: string,
    reportedProfile: string,
    reportedUsername: string,
    reportedId: string,
    reportedAt: string,
    type: "post" | "comment";
    postContent?: Post | null;
    commentContent?: Comment | null;
    contentViolation: string,
}

export default function FeedCell({
    reportId,
    reporterProfile,
    reporterUsername,
    reportedProfile,
    reportedUsername,
    reportedId,
    reportedAt,
    type,
    postContent,
    commentContent,
    contentViolation,
}: FeedProps ) {
    const violation = contentViolations.find(v => v.id === contentViolation);

    const {suspendUsers, dismissReport, reload, loading} = useAdmin();

    // Get profile picture URLs from Supabase bucket
    const reporterProfileUrl = useMemo(() => {
        return profileService.getProfilePictureUrl(reporterProfile) || "/avatar-capybara.png";
    }, [reporterProfile]);

    const reportedProfileUrl = useMemo(() => {
        return profileService.getProfilePictureUrl(reportedProfile) || "/avatar-capybara.png";
    }, [reportedProfile]);

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
                        src={reporterProfileUrl}
                        alt={reporterUsername}
                        width={60}
                        height={60}
                        className="rounded-full self-center"
                    />

                    <div className="flex flex-col text-white">
                        <div className="font-poppins-bold text-2xl">{reporterUsername}</div>
                        <div className="font-poppins text-base">{formatDate(reportedAt)}</div>
                    </div>
                </div>

                <div className="w-full flex flex-col space-y-2">
                    <div className="font-poppins-italic text-base">
                        Reported:
                    </div>

                    <div className="w-full flex flex-row justify-start items-center space-x-3 px-3 py-2 bg-[#2B442E] rounded-lg">
                        <Image 
                            src={reportedProfileUrl}
                            alt={reportedUsername}
                            width={45}
                            height={45}
                            className="rounded-full self-center"
                        />

                        <div className="font-poppins-bold text-xl">{reportedUsername}</div>
                    </div>
                </div>
            </div>

            {type === "post" && (
                <div className="flex flex-col bg-white p-3 rounded-lg justify-start items-start space-y-3">
                    <div className="flex flex-row justify-start items-center space-x-3">
                        <Image 
                            src={reportedProfileUrl}
                            alt={reportedUsername}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
            
                        <div className="flex flex-col text-black">
                            <div className="font-poppins-bold text-lg text-black">{reportedUsername}</div>
                            <div className="font-poppins text-xs text-black">{formatDate(postContent?.created_at || '')}</div>
                        </div>
                    </div>
                    <div className="font-poppins text-base text-black">{postContent?.content}</div>
                    {postContent?.media_url && (
                        <Image
                            src={postContent.media_url}
                            alt="Post image"
                            width={400}
                            height={300}
                            className="rounded-lg object-cover"
                        />
                    )}
                </div>
            )}

            {type === "comment" && (
                <div className="flex flex-col bg-white p-3 rounded-lg justify-start items-start space-y-3">
                    <div className="flex flex-row justify-start items-center space-x-3">
                        <Image 
                            src={reportedProfileUrl}
                            alt={reportedUsername}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
            
                        <div className="flex flex-col text-black">
                            <div className="font-poppins-bold text-lg text-black">{reportedUsername}</div>
                            <div className="font-poppins text-xs text-black">{formatDate(commentContent?.created_at || '')}</div>
                        </div>
                    </div>

                    <div className="font-poppins text-base text-black">{commentContent?.content}</div>
                </div>
            )}

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
                    onClick={async () => {
                        await suspendUsers(reportedId);
                        await dismissReport(reportId);
                        await reload();
                    }}
                    disabled={loading}
                    className="rounded-lg px-10 py-1 bg-[#FFC8C9] text-[#BF0003] border-2 border-[#BF0003] hover:bg-[#BF0003] hover:text-[#FFC8C9] hover:scale-105
                    cursor-pointer transition-all duration-200 ease-in-out"
                >
                    {loading? "Suspending" : "Suspend"}
                </button>

                <button
                    onClick={async () => {
                        await dismissReport(reportId);
                        await reload();
                    }}
                    disabled={loading}
                    className="rounded-lg px-10 py-1 bg-[#E2E2E2] text-[#646464] border-2 border-[#646464] hover:bg-[#E2E2E2] hover:text-[#646464] hover:scale-105
                    cursor-pointer transition-all duration-200 ease-in-out"
                >
                    {loading? "Dismissing" : "Dismiss"}
                </button>
            </div>
        </div>
    </div>
  )
}
