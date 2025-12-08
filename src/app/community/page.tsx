/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent, useMemo, useContext, createContext } from 'react';
import {
  MapPin, Users, Crown, Plus, ChevronDown, ArrowBigUp, ArrowBigDown,
  MessageCircle, Image as ImageIcon, Send, X, Reply, UploadCloud, Check, Sun, Moon, User, Edit2, ShieldCheck, UserMinus
} from "lucide-react";

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
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full h-[50px] border-b z-[100] flex items-center justify-between px-4 font-poppins shadow-sm transition-all duration-300 backdrop-blur-xl
      ${isDarkMode 
        ? 'bg-[#333333]/95 border-white/10' 
        : 'bg-[#E2DFC8]/95 border-black/5'}`}
    >
      <Link href="/" className="flex items-center gap-2">
        <img src="/spot icon.svg" alt="SPOT Icon" width={44} height={44} className={`object-contain ${isDarkMode ? "drop-shadow-[0_0_4px_white] brightness-110" : ""}`} />
        <span className={`text-4xl font-extrabold tracking-tighter drop-shadow-sm leading-none mt-1 ${isDarkMode ? 'text-[#4CA954]' : 'text-[#36683d]'}`}>SPOT</span>
      </Link>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center cursor-pointer h-9 mr-2" onClick={toggleTheme}>
          <div className={`w-[60px] h-9 rounded-full shadow-inner transition-colors duration-300 ${isDarkMode ? 'bg-[#3F3C56]' : 'bg-[#4B4A2C]'}`}></div>
          <div className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-md border-[2px] transition-all duration-300 ${isDarkMode ? 'left-[22px] bg-white border-[#333]' : '-left-1 bg-[#FFD500] border-[#E2DFC8]'}`}>
             {isDarkMode ? (<Moon className="w-6 h-6 text-[#3F3C56] fill-[#3F3C56]" />) : (<Sun className="w-6 h-6 text-[#F59E0B] fill-[#F59E0B]" />)}
          </div>
        </div>
        <ChevronDown className={`w-6 h-6 cursor-pointer stroke-[3] ${isDarkMode ? 'text-white' : 'text-black'}`} />
        <div className={`w-11 h-11 rounded-full flex items-center justify-center overflow-hidden border-[2px] shadow-sm cursor-pointer ${isDarkMode ? 'bg-[#9CA3AF] border-[#767D85]' : 'bg-[#B6BEC7] border-[#767D85]'}`}>
           <User className={`w-7 h-7 ${isDarkMode ? 'text-[#D1D5DB] fill-current' : 'text-[#7E868E] fill-current'}`} />
        </div>
      </div>
    </header>
  );
}

// --- TYPES ---
type Comment = {
  id: number;
  user: string;
  date: string;
  text: string;
  image?: string | null;
  vote: 'up' | 'down' | null;
  upvotes: number;
  downvotes: number;
  isReply: boolean;
};

type Post = {
  id: number;
  timestamp: number;
  user: string;
  date: string;
  heading: string;
  image?: string | null;
  caption: string;
  vote: 'up' | 'down' | null;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
};

type Member = { id: number; name: string; role: 'moderator' | 'member'; online: boolean; };
type SortOptionType = 'default' | 'newest' | 'oldest' | 'popular' | 'least';

// --- MAIN CONTENT COMPONENT ---
function ModeratorPageContent() {
  const { isDarkMode } = useTheme();

  // ===== STATE: MODERATOR MODE =====
  const isModerator = true; 

  // ===== STATE: COMMUNITY DATA =====
  const [communityBanner, setCommunityBanner] = useState('/landd.svg');
  const [communityProfile, setCommunityProfile] = useState('/binoculars.svg');
  const [communityLocation, setCommunityLocation] = useState('Cebu City, Philippines');

  // ===== STATE: EDITING =====
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocationText, setTempLocationText] = useState('');
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
  const [modalOrigin, setModalOrigin] = useState({ x: 0, y: 0 });
  
  const createPostBtnRef = useRef<HTMLButtonElement>(null);
  const membersBtnRef = useRef<HTMLButtonElement>(null);
  
  // New Post Form
  const [newPostHeading, setNewPostHeading] = useState("");
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const createPostFileInputRef = useRef<HTMLInputElement>(null);

  // ===== STATE: MEMBERS =====
  const [membersList, setMembersList] = useState<Member[]>([
    { id: 1, name: '@nature_explorer', role: 'moderator', online: true },
    { id: 2, name: '@cebu_pet_advocate', role: 'member', online: true },
    { id: 3, name: '@bio_student_cebu', role: 'member', online: false },
    { id: 4, name: '@snake_hunter_ph', role: 'member', online: true },
    { id: 5, name: '@newbie_hiker', role: 'member', online: false },
    { id: 6, name: '@bird_watcher_99', role: 'member', online: true },
    { id: 7, name: '@marine_life_fan', role: 'member', online: false },
    { id: 8, name: '@cebu_trekker', role: 'member', online: true },
    { id: 9, name: '@dog_lover_ph', role: 'member', online: false },
    { id: 10, name: '@cat_lady_cebu', role: 'member', online: true },
    { id: 11, name: '@wildlife_photog', role: 'member', online: false },
    { id: 12, name: '@forest_ranger_wannabe', role: 'member', online: true },
    { id: 13, name: '@mountain_goat', role: 'member', online: false },
    { id: 14, name: '@ocean_blue', role: 'member', online: true },
    { id: 15, name: '@green_earth', role: 'member', online: false },
  ]);

  // ===== STATE: POSTS =====
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 5,
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
      id: 4,
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
      id: 3,
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
      id: 2,
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
      id: 1,
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
  const [activePostId, setActivePostId] = useState<number | null>(null);
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
      case 'default': default: return sorted.sort((a, b) => b.id - a.id);
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
    }, 400);
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

  const handleCreatePost = () => {
    if (!newPostHeading.trim() && !newPostCaption.trim() && !newPostImage) return;
    const newPost: Post = {
      id: Date.now(),
      timestamp: Date.now(),
      user: '@currentUser',
      date: 'Just now',
      heading: newPostHeading,
      image: newPostImage,
      caption: newPostCaption,
      vote: null,
      upvotes: 0,
      downvotes: 0,
      comments: []
    };
    setPosts([newPost, ...posts]);
    closeModal(setIsCreatePostOpen);
  };

  const handlePostVote = (postId: number, type: 'up' | 'down') => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      let newVote = post.vote;
      let newUpvotes = post.upvotes;
      let newDownvotes = post.downvotes;
      if (post.vote === type) {
        newVote = null;
        if (type === 'up') newUpvotes--; else newDownvotes--;
      } else {
        if (post.vote === 'up') newUpvotes--;
        if (post.vote === 'down') newDownvotes--;
        newVote = type;
        if (type === 'up') newUpvotes++; else newDownvotes++;
      }
      return { ...post, vote: newVote, upvotes: newUpvotes, downvotes: newDownvotes };
    }));
  };

  const handleCommentVote = (postId: number, commentId: number, type: 'up' | 'down') => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      const updatedComments = post.comments.map(comment => {
        if (comment.id !== commentId) return comment;
        let newVote = comment.vote;
        let newUpvotes = comment.upvotes;
        let newDownvotes = comment.downvotes;
        if (comment.vote === type) {
          newVote = null;
          if (type === 'up') newUpvotes--; else newDownvotes--;
        } else {
          if (comment.vote === 'up') newUpvotes--;
          if (comment.vote === 'down') newDownvotes--;
          newVote = type;
          if (type === 'up') newUpvotes++; else newDownvotes++;
        }
        return { ...comment, vote: newVote, upvotes: newUpvotes, downvotes: newDownvotes };
      });
      return { ...post, comments: updatedComments };
    }));
  };

  const handleReplyClick = (postId: number, commentId: number, username: string) => {
    setActivePostId(postId);
    setReplyingToId(commentId);
    setReplyingToUser(username);
    const mentionText = `@${username.replace('@', '')} `;
    setNewCommentText(mentionText);
    setTimeout(() => {
        const input = document.getElementById(`comment-input-${postId}`) as HTMLTextAreaElement;
        if (input) {
            input.focus();
            const len = input.value.length;
            input.setSelectionRange(len, len);
        }
    }, 50);
  };

  const cancelReply = () => {
    setReplyingToId(null);
    setReplyingToUser('');
    setNewCommentText(''); 
  };

  const handlePostComment = (postId: number) => {
    if (!newCommentText.trim() && !attachedCommentImage) return;
    const newComment: Comment = {
      id: Date.now(),
      user: '@currentUser',
      date: 'Just now',
      text: newCommentText,
      image: attachedCommentImage,
      vote: null,
      upvotes: 0,
      downvotes: 0,
      isReply: replyingToId !== null, 
    };
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      const updatedComments = [...post.comments];
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
    cancelReply();
  };
  
  const handleCommentKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, postId: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePostComment(postId);
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
        
        {/* === INFO HEADER CARD === */}
        {/* FIX: Straight edges (rounded-none) */}
        <div className={`relative z-10 w-full transition-colors duration-300 flex-1 mb-0 flex flex-col min-h-[calc(100vh-70px)] ${isDarkMode ? "bg-[#222222] shadow-lg" : "bg-white shadow-sm"} rounded-none overflow-visible p-3`}>
          
          {/* ===== BANNER ===== */}
          {/* FIX: Width [95%] and mx-auto */}
          <div className="relative w-[95%] mx-auto h-[180px] shrink-0 group mt-3 rounded-[35px] overflow-hidden">
            <div className="w-full h-full cursor-pointer hover:opacity-95 transition-opacity" onClick={() => openLightbox(communityBanner)}>
              <img src={communityBanner} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-80" />
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
                <div className="w-full h-full bg-[#D9D9D9] flex items-center justify-center">
                    <img src={communityProfile} alt="Profile" className="w-full h-full object-contain p-6" />
                </div>
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
                  <h1 className={`text-4xl lg:text-5xl font-black tracking-tight leading-none whitespace-nowrap ${isDarkMode ? "text-white" : "text-black"}`}>Cebu Animal Identifier</h1>
                </div>

                <div>
                  {/* FIX: Font weight semibold, no italic, text-lg */}
                  <div className={`flex flex-wrap items-center gap-6 mt-6 font-semibold ${isDarkMode ? "text-gray-300" : "text-black"}`}>
                    <div className="flex items-center gap-2 text-lg"><Users className="w-5 h-5 text-[#5E5CE6]" /><span>12.5k members</span></div>
                    <div className="flex items-center gap-2 text-lg"><div className="w-3 h-3 bg-[#00C92C] rounded-full shadow-[0_0_8px_#00C92C]"></div><span>450 online</span></div>
                  </div>
                  
                  {/* ===== LOCATION SELECTOR (MODERATOR EDITABLE) ===== */}
                  <div className={`flex items-center gap-2 font-semibold text-lg mt-3 group w-fit min-h-[32px] ${isDarkMode ? "text-gray-300" : "text-black"}`}>
                    <MapPin className="w-5 h-5 text-[#FFD700] shrink-0" />
                    
                    {isEditingLocation ? (
                        <div className="relative">
                            <div className="flex items-center gap-2 animate-in fade-in">
                                <input 
                                    ref={locationInputRef}
                                    type="text" 
                                    value={tempLocationText}
                                    onChange={(e) => setTempLocationText(e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={(e) => { if(e.key === 'Enter') saveLocation(); if(e.key === 'Escape') cancelEditLocation(); }}
                                    className={`bg-transparent outline-none border-b-2 italic px-1 pr-4 ${isDarkMode ? "border-white text-white" : "border-black text-black"}`}
                                    placeholder="Search city..."
                                />
                                <button onClick={saveLocation} className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"><Check className="w-4 h-4" /></button>
                                <button onClick={cancelEditLocation} className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                            {/* DROPDOWN */}
                            <div className={`absolute top-full left-0 mt-2 w-72 max-h-60 overflow-y-auto rounded-xl border p-2 shadow-xl backdrop-blur-xl z-50 custom-scrollbar ${isDarkMode ? "bg-[#222222]/95 border-white/10" : "bg-white/95 border-black/5"}`}>
                                {filteredLocations.length > 0 ? (
                                    filteredLocations.map((loc) => (
                                        <button key={loc} onClick={() => setTempLocationText(loc)} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? "hover:bg-white/10 text-gray-200" : "hover:bg-black/5 text-gray-800"}`}>{loc}</button>
                                    ))
                                ) : (<div className="p-4 text-center text-sm opacity-50">No results found</div>)}
                            </div>
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

              {/* RIGHT SIDE ACTIONS (MODERATOR UI) */}
              <div className="flex flex-col items-end gap-4 shrink-0 pb-4">
                  
                 {/* MODERATOR BADGE */}
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
                
                {/* FIX: Create Post Font Semibold, Thinner padding */}
                <button 
                  ref={createPostBtnRef} 
                  onClick={openCreatePostModal}
                  className={`px-6 py-1.5 rounded-full font-semibold text-lg flex items-center gap-2 transition-all shadow-sm 
                  ${isDarkMode ? "bg-[#D9D9D9] text-black hover:bg-gray-400" : "bg-[#D9D9D9] text-black hover:bg-gray-300"}`}
                >
                  <div className="bg-[#0057FF] p-0.5 rounded text-white"><Plus className="w-5 h-5" /></div>
                  Create Post
                </button>
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
                    <div className="w-10 h-10 bg-[#A8A8A8] rounded-full border border-gray-400"></div>
                    <span className="font-semibold text-lg">{post.user}</span>
                  </div>
                  <span className={`text-xs font-bold italic ${isDarkMode ? "text-gray-400" : "text-black/60"}`}>{post.date}</span>
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

                <div className="flex items-center gap-2 mt-auto">
                  <div className="flex items-center gap-1 rounded-full px-2 py-1 bg-[#E0E0E0]/50 h-8 min-w-max">
                    <button onClick={() => handlePostVote(post.id, 'up')} className={`p-0.5 rounded-full transition-colors flex items-center justify-center ${post.vote === 'up' ? "bg-white/50" : "hover:bg-black/5"}`}><ArrowBigUp className={`w-5 h-5 ${post.vote === 'up' ? "text-[#00C92C] fill-[#00C92C]" : "text-[#00C92C]"}`} /></button>
                    <span className={`font-bold text-sm leading-none pt-0.5 px-1 text-center ${isDarkMode ? "text-white" : "text-black"}`}>{formatVoteCount(post.upvotes)}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full px-2 py-1 bg-[#E0E0E0]/50 h-8 min-w-max">
                    <button onClick={() => handlePostVote(post.id, 'down')} className={`p-0.5 rounded-full transition-colors flex items-center justify-center ${post.vote === 'down' ? "bg-white/50" : "hover:bg-black/5"}`}><ArrowBigDown className={`w-5 h-5 ${post.vote === 'down' ? "text-[#FF4C4C] fill-[#FF4C4C]" : "text-[#FF4C4C]"}`} /></button>
                    <span className={`font-bold text-sm leading-none pt-0.5 px-1 text-center ${isDarkMode ? "text-white" : "text-black"}`}>{formatVoteCount(post.downvotes)}</span>
                  </div>
                  <button onClick={() => { setActivePostId(post.id); setTimeout(() => document.getElementById(`comment-input-${post.id}`)?.focus(), 10); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm ml-2 bg-[#D9D9D9] hover:bg-blue-200 transition-colors"><MessageCircle className="w-5 h-5 text-[#0057FF] -scale-x-100 stroke-[2.5]" /></button>
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
                          <div className="w-9 h-9 bg-[#A8A8A8] rounded-full border border-gray-400 shrink-0 relative z-10"></div>
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
                    <div className="w-8 h-8 bg-[#A8A8A8] rounded-full border border-gray-300 shrink-0"></div>
                    
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
      {isCreatePostOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosingModal ? 'opacity-0' : 'opacity-100'}`} onClick={() => closeModal(setIsCreatePostOpen)}/>
          <div className="relative w-full max-w-3xl" style={{ transformOrigin: `${modalOrigin.x}px ${modalOrigin.y}px` }}>
             <div className={`w-full rounded-[40px] border p-8 shadow-2xl ${isClosingModal ? 'animate-genie-out' : 'animate-genie-in'} ${isDarkMode ? "bg-[#222222] border-white/20 text-white" : "bg-[#F8FDEB] border-black/10 text-black"}`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4"><div className="w-14 h-14 bg-[#A8A8A8] rounded-full border border-gray-400"></div><h2 className="font-extrabold text-3xl italic">Create Post</h2></div>
                <button onClick={() => closeModal(setIsCreatePostOpen)} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X className="w-8 h-8" /></button>
              </div>
              <div className="flex flex-col gap-6">
                <div><input type="text" placeholder="Heading" value={newPostHeading} onChange={(e) => setNewPostHeading(e.target.value)} className={`w-full text-3xl font-extrabold bg-transparent outline-none placeholder:italic ${isDarkMode ? "placeholder:text-gray-500" : "placeholder:text-gray-400"}`}/><div className="h-[2px] w-full bg-black/10 mt-2"></div></div>
                <div onClick={() => createPostFileInputRef.current?.click()} className={`w-full h-[300px] rounded-[30px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors relative overflow-hidden ${isDarkMode ? "border-gray-600 bg-[#333]" : "border-gray-300 bg-[#EFEFEF]"}`}>{newPostImage ? <img src={newPostImage} alt="Upload preview" className="absolute inset-0 w-full h-full object-cover" /> : <><UploadCloud className="w-16 h-16 text-gray-400 mb-2" /><span className="font-bold text-gray-400">Click to upload image</span></>}<input type="file" accept="image/*" ref={createPostFileInputRef} onChange={handleCreatePostFileSelect} className="hidden" /></div>
                <textarea placeholder="Write a caption..." rows={3} value={newPostCaption} onChange={(e) => setNewPostCaption(e.target.value)} className={`w-full text-lg font-bold bg-transparent outline-none resize-none placeholder:italic ${isDarkMode ? "placeholder:text-gray-500" : "placeholder:text-gray-400"}`}/>
                <div className="flex justify-end gap-4 mt-2"><button onClick={() => closeModal(setIsCreatePostOpen)} className="px-8 py-3 rounded-full font-bold text-gray-500 hover:bg-black/5 transition-colors">Cancel</button><button onClick={handleCreatePost} disabled={!newPostHeading.trim() && !newPostCaption.trim() && !newPostImage} className={`px-12 py-3 rounded-full font-extrabold text-xl shadow-lg transition-all ${(!newPostHeading.trim() && !newPostCaption.trim() && !newPostImage) ? "bg-gray-400 cursor-not-allowed" : "bg-[#00C92C] text-white hover:bg-green-600 hover:scale-105"}`}>Post</button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {lightboxImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"><X className="w-10 h-10" /></button>
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}><img src={lightboxImage} alt="Full view" className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl" /></div>
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

    </div>
  );
}

// --- ROOT COMPONENT ---
export default function ModeratorPage() {
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <Header />
      <ModeratorPageContent />
    </ThemeContext.Provider>
  );
}