'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    job: '',
    email: '',
    location: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/landingbg1.png" 
          alt="Background"
          fill
          className="object-cover opacity-70"
          priority
        />
        {/* Additional overlay for muted effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e8]/30 to-[#e8e0d0]/40"></div>
      </div>

      {/* Header Bar */}
      <header className="relative z-20 w-full h-24 bg-[#d1e39b] flex items-center justify-between px-12 shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image 
            src="/spot icon.svg" 
            alt="SPOT Icon"
            width={60}
            height={60}
            className="w-12 h-12"
          />
          <span className="text-3xl font-extrabold bg-gradient-to-b from-[#95ab33] via-[#23732f] to-[#082e0d] bg-clip-text text-transparent">
            SPOT
          </span>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-5">
          {/* Theme Toggle (Moon Icon) */}
          <button className="w-9 h-9 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#306137"/>
            </svg>
          </button>
          
          {/* Chevron Down */}
          <button className="w-9 h-9 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="#306137" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>

          {/* Profile Icon */}
          <button className="w-11 h-11 rounded-full bg-white border-2 border-[#306137] flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-9 h-9 bg-[#306137] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex gap-10 px-12 py-16 max-w-[1700px] mx-auto">
        {/* Left Panel - Profile Editing Form */}
        <div className="flex-1 bg-white rounded-[40px] p-10 shadow-2xl">
          <div className="flex gap-8">
            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-800">Username</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Username"
                    className="flex-1 px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#306137] text-gray-900 text-base placeholder:text-gray-400"
                  />
                  <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-800">Name</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Name"
                    className="flex-1 px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#306137] text-gray-900 text-base placeholder:text-gray-400"
                  />
                  <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Job/Occupation */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-800">Job/Occupation</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.job}
                    onChange={(e) => handleInputChange('job', e.target.value)}
                    placeholder="Job/Occupation"
                    className="flex-1 px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#306137] text-gray-900 text-base placeholder:text-gray-400"
                  />
                  <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-800">Email</label>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email"
                    className="flex-1 px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#306137] text-gray-900 text-base placeholder:text-gray-400"
                  />
                  <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-800">Location</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Location"
                    className="flex-1 px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#306137] text-gray-900 text-base placeholder:text-gray-400"
                  />
                  <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#306137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Picture Area */}
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64">
                {/* Profile Picture Circle */}
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-gray-400 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for llama image - using a simple div for now */}
                  <div className="w-full h-full bg-[#306137] flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">L</span>
                  </div>
                </div>
                
                {/* Upload Icon (bottom left) - Landscape icon */}
                <button className="absolute bottom-6 left-6 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-colors border-2 border-gray-300 cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12h18M12 3v18" stroke="#306137" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#306137" strokeWidth="2"/>
                    <path d="M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" stroke="#306137" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                {/* Edit Icon (bottom right) */}
                <button className="absolute bottom-4 right-4 w-12 h-12 bg-[#306137] rounded-full shadow-lg flex items-center justify-center hover:bg-[#246440] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Profile Preview */}
        <div className="w-[420px] bg-[#0a0a1a] rounded-[40px] p-10 shadow-2xl border-[3px] border-yellow-400 relative overflow-hidden">
          {/* Background Image for Preview - Night Sky/Aurora Effect */}
          <div className="absolute inset-0 opacity-40">
            <Image 
              src="/landingbg2.png" 
              alt="Preview Background"
              fill
              className="object-cover"
            />
          </div>
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/90 via-[#1a1a2e]/80 to-[#0a0a1a]/90"></div>

          {/* Preview Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            {/* Profile Picture */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-white flex items-center justify-center overflow-hidden shadow-xl mb-2">
              <div className="w-full h-full bg-[#306137] flex items-center justify-center">
                <span className="text-white text-4xl font-bold">L</span>
              </div>
            </div>

            {/* Username */}
            <div className="text-white text-2xl font-bold mt-2">
              {formData.username || 'Username'}
            </div>

            {/* Name with Badge */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white text-lg font-semibold">
                {formData.name || 'Name'}
              </span>
              {formData.name && (
                <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Job */}
            <div className="flex items-center gap-2 text-white mt-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-white text-base">{formData.job || 'Job/Occupation'}</span>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 text-white mt-4 max-w-[300px]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 flex-shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#ef4444"/>
                <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="white"/>
              </svg>
              <span className="text-white text-sm leading-relaxed">{formData.location || 'Location'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 flex justify-end px-12 pb-12">
        <Link href="/">
          <button className="bg-[#306137] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#246440] transition-colors flex items-center gap-3 shadow-xl text-lg">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12l6-6M5 12l6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>back</span>
          </button>
        </Link>
      </div>
    </div>
  );
}

