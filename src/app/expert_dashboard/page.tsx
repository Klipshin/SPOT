'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './style.css';

export default function ExpertDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`expert-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Background Image */}
      <div className="background-image-wrapper">
        <Image
          src="/landingbg1.png"
          alt="Background"
          fill
          className="background-image"
          priority
        />
      </div>
      
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="nav-left">
          <Image
            src="/spot icon.svg"
            alt="SPOT Icon"
            width={70}
            height={70}
            className="spot-logo-icon"
          />
          <span className="spot-logo-text">SPOT</span>
        </div>

        <div className="nav-center">
          <div className="search-container">
            <Image
              src="/search%20(1)%201.svg"
              alt="Search"
              width={20}
              height={20}
              className="search-icon"
            />
            <input type="text" placeholder="Search anything..." className="search-input" />
          </div>
        </div>

        <div className="nav-right">
          <button 
            onClick={toggleDarkMode}
            className={`dark-mode-toggle ${!isDarkMode ? 'active' : ''}`}
            aria-label="Toggle dark mode"
          >
            <div className="toggle-track">
              <div className="toggle-knob">
                {!isDarkMode ? (
                  <Image
                    src="/6ae923df-a01f-4168-9d3a-9f0563de2a4d-removebg-preview%201.svg"
                    alt="Sun icon"
                    width={20}
                    height={20}
                    className="toggle-icon sun-icon"
                  />
                ) : (
                  <Image
                    src="/dark-mode 1.svg"
                    alt="Dark mode"
                    width={20}
                    height={20}
                    className="toggle-icon moon-icon"
                  />
                )}
              </div>
            </div>
          </button>
          <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="user-avatar">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#D9D9D9"/>
              <circle cx="16" cy="12" r="5" fill="#666"/>
              <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#666"/>
            </svg>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          {/* User Profile Card */}
          <div className="profile-card">
            <div className="profile-header-row">
              <div className="profile-avatar">
                <svg width="96" height="96" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="#D9D9D9"/>
                  <circle cx="40" cy="30" r="12" fill="#666"/>
                  <path d="M20 65c0-8 8-15 20-15s20 7 20 15" fill="#666"/>
                </svg>
              </div>
              <div className="profile-info">
                <p className="profile-username">@username</p>
                <div className="profile-name-row">
                  <span className="profile-fullname">Full Name</span>
                  <Image
                    src="/expert%20badge.svg"
                    alt="Expert badge"
                    width={28}
                    height={28}
                    className="expert-badge-img"
                  />
                </div>
              </div>
            </div>
            <div className="profile-details-section">
              <div className="profile-detail">
                <Image
                  src="/suitcase%201.svg"
                  alt="Occupation"
                  width={16}
                  height={16}
                />
                <span>occupation</span>
              </div>
              <div className="profile-detail">
                <Image
                  src="/placeholder%20(1)%201.svg"
                  alt="Location"
                  width={16}
                  height={16}
                />
                <span>location</span>
              </div>
            </div>
            <button className="edit-profile-btn">
              <Image
                src="/pen%201.svg"
                alt="Edit"
                width={16}
                height={16}
              />
              Edit Profile
            </button>
          </div>

          {/* Your Communities Section */}
          <div className="communities-card">
            <div className="communities-header">
              <Image
                src="/join%201.svg"
                alt="Join icon"
                width={20}
                height={20}
              />
                <h3>Your Communities</h3>
            </div>
              <div className="divider" aria-hidden="true"></div>
            <div className="community-item">
              <div className="community-avatar">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                 
                </svg>
              </div>
              <span>community name</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome, @username!</h1>
            <p className="welcome-subtitle">The wild awaits - let&apos;s discover what&apos;s out there!</p>
          </div>

          {/* Sample Post Card */}
          <div className="post-card">
            <div className="post-header">
              <div className="post-community">
                <div className="post-community-header-row">
                  <div className="post-community-avatar">
                    <Image
                      src="/Ellipse 12.svg"
                      alt="Avatar outline"
                      width={40}
                      height={40}
                      className="avatar-outline"
                    />
                    <Image
                      src="/Ellipse 13.svg"
                      alt="Avatar inner"
                      width={24}
                      height={24}
                      className="avatar-inner"
                    />
                  </div>
                  <span>community name</span>
                  <span className="join-link">• Join</span>
                </div>
                <div className="post-author">
                  <span>@username</span>
                  <span className="post-date">Month DD, YYYY</span>
                  <Image
                    src="/world%20(2)%202.svg"
                    alt="Post icon"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <svg className="post-menu" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="post-heading">Heading</h2>
            <div className="post-image-placeholder"></div>
            <p className="post-caption">caption</p>
            <div className="post-actions">
              <button className="action-btn upvote">
                <Image
                  src="/arrow%208.svg"
                  alt="Upvote"
                  width={20}
                  height={20}
                />
              </button>
              <button className="action-btn downvote">
                <Image
                  src="/down%20(1)%208.svg"
                  alt="Downvote"
                  width={20}
                  height={20}
                />
              </button>
              <button className="action-btn comment">
                <Image
                  src="/chat%204.svg"
                  alt="Comment"
                  width={20}
                  height={20}
                />
              </button>
              <button className="share-btn">
                <Image
                  src="/next%204.svg"
                  alt="Share"
                  width={20}
                  height={20}
                />
                Share
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="trending-card">
            <h3 className="trending-title">Popular Now!</h3>
            <div className="trending-item">
              <Image
                src="/fire%201.svg"
                alt="Trending fire"
                width={20}
                height={20}
              />
              <span>trending topic</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Background Illustrations */}
      <div className="background-illustrations">
        <Image
          src="/SPOT%20Mascot.svg"
          alt="SPOT Mascot"
          width={380}
          height={380}
          className="spot-mascot"
        />
      </div>
    </div>
  );
}