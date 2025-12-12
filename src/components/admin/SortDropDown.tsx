"use client";

import React, { useState, useRef, useEffect } from 'react'
import { IoIosArrowDropdownCircle } from "react-icons/io";

type SortOption = {
  value: string;
  label: string;
}

type SortDropDownProps = {
  value?: string;
  onChange?: (value: string) => void;
  options?: SortOption[];
}

export default function SortDropDown({ value = "", onChange, options = [] }: SortDropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0] || { value: "", label: "Sort by" };

  return (
    <div className="relative w-55 border-[#245329] border-2 bg-[#C4DA83] rounded-full p-1" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-row items-center justify-center w-full px-2 py-1 font-poppins-semibold text-base text-[#245329] cursor-pointer"
      >
        {selectedOption.label}
        <IoIosArrowDropdownCircle className={`text-2xl ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && options.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border-2 border-[#245329] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange?.(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 font-poppins text-sm hover:bg-[#C4DA83] transition-colors ${
                value === option.value ? 'bg-[#C4DA83] font-semibold' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
