"use client";

import useAdmin from '@/src/lib/hooks/useAdmin';
import { profileService } from '@/src/lib/services';
import Image from 'next/image'
import { useMemo } from 'react'

type UserProps = {
    userId: string,
    profile: string,
    username: string,
    status: string,
}

export default function UserCell({userId, profile, username, status} : UserProps) {
    const {suspendUsers, activateUser, reload} = useAdmin();
    
    // Get profile picture URL from Supabase bucket
    const profilePictureUrl = useMemo(() => {
        return profileService.getProfilePictureUrl(profile) || "/avatar-capybara.png";
    }, [profile]);

  return (
    <div className="py-2 px-3 bg-[#4A654D] font-poppins-medium text-white text-lg rounded-xl grid grid-cols-[minmax(100px,200px)_2fr_1fr_1fr] items-center justify-center">
        <div className="flex justify-center items-center">
            <Image 
                src={profilePictureUrl}
                alt={username}
                width={50}
                height={50}
                className="rounded-full self-center"
            />
        </div>

        <div className="text-center text-xl">
            {username}
        </div>

        <div className="flex justify-center items-center">
            {status === "Suspended" && (
                <div
                    className="bg-[#FFC8C9] text-[#BF0003] rounded-lg px-10 py-1"
                >
                    Suspended
                </div>
            )}

            {status === "Active" && (
                <div
                    className="bg-[#F4FFC5] text-[#00600E] rounded-lg px-16 py-1"
                >
                    Active
                </div>
            )}
        </div>

        <div className="text-center">
            {status === "Active" && (
                <button
                    onClick={async () => {
                        await suspendUsers(userId);
                        await reload();
                    }}
                    className="rounded-full px-10 py-1 bg-[#FFC8C9] text-[#BF0003] border-2 border-[#BF0003] hover:bg-[#BF0003] hover:text-[#FFC8C9] hover:scale-105
                    cursor-pointer transition-all duration-200 ease-in-out"
                >
                    Suspend
                </button>
            )}

            {status === "Suspended" && (
                <button
                    onClick={async () => {
                        await activateUser(userId);
                        await reload();
                    }}
                    className="rounded-full px-10 py-1 bg-[#F4FFC5] text-[#00600E] border-2 border-[#00600E] hover:bg-[#00600E] hover:text-[#F4FFC5] hover:scale-105
                    cursor-pointer transition-all duration-200 ease-in-out"
                >
                    Activate
                </button>
            )}
        </div>
    </div>
  )
}
