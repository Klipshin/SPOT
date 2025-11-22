import InfoCards from '@/src/components/admin/InfoCards'
import SearchBar from '@/src/components/admin/SearchBar'
import SortDropDown from '@/src/components/admin/SortDropDown'
import UserCell from '@/src/components/admin/UserCell'
import React from 'react'

export default function UserManagementPage() {
  return (
    <div className="relative flex flex-col mt-3 space-y-5 w-full px-5">
      <div className="absolute -right-10 w-120 rounded-full bg-[#D0E69080] py-2 px-7 text-2xl font-poppins-bold">
        USER MANAGEMENT
      </div>

      <div className="flex flex-row justify-start items-center gap-8 w-full">
        <InfoCards 
          icon="/total-users.svg"
          title="Total Users"
          data={4}
        />

        <InfoCards
          icon="/total-reports.svg"
          title="Reports"
          data={10}
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

        <UserCell 
          profile="/avatar-capybara.png"
          username="nendouglazer"
          status="Active"
        />

        <UserCell 
          profile="/avatar-cat.png"
          username="lovesaiki"
          status="Suspended"
        />

      </div>
    </div>
  )
}
