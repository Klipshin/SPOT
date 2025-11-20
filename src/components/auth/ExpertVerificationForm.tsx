"use client";

import React, { useState } from 'react'
import { FaLink } from "react-icons/fa";
import FileUpload from './FileUpload';
import JobInput from './JobInput';
import { useRouter } from 'next/navigation';
import { IoChevronBackCircle } from "react-icons/io5";
import VerificationModal from './VerificationModal';
import useExperts from '@/src/lib/hooks/useExperts';

export default function ExpertVerification() {
    const jobOptions = [
        "Software Engineer",
        "Product Manager",
        "Designer",
        "Data Analyst",
        "Marketing Specialist",
    ];

    const [selectedJob, setSelectedJob] = useState("");
    const [profileLink, setProfileLink] = useState("");
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [idDocument, setIdDocument] = useState("");
    const [employmentProof, setEmploymentProof] = useState("");
    const [diplomaDocument, setDiplomaDocument] = useState("");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createExpert } = useExperts();
    const router = useRouter();
    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    }

    const handleContinue = async () => {
        if (!selectedJob.trim()) {
            alert("Please provide your job or occupation.");
            return;
        }

        if (!idDocument && !employmentProof && !diplomaDocument) {
            alert("Please upload at least one supporting document.");
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);
            const payload = {
                occupation: selectedJob,
                id_docu: idDocument,
                employment_proof: employmentProof,
                diploma_docu: diplomaDocument,
                ...(profileLink.trim()
                    ? { academic_profile: profileLink.trim() }
                    : {}),
            };
            await createExpert(payload);
            setShowVerificationModal(true);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to submit verification.";
            setSubmitError(message);
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showVerificationModal) {
        return <VerificationModal />;
    }

  return (
    <div className="z-10 w-full h-auto max-w-6xl bg-white rounded-l-4xl flex overflow-hidden">
        <div className="relative flex-1 flex flex-col items-center justify-start p-2">
            <div className="w-full flex items-center justify-between px-5">
                <button 
                    onClick={handleBack}
                    className="rounded-full px-5 py-1 bg-[#D0E69069] shadow-[0_4px_8px_rgba(0,0,0,0.3)] text-base font-poppins-bold text-[#082E0DB0] flex items-center justify-center gap-2
                        hover:bg-[#95AB33B2] transition-colors dura ease-in-out cursor-pointer"
                >
                    <IoChevronBackCircle className="pointer-events-none"/>
                    back
                </button>

                <div className="flex items-center">
                    <img 
                        src="/spot icon.svg"
                        alt="SPOT logo"
                        className="w-11 h-11"
                    />
                    <h5 className="font-poppins-black bg-gradient-to-b from-[#95AB33] via-[#23732F] via-70% to-[#082E0D] bg-clip-text text-transparent">
                        SPOT
                    </h5>
                </div>
            </div>

            <div className="relative w-full flex items-center justify-center -mt-7">
                <img 
                    src="/brush-stroke-two.png"
                    className="w-base h-auto"
                />
                <h3 className="absolute inset-0 flex items-center justify-center text-4xl font-poppins-bold text-[#082E0DB0]">
                    Verify Your Expertise
                </h3>
            </div>

            <JobInput 
                options={jobOptions}
                placeholder="Choose or type a job..."
                onChange={(value) => setSelectedJob(value)}
            />

            <div className="relative w-full flex flex-col items-center justify-center">
                <div className="w-4/5 h-[1px] mt-5 mb-2 bg-gray-400" />
                <p className="text-[11px] font-poppins-italic text-gray-400">{"Please provide one or more of the following (preferably all three) to confirm your expert status."}</p>
            </div>
        
            <div className="mt-4 flex flex-col items-center justify-center gap-4">
                <FileUpload 
                    label="ID/Certificate"
                    id="certificateFile"
                    acceptedFiles=".pdf,.jpg,.png"
                    onFileLoad={setIdDocument}
                />

                <FileUpload 
                    label="Employment/Organization Proof"
                    id="employmentFile"
                    acceptedFiles=".pdf,.jpg,.png"
                    onFileLoad={setEmploymentProof}
                />

                <FileUpload 
                    label="Degree/Diploma"
                    id="diplomaFile"
                    acceptedFiles=".pdf,.jpg,.png"
                    onFileLoad={setDiplomaDocument}
                />
            </div>

            <div className="relative w-full flex flex-col items-center justify-center">
                <div className="w-4/5 h-[1px] mt-5 mb-2 bg-gray-400" />
            </div>

            <div className="flex flex-col items-center justify-center gap-1 w-full">
                <label htmlFor="profileLink" className="my-2 mx-5 text-base font-poppins-medium-italic">
                    Provide link to academic/research profile <span className="text-sm text-gray-500">{"(this is optional)"}</span>
                </label>
        
                <div className="relative flex items-center gap-3">
                    <FaLink className="absolute left-5 top-1/2 -translate-y-1/2"/>
                    <input
                        type="url"
                        id="profileLink"
                        value={profileLink}
                        onChange={(e) => setProfileLink(e.target.value)}
                        className="w-125 border border-[#082E0D8F] outline-none focus:border-black py-1 pl-12 pr-3 rounded-xl cursor-text transition-colors duration-200 ease-in-out"
                        autoComplete="off"
                    />
                </div>
            </div>

            {submitError && (
                <div className="mt-4 text-sm text-red-600 font-poppins-semibold">
                    {submitError}
                </div>
            )}

            <button 
                onClick={handleContinue}
                disabled={isSubmitting}
                className="relative m-10 rounded-full px-20 py-2 bg-[#C3DEE1CC] shadow-[0_4px_8px_rgba(0,0,0,0.3)] text-2xl font-poppins-bold text-[#034CBCBA] flex items-center justify-center gap-2
                    hover:bg-[#034CBCBA] hover:text-[#C3DEE1CC] transition-colors dura ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Submitting..." : "Continue"}
                <IoChevronBackCircle className="absolute right-3 text-3xl pointer-events-none scale-x-[-1]"/>
            </button>
        </div>

        <div className="w-2/5 overflow-hidden">
            <img 
                src="/snake-verification.png"
                className="w-full h-full object-cover"
            />
        </div>
    </div>
  )
}
