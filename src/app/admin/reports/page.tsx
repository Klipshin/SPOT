"use client";

import FeedCell from '@/src/components/admin/FeedCell';
import HistoryCell from '@/src/components/admin/HistoryCell';
import InfoCards from '@/src/components/admin/InfoCards'
import ReportedContent from '@/src/components/admin/ReportedContent';
import SearchBar from '@/src/components/admin/SearchBar'
import SortDropDown from '@/src/components/admin/SortDropDown'
import ToggleBar from '@/src/components/admin/ToggleBar'
import React, { useState } from 'react'

export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState("Feed");

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
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="flex flex-row items-center space-x-5">
          <SearchBar />
          <SortDropDown />
        </div>
      </div>

      <div className="w-full flex flex-col bg-white/35 p-5 rounded-2xl space-y-2">
        {activeCategory === "Feed" && (
          <>
            <FeedCell 
              reporterProfile="/avatar-cat.png"
              reporterUsername="lovesaiki"
              reportedProfile="/avatar-capybara.png"
              reportedUsername="nendouglazer"
              date="11/07/2025"
              reportedContent={ <ReportedContent /> }
            />
          </>
        )}

        {activeCategory === "History" && (
          <>
            <div className="py-2 px-25 bg-[#2B442E] text-white font-poppins-bold text-lg rounded-xl grid grid-cols-[2fr_2fr_minmax(150px,250px)]">
              <div className="text-left">Reporter</div>
              <div className="text-left">Account Reported</div>
              <div className="text-center">Date</div>
            </div>

            <HistoryCell 
              reporterProfile="/avatar-cat.png"
              reporterUsername="lovesaiki"
              reportedProfile="/avatar-capybara.png"
              reportedUsername="nendouglazer"
              date="11/07/2025"
            />
          </>
        )}
      </div>
    </div>
  )
}
