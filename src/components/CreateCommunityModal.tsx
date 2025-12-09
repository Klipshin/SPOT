/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef } from 'react';
import { X, MapPin, Users, UploadCloud } from 'lucide-react';
import LocationSearch from './LocationSearch';

interface CreateCommunityModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  onCreate: (data: { communityName: string; location: string; bannerImage?: string; profileImage?: string }) => Promise<void>;
  modalOrigin: { x: number; y: number };
}

export default function CreateCommunityModal({
  isDarkMode,
  isOpen,
  isClosing,
  onClose,
  onCreate,
  modalOrigin
}: CreateCommunityModalProps) {
  const [communityName, setCommunityName] = useState('');
  const [location, setLocation] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!communityName.trim()) return;
    
    setIsCreating(true);
    try {
      await onCreate({
        communityName: communityName.trim(),
        location: location.trim(),
        bannerImage: bannerImage || undefined,
        profileImage: profileImage || undefined
      });
      
      // Reset form
      setCommunityName('');
      setLocation('');
      setBannerImage(null);
      setProfileImage(null);
    } catch (error) {
      console.error('Error creating community:', error);
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
                <Users className="w-7 h-7 text-[#5E5CE6]" />
              </div>
              <h2 className="font-extrabold text-2xl italic">Create Community</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Form - Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex flex-col gap-5">
            {/* Community Name */}
            <div>
              <label className="block text-sm font-bold mb-2 opacity-70">
                Community Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Wildlife Watchers, Bird Spotters"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                maxLength={50}
                className={`w-full text-xl font-bold bg-transparent outline-none border-b-2 pb-2 placeholder:italic transition-colors ${
                  isDarkMode 
                    ? "border-gray-600 placeholder:text-gray-500 focus:border-[#5E5CE6]" 
                    : "border-gray-300 placeholder:text-gray-400 focus:border-[#5E5CE6]"
                }`}
              />
              <div className="text-xs opacity-50 mt-1 text-right">
                {communityName.length}/50
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold mb-2 opacity-70">
                Location (Optional)
              </label>
              <div className="relative">
                <LocationSearch
                  value={location}
                  onChange={setLocation}
                />
              </div>
            </div>

            {/* Profile Picture (Optional) */}
            <div>
              <label className="block text-sm font-bold mb-2 opacity-70">
                Profile Picture (Optional)
              </label>
              <div 
                onClick={() => profileInputRef.current?.click()}
                className={`w-32 h-32 mx-auto rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors relative overflow-hidden ${
                  isDarkMode 
                    ? "border-gray-600 bg-[#333]" 
                    : "border-gray-300 bg-[#EFEFEF]"
                }`}
              >
                {profileImage ? (
                  <>
                    <img 
                      src={profileImage} 
                      alt="Profile preview" 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-sm text-center px-2">Click to change</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Users className="w-10 h-10 text-gray-400 mb-1" />
                    <span className="font-bold text-gray-400 text-xs text-center px-2">Click to upload</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={profileInputRef} 
                  onChange={handleProfileSelect} 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Banner Image (Optional) */}
            <div>
              <label className="block text-sm font-bold mb-2 opacity-70">
                Banner Image (Optional)
              </label>
              <div 
                onClick={() => bannerInputRef.current?.click()}
                className={`w-full h-[150px] rounded-[30px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors relative overflow-hidden ${
                  isDarkMode 
                    ? "border-gray-600 bg-[#333]" 
                    : "border-gray-300 bg-[#EFEFEF]"
                }`}
              >
                {bannerImage ? (
                  <>
                    <img 
                      src={bannerImage} 
                      alt="Banner preview" 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold">Click to change</span>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-gray-400 mb-1" />
                    <span className="font-bold text-gray-400 text-sm">Click to upload banner image</span>
                    <span className="text-xs text-gray-500 mt-1">Recommended: 1200x300px</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={bannerInputRef} 
                  onChange={handleBannerSelect} 
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
              disabled={!communityName.trim() || isCreating}
              className={`px-10 py-2.5 rounded-full font-extrabold text-lg shadow-lg transition-all ${
                !communityName.trim() || isCreating
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#5E5CE6] text-white hover:bg-[#4B4BD1] hover:scale-105"
              }`}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
