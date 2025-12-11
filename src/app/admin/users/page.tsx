"use client";

import InfoCards from '@/src/components/admin/InfoCards'
import SearchBar from '@/src/components/admin/SearchBar'
import SortDropDown from '@/src/components/admin/SortDropDown'
import UserCell from '@/src/components/admin/UserCell'
import useAdmin from '@/src/lib/hooks/useAdmin'
import React from 'react'

export default function UserManagementPage() {
  const { activeUsers, suspendedUsers, loading, error } = useAdmin();

  const allUsers = [
    ...activeUsers.map((user) => ({
      ...user,
      status: user.is_suspended ? "Suspended" : "Active",
    })),
    ...suspendedUsers.map((user) => ({
      ...user,
      status: user.is_suspended ? "Suspended": "Active"
    })),
  ];

  return (
    <div className="relative flex flex-col mt-3 space-y-5 w-full px-5">
      <div className="absolute -right-10 w-120 rounded-full bg-[#D0E69080] py-2 px-7 text-2xl font-poppins-bold">
        USER MANAGEMENT
      </div>

      <div className="flex flex-row justify-start items-center gap-8 w-full">
        <InfoCards 
          icon="/total-users.svg"
          title="Active Users"
          data={activeUsers.length}
        />

        <InfoCards
          icon="/total-reports.svg"
          title="Suspended"
          data={suspendedUsers.length}
        />
      </div>

      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-center space-x-2">
          <SearchBar />
          <SortDropDown />
        </div>
      </div>

      <div className="w-full flex flex-col bg-white/35 p-5 rounded-2xl space-y-2">
        <div className="py-2 px-3 bg-[#2B442E] font-poppins-bold text-white text-lg rounded-xl grid grid-cols-[minmax(100px,200px)_2fr_1fr_1fr]">
            <div className="text-center">Profile</div>
            <div className="text-center">Username</div>
            <div className="text-center">Status</div>
            <div className="text-center">Access</div>
        </div>

        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {allUsers.map((user) => (
          <UserCell
            key={user.user_id}
            userId={user.user_id}
            profile={user.profile_picture || "/avatar-capybara.png"}
            username={user.username}
            status={user.status}
          />
        ))}
      </div>
    </div>
  )
}
