"use client";

import FeedCell from '@/src/components/admin/FeedCell';
import HistoryCell from '@/src/components/admin/HistoryCell';
import InfoCards from '@/src/components/admin/InfoCards';
import SearchBar from '@/src/components/admin/SearchBar';
import SortDropDown from '@/src/components/admin/SortDropDown';
import ToggleBar from '@/src/components/admin/ToggleBar';
import useAdmin from '@/src/lib/hooks/useAdmin';
import React, { useState } from 'react';

export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState("Feed");

  const { totalUsers, totalReports, totalUndismissedReports, loading, error } = useAdmin();

  return (
    <div className="relative flex flex-col mt-3 space-y-5 w-full px-5">
      <div className="absolute -right-10 w-120 rounded-full bg-[#D0E69080] py-2 px-7 text-2xl font-poppins-bold">
        VIOLATION REPORTS
      </div>

      <div className="flex flex-row justify-start items-center gap-8 w-full">
        <InfoCards 
          icon="/total-users.svg"
          title="Total Users"
          data={totalUsers.length}
        />

        <InfoCards
          icon="/total-reports.svg"
          title="Reports"
          data={totalReports.length}
        />
      </div>

      <div className="flex flex-row items-center justify-between w-full">
        <ToggleBar 
          barOne="Feed"
          barTwo="History"
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="flex flex-row items-center space-x-2">
          <SearchBar />
          <SortDropDown />
        </div>
      </div>

      <div className="w-full flex flex-col bg-white/35 p-5 rounded-2xl space-y-2">
        {activeCategory === "Feed" && (
          <>
            {totalUndismissedReports.map((r) => {
              const reporterAvatar = r.reporterProfile?.profile_picture ?? "/default-avatar.png";
              const reporterUsername = r.reporterProfile?.username ?? "Unknown";
              const reportedAvatar = r.reportedProfile?.profile_picture ?? "/default-avatar.png";
              const reportedUsername = r.reportedProfile?.username ?? "Unknown";

              return (
                <FeedCell
                  key={r.id}
                  reportId={r.id}
                  reporterProfile={reporterAvatar}
                  reporterUsername={reporterUsername}
                  reportedId={r.reported_user_id}
                  reportedProfile={reportedAvatar}
                  reportedUsername={reportedUsername}
                  reportedAt={r.reported_at}
                  type={r.type}
                  postContent={r.postContent ?? null}
                  commentContent={r.commentContent ?? null}
                  contentViolation={r.violation}
                />
              );
            })}
          </>
        )}

        {activeCategory === "History" && (
          <>
            <div className="py-2 px-25 bg-[#2B442E] text-white font-poppins-bold text-lg rounded-xl grid grid-cols-[2fr_2fr_minmax(150px,250px)]">
              <div className="text-left">Reporter</div>
              <div className="text-left">Account Reported</div>
              <div className="text-center">Date</div>
            </div>

            {totalReports.map((r) => {
              const reporterAvatar = r.reporterProfile?.profile_picture ?? "/default-avatar.png";
              const reporterUsername = r.reporterProfile?.username ?? "Unknown";
              const reportedAvatar = r.reportedProfile?.profile_picture ?? "/default-avatar.png";
              const reportedUsername = r.reportedProfile?.username ?? "Unknown";

              return (
                <HistoryCell
                  key={r.id}
                  reporterProfile={reporterAvatar}
                  reporterUsername={reporterUsername}
                  reportedProfile={reportedAvatar}
                  reportedUsername={reportedUsername}
                  date={r.reported_at}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
