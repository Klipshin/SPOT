'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// You might have other imports here like specific icons, 
// but this Logic works regardless of your content.

export default function Header() {
  const pathname = usePathname();

  // =======================================================
  // 🔴 THE FIX IS HERE
  // If we are on the community page, return null (hide this header)
  // because page.tsx has its own special header.
  // =======================================================
  if (pathname === '/community') {
    return null;
  }

  // --- BELOW IS YOUR EXISTING LANDING PAGE HEADER CODE ---
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