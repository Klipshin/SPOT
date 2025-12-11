"use client";

import FeedCell from '@/src/components/admin/FeedCell';
import HistoryCell from '@/src/components/admin/HistoryCell';
import InfoCards from '@/src/components/admin/InfoCards';
import SearchBar from '@/src/components/admin/SearchBar';
import SortDropDown from '@/src/components/admin/SortDropDown';
import ToggleBar from '@/src/components/admin/ToggleBar';
import useAdmin from '@/src/lib/hooks/useAdmin';
import React, { useState, useMemo } from 'react';
import type { ReportWithProfiles } from '@/src/lib/hooks/useAdmin';

export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState("Feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const { totalUsers, totalReports, totalUndismissedReports, loading, error } = useAdmin();

  const sortOptions = [
    { value: "date", label: "Date (Newest)" },
    { value: "date-desc", label: "Date (Oldest)" },
    { value: "reporter", label: "Reporter (A-Z)" },
    { value: "reported", label: "Reported (A-Z)" },
  ];

  // Filter and sort reports based on active category
  const filteredAndSortedReports = useMemo(() => {
    const reports = activeCategory === "Feed" ? totalUndismissedReports : totalReports;
    
    // Filter by search query
    let filtered = reports;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = reports.filter((r: ReportWithProfiles) => 
        r.reporterProfile?.username?.toLowerCase().includes(query) ||
        r.reportedProfile?.username?.toLowerCase().includes(query) ||
        r.reporterProfile?.name?.toLowerCase().includes(query) ||
        r.reportedProfile?.name?.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a: ReportWithProfiles, b: ReportWithProfiles) => {
      switch (sortBy) {
        case "date":
          return (b.reported_at || "").localeCompare(a.reported_at || "");
        case "date-desc":
          return (a.reported_at || "").localeCompare(b.reported_at || "");
        case "reporter":
          const reporterA = a.reporterProfile?.username || "";
          const reporterB = b.reporterProfile?.username || "";
          return reporterA.localeCompare(reporterB);
        case "reported":
          const reportedA = a.reportedProfile?.username || "";
          const reportedB = b.reportedProfile?.username || "";
          return reportedA.localeCompare(reportedB);
        default:
          return 0;
      }
    });

    return sorted;
  }, [activeCategory, totalReports, totalUndismissedReports, searchQuery, sortBy]);

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
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search reports..."
          />
          <SortDropDown 
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />
        </div>
      </div>

      <div className="w-full flex flex-col bg-white/35 p-5 rounded-2xl space-y-2">
        {loading && <p>Loading reports...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {activeCategory === "Feed" && (
          <>
            {!loading && filteredAndSortedReports.length === 0 && (
              <p className="text-center py-5">No reports found.</p>
            )}
            {filteredAndSortedReports.map((r: ReportWithProfiles) => {
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

            {!loading && filteredAndSortedReports.length === 0 && (
              <p className="text-center py-5">No reports found.</p>
            )}

            {filteredAndSortedReports.map((r: ReportWithProfiles) => {
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
