'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User, Settings, HelpCircle, LogOut, Edit } from 'lucide-react';

// Settings now only has Change Password - no sections needed

export default function SettingsPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    username: '',
    location: '',
    occupation: '',
  });

  // Fetch user profile data on mount
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
          .select('id, name, username, bio, location, occupation, profile_visibility, show_email, show_location')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData({
            firstName: profile.name?.split(' ')[0] || '',
            lastName: profile.name?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            bio: profile.bio || '',
            username: profile.username || '',
            location: profile.location || '',
            occupation: profile.occupation || '',
          });
          setCurrentUsername(profile.username || '');
          setCurrentEmail(user.email || '');
          
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, [supabase, router]);

  // Handle clicks outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; 
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: fullName,
          bio: formData.bio,
          username: formData.username,
          location: formData.location,
          occupation: formData.occupation,
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (!passwordData.currentPassword) {
      alert('Please enter your current password');
      return;
    }
    
    if (!passwordData.newPassword) {
      alert('Please enter a new password');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) {
        // Check if it's an authentication error
        if (error.message.includes('Invalid login credentials') || error.message.includes('password')) {
          throw new Error('Current password is incorrect');
        }
        throw error;
      }
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Show success modal
      setShowPasswordSuccessModal(true);
    } catch (error: any) {
      console.error('Error updating password:', error);
      alert(error.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  return (
<div 
  className="min-h-screen" 
  style={{ 
    backgroundImage: isDarkMode ? 'url(/darkbg0.png)' : 'url(/lightbg0.png)', 
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    backgroundRepeat: 'no-repeat' 
  }}
>      {/* Hide root layout header */}
      <style dangerouslySetInnerHTML={{__html: `
        body > header[class*="fixed"] {
          display: none !important;
        }
      `}} />
      
      {/* Header Bar */}
      <header className="relative flex items-center justify-between px-3">
        {/* Logo */}
<div className="flex items-center gap-0 ml-5 ">
  <Image
    src="/spicon0.svg"
    alt="SPOT Icon"
    width={80}
    height={80}
    className="w-20 h-20"
  />
  <span 
    className="font-extrabold text-4xl"
    style={{
      background: 'linear-gradient(180deg, #95AB33 29.81%, #23732F 56.73%, #082E0D 82.69%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent',
    }}
  >
    SPOT
  </span>
</div>

        {/* Right Side - Utility Icons */}
<div className="flex items-center gap-4">
  <div className="flex items-center gap-4">
   {/* Light/Dark Mode Icon */}
<button 
  className="w-14 h-14 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
  onClick={() => setIsDarkMode(!isDarkMode)}
>
  <img 
    src={isDarkMode ? "dark.svg" : "light.svg"} 
    alt={isDarkMode ? "Dark mode" : "Light mode"} 
    className="w-15 h-15" 
  />
</button>

    {/* Profile & Chevron Combined Dropdown */}
<div className="relative" ref={profileDropdownRef}>
  <button 
    className="flex items-center gap-1 px-2 h-14 hover:bg-gray-200 rounded-full transition-colors"
    onClick={() => setIsProfileOpen(!isProfileOpen)}
  >
    <svg className="w-9 h-9 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
    <img src="pfp.svg" alt="Profile" className="w-9 h-9" />
  </button>
  
  {/* Dropdown Menu */}
  {isProfileOpen && (
    <div 
      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border-2 z-50"
      style={{ border: '2px solid #899A3C' }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-gray-300 flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shrink-0">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">@{currentUsername}</h3>
          <p className="text-xs text-gray-600 mt-0.5">{currentEmail}</p>
        </div>
      </div>

      {/* Menu Items - WITHOUT "View Profile" since we're already on settings/profile page */}
      <div className="py-1">
        <button 
          className="w-full px-4 py-2 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-2.5"
          onClick={() => {
            setIsProfileOpen(false);
            router.push('/profile');
          }}
        >
          <Edit className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-900">Edit Profile</span>
        </button>
        
        <button 
          className="w-full px-4 py-2 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-2.5"
          onClick={() => {
            setIsProfileOpen(false);
            // Already on settings page, just close dropdown
          }}
        >
          <Settings className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-900">Account Settings</span>
        </button>
        
        <button 
          className="w-full px-4 py-2 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-2.5"
          onClick={() => {/* Help Center logic here */}}
        >
          <HelpCircle className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-900">Help Center</span>
        </button>
      </div>

      {/* Log Out Section */}
      <div className="border-t border-gray-400">
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
          <LogOut className="w-4 h-4 text-gray-700 group-hover:text-white" />
          <span className="text-sm font-medium text-gray-900 group-hover:text-white">Log Out</span>
        </button>
      </div>
    </div>
  )}
</div>

    {/* Exit Icon */}
    <button className="w-14 h-14 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors">
      <img src="exit.svg" alt="Exit" className="w-9 h-9" />
    </button>
  </div>
</div>
      </header>

      {/* Main Content - Centered */}
      <div className="flex flex-col items-center justify-start pt-8 p-6">
        {/* Back Button */}
        <div className="w-full max-w-2xl mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        {/* Main Content Area */}
        <main className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Change Password</h1>
          <form onSubmit={handlePasswordSubmit} className="w-full">
                <div className="mb-6">
                  <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
                    />
                    <button
  type="button"
  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
>
  {showCurrentPassword ? (
    // Regular eye - when password is VISIBLE
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    // Eye with slash - when password is HIDDEN
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )}
</button>
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
                    />
                  <button
  type="button"
  onClick={() => setShowNewPassword(!showNewPassword)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
>
  {showNewPassword ? (
    // Regular eye - when password is VISIBLE
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    // Eye with slash - when password is HIDDEN
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )}
</button>
                  </div>
                </div>
                <div className="mb-8">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
                    />
                    <button
  type="button"
  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
>
  {showConfirmPassword ? (
    // Regular eye - when password is VISIBLE
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    // Eye with slash - when password is HIDDEN
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )}
</button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-[#4a7c59] text-white font-medium py-3 rounded-lg hover:bg-[#3d6a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
        </main>
      </div>

      {/* Password Success Modal */}
      {showPasswordSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={() => setShowPasswordSuccessModal(false)}>
          <div
            className={`rounded-xl shadow-2xl w-[400px] max-w-[90vw] overflow-hidden ${
              isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'
            }`}
            style={{ border: '2px solid #899A3C' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`px-6 py-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Password Updated Successfully!
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your password has been changed successfully. Please use your new password the next time you log in.
              </p>
              <button
                onClick={() => setShowPasswordSuccessModal(false)}
                className="w-full bg-[#4a7c59] text-white font-medium py-3 rounded-lg hover:bg-[#3d6a4a] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

