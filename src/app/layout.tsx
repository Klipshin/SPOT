//FROM HANNAH: DO NOT MAKE THIS A CLIENT COMPONENT

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import SupabaseProvider from '../components/providers/SupabaseProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SPOT - Species Protection & Online Tracking',
  description: 'AI-powered wildlife identification platform for communities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} antialiased`}>
        {/* Centered Navigation Bar */}
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
              <a href="#home" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
                Home
              </a>
              <a href="#about" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
                About
              </a>
              <a href="#explore" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
                Explore
              </a>
              <a href="#faqs" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
                FAQs
              </a>
              <a href="#contact" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
                Contact
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="absolute top-[15px] right-[40px] flex items-center gap-4">
              <button className="font-bold text-[#246440] text-[15px] hover:underline transition-all">
                Log In
              </button>
              <button className="w-[108px] h-[33px] bg-[#d1e39b] rounded-[9px] font-bold text-[#25451f] text-[15px] hover:bg-[#c5d78f] transition-all">
                Sign Up
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
        {/* You can add a footer here if needed */}
      </body>
    </html>
  );
}