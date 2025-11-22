'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, User, Sun, Moon } from 'lucide-react';

// FIX: Use the alias pointing to src/context
import { useTheme } from '@/app/components/ThemeContext';

export default function Header() {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme(); 
  const isCommunityPage = pathname === '/community';

  // --- COMMUNITY HEADER ---
  if (isCommunityPage) {
    return (
      <header className={`fixed top-0 left-0 w-full h-[70px] border-b z-50 flex items-center justify-between px-8 font-poppins shadow-sm transition-colors duration-300 
        ${isDarkMode ? 'bg-[#333333] border-[#444]' : 'bg-[#E2DFC8] border-[#A8A8A8]'}`}>

        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3">

          {/* UPDATED: Bigger icon + visible in dark mode */}
          <Image
            src="/spot icon.svg"
            alt="SPOT Icon"
            width={70}
            height={70}
            className={`object-contain ${isDarkMode ? "drop-shadow-[0_0_4px_white] brightness-110" : ""}`}
          />

          <span className={`text-4xl font-extrabold tracking-tight drop-shadow-sm 
            ${isDarkMode ? 'text-[#4CA954]' : 'text-[#36683d]'}`}>
            SPOT
          </span>
        </Link>

        {/* Right: Controls */}
        <div className="flex items-center gap-5">

          {/* === TOGGLE BUTTON === */}
          <div 
            className="relative flex items-center cursor-pointer h-8 mr-1"
            onClick={toggleTheme}
          >
            <div className={`w-14 h-8 rounded-full shadow-inner transition-colors duration-300 
              ${isDarkMode ? 'bg-[#3F3C56]' : 'bg-[#4B4A2C]'}`}></div>
            
            <div className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-md border-[3px] transition-all duration-300
              ${isDarkMode 
                ? 'left-[18px] bg-white border-[#333]' 
                : '-left-1 bg-[#FFD500] border-[#E2DFC8]' 
              }`}>
               {isDarkMode ? (
                 <Moon className="w-6 h-6 text-[#3F3C56] fill-[#3F3C56]" />
               ) : (
                 <Sun className="w-6 h-6 text-[#F59E0B] fill-[#F59E0B]" />
               )}
            </div>
          </div>

          <ChevronDown className={`w-8 h-8 cursor-pointer stroke-[3] ${isDarkMode ? 'text-white' : 'text-black'}`} />
          
          <div className={`w-11 h-11 rounded-full flex items-center justify-center overflow-hidden border-[2px] shadow-sm cursor-pointer
            ${isDarkMode ? 'bg-[#9CA3AF] border-[#767D85]' : 'bg-[#B6BEC7] border-[#767D85]'}`}>
             <User className={`w-10 h-10 translate-y-1.5 ${isDarkMode ? 'text-[#D1D5DB] fill-current' : 'text-[#7E868E] fill-current'}`} />
          </div>

        </div>
      </header>
    );
  }

  // --- LANDING HEADER (Unchanged) ---
  return (
    <header className="fixed top-3 left-1/2 transform -translate-x-1/2 w-[1383px] h-[94px] z-50 transition-all duration-300">
       <div className="relative flex justify-center items-center h-full">
        <Image src="/topbar.png" alt="Navigation Background" width={1334} height={56} className="absolute top-[7px] left-1/2 -translate-x-1/2" />
        <Image src="/spot icon.svg" alt="SPOT Icon" width={79} height={54} className="absolute top-[3px] left-[33px]" />
        
        <div className="absolute top-0 left-[110px] text-[40px] font-extrabold bg-gradient-to-b from-[#95ab33] via-[#23732f] to-[#082e0d] bg-clip-text text-transparent">
          SPOT
        </div>

        <nav className="absolute top-[18px] left-1/2 -translate-x-1/2 flex items-center gap-[75px]">
          <Link href="/" className="font-bold text-[#306137] text-[15px] hover:text-[#246440]">Home</Link>
          <Link href="/#about" className="font-bold text-[#306137] text-[15px] hover:text-[#246440]">About</Link>
          <Link href="/#explore" className="font-bold text-[#306137] text-[15px] hover:text-[#246440]">Explore</Link>
          <Link href="/#faqs" className="font-bold text-[#306137] text-[15px] hover:text-[#246440]">FAQs</Link>
          <Link href="/#contact" className="font-bold text-[#306137] text-[15px] hover:text-[#246440]">Contact</Link>
        </nav>

        <div className="absolute top-[15px] right-[40px] flex items-center gap-4">
          <Link href="/community">
            <span className="font-bold text-[#246440] text-[15px] hover:underline cursor-pointer">Log In</span>
          </Link>
          <button className="w-[108px] h-[33px] bg-[#d1e39b] rounded-[9px] font-bold text-[#25451f] text-[15px] hover:bg-[#c5d78f]">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
