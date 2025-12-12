"use client";

import React, { useState, useMemo } from 'react';
import InfoCards from '@/src/components/admin/InfoCards';
import VerifiedExpertsCell from '@/src/components/admin/VerifiedExpertsCell';
import PendingVerificationCell from '@/src/components/admin/PendingVerificationCell';
import ToggleBar from '@/src/components/admin/ToggleBar';
import SearchBar from '@/src/components/admin/SearchBar';
import SortDropDown from '@/src/components/admin/SortDropDown';
import useAdmin from '@/src/lib/hooks/useAdmin';

type Expert = {
  expert_id: string;
  profile_picture: string | null;
  name: string;
  username: string;
  occupation: string;
  location: string;
  academic_profile: string | null;
  id_docu: string | null;
  employment_proof: string | null;
  diploma_docu: string | null;
  verified_at?: string;
  created_at?: string;
};

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState("Verified Experts");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const { verifiedExperts, pendingExperts, loading, error, reload } = useAdmin();

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "occupation", label: "Occupation (A-Z)" },
    { value: "location", label: "Location (A-Z)" },
    { value: "date", label: "Date (Newest)" },
    { value: "date-desc", label: "Date (Oldest)" },
  ];

  // Filter and sort experts based on active category
  const filteredAndSortedExperts = useMemo(() => {
    const experts = activeCategory === "Verified Experts" ? verifiedExperts : pendingExperts;
    
    // Filter by search query
    let filtered = experts;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = experts.filter((expert: Expert) => 
        expert.name?.toLowerCase().includes(query) ||
        expert.username?.toLowerCase().includes(query) ||
        expert.occupation?.toLowerCase().includes(query) ||
        expert.location?.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a: Expert, b: Expert) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "occupation":
          return (a.occupation || "").localeCompare(b.occupation || "");
        case "location":
          return (a.location || "").localeCompare(b.location || "");
        case "date":
          const dateA = a.verified_at || a.created_at || "";
          const dateB = b.verified_at || b.created_at || "";
          return dateB.localeCompare(dateA);
        case "date-desc":
          const dateA2 = a.verified_at || a.created_at || "";
          const dateB2 = b.verified_at || b.created_at || "";
          return dateA2.localeCompare(dateB2);
        default:
          return 0;
      }
    });

    return sorted;
  }, [activeCategory, verifiedExperts, pendingExperts, searchQuery, sortBy]);

  return (
    <div className="relative flex flex-col mt-3 space-y-5 w-full px-5">
      <div className="absolute -right-10 w-120 rounded-full bg-[#D0E69080] py-2 px-7 text-2xl font-poppins-bold">
        VERIFICATION DASHBOARD
      </div>

      <div className="flex flex-row justify-start items-center gap-8 w-full">
        <InfoCards 
          icon="/verified-users.svg"
          title="Verified"
          data={verifiedExperts.length}
        />
        <InfoCards 
          icon="/pending-users.svg"
          title="Pending"
          data={pendingExperts.length}
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
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search experts..."
          />
          <SortDropDown 
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />
        </div>
      </div>

      <div className="w-full flex flex-col bg-white/35 p-5 rounded-2xl space-y-2">
        {loading && <p>Loading experts...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && filteredAndSortedExperts.length === 0 && (
          <p className="text-center py-5">No {activeCategory.toLowerCase()} found.</p>
        )}

        {activeCategory === "Verified Experts" && !loading && filteredAndSortedExperts.length > 0 && (
          filteredAndSortedExperts.map((expert: Expert) => (
            <VerifiedExpertsCell
              key={expert.expert_id}
              profile={expert.profile_picture}
              name={expert.name}
              username={`@${expert.username}`}
              job={expert.occupation}
              location={expert.location}
              link={expert.academic_profile || null}
              certificateFile={expert.id_docu}
              employmentFile={expert.employment_proof}
              diplomaFile={expert.diploma_docu}
            />
          ))
        )}

        {activeCategory === "Pending Verifications" && !loading && filteredAndSortedExperts.length > 0 && (
          filteredAndSortedExperts.map((expert: Expert) => (
            <PendingVerificationCell
              key={expert.expert_id}
              expertId={expert.expert_id}
              profile={expert.profile_picture}
              name={expert.name}
              username={`@${expert.username}`}
              job={expert.occupation}
              location={expert.location}
              link={expert.academic_profile || null}
              certificateFile={expert.id_docu}
              employmentFile={expert.employment_proof}
              diplomaFile={expert.diploma_docu}
            />
          ))
        )}
      </div>
    </div>
  )
}
