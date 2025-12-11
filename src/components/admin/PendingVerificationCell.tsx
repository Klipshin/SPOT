"use client";

import useAdmin from "@/src/lib/hooks/useAdmin";
import Image from "next/image";
import { useState } from "react";
import { FaLink, FaLocationDot } from "react-icons/fa6";
import { PiEyeBold } from "react-icons/pi";

type ExpertProps = {
  expertId: string;
  profile: string;
  name: string;
  username: string;
  job: string;
  location: string;
  link?: string | null;
  certificateFile: string;
  employmentFile: string;
  diplomaFile: string;
};

export default function PendingVerificationCell({
  expertId,
  profile,
  name,
  username,
  job,
  location,
  link,
  certificateFile,
  employmentFile,
  diplomaFile,
}: ExpertProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState<string>("");
  const [fileType, setFileType] = useState<"pdf" | "image">("image");

  const { approveExpert, rejectExpert, reload } = useAdmin();

  const prepareFileUrl = (file: string): { url: string; type: "pdf" | "image" } => {
    if (modalUrl.startsWith("blob:")) {
      URL.revokeObjectURL(modalUrl);
    }

    if (file.startsWith("http://") || file.startsWith("https://")) {
      const isPdf = file.toLowerCase().includes(".pdf") || file.toLowerCase().includes("application/pdf");
      return { url: file, type: isPdf ? "pdf" : "image" };
    }

    if (file.startsWith("data:")) {
      const parts = file.split(",");
      if (parts.length < 2) {
        console.error("Invalid base64 data format.");
        return { url: "", type: "image" };
      }

      const [meta, data] = parts;
      const mime = meta.match(/:(.*?);/)?.[1] || "application/octet-stream";
      const isPdf = mime.includes("pdf");

      try {
        const binary = atob(data);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
        const blob = new Blob([array], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        return { url: blobUrl, type: isPdf ? "pdf" : "image" };
      } catch (e) {
        console.error("Error decoding base64 data:", e);
        return { url: "", type: "image" };
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucketName = "documents"; 
    
    if (supabaseUrl) {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${file}`;
      const isPdf = file.toLowerCase().endsWith(".pdf");
      return { url: publicUrl, type: isPdf ? "pdf" : "image" };
    }

    return { url: file, type: "image" };
  };

  const openModal = (file: string) => {
    const { url, type } = prepareFileUrl(file);

    if (url) {
      setModalUrl(url);
      setFileType(type);
      setModalOpen(true);
    } else {
      alert("The document file could not be loaded.");
    }
  };

  const closeModal = () => {
    if (modalUrl.startsWith("blob:")) {
      URL.revokeObjectURL(modalUrl);
    }
    setModalOpen(false);
    setModalUrl("");
  };

  const documents = [
    { label: "ID/Certificate", file: certificateFile },
    { label: "Employment/Organization Proof", file: employmentFile },
    { label: "Degree/Diploma", file: diplomaFile },
  ];

  return (
    <div className="relative w-full flex flex-col py-5 px-10 bg-[#4A654D] rounded-xl space-y-5">
      <div className="absolute top-0 right-0 flex flex-row items-center justify-center m-3 space-x-2">
        <Image
          src="/user-warning.svg"
          alt="Pending Verification"
          width={25}
          height={25}
        />
        <div className="font-poppins-medium text-[#FFC048] text-lg">Pending</div>
      </div>

      <div className="flex flex-row justify-start items-center space-x-2">
        <Image
          src={profile || "/avatar-capybara.png"}
          alt={name}
          width={75}
          height={75}
          className="rounded-full self-center"
        />
        <div className="flex flex-col text-white">
          <div className="font-poppins-bold text-3xl">{name}</div>
          <div className="-mt-2 font-poppins text-lg">{username}</div>
        </div>
      </div>

      <div className="flex flex-col text-white justify-start items-start">
        <div className="font-poppins-bold text-2xl">{job}</div>
        <div className="flex flex-row justify-center items-center gap-1 font-poppins text-md">
          <FaLocationDot className="text-red-500" />
          {location}
        </div>
        {link && (
          <div className="flex flex-row justify-center items-center gap-1 font-poppins text-md">
            <FaLink className="text-[#FFC048]" />
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#FFC048] hover:underline">
              {link}
            </a>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col text-white">
        <div className="font-poppins-medium-italic text-md">
          Submitted Documents:
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
          {documents.map(({ label, file }) => (
            <div
              key={label}
              className="w-full bg-[#E2E2E2] border-2 border-[#646464] rounded-lg py-3 px-5 flex flex-col text-[#646464]"
            >
              <div className="font-poppins-bold text-lg">{label}</div>
              <button
                onClick={() => openModal(file)}
                className="mt-3 w-35 bg-[#646464] text-[#E2E2E2] cursor-pointer rounded-full text-lg font-poppins-bold
                  flex flex-row items-center justify-center gap-2 py-1 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <PiEyeBold className="text-xl" />
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row space-x-3 font-poppins-bold">
        <button 
          onClick={async () => {
            await approveExpert(expertId);
            await reload();
          }}
          className="rounded-lg px-10 py-1 bg-[#F4FFC5] text-[#00600E] border-2 border-[#00600E] hover:bg-[#00600E] hover:text-[#F4FFC5] hover:scale-105 cursor-pointer transition-all duration-200 ease-in-out">
          Approve
        </button>
        <button 
          onClick={async () => {
            await rejectExpert(expertId);
            await reload();
          }}
          className="rounded-lg px-10 py-1 bg-[#FFC8C9] text-[#BF0003] border-2 border-[#BF0003] hover:bg-[#BF0003] hover:text-[#FFC8C9] hover:scale-105 cursor-pointer transition-all duration-200 ease-in-out">
          Reject
        </button>
      </div>

      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 bg-opacity-70"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl p-5 max-w-5xl w-full max-h-[90vh] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute cursor-pointer top-3 right-3 text-3xl font-bold text-gray-700 hover:text-gray-900 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
            >
              &times;
            </button>

            {fileType === "pdf" ? (
              <div className="w-full h-[80vh]">
                <iframe
                  src={modalUrl}
                  className="w-full h-full border-0 rounded-lg"
                  title="PDF Document"
                />
              </div>
            ) : (
              <div className="w-full max-h-[80vh] overflow-auto flex items-center justify-center">
                <img 
                  src={modalUrl} 
                  alt="Document" 
                  className="max-w-full h-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}