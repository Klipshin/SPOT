/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent, useMemo, useContext, createContext, useEffect } from 'react';
import {
  MapPin, Users, Crown, Plus, ChevronDown, ArrowBigUp, ArrowBigDown,
  MessageCircle, Image as ImageIcon, Send, X, Reply, UploadCloud, Check, Sun, Moon, User, Edit2, ShieldCheck, UserMinus, ArrowLeft, Flag, Shield
} from "lucide-react";
import CreatePostModal from '@/src/components/CreatePostModal';
import ReportModal from '@/src/components/ReportModal';
import VerifySpeciesModal from '@/src/components/VerifySpeciesModal';
import { createClient } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import NotificationBell from '@/src/components/NotificationBell';
import { 
  getProfilePictureUrl, 
  getCommunityProfilePictureUrl, 
  getCommunityBannerUrl,
  getPostMediaUrl,
  getCommentMediaUrl
} from '@/src/utils/imageUrl';

const LocationSearch = dynamic(() => import('@/src/components/LocationSearch'), {
  ssr: false,
});


interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}
const Link = ({ href, children, className }: LinkProps) => <a href={href} className={className}>{children}</a>;

// --- THEME CONTEXT ---
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {}
});
const useTheme = () => useContext(ThemeContext);

// --- CONSTANTS: CITIES, PROVINCES & BARANGAYS ---
const philippineLocations = [
  "Angeles City, Pampanga", "Antipolo, Rizal", "Bacolod City, Negros Occidental", "Bacoor, Cavite", "Baguio City, Benguet", "Bantayan, Cebu", "Batangas City, Batangas", "Biñan, Laguna", "Bogo City, Cebu", "Butuan City, Agusan del Norte", "Cabanatuan, Nueva Ecija", "Cagayan de Oro, Misamis Oriental", "Calamba, Laguna", "Caloocan City, Metro Manila", "Camotes, Cebu", "Carcar City, Cebu", "Catbalogan City, Samar", "Cavite City, Cavite", "Cebu City, Cebu", "Clark, Pampanga", "Consolacion, Cebu", "Cotabato City, Maguindanao", "Dagupan, Pangasinan", "Danao City, Cebu", "Dasmarinas, Cavite", "Davao City, Davao del Sur", "Dumaguete City, Negros Oriental", "General Santos, South Cotabato", "Iligan City, Lanao del Norte", "Iloilo City, Iloilo", "Imus, Cavite", "Lapu-Lapu City, Cebu", "Las Piñas, Metro Manila", "Legazpi City, Albay", "Liloan, Cebu", "Lipa, Batangas", "Lucena, Quezon", "Makati City, Metro Manila", "Malabon, Metro Manila", "Mandaluyong, Metro Manila", "Mandaue City, Cebu", "Manila, Metro Manila", "Marikina, Metro Manila", "Minglanilla, Cebu", "Moalboal, Cebu", "Muntinlupa, Metro Manila", "Naga City, Camarines Sur", "Naga City, Cebu", "Navotas, Metro Manila", "Olongapo, Zambales", "Ormoc City, Leyte", "Oslob, Cebu", "Paranaque, Metro Manila", "Pasay, Metro Manila", "Pasig City, Metro Manila", "Puerto Princesa, Palawan", "Quezon City, Metro Manila", "Roxas City, Capiz", "San Juan, Metro Manila", "San Pablo, Laguna", "San Pedro, Laguna", "Santa Rosa, Laguna", "Santiago, Isabela", "Siargao, Surigao del Norte", "Subic, Zambales", "Tacloban City, Leyte", "Tagaytay City, Cavite", "Tagbilaran City, Bohol", "Taguig City, Metro Manila", "Talisay City, Cebu", "Tanauan, Batangas", "Tarlac City, Tarlac", "Toledo City, Cebu", "Trece Martires, Cavite", "Tuguegarao, Cagayan", "Valenzuela, Metro Manila", "Vigan City, Ilocos Sur", "Zamboanga City, Zamboanga",
  "Adlaon, Cebu City", "Agsungot, Cebu City", "Apas, Cebu City", "Babag, Cebu City", "Bacayan, Cebu City", "Banilad, Cebu City", "Basak Pardo, Cebu City", "Basak San Nicolas, Cebu City", "Binaliw, Cebu City", "Bonbon, Cebu City", "Budlaan, Cebu City", "Buhisan, Cebu City", "Bulacao, Cebu City", "Busay, Cebu City", "Calamba, Cebu City", "Cambinocot, Cebu City", "Camputhaw, Cebu City", "Capitol Site, Cebu City", "Carreta, Cebu City", "Cogon Pardo, Cebu City", "Cogon Ramos, Cebu City", "Day-as, Cebu City", "Duljo Fatima, Cebu City", "Ermita, Cebu City", "Guadalupe, Cebu City", "Guba, Cebu City", "Hipodromo, Cebu City", "Inayawan, Cebu City", "Kalubihan, Cebu City", "Kalunasan, Cebu City", "Kamagayan, Cebu City", "Kamputhaw, Cebu City", "Kasambagan, Cebu City", "Kinasang-an Pardo, Cebu City", "Labangon, Cebu City", "Lahug, Cebu City", "Lorega San Miguel, Cebu City", "Lusaran, Cebu City", "Luz, Cebu City", "Mabini, Cebu City", "Mabolo, Cebu City", "Malubog, Cebu City", "Mambaling, Cebu City", "Pahina Central, Cebu City", "Pahina San Nicolas, Cebu City", "Pamutan, Cebu City", "Pari-an, Cebu City", "Paril, Cebu City", "Pasil, Cebu City", "Pit-os, Cebu City", "Pulangbato, Cebu City", "Pung-ol Sibugay, Cebu City", "Punta Princesa, Cebu City", "Quiot, Cebu City", "Sambag I, Cebu City", "Sambag II, Cebu City", "San Antonio, Cebu City", "San Jose, Cebu City", "San Nicolas Proper, Cebu City", "San Roque, Cebu City", "Santa Cruz, Cebu City", "Santo Niño, Cebu City", "Sapangdaku, Cebu City", "Sawang Calero, Cebu City", "Sinsin, Cebu City", "Sirao, Cebu City", "Suba, Cebu City", "Sudlon I, Cebu City", "Sudlon II, Cebu City", "T. Padilla, Cebu City", "Tabunan, Cebu City", "Tagba-o, Cebu City", "Talamban, Cebu City", "Taptap, Cebu City", "Tejero, Cebu City", "Tinago, Cebu City", "Tisa, Cebu City", "Toong, Cebu City", "Zapatera, Cebu City",
  "Bel-Air, Makati City", "San Lorenzo, Makati City", "Poblacion, Makati City", "Urdaneta, Makati City", "Dasmarinas Village, Makati City", "Forbes Park, Makati City", "Magallanes, Makati City", 
  "Fort Bonifacio, Taguig City", "Pinagsama, Taguig City", "Upper Bicutan, Taguig City", "Lower Bicutan, Taguig City",
  "Loyola Heights, Quezon City", "Diliman, Quezon City", "Cubao, Quezon City", "New Manila, Quezon City", "Commonwealth, Quezon City", "Batasan Hills, Quezon City",
  "Alabang, Muntinlupa", "Ayala Alabang, Muntinlupa", "Poblacion, Muntinlupa",
  "Ortigas Center, Pasig City", "San Antonio, Pasig City", "Kapitolyo, Pasig City",
  "Greenhills, San Juan", "Wack-Wack, Mandaluyong"
].sort();

// --- HEADER COMPONENT ---
function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();
  
  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Set email
        setEmail(user.email || null);

        // Fetch user profile for username and profile picture
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('username, profile_picture')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          setUsername(profile.username);
          setProfilePicture(getProfilePictureUrl(profile.profile_picture) || null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    fetchUserProfile();
  }, [supabase]);
  
  return (
    <div className="fixed top-0 left-0 right-0 w-full z-50">
      <div className={`w-full h-11 justify-center ${isDarkMode ? 'bg-[#373333]' : 'bg-[#dad2b9]'}`} />
      
      {/* SPOT Logo Text */}
      <div className="absolute -top-0.5 left-[70px] [-webkit-text-stroke:0.5px_#072d0d] bg-[linear-gradient(180deg,rgba(149,171,51,1)_30%,rgba(35,115,47,1)_57%,rgba(8,46,13,1)_83%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins-ExtraBold',Helvetica] font-extrabold text-transparent text-[32px] tracking-[1.60px] leading-[normal]">
        SPOT
      </div>

      {/* Logo Icon */}
      <img className="absolute top-0 left-[15px] w-[50px] h-[40px] aspect-[1.48] object-cover" alt="Spoticon" src="/eyecon.svg" />
      
      {/* Right Side Icons */}
      <button 
        className="absolute top-0 left-[1320px] hover:scale-110 transition-transform duration-200 cursor-pointer"
        onClick={toggleTheme}
      >
        {isDarkMode ? (
          <img className="w-[70px] h-[50px]" style={{ marginTop: '1px' }} alt="Dark Mode" src="/darkk.svg" />
        ) : (
          <img className="w-[47px] h-[31px]" style={{ marginTop: '6px' }} alt="Light Mode" src="/lightt.svg" />
        )}
      </button>

      {/* Notification Bell */}
      <div className="absolute top-[5px] left-[1395px]">
        <NotificationBell isDarkMode={isDarkMode} />
      </div>

      {/* User Profile Button */}
      <div className="absolute top-[5px] left-[1425px]">
        <button 
          className="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
        >
          <img className="w-[35px] h-[35px] aspect-[1] object-cover" alt="Down chevron" src="/downn.svg" />
          <div className="w-[35px] h-[35px] bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt={username || 'User'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<img src="/pfp.svg" alt="User" class="w-full h-full object-cover" />';
                }}
              />
            ) : (
              <img src="/pfp.svg" alt="User" className="w-full h-full object-cover" />
            )}
          </div>
        </button>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <div 
            className={`absolute right-0 mt-1 w-64 rounded-xl shadow-xl overflow-hidden z-50 ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'}`}
            style={{ border: '2px solid #899A3C' }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* User Info Section */}
            <div className={`px-4 py-3 border-b flex items-center gap-3 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt={username || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src="/pfp.svg" alt="User" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>@{username || 'user'}</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{email || 'loading...'}</p>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="py-1">
              <button 
                className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2.5 ${isDarkMode ? 'hover:bg-[#3a3a3a]' : 'hover:bg-[#DBE9AF]'}`}
                onClick={() => {
                  setIsProfileOpen(false);
                  router.push('/profile');
                }}
              >
                <Edit2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Edit Profile</span>
              </button>
              
              <button 
                className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2.5 ${isDarkMode ? 'hover:bg-[#3a3a3a]' : 'hover:bg-[#DBE9AF]'}`}
                onClick={() => {
                  setIsProfileOpen(false);
                  router.push('/settings');
                }}
              >
                <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Account Settings</span>
              </button>
              
              <button 
                className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2.5 ${isDarkMode ? 'hover:bg-[#3a3a3a]' : 'hover:bg-[#DBE9AF]'}`}
                onClick={() => {/* Help Center logic here */}}
              >
                <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Help Center</span>
              </button>
            </div>
            
            {/* Log Out Section */}
            <div className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>
              <button 
                className="w-full px-4 py-2 text-left hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2.5 group"
                onClick={async () => {
                  try {
                    const { error } = await supabase.auth.signOut();
                    if (error) console.error('Error signing out:', error.message);
                    router.push('/');
                  } catch (err) {
                    console.error('Sign out failed:', err);
                  }
                }}
              >
                <svg className={`w-4 h-4 group-hover:text-white ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className={`text-sm font-medium group-hover:text-white ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- TYPES ---
type Comment = {
  id: number | string; // Can be UUID string or number
  commentId?: string; // UUID from database (comment_id)
  user: string;
  userId?: string; // Comment author's user_id
  userProfilePicture?: string | null;
  date: string;
  text: string;
  image?: string | null;
  vote: 'up' | 'down' | null;
  upvotes: number;
  downvotes: number;
  isReply: boolean;
};

type Post = {
  id: string;
  postId?: string; // Actual database post_id
  userId?: string; // Post author's user_id
  timestamp: number;
  user: string;
  userProfilePicture?: string | null;
  date: string;
  heading: string;
  image?: string | null;
  caption: string;
  vote: 'up' | 'down' | null;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  location?: string;
  latitude?: number;
  longitude?: number;
};

type Member = { id: number; name: string; role: 'moderator' | 'member'; online: boolean; };
type SortOptionType = 'default' | 'newest' | 'oldest' | 'popular' | 'least';

// --- MAIN CONTENT COMPONENT ---
function ModeratorPageContent({ communityId }: { communityId: string }) {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  
  // Community data state
  const [communityData, setCommunityData] = useState<any>(null);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [communityMembers, setCommunityMembers] = useState<any[]>([]);
  
  // ===== STATE: MEMBERSHIP STATUS =====
  const [isMember, setIsMember] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loadingMembership, setLoadingMembership] = useState(true);

  // ===== STATE: CURRENT USER =====
  const [currentUserProfilePicture, setCurrentUserProfilePicture] = useState<string | null>(null);

  // Fetch current user profile picture and expert status
  useEffect(() => {
    async function fetchCurrentUserProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('profile_picture, is_expert')
          .eq('user_id', user.id)
          .single();
        
        // Check expert status
        if (profile?.is_expert) {
          setIsExpert(true);
        } else {
          // Also check experts table
          const { data: expertData } = await supabase
            .from('experts')
            .select('is_verified')
            .eq('user_id', user.id)
            .single();
          
          setIsExpert(expertData?.is_verified || false);
        }

        if (profile) {
          setCurrentUserProfilePicture(getProfilePictureUrl(profile.profile_picture) || null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    fetchCurrentUserProfile();
  }, []);

  // Fetch community data
  useEffect(() => {
    async function fetchCommunity() {
      try {
        const [communityRes, postsRes, membersRes, membershipRes] = await Promise.all([
          fetch(`/api/communities/${communityId}`),
          fetch(`/api/communities/${communityId}/posts`),
          fetch(`/api/communities/${communityId}/members`),
          fetch(`/api/communities/${communityId}/membership`)
        ]);
        
        if (communityRes.ok) {
          const data = await communityRes.json();
          console.log('Community data received:', data.community);
          setCommunityData(data.community);
        }
        
        if (postsRes.ok) {
          const data = await postsRes.json();
          setCommunityPosts(data.posts || []);
        }
        
        if (membersRes.ok) {
          const data = await membersRes.json();
          setCommunityMembers(data.members || []);
        }

        // Check membership status
        if (membershipRes.ok) {
          const membershipData = await membershipRes.json();
          console.log('Membership API response:', membershipData);
          setIsMember(membershipData.isMember);
          setIsModerator(membershipData.role === 'moderator');
          console.log('Set states - isMember:', membershipData.isMember, 'isModerator:', membershipData.role === 'moderator');
        } else {
          const errorText = await membershipRes.text();
          console.error('Membership check failed:', membershipRes.status, errorText);
        }
      } catch (error) {
        console.error('Error fetching community:', error);
      } finally {
        setLoadingCommunity(false);
        setLoadingMembership(false);
      }
    }
    
    if (communityId) {
      fetchCommunity();
    }
  }, [communityId]); 

  // Debug membership state
  useEffect(() => {
    console.log('Community page - Membership state updated:', { isMember, isModerator, loadingMembership });
  }, [isMember, isModerator, loadingMembership]);

  // ===== STATE: COMMUNITY DATA =====
  const [communityBanner, setCommunityBanner] = useState('/landd.svg');
  const [communityProfile, setCommunityProfile] = useState('/binoculars.svg');
  const [communityLocation, setCommunityLocation] = useState('Cebu City, Philippines');
  
  // Update images when community data loads
  useEffect(() => {
    if (communityData) {
      console.log('Community data loaded:', {
        banner_image: communityData.banner_image,
        profile_picture: communityData.profile_picture,
        location: communityData.location
      });
      
      if (communityData.banner_image) {
        const bannerUrl = getCommunityBannerUrl(communityData.banner_image);
        console.log('Banner URL conversion:', { original: communityData.banner_image, converted: bannerUrl });
        setCommunityBanner(bannerUrl || '/landd.svg');
      } else {
        setCommunityBanner('/landd.svg');
      }
      
      if (communityData.profile_picture) {
        const profileUrl = getCommunityProfilePictureUrl(communityData.profile_picture);
        console.log('Profile picture URL conversion:', { original: communityData.profile_picture, converted: profileUrl });
        setCommunityProfile(profileUrl || '/binoculars.svg');
      } else {
        setCommunityProfile('/binoculars.svg');
      }
      
      if (communityData.location) {
        setCommunityLocation(communityData.location);
      }
    }
  }, [communityData]);

  // ===== STATE: EDITING =====
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocationText, setTempLocationText] = useState('');
  
  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContentType, setReportContentType] = useState<'post' | 'comment'>('post');
  const [reportContentId, setReportContentId] = useState('');
  const [reportUserId, setReportUserId] = useState('');
  
  // Expert verification state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedPostForVerification, setSelectedPostForVerification] = useState<Post | null>(null);
  const [isExpert, setIsExpert] = useState(false);
  
  // Post menu dropdown state
  const [openPostMenuId, setOpenPostMenuId] = useState<string | null>(null);
  
  // Close post menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openPostMenuId) {
        setOpenPostMenuId(null);
      }
    };
    
    if (openPostMenuId) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openPostMenuId]);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // ===== STATE: GLOBAL UI =====
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOptionType>('default');
  
  // ===== STATE: MODALS =====
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteCommunityModal, setShowDeleteCommunityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalOrigin, setModalOrigin] = useState({ x: 0, y: 0 });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  
  const createPostBtnRef = useRef<HTMLButtonElement>(null);
  const membersBtnRef = useRef<HTMLButtonElement>(null);
  
  // New Post Form
  const [newPostHeading, setNewPostHeading] = useState("");
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const createPostFileInputRef = useRef<HTMLInputElement>(null);

  // ===== STATE: MEMBERS =====
  const [membersList, setMembersList] = useState<Member[]>([]);
  
  // Map Supabase members to component format
  useEffect(() => {
    if (communityMembers.length > 0) {
      const mappedMembers: Member[] = communityMembers.map((m, index) => ({
        id: index + 1,
        name: `@${m.user_profiles?.username || m.user_profiles?.name || 'user'}`,
        role: m.community_role ? 'moderator' : 'member',
        online: m.is_active || false
      }));
      setMembersList(mappedMembers);
    }
  }, [communityMembers]);

  // ===== STATE: POSTS =====
  const [posts, setPosts] = useState<Post[]>([]);
  
  // Map Supabase posts to component format and fetch comments
  useEffect(() => {
    if (communityPosts.length > 0) {
      const mappedPosts: Post[] = communityPosts.map((p) => ({
        id: p.post_id, // Use actual post_id from database
        postId: p.post_id, // Keep reference to actual post ID
        userId: p.user_id, // Track post author
        timestamp: new Date(p.created_at).getTime(),
        user: `@${p.user_profiles?.username || 'user'}`,
        userProfilePicture: getProfilePictureUrl(p.user_profiles?.profile_picture) || null,
        date: formatDate(p.created_at),
        heading: p.title,
        image: getPostMediaUrl(p.media_url) || null,
        caption: p.content,
        vote: null,
        upvotes: p.upvotes || 0,
        downvotes: p.downvotes || 0,
        comments: [],
        location: p.location,
        latitude: p.latitude,
        longitude: p.longitude
      }));
      setPosts(mappedPosts);
      
      // Fetch comments for each post
      mappedPosts.forEach(async (post) => {
        try {
          const response = await fetch(`/api/posts/${post.id}/comments`);
          if (response.ok) {
            const { comments } = await response.json();
            const mappedComments: Comment[] = comments.map((c: any) => ({
              id: c.comment_id, // Keep for backward compatibility
              commentId: c.comment_id, // UUID from database
              user: `@${c.user_profiles?.username || 'user'}`,
              userId: c.user_id,
              userProfilePicture: getProfilePictureUrl(c.user_profiles?.profile_picture) || null,
              date: formatDate(c.created_at),
              text: c.content,
              image: getCommentMediaUrl(c.media_url) || null,
              vote: c.userVote || null,
              upvotes: c.upvotes || 0,
              downvotes: c.downvotes || 0,
              isReply: c.parent_comment_id !== null,
            }));
            
            setPosts(prevPosts => prevPosts.map(p => 
              p.id === post.id ? { ...p, comments: mappedComments } : p
            ));
          }
        } catch (error) {
          console.error(`Error fetching comments for post ${post.id}:`, error);
        }
      });
    }
  }, [communityPosts]);

  // Initialize Leaflet map when location modal opens
  useEffect(() => {
    if (showLocationModal && selectedLocation && typeof window !== 'undefined') {
      // Dynamically load Leaflet if not already loaded
      if (!(window as any).L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => initializeMap();
        document.head.appendChild(script);
      } else {
        // Leaflet already loaded
        initializeMap();
      }
    }

    function initializeMap() {
      const L = (window as any).L;
      if (!L || !selectedLocation) return;

      const mapContainer = document.getElementById('location-modal-map');
      if (!mapContainer) return;

      // Remove existing map instance if any
      if ((mapContainer as any)._leaflet_id) {
        const existingMap = (mapContainer as any)._leaflet_map;
        if (existingMap) {
          existingMap.remove();
        }
      }

      // Create new map
      const map = L.map('location-modal-map').setView([selectedLocation.lat, selectedLocation.lng], 13);
      (mapContainer as any)._leaflet_map = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker([selectedLocation.lat, selectedLocation.lng])
        .addTo(map)
        .bindPopup(selectedLocation.name)
        .openPopup();

      // Fix map rendering issue
      setTimeout(() => map.invalidateSize(), 100);
    }

    // Cleanup function
    return () => {
      const mapContainer = document.getElementById('location-modal-map');
      if (mapContainer && (mapContainer as any)._leaflet_map) {
        (mapContainer as any)._leaflet_map.remove();
        delete (mapContainer as any)._leaflet_map;
      }
    };
  }, [showLocationModal, selectedLocation]);
  
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Placeholder posts for empty state
  const [placeholderPosts] = useState<Post[]>([
    {
      id: "5",
      timestamp: 1715425000000,
      user: '@nature_explorer',
      date: '2 hours ago',
      heading: 'Can anyone identify this bird?',
      image: null, 
      caption: 'I saw this near Busay. It had striking blue feathers.',
      vote: null,
      upvotes: 255,
      downvotes: 2,
      comments: [
        { id: 101, user: '@bio_student_cebu', date: '1 hour ago', text: 'Looks like a White-collared Kingfisher! They are pretty common in that area.', vote: null, upvotes: 45, downvotes: 0, isReply: false },
        { id: 102, user: '@nature_explorer', date: '50 mins ago', text: '@bio_student_cebu That makes sense, thank you!', vote: null, upvotes: 12, downvotes: 0, isReply: true }
      ]
    },
    {
      id: "4",
      timestamp: 1715420000000,
      user: '@cebu_pet_advocate',
      date: '4 hours ago',
      heading: 'Missing Golden Retriever',
      image: '/goldenplaceholder.svg', 
      caption: 'Last seen near Ayala Center Cebu. Please help us find Goldie! She is wearing a red collar.',
      vote: null,
      upvotes: 120,
      downvotes: 0,
      comments: []
    },
    {
      id: "3",
      timestamp: 1715415000000,
      user: '@snake_hunter_ph',
      date: '6 hours ago',
      heading: 'Is this snake venomous?',
      image: null,
      caption: 'Found this in my backyard in Talamban. Should I be worried?',
      vote: null,
      upvotes: 89,
      downvotes: 15,
      comments: []
    },
    {
      id: "2",
      timestamp: 1715400000000,
      user: '@marine_bio_joy',
      date: '1 day ago',
      heading: 'Starfish identification',
      image: null,
      caption: 'Spotted this beautiful starfish while diving in Moalboal. Anyone know the scientific name?',
      vote: null,
      upvotes: 340,
      downvotes: 1,
      comments: []
    },
    {
      id: "1",
      timestamp: 1715300000000,
      user: '@newbie_hiker',
      date: '2 days ago',
      heading: 'Best trails for spotting monkeys?',
      image: null,
      caption: 'I want to take some photos of wildlife this weekend. Any trail recommendations?',
      vote: null,
      upvotes: 45,
      downvotes: 3,
      comments: []
    }
  ]);

  // Comment Input State
  const [newCommentText, setNewCommentText] = useState('');
  const [attachedCommentImage, setAttachedCommentImage] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyingToUser, setReplyingToUser] = useState<string>('');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const commentFileInputRef = useRef<HTMLInputElement>(null);

  // ===== LOGIC: SORTING & FILTERING =====
  const filteredLocations = useMemo(() => {
    return philippineLocations.filter(loc => loc.toLowerCase().includes(tempLocationText.toLowerCase()));
  }, [tempLocationText]);

  const sortedPosts = useMemo(() => {
    const sorted = [...posts];
    switch (sortOption) {
      case 'popular': return sorted.sort((a, b) => b.upvotes - a.upvotes);
      case 'least': return sorted.sort((a, b) => a.upvotes - b.upvotes);
      case 'oldest': return sorted.sort((a, b) => a.timestamp - b.timestamp);
      case 'newest': return sorted.sort((a, b) => b.timestamp - a.timestamp);
      case 'default': default: return sorted.sort((a, b) => b.timestamp - a.timestamp);
    }
  }, [posts, sortOption]);

  const handleSortSelect = (option: SortOptionType) => {
    setSortOption(option);
    setIsSortOpen(false);
  };

  const formatVoteCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return count.toString();
  };

  // ===== HANDLERS: MODALS & ACTIONS =====
  const openLightbox = (src: string) => setLightboxImage(src);
  const closeLightbox = () => setLightboxImage(null);

  // -- Modal Openers --
  const openCreatePostModal = () => {
    if (createPostBtnRef.current) {
      const rect = createPostBtnRef.current.getBoundingClientRect();
      setModalOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setIsCreatePostOpen(true);
    setIsClosingModal(false);
  };

  const openMembersModal = () => {
    if (membersBtnRef.current) {
        const rect = membersBtnRef.current.getBoundingClientRect();
        setModalOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setIsMembersModalOpen(true);
    setIsClosingModal(false);
  };

  // -- Modal Closers --
  const closeModal = (setter: (val: boolean) => void) => {
    setIsClosingModal(true);
    setTimeout(() => {
      setter(false);
      setIsClosingModal(false);
      setNewPostHeading("");
      setNewPostCaption("");
      setNewPostImage(null);
    }, 300);
  };

  // -- Create Post Handler --
  const handleCreatePost = async (data: { title: string; content: string; mediaUrl?: string; flairNames?: string[]; location?: string; latitude?: number; longitude?: number }) => {
    try {
      const response = await fetch(`/api/communities/${communityId}/posts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communityId,
          title: data.title,
          content: data.content,
          mediaUrl: data.mediaUrl,
          flairNames: data.flairNames, // Send flair names array
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to create post');
      }

      // Refresh posts
      const postsRes = await fetch(`/api/communities/${communityId}/posts`);
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setCommunityPosts(postsData.posts || []);
      }

      closeModal(setIsCreatePostOpen);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  // -- Post Comment Handler --
  const handlePostComment = async (postId: string) => {
    const trimmedContent = newCommentText.trim();
    if (!trimmedContent && !attachedCommentImage) return;
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Call API to post comment
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: trimmedContent,
          media_url: attachedCommentImage,
          parent_comment_id: replyingToId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to post comment:', response.status, errorData);
        alert(`Failed to post comment: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const { comment: insertedComment } = await response.json();

      // CLIENT-SIDE STATE UPDATE using data from API
      const newComment: Comment = {
        id: insertedComment?.comment_id || Date.now(),
        user: `@${insertedComment?.user_profiles?.username || 'user'}`,
        userProfilePicture: getProfilePictureUrl(insertedComment?.user_profiles?.profile_picture) || null,
        date: formatDate(new Date().toISOString()),
        text: insertedComment?.content || trimmedContent,
        image: getCommentMediaUrl(insertedComment?.media_url) || attachedCommentImage,
        vote: null,
        upvotes: 0,
        downvotes: 0,
        isReply: replyingToId !== null,
      };

      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id !== postId) return post;
        
        let updatedComments = [...post.comments];
        
        if (replyingToId !== null) {
          const parentIndex = updatedComments.findIndex(c => c.id === replyingToId);
          if (parentIndex !== -1) {
            let insertIndex = parentIndex + 1;
            while (insertIndex < updatedComments.length && updatedComments[insertIndex].isReply) {
              insertIndex++;
            }
            updatedComments.splice(insertIndex, 0, newComment);
          } else {
            updatedComments.push(newComment);
          }
        } else {
          updatedComments.push(newComment);
        }
        
        return { ...post, comments: updatedComments };
      }));

      setNewCommentText('');
      setAttachedCommentImage(null);
      setReplyingToId(null);
      setReplyingToUser('');
      setActivePostId(null);
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('An error occurred while posting your comment. Please try again.');
    }
  };

  // -- Join Community Action --
  const handleJoinCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to join community');
        return;
      }

      // Refresh membership status and community data
      const [membershipRes, membersRes] = await Promise.all([
        fetch(`/api/communities/${communityId}/membership`),
        fetch(`/api/communities/${communityId}/members`)
      ]);

      if (membershipRes.ok) {
        const membershipData = await membershipRes.json();
        setIsMember(membershipData.isMember);
        setIsModerator(membershipData.role === 'moderator');
      }

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setCommunityMembers(membersData.members || []);
      }

      // Show success modal
      setSuccessMessage('Welcome! You have successfully joined the community.');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Failed to join community. Please try again.');
    }
  };

  // -- Leave Community Action --
  const handleLeaveCommunity = async () => {
    setShowLeaveModal(false);
    
    try {
      const response = await fetch(`/api/communities/${communityId}/leave`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to leave community');
        return;
      }

      // Refresh membership status
      const membershipRes = await fetch(`/api/communities/${communityId}/membership`);
      if (membershipRes.ok) {
        const membershipData = await membershipRes.json();
        setIsMember(membershipData.isMember);
        setIsModerator(membershipData.role === 'moderator');
      }

      // Show success modal
      setSuccessMessage('You have left the community.');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error leaving community:', error);
      alert('Failed to leave community. Please try again.');
    }
  };

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [postToDelete, setPostToDelete] = React.useState<string | number | null>(null);

  // -- Delete Post Action (for moderators) --
  const handleDeletePost = async (postId: string | number) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`/api/posts/${postToDelete}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: 'Deleted by moderator'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to delete post');
        setShowDeleteModal(false);
        setPostToDelete(null);
        return;
      }

      // Refresh posts
      const postsRes = await fetch(`/api/communities/${communityId}/posts`);
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setCommunityPosts(postsData.posts || []);
      }

      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  // -- Moderator Actions --
  const handleRemoveMember = (id: number) => { 
    setMembersList((prev) => prev.filter((member) => member.id !== id)); 
  };

  const handleBannerSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCommunityBanner(URL.createObjectURL(file));
  };
  
  const handleProfileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCommunityProfile(URL.createObjectURL(file));
  };
  
  const startEditingLocation = () => {
    setTempLocationText(communityLocation);
    setIsEditingLocation(true);
    setTimeout(() => locationInputRef.current?.focus(), 50);
  };
  
  const saveLocation = () => {
    if (tempLocationText.trim()) setCommunityLocation(tempLocationText);
    setIsEditingLocation(false);
  };
  
  const cancelEditLocation = () => setIsEditingLocation(false);

  const handleDeleteCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete community');
      }

      // Close modal and show success message
      setShowDeleteCommunityModal(false);
      setSuccessMessage('Community deleted successfully');
      setShowSuccessModal(true);
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error: any) {
      console.error('Error deleting community:', error);
      alert(`Error: ${error.message || 'Failed to delete community'}`);
    }
  };

  // -- Post interaction handlers --
  const handlePostVote = async (postId: string, direction: 'up' | 'down') => {
    const currentPost = posts.find(p => p.id === postId);
    if (!currentPost) return;

    const isUpvote = direction === 'up';
    const wasVoted = currentPost.vote === direction;
    
    let newVote: 'up' | 'down' | null = wasVoted ? null : direction;
    let newUpvotes = currentPost.upvotes;
    let newDownvotes = currentPost.downvotes;
    let action: 'insert' | 'update' | 'delete';

    if (wasVoted) {
      // User is unvoting
      if (isUpvote) newUpvotes--;
      else newDownvotes--;
      action = 'delete';
    } else {
      // User is changing vote or voting for the first time
      if (currentPost.vote === 'up') newUpvotes--;
      if (currentPost.vote === 'down') newDownvotes--;
      
      if (isUpvote) newUpvotes++;
      else newDownvotes++;
      
      action = currentPost.vote ? 'update' : 'insert';
    }

    try {
      const response = await fetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote_type: direction === 'up' ? 'upvote' : 'downvote',
          action: action
        }),
      });

      if (!response.ok) {
        console.error('Failed to update vote');
        return;
      }

      // Update UI
      setPosts(prev => prev.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          vote: newVote,
          upvotes: newUpvotes,
          downvotes: newDownvotes
        };
      }));
    } catch (error) {
      console.error('Error handling vote:', error);
    }
  };

  const handleCommentVote = async (postId: string, commentId: number, direction: 'up' | 'down') => {
    let currentComment: Comment | undefined;
    const currentPost = posts.find(p => p.id === postId);
    if (currentPost) {
      currentComment = currentPost.comments.find(c => c.id === commentId);
    }
    if (!currentComment) return;

    let newVote: 'up' | 'down' | null = currentComment.vote;
    let newUpvotes = currentComment.upvotes;
    let newDownvotes = currentComment.downvotes;
    let action: 'insert' | 'update' | 'delete';

    if (currentComment.vote === direction) {
      // User is unvoting
      newVote = null;
      if (direction === 'up') newUpvotes--;
      else newDownvotes--;
      action = 'delete';
    } else {
      // User is changing vote or voting for the first time
      if (currentComment.vote === 'up') newUpvotes--;
      if (currentComment.vote === 'down') newDownvotes--;
      
      newVote = direction;
      if (direction === 'up') newUpvotes++;
      else newDownvotes++;
      
      action = currentComment.vote ? 'update' : 'insert';
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote_type: direction === 'up' ? 'upvote' : 'downvote',
          action: action
        }),
      });

      if (!response.ok) {
        console.error('Failed to update comment vote');
        return;
      }

      // Update UI
      setPosts(prev => prev.map(post => {
        if (post.id !== postId) return post;
        
        const updatedComments = post.comments.map(comment => {
          if (comment.id !== commentId) return comment;
          return { ...comment, vote: newVote, upvotes: newUpvotes, downvotes: newDownvotes };
        });
        
        return { ...post, comments: updatedComments };
      }));
    } catch (error) {
      console.error('Error handling comment vote:', error);
    }
  };

  const handleReplyClick = (postId: string, commentId: number, username: string) => {
    setActivePostId(postId);
    setReplyingToId(commentId);
    setReplyingToUser(username);
    const mentionText = `@${username.replace('@', '')} `;
    setNewCommentText(mentionText);

    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const input = document.getElementById(`comment-input-${postId}`) as HTMLTextAreaElement;
        if (input) {
          input.focus();
          const len = input.value.length;
          input.setSelectionRange(len, len);
        }
      }, 50);
    }
  };

  const handleCommentKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, postId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePostComment(postId);
    }
  };

  const cancelReply = () => {
    setReplyingToId(null);
    setReplyingToUser('');
    setNewCommentText('');
  };

  const handleCreatePostFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewPostImage(imageUrl);
    }
  };

  const handleCommentFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAttachedCommentImage(imageUrl);
    }
  };

  return (
    <div className={`relative min-h-screen pt-[50px] flex flex-col font-poppins transition-colors duration-300 w-full ${isDarkMode ? "text-white" : "text-black"}`}>
      
      {/* HIDDEN INPUTS FOR UPLOAD */}
      <input type="file" accept="image/*" ref={bannerInputRef} onChange={handleBannerSelect} className="hidden" />
      <input type="file" accept="image/*" ref={profileInputRef} onChange={handleProfileSelect} className="hidden" />

      {/* BACKGROUND */}
      <div className="!fixed !top-0 !left-0 !w-screen !h-screen -z-50">
        <img src={isDarkMode ? "/communitybgdrk.svg" : "/communitybg.svg"} alt="bg" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" />
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isDarkMode ? "opacity-100" : "opacity-0"}`}></div>
      </div>

      <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className={`relative z-20 mb-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white' 
              : 'bg-white hover:bg-gray-100 text-black border border-gray-300'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>
        
        {/* === INFO HEADER CARD === */}
        {/* FIX: Straight edges (rounded-none) */}
        <div className={`relative z-10 w-full transition-colors duration-300 flex-1 mb-0 flex flex-col min-h-[calc(100vh-70px)] ${isDarkMode ? "bg-[#222222] shadow-lg" : "bg-white shadow-sm"} rounded-none overflow-visible p-3`}>
          
          {/* ===== BANNER ===== */}
          {/* FIX: Width [95%] and mx-auto */}
          <div className="relative w-[95%] mx-auto h-[180px] shrink-0 group mt-3 rounded-[35px] overflow-hidden">
            <div className="w-full h-full cursor-pointer hover:opacity-95 transition-opacity" onClick={() => openLightbox(communityBanner)}>
              <img 
                src={communityBanner} 
                alt="Banner" 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                onError={(e) => {
                  console.error('Failed to load community banner:', communityBanner);
                  e.currentTarget.src = '/landd.svg';
                }}
              />
            </div>
             {/* MODERATOR: Edit Banner Button */}
             {isModerator && (
              <button onClick={() => bannerInputRef.current?.click()} className="absolute bottom-4 right-4 w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110" title="Edit Banner"><Edit2 className="w-4 h-4" /></button>
            )}
          </div>

          {/* INFO HEADER CONTENT */}
          <div className="px-8 pb-6 shrink-0 flex flex-col lg:flex-row items-end gap-6 pt-6"> 
              
             {/* ===== PROFILE PICTURE ===== */}
             {/* FIX: Size 230px, Hug bottom left (-mt-135, -ml-10), Thinner border, No opacity */}
            <div className="relative -mt-[135px] -ml-10 z-20 shrink-0 group">
              <div className={`w-[230px] h-[230px] rounded-full border-[4px] shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform ${isDarkMode ? "bg-[#444] border-[#222222]" : "bg-[#D9D9D9] border-white"}`} onClick={() => openLightbox(communityProfile)}>
                <img 
                  src={communityProfile} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load community profile picture:', communityProfile);
                    e.currentTarget.src = '/binoculars.svg';
                  }}
                />
              </div>
                {/* MODERATOR: Edit Profile Button */}
                {isModerator && (
                 <button onClick={() => profileInputRef.current?.click()} className="absolute bottom-3 right-3 w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 z-30" title="Edit Profile Picture"><Edit2 className="w-4 h-4" /></button>
               )}
            </div>
            
            {/* WRAPPER for Text and Buttons */}
            <div className="flex-1 min-w-0 flex flex-col lg:flex-row justify-between items-start ml-6 gap-4 w-full">
              
              {/* Text Info */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3">
                  {/* FIX: Text size */}
                  <h1 className={`text-4xl lg:text-5xl font-black tracking-tight leading-none whitespace-nowrap ${isDarkMode ? "text-white" : "text-black"}`}>
                    {loadingCommunity ? 'Loading...' : communityData?.community_name || 'Community'}
                  </h1>
                </div>

                <div>
                  {/* FIX: Font weight semibold, no italic, text-lg */}
                  <div className={`flex flex-wrap items-center gap-6 mt-6 font-semibold ${isDarkMode ? "text-gray-300" : "text-black"}`}>
                    <div className="flex items-center gap-2 text-lg">
                      <Users className="w-5 h-5 text-[#5E5CE6]" />
                      <span>{loadingCommunity ? '...' : (communityData?.member_count ?? 0)} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <div className="w-3 h-3 bg-[#00C92C] rounded-full shadow-[0_0_8px_#00C92C]"></div>
                      <span>{loadingCommunity ? '...' : (communityData?.active_members ?? 0)} online</span>
                    </div>
                  </div>
                  
                  {/* ===== LOCATION SELECTOR (MODERATOR EDITABLE) ===== */}
                  <div className={`flex items-center gap-2 font-semibold text-lg mt-3 group w-fit min-h-[32px] ${isDarkMode ? "text-gray-300" : "text-black"}`}>
                    <MapPin className="w-5 h-5 text-[#FFD700] shrink-0" />
                    
                    {isEditingLocation ? (
                        <div className="relative flex items-center gap-2 animate-in fade-in">
                            <LocationSearch
                              value={tempLocationText}
                              onChange={setTempLocationText}
                              isDarkMode={isDarkMode}
                            />
                            <button onClick={saveLocation} className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"><Check className="w-4 h-4" /></button>
                            <button onClick={cancelEditLocation} className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                    ) : (
                        <>
                            <span>{communityLocation}</span>
                            {isModerator && (
                            <button onClick={startEditingLocation} className="ml-2 p-1.5 bg-blue-500 text-white rounded-full transition-all hover:scale-110 hover:bg-blue-600 shadow-sm" title="Edit Location"><Edit2 className="w-3 h-3" /></button>
                            )}
                        </>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE ACTIONS */}
              <div className="flex flex-col items-end gap-4 shrink-0 pb-4">
                  
                 {/* SHOW MODERATOR BADGE IF MODERATOR */}
                 {isModerator && (
                   <div className="flex items-center gap-3">
                     {/* CUSTOM TOOLTIP FOR MODERATOR */}
                     <div className="relative z-10 group/crown">
                       {/* FIX: Reverted to larger w-12 h-12 size as requested */}
                       <div className="w-12 h-12 bg-[#00A3FF] rounded-full flex items-center justify-center shadow-md [perspective:1000px] cursor-pointer">
                           <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] group-hover/crown:[transform:rotateY(180deg)]">
                              {/* Front */}
                              <div className="absolute inset-0 w-full h-full bg-[#00A3FF] rounded-full flex items-center justify-center [backface-visibility:hidden]">
                                 <Crown className="w-6 h-6 text-[#FFD700] fill-current" />
                              </div>
                              {/* Back */}
                              <div className="absolute inset-0 w-full h-full bg-white rounded-full overflow-hidden border-2 border-[#00A3FF] [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                 <img src="/binoculars.svg" alt="Mod" className="w-full h-full object-contain p-2" />
                              </div>
                           </div>
                       </div>
                       {/* Tooltip Content */}
                       <div className="absolute bottom-[130%] left-1/2 -translate-x-1/2 w-max opacity-0 group-hover/crown:opacity-100 transition-all duration-300 pointer-events-none z-50 group-hover/crown:-translate-y-2">
                         <div className="px-3 py-1.5 rounded-lg flex flex-col items-center backdrop-blur-md border shadow-md"
                           style={{ background: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)' }}>
                             <span className={`text-xs font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Current user is the moderator</span>
                         </div>
                       </div>
                     </div>

                     {/* FIX: Kept text small as requested */}
                     <span className={`font-bold text-xl ${isDarkMode ? "text-white" : "text-black"}`}>Moderator</span>
                   </div>
                 )}

                 {/* JOIN BUTTON - Show if user is not a member */}
                 {!isMember && (
                   <button 
                     onClick={handleJoinCommunity}
                     className={`px-8 py-2 rounded-full font-semibold text-lg flex items-center gap-2 transition-all shadow-sm 
                     ${isDarkMode ? "bg-[#0057FF] text-white hover:bg-[#0046CC]" : "bg-[#0057FF] text-white hover:bg-[#0046CC]"}`}
                   >
                     Join
                   </button>
                 )}

                 {/* LEAVE BUTTON - Show if user is a member but not moderator */}
                 {isMember && !isModerator && (
                   <button 
                     onClick={() => setShowLeaveModal(true)}
                     className={`px-6 py-1.5 rounded-full font-semibold text-sm flex items-center gap-2 transition-all shadow-sm 
                     ${isDarkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"}`}
                   >
                     Leave Community
                   </button>
                 )}

                 {/* DELETE BUTTON - Show only for moderators */}
                 {isModerator && (
                   <button 
                     onClick={() => setShowDeleteCommunityModal(true)}
                     className="px-6 py-1.5 rounded-full font-semibold text-sm flex items-center gap-2 transition-all shadow-sm bg-red-700 text-white hover:bg-red-800"
                   >
                     Delete Community
                   </button>
                 )}
                
                {/* CREATE POST BUTTON - Always show if user is a member */}
                {isMember && (
                  <button 
                    ref={createPostBtnRef} 
                    onClick={openCreatePostModal}
                    className={`px-6 py-1.5 rounded-full font-semibold text-lg flex items-center gap-2 transition-all shadow-sm 
                    ${isDarkMode ? "bg-[#D9D9D9] text-black hover:bg-gray-400" : "bg-[#D9D9D9] text-black hover:bg-gray-300"}`}
                  >
                    <div className="bg-[#0057FF] p-0.5 rounded text-white"><Plus className="w-5 h-5" /></div>
                    Create Post
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* STICKY NAV: MEMBERS & SORT */}
          {/* FIX: Font size xs for Members to match Sort By */}
          <div className={`sticky top-[50px] z-30 w-full shrink-0 px-10 py-2 border-b backdrop-blur-xl transition-colors duration-300 ${isDarkMode ? "bg-[#222222]/80 border-white/40 text-gray-200" : "bg-white/80 border-black/50 text-gray-600"}`}>
            <div className="flex justify-end items-center gap-6 mr-4">
              
              {/* MEMBERS BUTTON */}
              <button 
                ref={membersBtnRef}
                onClick={openMembersModal}
                className={`font-bold text-xs transition-colors hover:underline ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-black"}`}
              >
                Members
              </button>

              <div className="relative">
                <button onClick={() => setIsSortOpen(!isSortOpen)} className={`flex items-center gap-2 font-bold text-xs transition-colors ${isDarkMode ? "hover:text-white" : "hover:text-black"}`}>
                    Sort by: <span className="capitalize">{sortOption}</span> <ChevronDown className={`w-3.5 h-3.5 stroke-[3] transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSortOpen && (
                    <div className={`absolute top-full right-0 mt-4 w-56 rounded-[20px] border p-2 shadow-2xl z-50 animate-dropdown-morph ${isDarkMode ? "bg-[#222222]/90 border-white/10 text-white" : "bg-white/90 border-black/10 text-black"}`}>
                    {['default', 'newest', 'oldest', 'popular', 'least'].map((option) => (
                        <button key={option} onClick={() => handleSortSelect(option as SortOptionType)} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${sortOption === option ? (isDarkMode ? "bg-white/10 text-white" : "bg-black/5 text-black") : "hover:bg-black/5 hover:pl-3"}`}>
                        <span className="capitalize">{option}</span>
                        {sortOption === option && <Check className="w-4 h-4 text-green-500" />}
                        </button>
                    ))}
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== POSTS LIST ===== */}
          {/* FIX: Reverted to COMPACT / FITTED view (mx-8, p-5, h-280px) */}
          {sortedPosts.map(post => (
            <div key={post.id} className={`mx-8 mt-4 mb-8 rounded-[20px] border p-5 flex flex-col lg:flex-row gap-6 min-h-[400px] transition-colors duration-300 items-stretch ${isDarkMode ? "bg-[#393A2C] border-black" : "bg-[#F8FDEB] border-black"}`}>
              
              {/* LEFT: POST CONTENT */}
              <div className="flex flex-col w-full lg:w-[55%]">
                {/* User Row */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#A8A8A8] rounded-full border border-gray-400 flex items-center justify-center overflow-hidden">
                      {post.userProfilePicture ? (
                        <img 
                          src={post.userProfilePicture} 
                          alt={post.user} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) parent.innerHTML = '<img src="/pfp.svg" alt="User" class="w-full h-full object-cover" />';
                          }}
                        />
                      ) : (
                        <img src="/pfp.svg" alt="User" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="font-semibold text-lg">{post.user}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold italic ${isDarkMode ? "text-gray-400" : "text-black/60"}`}>{post.date}</span>
                    
                    {/* Post Menu Dropdown */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenPostMenuId(openPostMenuId === post.id ? null : post.id);
                        }}
                        className={`p-1.5 rounded-full transition-colors ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                        title="More options"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {/* Menu Dropdown */}
                      {openPostMenuId === post.id && (
                        <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 ${
                          isDarkMode ? 'bg-[#2a2a2a] border border-gray-600' : 'bg-white border border-gray-200'
                        }`}>
                        <div className="py-1">
                          {/* Report Post */}
                          <button
                            onClick={() => {
                              setReportContentType('post');
                              setReportContentId(post.postId || post.id);
                              setReportUserId(post.userId || '');
                              setShowReportModal(true);
                            }}
                            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2.5 ${
                              isDarkMode ? 'hover:bg-[#3a3a3a] text-white' : 'hover:bg-[#D4DEC3] text-gray-900'
                            }`}
                          >
                            <Flag className="w-4 h-4" />
                            <span className="text-sm font-medium">Report Post</span>
                          </button>
                          
                          {/* Verify Species (Experts only) */}
                          {isExpert && (
                            <button
                              onClick={() => {
                                setSelectedPostForVerification(post);
                                setShowVerifyModal(true);
                              }}
                              className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2.5 ${
                                isDarkMode ? 'hover:bg-[#3a3a3a] text-white' : 'hover:bg-[#D4DEC3] text-gray-900'
                              }`}
                            >
                              <Shield className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium">Verify Species</span>
                            </button>
                          )}
                          
                          {/* Delete Post (Moderators only) */}
                          {isModerator && (
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2.5 ${
                                isDarkMode ? 'hover:bg-red-900/50 text-white' : 'hover:bg-red-100 text-red-600'
                              }`}
                            >
                              <X className="w-4 h-4" />
                              <span className="text-sm font-medium">Delete Post</span>
                            </button>
                          )}
                        </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <h2 className="font-extrabold text-2xl mb-3 leading-tight">{post.heading}</h2>
                
                {post.image ? (
                  <div 
                    className="w-full h-[280px] rounded-[20px] mb-4 shadow-inner relative overflow-hidden border cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => openLightbox(post.image!)}
                  >
                    <img src={post.image} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`w-full h-[280px] rounded-[20px] mb-4 shadow-inner ${isDarkMode ? "bg-[#888]" : "bg-[#C4C4C4]"}`}></div>
                )}
                
                <p className="text-base font-medium mb-4">{post.caption}</p>

                <div className="flex items-center gap-2 mt-auto justify-between">
                  <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full px-2 py-1 bg-[#E0E0E0]/50 h-8 min-w-max">
                    <button onClick={() => handlePostVote(post.id, 'up')} className={`p-0.5 rounded-full transition-colors flex items-center justify-center ${post.vote === 'up' ? "bg-white/50" : "hover:bg-black/5"}`}><ArrowBigUp className={`w-5 h-5 ${post.vote === 'up' ? "text-[#00C92C] fill-[#00C92C]" : "text-[#00C92C]"}`} /></button>
                    <span className={`font-bold text-sm leading-none pt-0.5 px-1 text-center ${isDarkMode ? "text-white" : "text-black"}`}>{formatVoteCount(post.upvotes)}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full px-2 py-1 bg-[#E0E0E0]/50 h-8 min-w-max">
                    <button onClick={() => handlePostVote(post.id, 'down')} className={`p-0.5 rounded-full transition-colors flex items-center justify-center ${post.vote === 'down' ? "bg-white/50" : "hover:bg-black/5"}`}><ArrowBigDown className={`w-5 h-5 ${post.vote === 'down' ? "text-[#FF4C4C] fill-[#FF4C4C]" : "text-[#FF4C4C]"}`} /></button>
                    <span className={`font-bold text-sm leading-none pt-0.5 px-1 text-center ${isDarkMode ? "text-white" : "text-black"}`}>{formatVoteCount(post.downvotes)}</span>
                  </div>
                  <button 
                    onClick={() => { setActivePostId(post.id); setTimeout(() => document.getElementById(`comment-input-${post.id}`)?.focus(), 10); }} 
                    className="flex items-center gap-1.5 rounded-full px-2 py-1 shadow-sm bg-[#D9D9D9] hover:bg-blue-200 transition-colors h-8"
                  >
                    <MessageCircle className="w-4 h-4 text-[#0057FF] -scale-x-100 stroke-[2.5]" />
                    <span className="font-bold text-xs text-gray-700">{post.comments.length}</span>
                  </button>
                  </div>
                  {post.location && (
                    <button 
                      onClick={() => {
                        setSelectedLocation({
                          name: post.location!,
                          lat: post.latitude || 0,
                          lng: post.longitude || 0
                        });
                        setShowLocationModal(true);
                      }} 
                      className="flex items-center gap-1.5 rounded-full px-2 py-1 shadow-sm bg-[#7D9B76] hover:bg-[#5A7353] transition-colors h-8"
                    >
                      <MapPin className="w-4 h-4 text-white stroke-[2.5]" />
                      <span className="font-bold text-xs text-white">Location</span>
                    </button>
                  )}
                </div>
              </div>

              <div className={`hidden lg:block w-[1px] self-stretch rounded-full ${isDarkMode ? "bg-white/40" : "bg-black/50"}`}></div>

              {/* RIGHT: COMMENTS (COMPACT) */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col w-full flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 shrink-0">
                    <h3 className="font-semibold text-2xl italic">Comments</h3>
                    <div className="w-6 h-6 bg-[#00CED1] rounded-full flex items-center justify-center text-black text-xs font-bold shadow-sm">{post.comments.length}</div>
                  </div>

                  <div className="flex flex-col gap-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar flex-1">
                    {post.comments.map((comment, index) => {
                      const isNextReply = post.comments[index + 1]?.isReply;
                      return (
                        <div key={comment.id} className={`relative flex gap-3 ${comment.isReply ? "pl-[36px]" : ""}`}>
                          {!comment.isReply && isNextReply && <div className="absolute left-[18px] top-[40px] bottom-0 w-[2px] bg-[#A8A8A8]"></div>}
                          {comment.isReply && (<><div className="absolute left-[18px] -top-4 h-[35px] w-[18px] border-l-[2px] border-b-[2px] rounded-bl-lg border-[#A8A8A8]"></div>{isNextReply && <div className="absolute left-[18px] top-[20px] h-[calc(100%+20px)] w-[2px] bg-[#A8A8A8]"></div>}</>)}
                          <div className="w-9 h-9 bg-[#A8A8A8] rounded-full border border-gray-400 shrink-0 relative z-10 flex items-center justify-center overflow-hidden">
                            {comment.userProfilePicture ? (
                              <img 
                                src={comment.userProfilePicture} 
                                alt={comment.user} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) parent.innerHTML = '<img src="/pfp.svg" alt="User" class="w-full h-full object-cover" />';
                                }}
                              />
                            ) : (
                              <img src="/pfp.svg" alt="User" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="font-normal text-sm">{comment.user}</span>
                              <span className="text-[10px] font-bold text-gray-400">{comment.date}</span>
                            </div>
                            
                            <p className="text-sm font-normal mb-1.5 leading-snug">
                              {comment.text.split(/(@[\w_]+)/g).map((part, i) => (
                                part.startsWith('@') 
                                ? <span key={i} className="font-bold text-blue-600">{part}</span> 
                                : <span key={i}>{part}</span>
                              ))}
                            </p>

                            {comment.image && (
                              <div className="mb-2 mt-1 relative h-24 w-full max-w-[200px] rounded-lg overflow-hidden border cursor-pointer hover:opacity-95 transition-opacity" onClick={() => openLightbox(comment.image!)}><img src={comment.image} alt="Attachment" className="absolute inset-0 w-full h-full object-cover" /></div>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 rounded-full px-1.5 py-0.5 bg-[#E0E0E0] h-6 min-w-max">
                                <button onClick={() => handleCommentVote(post.id, comment.id, 'up')} className="hover:bg-black/5 rounded-full p-0.5"><ArrowBigUp className={`w-3.5 h-3.5 ${comment.vote === 'up' ? "text-[#00C92C] fill-[#00C92C]" : "text-[#00C92C]"}`} /></button>
                                <span className="text-xs font-bold text-black px-0.5 text-center leading-none pt-0.5">{formatVoteCount(comment.upvotes)}</span>
                              </div>
                              <div className="flex items-center gap-1 rounded-full px-1.5 py-0.5 bg-[#E0E0E0] h-6 min-w-max">
                                <button onClick={() => handleCommentVote(post.id, comment.id, 'down')} className="hover:bg-black/5 rounded-full p-0.5"><ArrowBigDown className={`w-3.5 h-3.5 ${comment.vote === 'down' ? "text-[#FF4C4C] fill-[#FF4C4C]" : "text-[#FF4C4C]"}`} /></button>
                                <span className="text-xs font-bold text-black px-0.5 text-center leading-none pt-0.5">{formatVoteCount(comment.downvotes)}</span>
                              </div>
                              <button onClick={() => handleReplyClick(post.id, comment.id, comment.user)} className="text-[10px] px-3 py-1 h-6 rounded-[4px] font-bold bg-[#D9D9D9] hover:bg-gray-300 transition-colors">Reply</button>
                              <button 
                                onClick={() => {
                                  setReportContentType('comment');
                                  // Use commentId (UUID) if available, otherwise use id
                                  setReportContentId(comment.commentId || String(comment.id));
                                  setReportUserId(comment.userId || '');
                                  setShowReportModal(true);
                                }}
                                className="text-[10px] px-3 py-1 h-6 rounded-[4px] font-bold bg-red-100 hover:bg-red-200 text-red-600 transition-colors flex items-center gap-1"
                                title="Report comment"
                              >
                                <Flag className="w-3 h-3" />
                                Report
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* COMMENT INPUT (COMPACT) */}
                <div className="w-full pt-3 mt-4 flex flex-col gap-2 shrink-0">
                  {activePostId === post.id && replyingToId !== null && (
                    <div className="flex items-center justify-between bg-blue-100/50 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-800 border border-blue-200 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-2"><Reply className="w-3 h-3" /><span>Replying to {replyingToUser}</span></div>
                      <button onClick={cancelReply} className="hover:bg-blue-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                    </div>
                  )}
                  
                  {activePostId === post.id && attachedCommentImage && (
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden border self-start">
                      <img src={attachedCommentImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      <button onClick={() => setAttachedCommentImage(null)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"><X className="w-3 h-3" /></button>
                    </div>
                  )}

                  <div className={`flex items-center gap-3 border-[2px] rounded-[15px] px-3 py-2 shadow-sm min-h-[50px] relative transition-colors ${isDarkMode ? "bg-[#595A4A] border-[#95AB33]" : "bg-white border-[#95AB33]"}`}>
                    <div className="w-8 h-8 bg-[#A8A8A8] rounded-full border border-gray-300 shrink-0 flex items-center justify-center overflow-hidden">
                      {currentUserProfilePicture ? (
                        <img 
                          src={currentUserProfilePicture} 
                          alt="You" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) parent.innerHTML = '<img src="/pfp.svg" alt="User" class="w-full h-full object-cover" />';
                          }}
                        />
                      ) : (
                        <img src="/pfp.svg" alt="User" className="w-full h-full object-cover" />
                      )}
                    </div>
                    
                    <textarea
                      id={`comment-input-${post.id}`}
                      value={activePostId === post.id ? newCommentText : ""}
                      onChange={(e) => {
                        if (activePostId !== post.id) {
                           setActivePostId(post.id);
                           setReplyingToId(null); 
                           setAttachedCommentImage(null);
                        }
                        setNewCommentText(e.target.value);
                      }}
                      onKeyDown={(e) => handleCommentKeyDown(e, post.id)}
                      onFocus={() => setActivePostId(post.id)}
                      placeholder={activePostId === post.id && replyingToId ? `Reply to ${replyingToUser}...` : "Write your thoughts here..."}
                      rows={1}
                      className={`flex-1 bg-transparent outline-none text-sm font-poppins italic resize-none py-1.5 ${isDarkMode ? "text-white placeholder:text-gray-300" : "text-black placeholder:text-gray-400"}`}
                    />
                    
                    <input type="file" accept="image/*" ref={commentFileInputRef} onChange={handleCommentFileSelect} className="hidden" />
                    
                    <button onClick={() => { setActivePostId(post.id); commentFileInputRef.current?.click(); }} className="bg-blue-100 p-1.5 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors shrink-0"><ImageIcon className="w-4 h-4 text-[#0057FF]" /></button>
                    <button onClick={() => handlePostComment(post.id)} disabled={activePostId !== post.id || (!newCommentText.trim() && !attachedCommentImage)} className={`p-1.5 rounded-lg transition-colors shrink-0 ${(activePostId === post.id && (newCommentText.trim() || attachedCommentImage)) ? "bg-[#00C92C] hover:bg-green-600 text-white cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}><Send className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MEMBERS MODAL (MODERATOR: REMOVE BUTTON) */}
      {isMembersModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosingModal ? 'opacity-0' : 'opacity-100'}`} onClick={() => closeModal(setIsMembersModalOpen)}/>
          <div className="relative w-full max-w-lg" style={{ transformOrigin: `${modalOrigin.x}px ${modalOrigin.y}px` }}>
             <div className={`w-full rounded-[40px] border p-8 shadow-2xl max-h-[80vh] flex flex-col ${isClosingModal ? 'animate-bubbly-out' : 'animate-bubbly-in'} ${isDarkMode ? "bg-[#222222] border-white/20 text-white" : "bg-[#F8FDEB] border-black/10 text-black"}`}>
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex items-center gap-3"><Users className="w-8 h-8 text-[#5E5CE6]" /><h2 className="font-extrabold text-2xl italic">Members</h2></div>
                <button onClick={() => closeModal(setIsMembersModalOpen)} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                {membersList.map((member) => (
                    <div key={member.id} className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#A8A8A8] rounded-full border border-gray-400 relative">{member.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00C92C] rounded-full border-2 border-white"></div>}</div>
                            <div><p className="font-bold text-lg">{member.name}</p>{member.role === 'moderator' ? (<span className="text-xs font-bold text-blue-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Moderator</span>) : (<span className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Member</span>)}</div>
                        </div>
                        {isModerator && member.role !== 'moderator' && (<button onClick={() => handleRemoveMember(member.id)} className="p-2 text-red-400 hover:bg-red-100/20 hover:text-red-500 rounded-full transition-colors" title="Remove Member"><UserMinus className="w-5 h-5" /></button>)}
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE POST MODAL */}
      <CreatePostModal
        isDarkMode={isDarkMode}
        isOpen={isCreatePostOpen}
        isClosing={isClosingModal}
        onClose={() => closeModal(setIsCreatePostOpen)}
        onCreate={handleCreatePost}
        modalOrigin={modalOrigin}
        communityId={communityId}
      />

      {lightboxImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"><X className="w-10 h-10" /></button>
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}><img src={lightboxImage} alt="Full view" className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl" /></div>
        </div>
      )}

      {/* LEAVE COMMUNITY CONFIRMATION MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full shadow-2xl ${isDarkMode ? 'bg-[#333333]' : 'bg-white'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Leave Community?</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to leave <span className="font-semibold">{communityData?.community_name}</span>? You can always rejoin later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className={`flex-1 py-2.5 rounded-full font-semibold transition-all ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveCommunity}
                className="flex-1 py-2.5 rounded-full font-semibold bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl text-center ${isDarkMode ? 'bg-[#333333]' : 'bg-white'}`}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>Success!</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {successMessage}
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 rounded-full font-semibold bg-[#0057FF] text-white hover:bg-[#0046CC] transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* SVG FILTERS */}
      <svg className="hidden">
        <defs>
          <filter id="shadowed-goo">
             <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
             <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
             <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
             <feColorMatrix in="shadow" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2" result="shadow" />
             <feOffset in="shadow" dx="1" dy="1" result="shadow" />
             <feComposite in2="shadow" in="goo" result="goo" />
             <feComposite in2="goo" in="SourceGraphic" result="mix" />
          </filter>
          <filter id="goo">
             <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
             <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
             <feComposite in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteModal(false);
              setPostToDelete(null);
            }}
          />
          <div className="relative w-full max-w-md">
            <div 
              className={`w-full rounded-[40px] border shadow-2xl p-8 flex flex-col items-center animate-genie-in ${
                isDarkMode ? "bg-[#222222] border-white/20 text-white" : "bg-[#F8FDEB] border-black/10 text-black"
              }`}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                isDarkMode ? 'bg-red-600' : 'bg-red-500'
              }`}>
                <span className="text-5xl text-white">⚠</span>
              </div>
              <h2 className="font-extrabold text-2xl mb-2 text-center">Delete Post?</h2>
              <p className="text-center mb-6 opacity-80">Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPostToDelete(null);
                  }}
                  className={`flex-1 px-6 py-3 rounded-full font-bold transition-colors ${
                    isDarkMode
                      ? 'bg-[#333] border-2 border-gray-600 text-white hover:bg-[#444]'
                      : 'bg-white border-2 border-gray-300 text-black hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePost}
                  className="flex-1 px-6 py-3 rounded-full font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE COMMUNITY CONFIRMATION MODAL */}
      {showDeleteCommunityModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteCommunityModal(false)}
          />
          <div className="relative w-full max-w-md">
            <div 
              className={`w-full rounded-[40px] border shadow-2xl p-8 flex flex-col items-center animate-genie-in ${
                isDarkMode ? "bg-[#222222] border-white/20 text-white" : "bg-[#F8FDEB] border-black/10 text-black"
              }`}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                isDarkMode ? 'bg-red-600' : 'bg-red-500'
              }`}>
                <span className="text-5xl text-white">⚠</span>
              </div>
              <h2 className="font-extrabold text-2xl mb-2 text-center">Delete Community?</h2>
              <p className="text-center mb-6 opacity-80">
                Are you sure you want to delete this entire community? This will permanently delete all posts, comments, and members. This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteCommunityModal(false)}
                  className={`flex-1 px-6 py-3 rounded-full font-bold transition-colors ${
                    isDarkMode
                      ? 'bg-[#333] border-2 border-gray-600 text-white hover:bg-[#444]'
                      : 'bg-white border-2 border-gray-300 text-black hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCommunity}
                  className="flex-1 px-6 py-3 rounded-full font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete Community
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOCATION MODAL */}
      {showLocationModal && selectedLocation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowLocationModal(false);
              setSelectedLocation(null);
            }}
          />
          <div className="relative w-full max-w-3xl">
            <div 
              className={`w-full rounded-[40px] border shadow-2xl p-8 flex flex-col animate-genie-in ${
                isDarkMode ? "bg-[#222222] border-white/20 text-white" : "bg-[#F8FDEB] border-black/10 text-black"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-[#7D9B76]' : 'bg-[#7D9B76]'
                  }`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-2xl">Post Location</h2>
                    <p className="text-sm opacity-70">{selectedLocation.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowLocationModal(false);
                    setSelectedLocation(null);
                  }}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Map Container */}
              <div className="w-full h-[400px] rounded-[20px] overflow-hidden border-2 border-black/10 mb-4">
                <div id="location-modal-map" className="w-full h-full" />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLocationModal(false);
                    setSelectedLocation(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-full font-bold bg-[#7D9B76] text-white hover:bg-[#5A7353] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportContentId('');
          setReportUserId('');
        }}
        contentType={reportContentType}
        contentId={reportContentId}
        reportedUserId={reportUserId}
        isDarkMode={isDarkMode}
      />

      {/* Verify Species Modal */}
      {showVerifyModal && selectedPostForVerification && (
        <VerifySpeciesModal
          isOpen={showVerifyModal}
          postId={selectedPostForVerification.postId || selectedPostForVerification.id}
          postTitle={selectedPostForVerification.heading}
          postImage={selectedPostForVerification.image}
          onClose={() => {
            setShowVerifyModal(false);
            setSelectedPostForVerification(null);
          }}
          onVerified={async () => {
            setShowVerifyModal(false);
            setSelectedPostForVerification(null);
            // Refresh posts to update verification status
            window.location.reload();
          }}
          isDarkMode={isDarkMode}
        />
      )}

    </div>
  );
}

// --- WRAPPER FOR ASYNC PARAMS ---
function CommunityPageWrapper({ communityId }: { communityId: string }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      return stored === 'true';
    }
    return false;
  }); 
  const toggleTheme = () => setIsDarkMode(prev => {
    const newValue = !prev;
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newValue.toString());
    }
    return newValue;
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <Header />
      <ModeratorPageContent communityId={communityId} />
    </ThemeContext.Provider>
  );
}

// --- ROOT COMPONENT ---
export default function ModeratorPage({ params }: { params: Promise<{ id: string }> }) {
  const [communityId, setCommunityId] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    params.then(({ id }) => setCommunityId(id));
  }, [params]);
  
  if (!communityId) return null;
  
  return (
    <ProtectedRoute>
      <CommunityPageWrapper communityId={communityId} />
    </ProtectedRoute>
  );
}