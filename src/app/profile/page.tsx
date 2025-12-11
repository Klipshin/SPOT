'use client';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Settings, HelpCircle, LogOut, User, Briefcase, MapPin, Edit, ArrowLeft, Crown } from 'lucide-react';
import { createClient } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Leaflet
const LocationSearch = dynamic(() => import('@/src/components/LocationSearch'), {
  ssr: false
});

export default function ProfilePage() {
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isExpert, setIsExpert] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    job: '',
    email: '',
    location: '',
  });

  // Load user profile data
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('username, name, location, profile_picture, is_expert')
          .eq('user_id', user.id)
          .single();

        // Check if user is an expert to get occupation
        const { data: expertData } = await supabase
          .from('experts')
          .select('occupation, is_verified')
          .eq('user_id', user.id)
          .single();

        // Set expert status
        setIsExpert(profile?.is_expert || (expertData?.is_verified === true));

        if (profile) {
          setFormData({
            username: profile.username || '',
            name: profile.name || '',
            job: expertData?.occupation || 'Wildlife Enthusiast',
            email: user.email || '',
            location: profile.location || '',
          });
          if (profile.profile_picture) {
            setProfileImage(profile.profile_picture);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, [supabase, router]);

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

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in to save your profile');
        return;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          username: formData.username,
          name: formData.name,
          location: formData.location,
          profile_picture: profileImage,
        })
        .eq('user_id', user.id);

      // If user is an expert, update occupation in experts table
      if (formData.job) {
        await supabase
          .from('experts')
          .update({ occupation: formData.job })
          .eq('user_id', user.id);
      }

      if (error) throw error;

      // Show success modal
      setShowSuccessModal(true);
      // Disable all field editing after save
      setEditableFields({
        username: false,
        name: false,
        job: false,
        email: false,
        location: false,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
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
      src={profileImage || "/pfpp.svg"} 
    />
  </button>

  {/* Profile Dropdown */}
  {isProfileOpen && (
    <div 
     className={`absolute right-0 mt-1 w-64 rounded-xl shadow-xl overflow-hidden z-50 ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'}`}
      style={{ border: '2px solid #899A3C' }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* User Info Section */}
      <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
        <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>@{formData.username || 'username'}</h3>
        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{formData.email || 'email@example.com'}</p>
      </div>

      {/* Menu Items - WITHOUT "View Profile" since we're already on the profile edit page */}
      <div className="py-1">
        <button 
          className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2.5 ${isDarkMode ? 'hover:bg-[#3a3a3a]' : 'hover:bg-[#DBE9AF]'}`}
          onClick={() => {
            setIsProfileOpen(false);
            router.push('/settings');
          }}
        >
          <Settings className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Account Settings</span>
        </button>
        
        <button 
          className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2.5 ${isDarkMode ? 'hover:bg-[#3a3a3a]' : 'hover:bg-[#DBE9AF]'}`}
          onClick={() => {
            setIsProfileOpen(false);
            // Help Center logic here
          }}
        >
          <HelpCircle className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Help Center</span>
        </button>
      </div>

      {/* Log Out Section */}
      <div className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>
        <button 
          className="w-full px-4 py-2 text-left hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2.5 group"
          onClick={async () => {
            try {
              await supabase.auth.signOut();
              router.push('/auth/login');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }}
        >
          <LogOut className={`w-4 h-4 group-hover:text-white ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
          <span className={`text-sm font-medium group-hover:text-white ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Log Out</span>
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
        {isLoading ? (
          <div className={`flex-1 rounded-[40px] p-15 shadow-2xl w-250 flex items-center justify-center ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'}`}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#306137] mx-auto mb-4"></div>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading profile...</p>
            </div>
          </div>
        ) : (
          <>
        {/* Left Panel - Profile Editing Form */}
        <div className={`flex-1 rounded-[40px] p-15 shadow-2xl w-250 ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'}`}>
          <div className="flex gap-8">
            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <label className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Username</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    ref={inputRefs.username}
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onBlur={() => disableFieldEditing('username')}
                    readOnly={!editableFields.username}
                    placeholder="Username"
                    className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-base placeholder:text-gray-400 ${
                      editableFields.username
                        ? 'border-[#306137]'
                        : isDarkMode 
                          ? 'border-gray-600 bg-gray-700 cursor-not-allowed text-gray-300'
                          : 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-500'
                    } ${isDarkMode ? 'text-white bg-gray-800' : 'text-gray-900'}`}
                  />
                  <button
                    type="button"
                    onClick={() => enableFieldEditing('username')}
                    className={`p-2.5 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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
                <label className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Name</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    ref={inputRefs.name}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => disableFieldEditing('name')}
                    readOnly={!editableFields.name}
                    placeholder="Name"
                    className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-base placeholder:text-gray-400 ${
                      editableFields.name
                        ? 'border-[#306137]'
                        : isDarkMode 
                          ? 'border-gray-600 bg-gray-700 cursor-not-allowed text-gray-300'
                          : 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-500'
                    } ${isDarkMode ? 'text-white bg-gray-800' : 'text-gray-900'}`}
                  />
                  <button
                    type="button"
                    onClick={() => enableFieldEditing('name')}
                    className={`p-2.5 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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
                <label className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Job/Occupation</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    ref={inputRefs.job}
                    value={formData.job}
                    onChange={(e) => handleInputChange('job', e.target.value)}
                    onBlur={() => disableFieldEditing('job')}
                    readOnly={!editableFields.job}
                    placeholder="Job/Occupation"
                    className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-base placeholder:text-gray-400 ${
                      editableFields.job
                        ? 'border-[#306137]'
                        : isDarkMode 
                          ? 'border-gray-600 bg-gray-700 cursor-not-allowed text-gray-300'
                          : 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-500'
                    } ${isDarkMode ? 'text-white bg-gray-800' : 'text-gray-900'}`}
                  />
                  <button
                    type="button"
                    onClick={() => enableFieldEditing('job')}
                    className={`p-2.5 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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
                <label className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Email</label>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    ref={inputRefs.email}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => disableFieldEditing('email')}
                    readOnly={!editableFields.email}
                    placeholder="Email"
                    className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-base placeholder:text-gray-400 ${
                      editableFields.email
                        ? 'border-[#306137]'
                        : isDarkMode 
                          ? 'border-gray-600 bg-gray-700 cursor-not-allowed text-gray-300'
                          : 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-500'
                    } ${isDarkMode ? 'text-white bg-gray-800' : 'text-gray-900'}`}
                  />
                  <button
                    type="button"
                    onClick={() => enableFieldEditing('email')}
                    className={`p-2.5 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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
                <label className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Location</label>
                {editableFields.location ? (
                  <div>
                    <LocationSearch 
                      value={formData.location}
                      onChange={(location) => handleInputChange('location', location)}
                      isDarkMode={isDarkMode}
                    />
                    <button
                      type="button"
                      onClick={() => disableFieldEditing('location')}
                      className="mt-2 px-4 py-2 bg-[#306137] text-white rounded-lg hover:bg-[#246440] transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={formData.location}
                      readOnly
                      placeholder="Location"
                      className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-base placeholder:text-gray-400 ${
                        isDarkMode 
                          ? 'border-gray-600 bg-gray-700 cursor-not-allowed text-gray-300'
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
                )}
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
        <aside className="w-80 flex-shrink-0 flex flex-col">
          <div
            className="p-8 text-white shadow-lg relative overflow-hidden"
            style={isExpert ? {
              backgroundImage: 'url(/exp.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '15px',
            } : {
               background: 'linear-gradient(131deg, #2A5528 15.98%, #927D31 125.22%)',
              borderRadius: '15px',
            }}
          >
            
            {/* Content wrapper with relative positioning */}
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-15 h-15 bg-white/30 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold opacity-90">@{formData.username || 'username'}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold">{formData.name || 'Your Name'}</p>
                    {isExpert && (
                      <img src="/badge.svg" alt="Expert Badge" className="w-6 h-6" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2.5 text-base">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span className="font-medium">{formData.job || 'Wildlife Enthusiast'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{formData.location || 'Location'}</span>
                </div>
              </div>
            </div>
          </div>

         {/* Save and Back Buttons */}
<div className="mt-auto pt-6 space-y-3">
  {/* Save Button */}
  <button 
    onClick={handleSaveProfile}
    disabled={isSaving}
    className="w-full transition-all duration-200 hover:scale-105 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <img src="/savee.svg" alt="Save Changes" className="w-full h-auto" />
  </button>

  {/* Back Button */}
  <button 
    onClick={() => router.push('/dashboard')}
    className="w-full transition-all duration-200 hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
  >
    <img src="/backz.svg" alt="Back" className="w-full h-auto" />
  </button>
</div>
        </aside>
          </>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowSuccessModal(false)}
          />
          <div 
            className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all"
            style={{
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <style jsx>{`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: scale(0.9) translateY(-20px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
            `}</style>
            
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(131deg, #2A5528 15.98%, #927D31 125.22%)'
                }}
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#2A5528' }}>
              Profile Updated!
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Your changes have been saved successfully.
            </p>

            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(131deg, #2A5528 15.98%, #927D31 125.22%)'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}