'use client';
import { useState } from 'react';
import { Search, MapPin, Edit, MessageCircle, TrendingUp, MoreHorizontal, ChevronDown, User } from 'lucide-react';
import { Settings, HelpCircle, LogOut, Clock } from 'lucide-react';
import { Share2, Flag, EyeOff, X, Users } from 'lucide-react';

export default function Dashboard() {
  const [activePost, setActivePost] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const communities = ['Wildlife watchers', 'Trail explorers', 'Bird spotters', 'Snake finders'];
  const tags = ['venomous snakes', 'rat snake', 'non venomous snakes', 'cobra', 'sea snakes'];
  const recentSearches = ['Philippine cobra habitat', 'Venomous vs non-venomous', 'Snake identification guide', 'Local wildlife communities'];
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);

  const community = [
    { id: 1, name: "Wildlife Watchers", color: "bg-green-100" },
    { id: 2, name: "Trail Explorers", color: "bg-amber-100" },
    { id: 3, name: "Bird Spotters", color: "bg-blue-100" },
    { id: 4, name: "Snake Finders", color: "bg-yellow-100" }
  ];

  const trending = [
    { id: 1, name: "King Cobra", color: "bg-green-100" },
    { id: 2, name: "Rat Snakes", color: "bg-amber-100" },
    { id: 3, name: "Anaconda", color: "bg-blue-100" },
    { id: 4, name: "mommy oni", color: "bg-yellow-100" }
  ];

  const posts = [
    {
      id: 1,
      community: "Wildlife Watchers",
      username: "@username",
      date: "Month DD, YYYY",
      heading: "Morning hike discovery",
      caption: "Found this amazing viewpoint after a 2-hour trek. The wildlife here is incredible!",
      upvotes: 142,
      downvotes: 3,
      comments: 28
    }
  ];

  return (
<div 
  className="h-screen flex flex-col bg-gradient-to-b from-green-50 to-amber-50" 
  style={{ 
    backgroundImage: `url('/${isDarkMode ? 'darkbg00.png' : 'lightbg0.png'}')`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    backgroundAttachment: 'fixed' 
  }}
>      <div className="fixed top-0 left-0 right-0 w-full z-50">
          {/* Background Bar */}
          <div className={`w-full h-11 justify-center ${isDarkMode ? 'bg-[#373333]' : 'bg-[#dad2b9]'}`} />
          
          {/* Centered Content Container */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1440px] max-w-full h-11">
            
            {/* SPOT Logo Text */}
            <div className="absolute -top-0.5 left-[46px] [-webkit-text-stroke:0.5px_#072d0d] bg-[linear-gradient(180deg,rgba(149,171,51,1)_30%,rgba(35,115,47,1)_57%,rgba(8,46,13,1)_83%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins-ExtraBold',Helvetica] font-extrabold text-transparent text-[32px] tracking-[1.60px] leading-[normal]">
              SPOT
            </div>

           {/* Search bar */}
<div className="flex-1 max-w-xl mx-auto" style={{ top: '3px', position: 'relative' }}>
  <div className="relative">
    <Search className="absolute left-3 top-[calc(75%-3px)] -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="text"
      placeholder="Search anything..."
      className="w-full pl-10 pr-4 h-7 fixed-center 
                 border border-gray-200 
                 rounded-[15px] 
                 bg-white/44 
                 focus:outline-none focus:ring-1 focus:#9A9A9A"
      style={{
        borderColor: 'rgba(0, 0, 0, 0.43)',
        position: 'relative',
        top: '3px',
      }}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setTimeout(() => setIsOpen(false), 200)}
    />
    
    {/* Dropdown */}
    {isOpen && (
      <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-2 py-2 gap-2">
          {['All', 'Communities', 'People'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="max-h-80 overflow-y-auto">
          {/* All Tab */}
          {activeTab === 'All' && (
            <div className="p-3">
              {/* Tags Section */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              <div>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recent Searches</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Communities Tab */}
          {activeTab === 'Communities' && (
            <div className="p-3">
              <div className="space-y-1">
                {communities.map((community) => (
                  <button
                    key={community}
                    className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    {community}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* People Tab */}
          {activeTab === 'People' && (
            <div className="p-3">
              <div className="text-center py-8 text-gray-500 text-sm">
                No verified people yet
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</div>

            {/* Logo Icon */}
            <img className="absolute top-0 left-[-32px] w-[75px] h-[47px] aspect-[1.48] object-cover" alt="Spoticon" src="/spicon0.svg" />
            
            {/* Right Side Icons */}
            <button 
    className="absolute top-0 left-[1340px] hover:scale-110 transition-transform duration-200 cursor-pointer"
    onClick={() => setIsDarkMode(!isDarkMode)}
>
    {isDarkMode ? (
        <img className="w-[70px] h-[50px]" style={{ marginTop: '1px' }} alt="Dark Mode" src="/dark.svg" />
    ) : (
        <img className="w-[47px] h-[31px]" style={{ marginTop: '6px' }} alt="Light Mode" src="/light.svg" />
    )}
</button>

{/* User Profile Button (Chevron + PFP combined) */}
<div className="absolute top-[5px] left-[1406px]">
  <button 
    className="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
    onClick={() => setIsProfileOpen(!isProfileOpen)}
    onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
  >
    <img 
      className="w-[35px] h-[35px] aspect-[1] object-cover" 
      alt="Down chevron" 
      src="/down.svg" 
    />
    <img 
      className="w-[35px] h-[35px] aspect-[1] object-cover rounded-full" 
      alt="User" 
      src="/pfp.svg" 
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
        </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 h-full flex gap-6">
        
          {/* Left Sidebar - User Profile */}
          <aside className="w-80 flex-shrink-0 py-15 fixed left-5">
          <div
  className="p-8 text-white shadow-lg"
  style={{
    // Applying the specific gradient requested
    background: 'linear-gradient(131deg, #2A5528 15.98%, #927D31 125.22%)',
    // Setting the specific border radius
    borderRadius: '15px',
  }}
>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-15 h-15 bg-white/30 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold opacity-90">@username</p>
                  <p className="text-xl font-bold">Full Name</p>
                </div>
              </div>
              
              <div className="space-y-2.5 text-base">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">occupation</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>location</span>
                </div>
              </div>

              <button className="mt-5 w-full bg-white/20 hover:bg-white/30 rounded-full py-2.5 px-5 flex items-center justify-center gap-2 transition">
                <Edit className="w-5 h-5" />
                <span className="text-base font-medium">Edit Profile</span>
              </button>
            </div>

            {/* Communities */}
<div className="mt-6 rounded-3xl shadow-lg p-5"
style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
    {/* Title/Icon Wrapper */}
    <div className="flex items-center gap-2 mb-5 px-2">
        <MessageCircle className="w-6 h-6 text-green-600" />
        <h3 className="font-bold text-gray-800 text-lg">Your Communities</h3>
    </div>

    {/* ADJUSTED: max-h increased to 220px to fit 3 items exactly before scrolling */}
    <div className="space-y-2 max-h-[260px] overflow-y-auto"> 
        {community.map((community) => (
            <button
                key={community.id}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-green-50 transition" 
            >
                <div className={`w-12 h-12 ${community.color} rounded-full`}></div>
                <span className="text-base font-medium text-gray-700">
                    {community.name}
                </span>
            </button>
        ))}
    </div>
</div>
          </aside>

{/* Main Feed */}
<main 
  className="fixed left-90 right-90 top-6 h-[calc(100vh-44px)] overflow-y-auto py-15 flex justify-center mt-5" 
  style={{ 
    backgroundColor: isDarkMode ? '#1B1B1B' : '#FAFFF1', 
    backgroundSize: '750px 600px', 
    backgroundRepeat: 'repeat', 
    backgroundPosition: 'top center' 
  }}
> 
<div className="w-[767px] px-5 -mt-15"> 
  <div className="p-8 mb-6 -ml-5">
    <h1 className="font-bold mb-2" style={{ 
      color: isDarkMode ? '#B6FFEA' : 'rgba(11, 87, 66, 0.93)',
      fontFamily: 'Poppins',
      fontSize: '40px',
      fontWeight: '900',
      lineHeight: 'normal'
    }}>
      Welcome, @username!
    </h1>
    <p style={{ 
      color: isDarkMode ? '#E0F9FF' : 'rgba(9, 49, 59, 0.73)',
      fontFamily: 'Poppins',
      fontSize: '24px',
      fontWeight: '800',
      lineHeight: 'normal'
    }}>
      The wild awaits - let's discover what's out there!
    </p><br />
    <div className="w-[703px] h-px bg-gray-500"></div>
  </div>

    {/* Post Card */}
<article 
  className="rounded-3xl shadow-lg p-6 -mt-8" 
  style={{
    borderRadius: '25px',
    border: '1px solid #000',
    background: isDarkMode ? 'rgba(208, 230, 144, 0.12)' : 'rgba(208, 230, 144, 0.12)'
  }}
>
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-gray-400" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800">community name</span>
          <button className="text-blue-600 text-sm font-semibold hover:underline">
            • Join
          </button>
        </div>
        <p className="text-sm text-gray-500">@username • Month DD, YYYY</p>
      </div>
    </div>
    
    <div className="relative">
      <button 
        className="p-2 hover:bg-white/50 rounded-full transition"
        onClick={() => setIsPostMenuOpen(!isPostMenuOpen)}
        onBlur={() => setTimeout(() => setIsPostMenuOpen(false), 200)}
      >
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </button>

      {/* Post Menu Dropdown */}
      {isPostMenuOpen && (
        <div 
          className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-50"
          style={{ border: '1px solid #899A3C' }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="py-1">
            <button 
              className="w-full px-4 py-2 text-left hover:bg-[#D4DEC3] transition-colors flex items-center gap-2.5"
              onClick={() => {
                setIsPostMenuOpen(false);
                setShowRepostModal(true);
              }}
            >
              <Share2 className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Repost to...</span>
            </button>
            
            <button 
              className="w-full px-4 py-2 text-left hover:bg-[#D4DEC3] transition-colors flex items-center gap-2.5"
              onClick={() => {
                // Add your Report logic here
              }}
            >
              <Flag className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Report Post</span>
            </button>
          </div>

          {/* Hide Post Section */}
          <div className="border-t border-gray-400">
            <button 
              className="w-full px-4 py-2 text-left hover:bg-[#3A6064] hover:text-white transition-colors flex items-center gap-2.5 group"
              onClick={() => {
                // Add your Hide Post logic here
              }}
            >
              <EyeOff className="w-4 h-4 text-gray-700 group-hover:text-white" />
              <span className="text-sm font-medium text-gray-900 group-hover:text-white">Hide Post</span>
            </button>
          </div>
        </div>
      )}

      {/* Repost Modal */}
      {showRepostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden"
            style={{ border: '2px solid #899A3C' }}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Repost to Community</h3>
              <button 
                onClick={() => setShowRepostModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Communities List */}
            <div className="max-h-80 overflow-y-auto py-2">
              {communities.map((community) => (
                <button
                  key={community}
                  className="w-full px-6 py-3 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-3"
                  onClick={() => {
                    // Add your repost logic here
                    console.log(`Reposting to ${community}`);
                    setShowRepostModal(false);
                  }}
                >
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{community}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

  <h2 className="text-xl font-bold text-gray-800 mb-4">Heading</h2><br />

  {/* Image Placeholder */}
  <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-64 mb-4 flex items-center justify-center">
    <span className="text-gray-400 text-sm">Image content</span>
  </div>

  <p className="text-gray-700 mb-6">caption</p><br />

  {/* Action Buttons */}
  <div className="flex items-center gap-3">
    <button className="p-3 bg-green-400 hover:bg-green-500 rounded-full transition shadow-md">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"/>
      </svg>
    </button>
    <button className="p-3 bg-red-400 hover:bg-red-500 rounded-full transition shadow-md">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 17l-2-6H2l5-4-2 6 5 4 5-4-2 6 5 4h-6z"/>
      </svg>
    </button>
    <button className="p-3 bg-blue-200 hover:bg-blue-300 rounded-full transition shadow-md">
      <MessageCircle className="w-5 h-5 text-blue-700" />
    </button>
  </div>
</article>
  </div>
</main>
          {/* Right Sidebar - Trending */}
          <aside className="w-80 fixed right-5 flex-shrink-0 py-15">
            {/* Popular Now – Scrollable Trending List */}
<div
  className="bg-white rounded-3xl shadow-lg p-6"
  style={{
    background: "rgba(241, 238, 229, 0.71)",
    boxShadow: "inset 0 4px 4px 0 rgba(0, 0, 0, 0.25)",
    borderRadius: "15px",
  }}
>
  <h3 className="font-bold text-xl text-gray-800 mb-6">Popular Now!</h3>

  {/* Scrollable wrapper */}
  <div className="mt-3 space-y-2 max-h-[170px] overflow-y-auto">

    {trending.map((trend) => (
      <button
        key={trend.id}
        className="w-full text-left"
      >
       <div
  className="bg-gradient-to-br from-amber-50 to-green-50 rounded-2xl border-2 border-amber-200 flex items-center gap-1 px-2"
  style={{ height: "50px" }}
>
  <div className="text-2xl">🔥</div>
  <span className="font-semibold text-gray-700 truncate">
    {trend.name}
  </span>
</div>
      </button>
    ))}
  </div>
</div>

            <button 
    className="absolute -bottom-[350px] right-[-20px] w-[450px] h-auto hover:scale-105 transition-transform duration-300 cursor-pointer group"
    onClick={() => console.log('Spot clicked!')}
  >
    <img 
      src="/spotdb.svg" 
      alt="Spot Database Icon" 
      className="w-full h-full object-contain" 
    />
    {/* Tooltip */}
    <span className="absolute top-40 left-70 -translate-x-1/2 -translate-y-1/2 
                     bg-green-800 text-white px-6 py-3 rounded-full text-xl font-bold
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     pointer-events-none whitespace-nowrap shadow-lg">
      Spot Anything?
    </span>
  </button>
          </aside>
        </div>
      </div>
    </div>
  );
}