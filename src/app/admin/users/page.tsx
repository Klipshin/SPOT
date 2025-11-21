import InfoCards from '@/src/components/admin/InfoCards'
import SearchBar from '@/src/components/admin/SearchBar'
import SortDropDown from '@/src/components/admin/SortDropDown'
import ToggleBar from '@/src/components/admin/ToggleBar'
import React from 'react'

export default function UserManagementPage() {
  return (
    <div className="flex flex-col mt-3 space-y-5 w-full px-5">
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
        <ToggleBar 
          barOne="Feed"
          barTwo="History"
        />

        <div className="flex flex-row items-center space-x-5">
          <SearchBar />
          <SortDropDown />
        </div>
      </div>

      <div className="w-full bg-white/35 p-5 rounded-3xl">
        <div className="py-2 px-3 bg-[#082E0D] font-poppins-bold text-white text-lg rounded-2xl flex flex-row">
            <div className="ml-10 flex-1 text-left">Reporter</div>
            <div className="flex-1 text-left">Username</div>
            <div className="flex-1 text-center">Status</div>
            <div className="flex-1 text-center">Access</div>
        </div>
      </div>
    </div>
  )
}
