'use client';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Settings, HelpCircle, LogOut, User, Briefcase, MapPin, Edit, ArrowLeft } from 'lucide-react';

export default function ExpertProfilePage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      return stored === 'true';
    }
    return false;
  });
  
  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', isDarkMode.toString());
    }
  }, [isDarkMode]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    job: '',
    email: '',
    location: '',
  });

  const [editableFields, setEditableFields] = useState({
    username: false,
    name: false,
    job: false,
    email: false,
    location: false,
  });

  const inputRefs = {
    username: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    job: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    location: useRef<HTMLInputElement>(null),
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const enableFieldEditing = (field: keyof typeof formData) => {
    setEditableFields(prev => ({ ...prev, [field]: true }));
    requestAnimationFrame(() => {
      inputRefs[field].current?.focus();
    });
  };

  const disableFieldEditing = (field: keyof typeof formData) => {
    setEditableFields(prev => ({ ...prev, [field]: false }));
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

  return (
    <div 
      className="h-screen flex flex-col bg-gradient-to-b from-green-50 to-amber-50 overflow-hidden" 
      style={{ 
        backgroundImage: `url('/${isDarkMode ? 'dark.png' : 'light.png'}')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundAttachment: 'fixed',
        zoom: '100%',
      }}
    >
      <div className="fixed top-0 left-0 right-0 w-full z-50">
        
          {/* Background Bar */}
          <div className={`w-full h-11 justify-center ${isDarkMode ? 'bg-[#373333]' : 'bg-[#dad2b9]'}`} />

        {/* SPOT Logo Text */}
            <div className="absolute -top-0.5 left-[70px] [-webkit-text-stroke:0.5px_#072d0d] bg-[linear-gradient(180deg,rgba(149,171,51,1)_30%,rgba(35,115,47,1)_57%,rgba(8,46,13,1)_83%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins-ExtraBold',Helvetica] font-extrabold text-transparent text-[32px] tracking-[1.60px] leading-[normal]">
              SPOT
            </div>

        {/* Logo Icon */}
            <img className="absolute top-0 left-[15px] w-[50px] h-[40px] aspect-[1.48] object-cover" alt="Spoticon" src="/eyecon.svg" />

      {/* Right Side Icons */}
            <button 
    className="absolute top-0 left-[1365px] hover:scale-110 transition-transform duration-200 cursor-pointer"
    onClick={() => setIsDarkMode(!isDarkMode)}
>
    {isDarkMode ? (
        <img className="w-[70px] h-[50px]" style={{ marginTop: '1px' }} alt="Dark Mode" src="/darkk.svg" />
    ) : (
        <img className="w-[47px] h-[31px]" style={{ marginTop: '6px' }} alt="Light Mode" src="/lightt.svg" />
    )}
</button>

{/* User Profile Button (Chevron + PFP combined) */}
<div className="absolute top-[5px] left-[1440px]">
  <button 
    className="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
    onClick={() => setIsProfileOpen(!isProfileOpen)}
    onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
  >
    <img 
      className="w-[35px] h-[35px] aspect-[1] object-cover" 
      alt="Down chevron" 
      src="/downn.svg" 
    />
    <img 
      className="w-[35px] h-[35px] aspect-[1] object-cover rounded-full" 
      alt="User" 
      src="/pfpp.svg" 
    />
  </button>

  {/* Profile Dropdown */}
  {isProfileOpen && (
    <div 
     className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-50"
      style={{ border: '2px solid #899A3C' }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-gray-300">
        <h3 className="text-base font-bold text-gray-900">@username</h3>
        <p className="text-xs text-gray-600 mt-0.5">username@gmail.com</p>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <button 
          className="w-full px-4 py-2 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-2.5"
          onClick={() => {
            // Add your View Profile logic here
          }}
        >
          <User className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-900">View Profile</span>
        </button>
        
        <button 
          className="w-full px-4 py-2 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-2.5"
          onClick={() => {
            // Add your Account Settings logic here
          }}
        >
          <Settings className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-900">Account Settings</span>
        </button>
        
        <button 
          className="w-full px-4 py-2 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-2.5"
          onClick={() => {
            // Add your Help Center logic here
          }}
        >
          <HelpCircle className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-900">Help Center</span>
        </button>
      </div>

      {/* Log Out Section */}
      <div className="border-t border-gray-400">
        <button 
          className="w-full px-4 py-2 text-left hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2.5 group"
          onClick={() => {
            // Add your Log Out logic here
          }}
        >
          <LogOut className="w-4 h-4 text-gray-700 group-hover:text-white" />
          <span className="text-sm font-medium text-gray-900 group-hover:text-white">Log Out</span>
        </button>
      </div>
    </div>
  )}
</div>
          </div>


      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 h-full flex gap-6">
      </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex gap-10 px-12 py-20 max-w-[1800px] mx-auto">
        {/* Left Panel - Profile Editing Form */}
        <div className="flex-1 bg-white rounded-[40px] p-15 shadow-2xl w-250">
          <div className="flex gap-8">
            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-800">Username</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    ref={inputRefs.username}
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onBlur={() => disableFieldEditing('username')}
                    readOnly={!editableFields.username}
                    placeholder="Username"
                    className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-gray-900 text-base placeholder:text-gray-400 ${
                      editableFields.username
                        ? 'border-[#306137]'
                        : 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => enableFieldEditing('username')}
                    className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
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
                    ref={inputRefs.name}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => disableFieldEditing('name')}
                    readOnly={!editableFields.name}
                    placeholder="Name"
                    className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-gray-900 text-base placeholder:text-gray-400 ${
                      editableFields.name
                        ? 'border-[#306137]'
                        : 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => enableFieldEditing('name')}
                    className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
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
                    ref={inputRefs.job}
                    value={formData.job}
                    onChange={(e) => handleInputChange('job', e.target.value)}
                    onBlur={() => disableFieldEditing('job')}
                    readOnly={!editableFields.job}
                    placeholder="Job/Occupation"
                    className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-gray-900 text-base placeholder:text-gray-400 ${
                      editableFields.job
                        ? 'border-[#306137]'
                        : 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => enableFieldEditing('job')}
                    className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
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
                    ref={inputRefs.email}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => disableFieldEditing('email')}
                    readOnly={!editableFields.email}
                    placeholder="Email"
                    className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-gray-900 text-base placeholder:text-gray-400 ${
                      editableFields.email
                        ? 'border-[#306137]'
                        : 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => enableFieldEditing('email')}
                    className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
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
                    ref={inputRefs.location}
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    onBlur={() => disableFieldEditing('location')}
                    readOnly={!editableFields.location}
                    placeholder="Location"
                    className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-gray-900 text-base placeholder:text-gray-400 ${
                      editableFields.location
                        ? 'border-[#306137]'
                        : 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => enableFieldEditing('location')}
                    className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
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
      {/* Placeholder for profile image */}
      {profileImage ? (
        <img 
          src={profileImage} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-[#FFFFFF] flex items-center justify-center">
        </div>
      )}
    </div>
    
    {/* Hidden file input */}
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      accept="image/*"
      className="hidden"
    />
    
    {/* Edit Icon (bottom right) */}
    <button 
      onClick={handleProfilePictureClick}
      className="absolute bottom-4 right-4 w-12 h-12 bg-[#306137] rounded-full shadow-lg flex items-center justify-center hover:bg-[#246440] transition-colors cursor-pointer"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  </div>
</div>
          </div>
        </div>

       {/* Right Sidebar - User Profile */}
<aside className="w-80 flex-shrink-0 flex flex-col" style={{ marginTop: '-40px' }}>
  <div
    className="text-white relative"
    style={{
      backgroundImage: 'url(exp.svg)',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '400px',
      padding: '32px'
    }}
  >
            
            {/* Content wrapper with relative positioning */}
            <div className="relative z-10 py-15">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-15 h-15 bg-white/30 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold opacity-90">@username</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold">Cliff Edward Alsonado</p>
                      <img 
          src="badge.svg" 
          alt="Experience Badge" 
          className="w-6 h-6"
        />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2.5 text-base">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span className="font-medium">occupation</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>location</span>
                </div>
              </div>
            </div>
          </div>

         {/* Save and Back Buttons */}
<div className="mt-auto pt-6 space-y-3">
  {/* Save Button */}
  <button className="w-full transition-all duration-200 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
    <img src="/savee.svg" alt="Save Changes" className="w-full h-auto" />
  </button>

  {/* Back Button */}
  <button className="w-full transition-all duration-200 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
    <img src="/backz.svg" alt="Back" className="w-full h-auto" />
  </button>
</div>
        </aside>
      </div>
    </div>
  );
}