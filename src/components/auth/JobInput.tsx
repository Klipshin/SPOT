"use client";

import { useState, useRef, useEffect, FC, ChangeEvent } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

interface JobInputProps {
  options: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const JobInput: FC<JobInputProps> = ({
  options,
  placeholder = "Type or select",
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleSelect = (option: string) => {
    setValue(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-center gap-5">
        <h3 className="text-lg font-poppins-medium-italic">{"Job/Occupation"}</h3>
      <div
        className={`flex items-center border rounded-xl overflow-hidden transition-colors ${
          value ? "text-[#082E0D] border border-[#082E0D8F] bg-[#95AB33B2] " : "bg-white border-[#082E0D8F]"
        }`}
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 py-1 px-2 outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 flex items-center justify-center cursor-pointer"
        >
          <IoIosArrowDropdownCircle
            className={`w-6 text-[#082E0D] h-auto transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && options.length > 0 && (
        <ul className="absolute top-full right-0 mt-1 p-2 border rounded-xl bg-white shadow-lg z-10 max-h-48 overflow-auto w-max scrollbar-none">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="px-3 py-1 text-sm hover:bg-[#082E0D] hover:text-[#95AB33B2] cursor-pointer rounded-lg whitespace-nowrap"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobInput;
