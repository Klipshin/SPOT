"use client";

import React, { useState } from 'react';
import InfoCards from '@/src/components/admin/InfoCards';
import VerifiedExpertsCell from '@/src/components/admin/VerifiedExpertsCell';
import PendingVerificationCell from '@/src/components/admin/PendingVerificationCell';
import ToggleBar from '@/src/components/admin/ToggleBar';
import SearchBar from '@/src/components/admin/SearchBar';
import SortDropDown from '@/src/components/admin/SortDropDown';
import useAdmin from '@/src/lib/hooks/useAdmin';

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState("Verified Experts");

  const { verifiedExperts, pendingExperts, loading, error, reload } = useAdmin();

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
          <SearchBar />
          <SortDropDown />
        </div>
      </div>

      <div className="w-full flex flex-col bg-white/35 p-5 rounded-2xl space-y-2">
        {loading && <p>Loading experts...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {activeCategory === "Verified Experts" && !loading && verifiedExperts.length > 0 && (
          verifiedExperts.map((expert) => (
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

        {activeCategory === "Verified Experts" && !loading && verifiedExperts.length === 0 && (
          <p>No verified experts found.</p>
        )}

        {activeCategory === "Pending Verifications" && !loading && pendingExperts.length > 0 && (
          pendingExperts.map((expert) => (
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

        {activeCategory === "Pending Verifications" && !loading && pendingExperts.length === 0 && (
          <p>No pending verifications found.</p>
        )}
      </div>
    </div>
  )
}
