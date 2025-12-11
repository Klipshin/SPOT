/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, FileText, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Leaflet
const LocationSearch = dynamic(() => import('./LocationSearch'), {
  ssr: false
});

interface CreatePostModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; content: string; mediaUrl?: string; flairNames?: string[]; location?: string; latitude?: number; longitude?: number }) => Promise<void>;
  modalOrigin: { x: number; y: number };
  communityId: string;
}

const WILDLIFE_CATEGORIES = [
  'Mammals',
  'Birds', 
  'Reptiles',
  'Amphibians',
  'Fish',
  'Insects',
  'Arachnids',
  'Mollusks',
  'Crustaceans',
  'Plants',
  'Fungi',
  'Other'
];

export default function CreatePostModal({
  isDarkMode,
  isOpen,
  isClosing,
  onClose,
  onCreate,
  modalOrigin,
  communityId
}: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [selectedFlairs, setSelectedFlairs] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocationChange = (locationName: string, lat?: number, lng?: number) => {
    setLocation(locationName);
    if (lat !== undefined && lng !== undefined) {
      setCoordinates({ lat, lng });
    } else {
      // If no coordinates provided, try to geocode the location name
      setCoordinates(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFlair = (flair: string) => {
    setSelectedFlairs(prev => 
      prev.includes(flair) 
        ? prev.filter(f => f !== flair)
        : [...prev, flair]
    );
  };

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in title and content');
      return;
    }
    
    if (!location.trim()) {
      alert('Please select a location for wildlife tracking');
      return;
    }
    
    setIsCreating(true);
    try {
      await onCreate({
        title: title.trim(),
        content: content.trim(),
        mediaUrl: mediaUrl || undefined,
        flairNames: selectedFlairs.length > 0 ? selectedFlairs : undefined,
        location: location.trim(),
        latitude: coordinates?.lat,
        longitude: coordinates?.lng
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setMediaUrl(null);
      setSelectedFlairs([]);
      setLocation('');
      setCoordinates(null);
      setShowLocationPicker(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-2xl" 
        style={{ transformOrigin: `${modalOrigin.x}px ${modalOrigin.y}px` }}
      >
        <div 
          className={`w-full rounded-[40px] border shadow-2xl max-h-[90vh] flex flex-col ${isClosing ? 'animate-genie-out' : 'animate-genie-in'} ${isDarkMode ? "bg-[#222222] border-white/20 text-white" : "bg-[#F8FDEB] border-black/10 text-black"}`}
        >
          {/* Header */}
          <div className={`flex justify-between items-center px-8 pt-8 pb-4 border-b ${isDarkMode ? "border-white/10" : "border-black/10"}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${isDarkMode ? 'bg-[#333] border-gray-600' : 'bg-[#E2DFC8] border-gray-300'}`}>
                <FileText className="w-7 h-7 text-[#5E5CE6]" />
              </div>
              <h2 className="font-extrabold text-2xl italic">Create Post</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
              disabled={isCreating}
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Form - Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex flex-col gap-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold mb-2 opacity-70">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Can anyone identify this bird?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className={`w-full text-xl font-bold bg-transparent outline-none border-b-2 pb-2 placeholder:italic transition-colors ${
                    isDarkMode 
                      ? "border-gray-600 placeholder:text-gray-500 focus:border-[#5E5CE6]" 
                      : "border-gray-300 placeholder:text-gray-400 focus:border-[#5E5CE6]"
                  }`}
                />
                <div className="text-xs opacity-50 mt-1 text-right">
                  {title.length}/100
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-bold mb-2 opacity-70">
                  Content *
                </label>
                <textarea
                  placeholder="Describe what you spotted, where, and any details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={1000}
                  rows={6}
                  className={`w-full text-base bg-transparent outline-none border-2 rounded-xl p-4 placeholder:italic transition-colors resize-none ${
                    isDarkMode 
                      ? "border-gray-600 placeholder:text-gray-500 focus:border-[#5E5CE6]" 
                      : "border-gray-300 placeholder:text-gray-400 focus:border-[#5E5CE6]"
                  }`}
                />
                <div className="text-xs opacity-50 mt-1 text-right">
                  {content.length}/1000
                </div>
              </div>

              {/* Flair/Category Selection */}
              <div className="relative">
                <label className="block text-sm font-bold mb-2 opacity-70">
                  Categories (Optional)
                </label>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full text-base font-medium outline-none border-2 rounded-xl p-3 transition-colors cursor-pointer min-h-[48px] flex items-center justify-between ${
                    isDarkMode 
                      ? "border-gray-600 bg-[#333] text-white hover:border-[#7D9B76]" 
                      : "border-[#7D9B76] bg-[#E2DFC8] text-black hover:border-[#5A7353]"
                  }`}
                >
                  <div className="flex flex-wrap gap-2">
                    {selectedFlairs.length === 0 ? (
                      <span className="opacity-50">Select categories...</span>
                    ) : (
                      selectedFlairs.map(flair => (
                        <span 
                          key={flair}
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            isDarkMode
                              ? "bg-[#7D9B76] text-white"
                              : "bg-[#7D9B76] text-white"
                          }`}
                        >
                          {flair}
                        </span>
                      ))
                    )}
                  </div>
                  <svg 
                    className={`w-5 h-5 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Dropdown Menu - Opens Downward */}
                {isDropdownOpen && (
                  <div 
                    className={`absolute top-full left-0 right-0 mt-2 rounded-xl border-2 shadow-lg z-10 max-h-[300px] overflow-y-auto ${
                      isDarkMode
                        ? "bg-[#333] border-gray-600"
                        : "bg-[#E2DFC8] border-[#7D9B76]"
                    }`}
                  >
                    {WILDLIFE_CATEGORIES.map((category) => (
                      <label
                        key={category}
                        className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                          isDarkMode
                            ? "hover:bg-[#444]"
                            : "hover:bg-[#D4D1BC]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFlairs.includes(category)}
                          onChange={() => toggleFlair(category)}
                          className="w-5 h-5 rounded accent-[#7D9B76] cursor-pointer"
                        />
                        <span className="ml-3 font-medium">{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Selection (Required) */}
              <div>
                <label className="block text-sm font-bold mb-2 opacity-70 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location (Required for tracking)
                </label>
                {showLocationPicker ? (
                  <div className="space-y-2">
                    <LocationSearch 
                      value={location} 
                      onChange={handleLocationChange}
                      isDarkMode={isDarkMode}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLocationPicker(false)}
                      className="px-4 py-2 bg-[#7D9B76] text-white rounded-lg hover:bg-[#5A7353] transition-colors text-sm font-medium"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setShowLocationPicker(true)}
                    className={`w-full text-base font-medium outline-none border-2 rounded-xl p-3 transition-colors cursor-pointer min-h-[48px] flex items-center gap-2 ${
                      isDarkMode 
                        ? "border-gray-600 bg-[#333] text-white hover:border-[#7D9B76]" 
                        : location 
                          ? "border-[#7D9B76] bg-[#E2DFC8] text-black" 
                          : "border-red-400 bg-[#FFE2E2] text-black hover:border-red-500"
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    {location ? (
                      <span className="text-sm">{location}</span>
                    ) : (
                      <span className="opacity-50">Click to select location...</span>
                    )}
                  </div>
                )}
                {!location && !showLocationPicker && (
                  <p className="text-xs text-red-500 mt-1">* Location is required for wildlife tracking</p>
                )}
              </div>

              {/* Image Upload (Optional) */}
              <div>
                <label className="block text-sm font-bold mb-2 opacity-70">
                  Image (Optional)
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-[200px] rounded-[30px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors relative overflow-hidden ${
                    isDarkMode 
                      ? "border-gray-600 bg-[#333]" 
                      : "border-gray-300 bg-[#EFEFEF]"
                  }`}
                >
                  {mediaUrl ? (
                    <>
                      <img 
                        src={mediaUrl} 
                        alt="Preview" 
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-bold">Click to change</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-1" />
                      <span className="font-bold text-gray-400 text-sm">Click to upload image</span>
                      <span className="text-xs text-gray-500 mt-1">Supports JPG, PNG, GIF</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex justify-end gap-3 px-8 py-6 border-t ${isDarkMode ? "border-white/10" : "border-black/10"}`}>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-full font-bold text-gray-500 hover:bg-black/5 transition-colors"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button 
              onClick={handleCreate}
              disabled={!title.trim() || !content.trim() || isCreating}
              className={`px-10 py-2.5 rounded-full font-extrabold text-lg shadow-lg transition-all ${
                !title.trim() || !content.trim() || isCreating
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#5E5CE6] text-white hover:bg-[#4B4BD1] hover:scale-105"
              }`}
            >
              {isCreating ? 'Creating...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
