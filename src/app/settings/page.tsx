'use client';
import React, { useState } from 'react';
import Image from 'next/image';

type ActiveSection = 'edit-profile' | 'change-password' | 'privacy-settings' | 'notifications';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('edit-profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Software developer passionate about creating beautiful user experiences.',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [privacyData, setPrivacyData] = useState({
    profileVisibility: 'public',
    showEmail: true,
    showLocation: true,
    allowMessages: true,
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyDigest: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; 
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change
    console.log('Password change submitted:', passwordData);
  };

  const handlePrivacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle privacy settings update
    console.log('Privacy settings updated:', privacyData);
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle notification settings update
    console.log('Notification settings updated:', notificationData);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPrivacyData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationData((prev) => ({
      ...prev,
      [name]: checked,
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
<div className="relative">
  <button 
    className="flex items-center gap-1 px-2 h-14 hover:bg-gray-200 rounded-full transition-colors"
    onClick={() => {/* Toggle dropdown */}}
  >
    <svg className="w-9 h-9 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
    <img src="pfp.svg" alt="Profile" className="w-9 h-9" />
  </button>
  
  {/* Dropdown Menu */}
  {/* Add your dropdown content here */}
  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 hidden">
    {/* Dropdown content */}
  </div>
</div>

    {/* Exit Icon */}
    <button className="w-14 h-14 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors">
      <img src="exit.svg" alt="Exit" className="w-9 h-9" />
    </button>
  </div>
</div>
      </header>

      {/* Main Content */}
      <div className="flex gap-6 p-6 max-w-7xl mx-auto pt-2">
        {/* Left Sidebar */}
        <aside className="w-75 bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2><br />

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 flex-grow mb-4">
            <button 
              onClick={() => setActiveSection('edit-profile')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeSection === 'edit-profile'
                  ? 'bg-[#4a7c59] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Edit Profile
            </button>
            <button 
              onClick={() => setActiveSection('change-password')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeSection === 'change-password'
                  ? 'bg-[#4a7c59] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Change Password
            </button>
            <button 
              onClick={() => setActiveSection('privacy-settings')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeSection === 'privacy-settings'
                  ? 'bg-[#4a7c59] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Privacy Settings
            </button>
            <button 
              onClick={() => setActiveSection('notifications')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeSection === 'notifications'
                  ? 'bg-[#4a7c59] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Notifications
            </button><br /><br />
          </nav>

          {/* Log Out Button */}
          <button className="mt-auto px-4 py-3 rounded-lg bg-[#f44336] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#d32f2f] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="2" x2="12" y2="8" strokeLinecap="round" />
            </svg>
            Log Out
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-lg shadow-lg p-8">
          {activeSection === 'edit-profile' && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Edit Profile</h1>
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent resize-y"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#4a7c59] text-white font-medium py-3 rounded-lg hover:bg-[#3d6a4a] transition-colors"
                >
                  Save Changes
                </button>
              </form>
            </>
          )}

{activeSection === 'change-password' && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Change Password</h1><br />
              <form onSubmit={handlePasswordSubmit} className="max-w-2xl mx-auto">
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
                  className="w-full bg-[#4a7c59] text-white font-medium py-3 rounded-lg hover:bg-[#3d6a4a] transition-colors"
                >
                  Update Password
                </button>
              </form>
            </>
          )}

          {activeSection === 'privacy-settings' && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Privacy Settings</h1><br /><br />
              <form onSubmit={handlePrivacySubmit} className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <label htmlFor="profileVisibility" className="block text-gray-700 font-medium mb-2">
                    Profile Visibility
                  </label>
                  <select
                    id="profileVisibility"
                    name="profileVisibility"
                    value={privacyData.profileVisibility}
                    onChange={handlePrivacyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="showEmail"
                      checked={privacyData.showEmail}
                      onChange={handlePrivacyChange}
                      className="w-5 h-5 text-[#4a7c59] border-gray-300 rounded focus:ring-[#4a7c59]"
                    />
                    <span className="text-gray-700 font-medium">Show Email Address</span>
                  </label>
                </div>
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="showLocation"
                      checked={privacyData.showLocation}
                      onChange={handlePrivacyChange}
                      className="w-5 h-5 text-[#4a7c59] border-gray-300 rounded focus:ring-[#4a7c59]"
                    />
                    <span className="text-gray-700 font-medium">Show Location</span>
                  </label><br /><br />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#4a7c59] text-white font-medium py-3 rounded-lg hover:bg-[#3d6a4a] transition-colors"
                >
                  Save Privacy Settings
                </button>
              </form>
            </>
          )}

          {activeSection === 'notifications' && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Notifications</h1><br /><br />
              <form onSubmit={handleNotificationSubmit} className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 font-medium">Email Notifications</span>
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={notificationData.emailNotifications}
                      onChange={handleNotificationChange}
                      className="w-5 h-5 text-[#4a7c59] border-gray-300 rounded focus:ring-[#4a7c59]"
                    />
                  </label>
                </div>
                <div className="mb-6">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 font-medium">Push Notifications</span>
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={notificationData.pushNotifications}
                      onChange={handleNotificationChange}
                      className="w-5 h-5 text-[#4a7c59] border-gray-300 rounded focus:ring-[#4a7c59]"
                    />
                  </label>
                </div>
                <div className="mb-8">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 font-medium">Weekly Digest</span>
                    <input
                      type="checkbox"
                      name="weeklyDigest"
                      checked={notificationData.weeklyDigest}
                      onChange={handleNotificationChange}
                      className="w-5 h-5 text-[#4a7c59] border-gray-300 rounded focus:ring-[#4a7c59]"
                    />
                  </label><br /><br />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#4a7c59] text-white font-medium py-3 rounded-lg hover:bg-[#3d6a4a] transition-colors"
                >
                  Save Notification Settings
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

