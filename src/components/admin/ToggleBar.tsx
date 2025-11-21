"use client";

import React, { useState } from 'react';

type ToggleBarTabs = {
  barOne: string;
  barTwo: string;
};

export default function ToggleBar({ barOne, barTwo }: ToggleBarTabs) {
  const [activeCategory, setActiveCategory] = useState(barOne);

  return (
    <div className="flex justify-end">
      <div className="flex bg-white border-2 border-[#245329] rounded-full p-1 gap-1">

        <button
          onClick={() => setActiveCategory(barOne)}
          className={`px-4 sm:px-6 py-2 rounded-full text-base font-medium transition-all duration-200 cursor-pointer font-poppins-bold ${
            activeCategory === barOne
              ? "bg-[#082E0D] text-white shadow-sm"
              : "text-gray-600 hover:text-[#74863B]"
          }`}
        >
          {barOne}
        </button>

        <button
          onClick={() => setActiveCategory(barTwo)}
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
