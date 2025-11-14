'use client';
import React, { useState } from 'react';
import Image from 'next/image';

type ActiveSection = 'edit-profile' | 'change-password' | 'privacy-settings' | 'notifications';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('edit-profile');
  
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
    <div className="min-h-screen bg-[#d9ead3]">
      {/* Hide root layout header */}
      <style dangerouslySetInnerHTML={{__html: `
        body > header[class*="fixed"] {
          display: none !important;
        }
      `}} />
      
      {/* Header Bar */}
      <header className="relative w-full h-16 bg-[#f5f5dc] flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/spot icon.svg"
            alt="SPOT Icon"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="text-[#4a7c59] font-bold text-lg">SPOT</span>
        </div>

        {/* Navigation Links - Centered */}
        <nav className="flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2 bg-transparent shadow-none rounded-none p-0">
          <a href="/" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
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

        {/* Right Side - Auth Buttons and Icons */}
        <div className="flex items-center gap-4">
          {/* Auth Buttons */}
          <button className="font-bold text-[#246440] text-[15px] hover:underline transition-all">
            Log In
          </button>
          <button className="w-[108px] h-[33px] bg-[#d1e39b] rounded-[9px] font-bold text-[#25451f] text-[15px] hover:bg-[#c5d78f] transition-all">
            Sign Up
          </button>

          {/* Utility Icons */}
          <div className="flex items-center gap-2 ml-2">
            {/* Moon Icon (Dark Mode) */}
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            {/* Chevron Down */}
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Person Icon */}
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* X Icon */}
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex gap-6 p-6 max-w-7xl mx-auto pt-8">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>

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
            </button>
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
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Change Password</h1>
              <form onSubmit={handlePasswordSubmit} className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
                  />
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
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Privacy Settings</h1>
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
                    <option value="friends">Friends Only</option>
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
                  </label>
                </div>
                <div className="mb-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowMessages"
                      checked={privacyData.allowMessages}
                      onChange={handlePrivacyChange}
                      className="w-5 h-5 text-[#4a7c59] border-gray-300 rounded focus:ring-[#4a7c59]"
                    />
                    <span className="text-gray-700 font-medium">Allow Messages from Other Users</span>
                  </label>
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
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Notifications</h1>
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
                <div className="mb-6">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 font-medium">SMS Notifications</span>
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={notificationData.smsNotifications}
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
                  </label>
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

