import React, { useRef, useState } from 'react';
import { FaFolder } from "react-icons/fa";

interface FileUploadProps {
  label: string;
  id: string;
  acceptedFiles?: string;
}

export default function FileUpload({ label, id, acceptedFiles }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const fileUploaded = fileName 
    ? "text-[#082E0D] border border-[#082E0D8F] bg-[#95AB33B2] "
    : "border border-[#082E0D8F] outline-none"

  return (
    <div className="flex flex-col items-start gap-1 w-full">
      <label htmlFor={id} className="mx-5 text-base font-poppins-medium-italic">
        {label}
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClick}
          className={`flex items-center gap-2 py-1 px-5 w-125 rounded-xl cursor-pointer ${fileUploaded}  hover:bg-[#082E0D] hover:text-[#95AB33B2] transition-colors duration-200 ease-in-out`}
        >
          <FaFolder className="text-yellow-300" />
          <span className="truncate max-w-[150px]">
            {fileName || "Choose File"}
          </span>  
        </button>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={acceptedFiles}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
