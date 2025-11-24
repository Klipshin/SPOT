"use client";

import InfoCards from '@/src/components/admin/InfoCards'
import PendingVerificationCell from '@/src/components/admin/PendingVerificationCell';
import SearchBar from '@/src/components/admin/SearchBar'
import SortDropDown from '@/src/components/admin/SortDropDown'
import ToggleBar from '@/src/components/admin/ToggleBar'
import VerifiedExpertsCell from '@/src/components/admin/VerifiedExpertsCell';
import React, { useState } from 'react'

export default function DashboardPage() {
  const [ activeCategory, setActiveCategory ] = useState("Verified Experts")

  return (
    <div className="relative flex flex-col mt-3 space-y-5 w-full px-5">
      <div className="absolute -right-10 w-120 rounded-full bg-[#D0E69080] py-2 px-7 text-2xl font-poppins-bold">
        VERIFICATION DASHBOARD
      </div>
      <div className="flex flex-row justify-start items-center gap-8 w-full">
        <InfoCards 
          icon="/verified-users.svg"
          title="Verified"
          data={4}
        />

        <InfoCards 
          icon="/pending-users.svg"
          title="Pending"
          data={10}
        />
      </div>

      <div className="flex flex-row items-center justify-between w-full">
        <ToggleBar 
          barOne="Verified Experts"
          barTwo="Pending Verifications"
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="flex flex-row items-center space-x-2">
          <SearchBar />
          <SortDropDown />
        </div>
      </div>

      <div className="w-full flex flex-col bg-white/35 p-5 rounded-2xl space-y-2">
        {activeCategory === "Verified Experts" && (
          <>
            <VerifiedExpertsCell
              profile="/avatar-cat.png"
              name="Saiki Kusuo"
              username={`@${"lovesaiki"}`}
              job="Wildlife Psychic"
              location="Sapa Sa Amo, Japan"
              link="https://www.youtube.com/watch?v=Zu0sMh9JgZw"
              certificateFile="avatar-hamster.png"
              employmentFile="avatar-duck.png"
              diplomaFile="avatar-rabbit.png"
            />

            <VerifiedExpertsCell
              profile="/avatar-cat.png"
              name="Saiki Kusuo"
              username={`@${"lovesaiki"}`}
              job="Wildlife Psychic"
              location="Sapa Sa Amo, Japan"
              certificateFile="avatar-hamster.png"
              employmentFile="avatar-duck.png"
              diplomaFile="avatar-rabbit.png"
            />
          </>
        )}

        {activeCategory === "Pending Verifications" && (
          <>
            <PendingVerificationCell
              profile="/avatar-cat.png"
              name="Saiki Kusuo"
              username={`@${"lovesaiki"}`}
              job="Wildlife Psychic"
              location="Sapa Sa Amo, Japan"
              link="https://www.youtube.com/watch?v=Zu0sMh9JgZw"
              certificateFile="avatar-hamster.png"
              employmentFile="avatar-duck.png"
              diplomaFile="avatar-rabbit.png"
            />

            <PendingVerificationCell
              profile="/avatar-cat.png"
              name="Saiki Kusuo"
              username={`@${"lovesaiki"}`}
              job="Wildlife Psychic"
              location="Sapa Sa Amo, Japan"
              certificateFile="avatar-hamster.png"
              employmentFile="avatar-duck.png"
              diplomaFile="avatar-rabbit.png"
            />
          </>
        )}
      </div>
    </div>
  )
}
