import React from 'react'
import { IoIosArrowDropdownCircle } from "react-icons/io";

export default function SortDropDown() {
  return (
    <div className="w-32 border-[#245329] border-2 bg-[#C4DA83] rounded-full p-1">

      <button
        className="flex flex-row items-center justify-center w-full px-2 py-1 font-poppins-semibold text-base text-[#245329] cursor-pointer"
      >
        Sort by
        <IoIosArrowDropdownCircle className="text-2xl ml-1" />
      </button>
      
    </div>
  );
}
