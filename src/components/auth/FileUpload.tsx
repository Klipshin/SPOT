import React, { useState } from 'react'
import { FaFolder } from "react-icons/fa";

interface FileInputProps {
  label: string;
  id: string;
  acceptedFiles?: string;
}

export default function FileUpload({ label, id, acceptedFiles }: FileInputProps) {
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName("");
        }
    };


  return (
    <div className="flex flex-col items-center justify-center">
        <label className="text-left text-base font-poppins-medium-italic" htmlFor={id}>
            {label}
        </label>

        <div className="relative w-fit flex items-center justify-center">
            <FaFolder className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-yellow-300 pointer-events-none" />
            <input
                id={id}
                type="file"
                placeholder="Choose file"
                accept={acceptedFiles}
                onChange={handleFileChange}
                className="border border-[#082E0D8F] outline-none focus:border-black py-1 px-5 w-75 rounded-lg cursor-text"
                autoComplete="off"
            />
            {fileName && (
            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-700 text-sm truncate pointer-events-none">
                {fileName || "Choose file"}
            </span>
            )}
        </div>
    </div>
  )
}
