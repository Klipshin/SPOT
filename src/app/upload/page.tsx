 'use client';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Upload() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('spot_pending_upload');
      const storedStatic = localStorage.getItem('spot_pending_upload_static');

      if (stored) {
        setPreview(stored);
      } else if (storedStatic) {
        setPreview(storedStatic);
      }
    } catch (err) {
      console.error('Failed to read pending upload', err);
    }
  }, []);

  const handleBack = () => router.push('/');
  const handleLogin = () => router.push('/auth/login');
  const handleSignup = () => router.push('/auth/signup');

  const handleReplaceClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      try {
        localStorage.setItem('spot_pending_upload', data);
      } catch (err) {
        console.error('Failed to store selected image', err);
      }
      setPreview(data);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#f1eee5] relative overflow-hidden font-poppins">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Image 
          src="/landingbg1.png" 
          alt="landing-page-bg"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        
        {/* --- HEADER --- */}
        <header className="flex items-center justify-between w-full mb-12">
          
          {/* LEFT GROUP: Logo, Brand, and Back Link */}
          <div className="flex items-center gap-12"> 
            
            {/* Logo & Brand (Often treated as clickable to go home) */}
            <div className="flex items-center gap-4 cursor-pointer">
              <Image 
                src="/spot icon.svg" 
                alt="spot-icon"
                width={60}
                height={60}
                className="w-12 h-12 md:w-[60px] md:h-[60px]"
              />
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#3a5a2a] tracking-tight">
                SPOT
              </h1>
            </div>

            {/* Back to Home Link (Already a Link, adding explicit cursor) */}
            <button onClick={handleBack} className="text-[16px] font-bold text-[#316138] hover:text-[#1e3d23] transition-colors cursor-pointer">
              &lt; Back to Home
            </button>
          </div>

          {/* RIGHT GROUP: Auth Buttons */}
          <div className="flex items-center gap-6">
            {/* Log In Button */}
            <button onClick={handleLogin} className="text-[16px] font-bold text-[#246540] hover:underline cursor-pointer">
              Log In
            </button>
            {/* Sign Up Button */}
            <button onClick={handleSignup} className="text-[16px] font-bold text-[#26451f] bg-[#d0e690] px-8 py-2.5 rounded-full hover:bg-[#c2d980] transition-colors shadow-sm cursor-pointer">
              Sign Up
            </button>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center mt-4">
          
          {/* Left Side - Image Upload Area (This entire div is clickable) */}
          <div className="w-full lg:w-[650px] h-[500px]">
             {/* Added file input and cursor-pointer here */}
             <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
             <div onClick={handleReplaceClick} className="w-full h-full bg-[#d0e690]/30 border-[3px] border-dashed border-[#4a4a4a]/80 rounded-[60px] flex flex-col items-center justify-center hover:bg-[#d0e690]/40 transition-colors cursor-pointer group overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Selected" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <p className="text-[#3a4216] font-bold text-xl">+ Upload Image</p>
                  </div>
                )}

            </div>
          </div>

          {/* Right Side - AI Response & CTA */}
          <div className="w-full lg:w-[500px] flex flex-col gap-8">
            
            {/* AI Response Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[30px] p-8 min-h-[350px] shadow-lg border border-white/50">
              <h2 className="text-[18px] font-bold text-black mb-4">
                AI Response
              </h2>
              <div className="w-full h-[1px] bg-gray-200 mb-4"></div>
              {/* Content placeholder */}
              <p className="text-gray-400 italic text-sm">
                Upload an image to identify the species...
              </p>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <p className="text-[15px] text-[#2d3a1e] mb-6 italic font-medium">
                Want to ask more questions and save your sightings?<br />
                Create your free account and join the SPOT community today!
              </p>
              
              {/* Styled Button matching Landing Page */}
              {/* Added cursor-pointer here */}
              <button onClick={handleSignup} className="relative group inline-block cursor-pointer">
                <div className="absolute inset-0 bg-black rounded-[29px] translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
                <div className="relative bg-[#3a4216] rounded-[29px] px-12 py-3 border-2 border-black active:translate-y-1 active:translate-x-1 transition-transform">
                  <span className="text-[20px] font-bold tracking-[0.05em] text-[#c6e54d]">
                    Be an Explorer!
                  </span>
                </div>
              </button>
            </div>
          </div>

        </div>
        {/* preview shown inside the main dashed container; removed duplicate floating preview */}
      </div>
    </div>
  );
}