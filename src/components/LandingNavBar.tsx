import Image from 'next/image';
import React from 'react'

export default function LandingNavBar() {
    
  return (
    <header className="fixed top-3 left-1/2 transform -translate-x-1/2 w-[1383px] h-[94px] z-50">
        <div className="relative flex justify-center items-center h-full">
            <Image
                src="/topbar.png"
                alt="Navigation Background"
                width={1334}
                height={56}
                className="absolute top-[7px] left-1/2 -translate-x-1/2"
            />

            {/* Logo */}
            <div className="absolute top-[3px] left-[33px]">
            <Image
                src="/spot icon.svg"
                alt="SPOT Icon"
                width={79}
                height={54}
            />
            </div>

            <div className="absolute top-0 left-[110px] text-[40px] font-extrabold bg-gradient-to-b from-[#95ab33] via-[#23732f] to-[#082e0d] bg-clip-text text-transparent"> SPOT </div>
    
             {/* Navigation Links */}
            <nav className="absolute top-[18px] left-1/2 -translate-x-1/2 flex items-center gap-[75px]">
            <a 
                href="#home" 
                className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors cursor-pointer"
                onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                Home
            </a>
            <a 
                href="#about" 
                className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors cursor-pointer"
                onClick={(e) => {
                e.preventDefault();
                document.getElementById('what-is-spot')?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                About
            </a>
            <a 
                href="#explore" 
                className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors cursor-pointer"
                onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                Explore
            </a>
            <a 
                href="#faqs" 
                className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors cursor-pointer"
                onClick={(e) => {
                e.preventDefault();
                document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                FAQs
            </a>
            <a 
                href="#contact" 
                className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors cursor-pointer"
                onClick={(e) => {
                e.preventDefault();
                document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                Contact
            </a>
            </nav>
    
            {/* Auth Buttons */}
            <div className="absolute top-[15px] right-[40px] flex items-center gap-4">
                <button className="cursor-pointer font-bold text-[#246440] text-[15px] hover:underline transition-all"
                    onClick={() => {
                    // Add your click handler here
                    console.log('Log In Clicked!');
                }}
                >
                    Log In
                </button>
                <button className="cursor-pointer w-[108px] h-[33px] bg-[#d1e39b] rounded-[9px] font-bold text-[#25451f] text-[15px] hover:bg-[#c5d78f] transition-all"
                onClick={() => {
                    // Add your click handler here
                    console.log('Sign Up Clicked!');
                }}
                >
                    Sign Up
                </button>
            </div>
        </div>
    </header>
  )
}
