import React from 'react'
import { FaSearch } from 'react-icons/fa'

export default function SearchBar() {
  return (
    <div className="flex items-center bg-white/25 w-175 border-2 border-[#245329] rounded-full p-1 gap-1 px-3">
      <FaSearch className="text-black opacity-80" />
      <input 
        type="text"
        className="w-200 bg-transparent py-1 px-2 outline-none text-base font-poppins text-black placeholder-black/70"
        placeholder="Search..."
      />
    </div>
  )
}
