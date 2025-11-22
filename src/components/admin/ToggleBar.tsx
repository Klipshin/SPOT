"use client";

import React, { useState } from 'react';

type ToggleBarTabs = {
  barOne: string;
  barTwo: string;
  activeCategory: string;
  onChange: (category: string) => void;
};

export default function ToggleBar({ barOne, barTwo, activeCategory, onChange }: ToggleBarTabs) {
  return (
    <div className="flex justify-end">
      <div className="flex bg-white border-2 border-[#245329] rounded-full p-1 gap-1">

        <button
          onClick={() => onChange(barOne)}
          className={`px-4 sm:px-6 py-2 rounded-full text-base font-medium transition-all duration-200 cursor-pointer font-poppins-bold ${
            activeCategory === barOne
              ? "bg-[#082E0D] text-white shadow-sm"
              : "text-gray-600 hover:text-[#74863B]"
          }`}
        >
          {barOne}
        </button>

        <button
          onClick={() => onChange(barTwo)}
          className={`px-4 sm:px-6 py-2 rounded-full text-base font-medium transition-all duration-200 cursor-pointer font-poppins-bold ${
            activeCategory === barTwo
              ? "bg-[#082E0D] text-white shadow-sm"
              : "text-gray-600 hover:text-[#74863B]"
          }`}
        >
          {barTwo}
        </button>

      </div>
    </div>
  );
}
