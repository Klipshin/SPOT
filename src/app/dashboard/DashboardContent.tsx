'use client';

import { useState, useRef, ChangeEvent, KeyboardEvent, useEffect, useCallback } from 'react';
import { Search, MapPin, Edit, MessageCircle, TrendingUp, MoreHorizontal, ChevronDown, User, ArrowBigUp, ArrowBigDown, Briefcase } from 'lucide-react';
import { Settings, HelpCircle, LogOut, Clock, Loader2, Plus } from 'lucide-react';
import { Share2, Flag, EyeOff, X, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/client';
import { useCommunities } from '@/src/lib/hooks/useCommunities';
import CreateCommunityModal from '@/src/components/CreateCommunityModal';
import { communityService } from '@/src/lib/services';

// IMPORTANT: Import the useSupabase hook (Assuming its location)
import { useSupabase } from '@/src/components/providers/SupabaseProvider'; 

// --- START: Types ---
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

// Updated Post type to use string/UUID for id
type ClientPost = {
  id: string; 
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
  scientificName: string;
  communityId?: string;
  communityName?: string;
  communityProfilePicture?: string;
  flairNames?: string[];
  userId?: string;
  authorUsername?: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

// FIX: Updated Supabase Post structure for fetching to treat joined fields as arrays
type PostWithDetails = {
    post_id: string; // Use UUID for Supabase
    title: string;
    content: string;
    created_at: string;
    media_url: string | null;
    
    // FIX: Must be an array of user profiles (or null)
    user_profiles: { 
      username: string;
      profile_picture: string | null;
    }[] | null; 

    // FIX: Must be an array of identifications (or null)
    identifications: {
      image_url: string | null;
      confidence_score: number | null;
      
      // FIX: Nested species data is also returned as an ARRAY of objects or null
      species: { 
        scientific_name: string | null;
        common_name: string | null;
      }[] | null; 
      
    }[] | null; 
    
    votes?: any[]; 
    comments?: any[]; 
};
// --- END: Types ---

// Note: Dynamic config handled in page.tsx wrapper

// --- START: Supabase Data Fetching Hook ---
function useAllPosts() {
    const { session, isLoaded } = useSupabase();
    const [posts, setPosts] = useState<PostWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useCallback is used to memoize fetchPosts, ensuring it's not redefined on every render
    const fetchPosts = useCallback(async () => {
        if (!session) return;
        
        setIsLoading(true);
        
        try {
          // Fetch posts from user's communities via API
          const response = await fetch('/api/posts/feed');
          
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          
          const data = await response.json();
          setPosts(data.posts || []);
          setError(null);
        } catch (fetchError: any) {
          console.error("Error fetching posts:", fetchError);
          setError(fetchError.message);
          setPosts([]);
        }
        
        setIsLoading(false);
    }, [session]);

    useEffect(() => {
        if (!isLoaded || !session) return;
        fetchPosts();
    }, [session, isLoaded, fetchPosts]);

    return { posts, isLoading, error, fetchPosts };
}
// --- END: Supabase Data Fetching Hook ---

export default function Dashboard() {
  const router = useRouter();
  
  // *** SUPABASE INTEGRATION & DATA ***
  const { session, isLoaded: supabaseLoaded, supabase } = useSupabase(); 
  console.log('Dashboard mounted - isLoaded:', supabaseLoaded, 'hasSession:', !!session);

useEffect(() => {
  console.log('Supabase state changed:', { 
    supabaseLoaded, 
    hasSession: !!session,
    sessionUser: session?.user?.email 
  });
}, [supabaseLoaded, session]);
  const { posts: fetchedPosts, isLoading: postsLoading, error: postsError, fetchPosts } = useAllPosts();
  
  const currentUserId = session?.user.id;
  const currentUsername = session?.user.user_metadata?.username || session?.user.email?.split('@')[0] || 'Guest';
  const currentEmail = session?.user.email || 'N/A';

  // State for user profile data
  const [userProfile, setUserProfile] = useState<{ name: string; location: string; occupation: string; profile_picture: string | null } | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUserId) return;
      
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('user_profiles')
          .select('name, location, profile_picture')
          .eq('user_id', currentUserId)
          .single();

        if (data) {
          console.log('User profile data:', data);
          setUserProfile({
            name: data.name || 'Full Name',
            location: data.location || 'Location not set',
            occupation: 'Wildlife Enthusiast', // Default occupation
            profile_picture: data.profile_picture
          });
        }

        // Fetch expert data if exists
        const { data: expertData } = await supabase
          .from('experts')
          .select('occupation')
          .eq('user_id', currentUserId)
          .single();

        if (expertData) {
          setUserProfile(prev => prev ? { ...prev, occupation: expertData.occupation } : null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [currentUserId]);

  // Fetch user's communities from Supabase
  const { userCommunities, loading: communitiesLoading } = useCommunities();

  // Debug logging
  useEffect(() => {
    console.log('Dashboard userCommunities updated:', { count: userCommunities.length, communities: userCommunities });
  }, [userCommunities]);

  // --- State Hooks ---
  const [activePost, setActivePost] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPostForComment, setSelectedPostForComment] = useState<ClientPost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [attachedCommentImage, setAttachedCommentImage] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyingToUser, setReplyingToUser] = useState<string>('');
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isClosingCommunityModal, setIsClosingCommunityModal] = useState(false);
  const [modalOrigin, setModalOrigin] = useState({ x: 0, y: 0 });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>({ communities: [], people: [], flairs: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedFlair, setSelectedFlair] = useState<string | null>(null);

  const commentFileInputRef = useRef<HTMLInputElement>(null);
  const createCommunityBtnRef = useRef<HTMLButtonElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    }
  }, []);
  
  const community = [
    { id: 1, name: "Wildlife Watchers", color: "bg-green-100" },
    { id: 2, name: "Trail Explorers", color: "bg-amber-100" },
    { id: 3, name: "Bird Spotters", color: "bg-blue-100" },
    { id: 4, name: "Snake Finders", color: "bg-yellow-100" }
  ];

  // Flair metadata with emojis and colors
  const flairMetadata: Record<string, { emoji: string; color: string }> = {
    'Reptiles': { emoji: '🦎', color: 'bg-green-100' },
    'Birds': { emoji: '🦅', color: 'bg-blue-100' },
    'Mammals': { emoji: '🦁', color: 'bg-amber-100' },
    'Amphibians': { emoji: '🐸', color: 'bg-emerald-100' },
    'Fish': { emoji: '🐠', color: 'bg-cyan-100' },
    'Insects': { emoji: '🦋', color: 'bg-yellow-100' },
    'Arachnids': { emoji: '🕷️', color: 'bg-purple-100' },
    'Mollusks': { emoji: '🐚', color: 'bg-pink-100' },
    'Crustaceans': { emoji: '🦀', color: 'bg-orange-100' },
    'Plants': { emoji: '🌿', color: 'bg-lime-100' },
    'Fungi': { emoji: '🍄', color: 'bg-red-100' },
    'Other': { emoji: '🔍', color: 'bg-gray-100' }
  };

  // State for popular flairs
  const [popularFlairs, setPopularFlairs] = useState<Array<{ name: string; count: number; emoji: string; color: string }>>([]);
  
  // Client-side state for rendering posts (initial dummy data uses UUID string)
  const [clientPosts, setClientPosts] = useState<ClientPost[]>([]);

  // Effect to calculate popular flairs from posts
  useEffect(() => {
    if (fetchedPosts.length > 0) {
      // Count posts per flair
      const flairCounts: Record<string, number> = {};
      
      fetchedPosts.forEach((post: any) => {
        if (post.flairNames && Array.isArray(post.flairNames)) {
          post.flairNames.forEach((flair: string) => {
            flairCounts[flair] = (flairCounts[flair] || 0) + 1;
          });
        }
      });

      // Convert to array and sort by count
      const sortedFlairs = Object.entries(flairCounts)
        .map(([name, count]) => ({
          name,
          count,
          emoji: flairMetadata[name]?.emoji || '🔥',
          color: flairMetadata[name]?.color || 'bg-gray-100'
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6); // Top 6 flairs

      setPopularFlairs(sortedFlairs);
    }
  }, [fetchedPosts]);

  // Effect to map Supabase data to your client-side state structure and fetch comments
  useEffect(() => {
      if (fetchedPosts.length > 0) {
          const mappedPosts: ClientPost[] = fetchedPosts.map((p: any) => ({
              id: p.post_id,
              timestamp: new Date(p.created_at).getTime(),
              user: `@${p.user_profiles?.username || 'unknown'}`, 
              date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              heading: p.title,
              caption: p.content,
              image: p.media_url || p.identifications?.[0]?.image_url || null, 
              scientificName: p.identifications?.[0]?.species?.[0]?.scientific_name || 'Unidentified Species',
              vote: null,
              upvotes: p.upvotes || 0, 
              downvotes: p.downvotes || 0,
              comments: [],
              communityId: p.communities?.community_id,
              communityName: p.communities?.community_name,
              communityProfilePicture: p.communities?.profile_picture,
              flairNames: p.flairNames || [],
              userId: p.user_id,
              authorUsername: p.user_profiles?.username,
              location: p.location || null,
              latitude: p.latitude || null,
              longitude: p.longitude || null
          }));
          setClientPosts(mappedPosts);
          
          // Fetch comments for each post
          mappedPosts.forEach(async (post) => {
            try {
              const response = await fetch(`/api/posts/${post.id}/comments`);
              if (response.ok) {
                const { comments } = await response.json();
                const mappedComments: Comment[] = comments.map((c: any) => ({
                  id: c.comment_id,
                  user: `@${c.user_profiles?.username || 'user'}`,
                  date: formatTimeAgo(c.created_at),
                  text: c.content,
                  image: c.media_url,
                  vote: null,
                  upvotes: 0,
                  downvotes: 0,
                  isReply: c.parent_comment_id !== null,
                }));
                
                setClientPosts(prevPosts => prevPosts.map(p => 
                  p.id === post.id ? { ...p, comments: mappedComments } : p
                ));
              }
            } catch (error) {
              console.error(`Error fetching comments for post ${post.id}:`, error);
            }
          });
      }
  }, [fetchedPosts]);

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

      const mapContainer = document.getElementById('dashboard-location-modal-map');
      if (!mapContainer) return;

      // Remove existing map instance if any
      if ((mapContainer as any)._leaflet_id) {
        const existingMap = (mapContainer as any)._leaflet_map;
        if (existingMap) {
          existingMap.remove();
        }
      }

      // Create new map
      const map = L.map('dashboard-location-modal-map').setView([selectedLocation.lat, selectedLocation.lng], 13);
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
      const mapContainer = document.getElementById('dashboard-location-modal-map');
      if (mapContainer && (mapContainer as any)._leaflet_map) {
        (mapContainer as any)._leaflet_map.remove();
        delete (mapContainer as any)._leaflet_map;
      }
    };
  }, [showLocationModal, selectedLocation]);


  // --- Handlers (CRUD Placeholders) ---
  
  // Search handlers
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query || query.length < 1) {
      setSearchResults({ communities: [], people: [], flairs: [] });
      return;
    }

    setIsSearching(true);
    try {
      const type = activeTab === 'All' ? 'all' : activeTab.toLowerCase();
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
      const data = await response.json();
      console.log('Search results for', query, ':', data);
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const addToRecentSearches = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const handleSearchSelect = (query: string, type: 'community' | 'person' | 'flair', id?: string) => {
    addToRecentSearches(query);
    setIsOpen(false);
    
    if (type === 'community' && id) {
      router.push(`/community/${id}`);
    } else if (type === 'flair') {
      setSelectedFlair(query);
      // Reload posts filtered by flair
      fetchPostsByFlair(query);
    }
  };

  const fetchPostsByFlair = async (flairName: string) => {
    try {
      const response = await fetch(`/api/posts/by-flair?flair=${encodeURIComponent(flairName)}`);
      const data = await response.json();
      if (data.posts) {
        // Trigger a manual re-fetch by updating the posts state
        // Note: This is a workaround since fetchPosts doesn't accept parameters
        router.push(`?flair=${encodeURIComponent(flairName)}`);
      }
    } catch (error) {
      console.error('Error fetching posts by flair:', error);
    }
  };

  const clearFlairFilter = () => {
    setSelectedFlair(null);
    fetchPosts(); // Reload all posts
  };

  const handleFlairClick = (flairName: string) => {
    setSelectedFlair(flairName);
    fetchPostsByFlair(flairName);
  };

  const handleDeletePost = async (postId: string, post: ClientPost) => {
    const isAuthor = post.userId === currentUserId;
    
    let reason = null;
    if (!isAuthor) {
      // Moderator deleting someone else's post - ask for reason
      reason = prompt('Please provide a reason for deleting this post:');
      if (reason === null) return; // User cancelled
    }

    if (!confirm(`Are you sure you want to delete this post?${!isAuthor ? ' This action will be logged.' : ''}`)) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to delete post');
        return;
      }

      // Remove post from UI
      setClientPosts(prev => prev.filter(p => p.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleCommentFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAttachedCommentImage(imageUrl);
    }
  };

  const handleReplyClick = (postId: string, commentId: number, username: string) => {
    setActivePost(postId);
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

  const cancelReply = () => {
    setReplyingToId(null);
    setReplyingToUser('');
    setNewCommentText('');
    setAttachedCommentImage(null);
  };

  // ===== CREATE COMMUNITY HANDLERS =====
  const openCreateCommunityModal = () => {
    if (createCommunityBtnRef.current) {
      const rect = createCommunityBtnRef.current.getBoundingClientRect();
      setModalOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setIsCreateCommunityOpen(true);
    setIsClosingCommunityModal(false);
  };

  const closeCreateCommunityModal = () => {
    setIsClosingCommunityModal(true);
    setTimeout(() => {
      setIsCreateCommunityOpen(false);
      setIsClosingCommunityModal(false);
    }, 400);
  };

  const handleJoinCommunity = async (communityId: string) => {
    if (!currentUserId) {
      alert('You must be logged in to join a community');
      return;
    }

    try {
      const response = await fetch('/api/communities/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ communityId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to join community');
      }

      // Refresh the page to update communities list
      router.refresh();
    } catch (error: any) {
      console.error('Error joining community:', error);
      alert(error.message || 'Failed to join community. Please try again.');
    }
  };

  const handleCreateCommunity = async (data: { communityName: string; location: string; bannerImage?: string; profileImage?: string }) => {
    if (!currentUserId) {
      alert('You must be logged in to create a community');
      return;
    }

    try {
      const response = await fetch('/api/communities/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          community_name: data.communityName,
          location: data.location || null,
          banner_image: data.bannerImage || null,
          profile_picture: data.profileImage || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create community');
      }

      // Close modal first
      closeCreateCommunityModal();
      
      // Wait a bit then refresh to ensure modal closes smoothly
      setTimeout(() => {
        router.refresh();
      }, 500);
      
    } catch (error: any) {
      console.error('Error creating community:', error);
      const errorMessage = error?.message || 'Failed to create community. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  // ===== SUPABASE HANDLER FOR COMMENTS =====
  const handlePostComment = async (postId: string) => {
    if (!newCommentText.trim() && !attachedCommentImage) return;
    if (!currentUserId) return;
    
    try {
      // Call API to post comment
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newCommentText,
          media_url: attachedCommentImage,
          parent_comment_id: replyingToId
        }),
      });

      if (!response.ok) {
        console.error('Failed to post comment');
        return;
      }

      const { comment: insertedComment } = await response.json();

      // CLIENT-SIDE STATE UPDATE (after successful DB insert)
      const newComment: Comment = {
        id: insertedComment?.comment_id || Date.now(), 
        user: `@${currentUsername}`,
        date: 'Just now', 
        text: newCommentText,
        image: attachedCommentImage,
        vote: null,
        upvotes: 0,
        downvotes: 0,
        isReply: replyingToId !== null,
      };
    
    setClientPosts(prevPosts => prevPosts.map(post => {
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
      
      // Also update the post in the modal view if it's currently open
      if (selectedPostForComment && selectedPostForComment.id === postId) {
          setSelectedPostForComment(prevPost => {
              if (!prevPost) return null;
              return { ...prevPost, comments: updatedComments }; 
          });
      }

      return { ...post, comments: updatedComments };
    }));
    
    setNewCommentText('');
    setAttachedCommentImage(null);
    cancelReply();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleCommentKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, postId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePostComment(postId);
    }
  };

  // ===== HELPER FUNCTIONS =====
  const formatVoteCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return count.toString();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // ===== HANDLER FOR POST VOTES =====
  const handlePostVote = async (postId: string, type: 'up' | 'down') => {
    if (!currentUserId) {
      console.warn('Cannot vote: User not logged in');
      return;
    }

    // CLIENT-SIDE PRE-CALCULATION FOR STATE UPDATE
    let currentPost = clientPosts.find(p => p.id === postId);
    if (!currentPost) return;
    
    let newVote = currentPost.vote;
    let newUpvotes = currentPost.upvotes;
    let newDownvotes = currentPost.downvotes;
    
    let action: 'insert' | 'update' | 'delete';
    
    if (currentPost.vote === type) {
        // User is unvoting
        newVote = null;
        if (type === 'up') newUpvotes--;
        else newDownvotes--;
        action = 'delete';
    } else {
        // User is changing vote or voting for the first time
        if (currentPost.vote === 'up') newUpvotes--;
        if (currentPost.vote === 'down') newDownvotes--;
        
        newVote = type;
        if (type === 'up') newUpvotes++;
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
          vote_type: type === 'up' ? 'upvote' : 'downvote',
          action: action
        }),
      });

      if (!response.ok) {
        console.error('Failed to update vote');
        return;
      }

      // CLIENT-SIDE STATE UPDATE (Only if API call was successful)
      setClientPosts(prevPosts => prevPosts.map(post => {
          if (post.id !== postId) return post;
          return { ...post, vote: newVote, upvotes: newUpvotes, downvotes: newDownvotes };
      }));
    } catch (error) {
      console.error('Error handling vote:', error);
    }
  };

  // ===== HANDLER FOR COMMENT VOTES =====
  const handleCommentVote = async (postId: string, commentId: number, type: 'up' | 'down') => {
    if (!currentUserId) return;

    // Find current comment state
    let currentComment: Comment | undefined;
    const currentPost = clientPosts.find(p => p.id === postId);
    if (currentPost) {
      currentComment = currentPost.comments.find(c => c.id === commentId);
    }
    if (!currentComment) return;

    let newVote = currentComment.vote;
    let newUpvotes = currentComment.upvotes;
    let newDownvotes = currentComment.downvotes;
    let action: 'insert' | 'update' | 'delete';

    if (currentComment.vote === type) {
      // User is unvoting
      newVote = null;
      if (type === 'up') newUpvotes--;
      else newDownvotes--;
      action = 'delete';
    } else {
      // User is changing vote or voting for the first time
      if (currentComment.vote === 'up') newUpvotes--;
      if (currentComment.vote === 'down') newDownvotes--;
      
      newVote = type;
      if (type === 'up') newUpvotes++;
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
          vote_type: type === 'up' ? 'upvote' : 'downvote',
          action: action
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update comment vote:', errorData);
        return;
      }

      // CLIENT-SIDE STATE UPDATE
      setClientPosts(prevPosts => prevPosts.map(post => {
        if (post.id !== postId) return post;
        
        const updatedComments = post.comments.map(comment => {
          if (comment.id !== commentId) return comment;
          return { ...comment, vote: newVote, upvotes: newUpvotes, downvotes: newDownvotes };
        });
        
        return { ...post, comments: updatedComments };
      }));

      // Also update the modal view if it's currently open
      if (selectedPostForComment && selectedPostForComment.id === postId) {
        setSelectedPostForComment(prevPost => {
          if (!prevPost) return null;
          const updatedComments = prevPost.comments.map(comment => {
            if (comment.id !== commentId) return comment;
            return { ...comment, vote: newVote, upvotes: newUpvotes, downvotes: newDownvotes };
          });
          return { ...prevPost, comments: updatedComments };
        });
      }
    } catch (error) {
      console.error('Error handling comment vote:', error);
    }
  };

  // ===== HANDLERS: COMMENT MODAL =====
  const openCommentModal = (post: ClientPost) => {
    setSelectedPostForComment(post);
    setIsCommentModalOpen(true);
    setActivePost(post.id);
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
    setSelectedPostForComment(null);
    setNewCommentText('');
    setAttachedCommentImage(null);
    setReplyingToId(null);
    setReplyingToUser('');
  };

  // Redirect to login if no session (use useEffect to avoid render issues)
  useEffect(() => {
    if (supabaseLoaded && !session) {
      console.log('No session found, redirecting to login');
      router.push('/auth/login');
    }
  }, [supabaseLoaded, session, router]);

  // --- RENDER LOGIC (Unchanged) ---
  console.log('Dashboard render check:', { supabaseLoaded, hasSession: !!session, session });
  
  if (!supabaseLoaded) {
      // Show loading while Supabase is initializing
      return (
          <div className="flex items-center justify-center h-screen text-2xl font-semibold">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-green-700" /> Loading User Session...
          </div>
      );
  }

  if (!session) {
      // If loaded but no session, show redirecting message
      return (
          <div className="flex items-center justify-center h-screen text-2xl font-semibold">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-green-700" /> Redirecting...
          </div>
      );
  }

  return (
    <div 
      className="h-screen flex flex-col bg-gradient-to-b from-green-50 to-amber-50" 
      style={{ 
        backgroundImage: `url('/${isDarkMode ? 'darkbg00.png' : 'lightbg0.png'}')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundAttachment: 'fixed' 
      }}
    >
      {/* Top Fixed Header */}
      <div className="fixed top-0 left-0 right-0 w-full z-50">
          <div className={`w-full h-11 justify-center ${isDarkMode ? 'bg-[#373333]' : 'bg-[#dad2b9]'}`} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1440px] max-w-full h-11">
              <div className="absolute -top-0.5 left-[46px] [-webkit-text-stroke:0.5px_#072d0d] bg-[linear-gradient(180deg,rgba(149,171,51,1)_30%,rgba(35,115,47,1)_57%,rgba(8,46,13,1)_83%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins-ExtraBold',Helvetica] font-extrabold text-transparent text-[32px] tracking-[1.60px] leading-[normal]">
                  SPOT
              </div>

              {/* === UPDATED SEARCH BAR SECTION === */}
              <div className="flex-1 max-w-xl mx-auto h-full flex items-center justify-center">
                  <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      
                      <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          placeholder="Search communities, people, or flairs..."
                          className="w-full pl-10 pr-4 h-8 border border-gray-200 rounded-[15px] bg-white/44 focus:outline-none focus:ring-1 focus:ring-[#7D9B76] text-left"
                          style={{ borderColor: 'rgba(0, 0, 0, 0.43)' }}
                          onFocus={() => setIsOpen(true)}
                          onBlur={() => setTimeout(() => setIsOpen(false), 300)}
                      />
                      
                      {/* Dropdown */}
                      {isOpen && (
                          <div 
                            className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                              {/* Tabs */}
                              <div className="flex border-b border-gray-200 px-2 py-2 gap-2">
                                  {['All', 'Communities', 'People', 'Flairs'].map((tab) => (
                                      <button
                                          key={tab}
                                          onClick={() => {
                                            setActiveTab(tab);
                                            if (searchQuery) handleSearch(searchQuery);
                                          }}
                                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                              activeTab === tab ? 'bg-[#7D9B76] text-white' : 'text-gray-600 hover:bg-gray-100'
                                          }`}
                                      >
                                          {tab}
                                      </button>
                                  ))}
                              </div>

                              {/* Content based on active tab */}
                              <div className="max-h-80 overflow-y-auto">
                                  {isSearching ? (
                                    <div className="p-8 text-center text-gray-500">
                                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                    </div>
                                  ) : (
                                    <>
                                      {/* Debug info */}
                                      {searchQuery && (
                                        <div className="p-2 text-xs text-gray-400 border-b">
                                          Communities: {searchResults.communities?.length || 0}, 
                                          People: {searchResults.people?.length || 0}, 
                                          Flairs: {searchResults.flairs?.length || 0}
                                        </div>
                                      )}
                                      
                                      {(activeTab === 'All' || activeTab === 'Communities') && searchResults.communities?.length > 0 && (
                                        <div className="p-3">
                                          <div className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Communities</div>
                                          <div className="space-y-1">
                                            {searchResults.communities.map((comm: any) => (
                                              <button
                                                key={comm.community_id}
                                                onClick={() => handleSearchSelect(comm.community_name, 'community', comm.community_id)}
                                                className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors flex items-center gap-3"
                                              >
                                                {comm.profile_picture ? (
                                                  <img src={comm.profile_picture} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                  <div className="w-8 h-8 rounded-full bg-[#7D9B76] flex items-center justify-center text-white font-bold text-xs">
                                                    {comm.community_name[0]}
                                                  </div>
                                                )}
                                                <div>
                                                  <div className="font-medium">{comm.community_name}</div>
                                                </div>
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {(activeTab === 'All' || activeTab === 'People') && searchResults.people?.length > 0 && (
                                        <div className="p-3">
                                          <div className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">People</div>
                                          <div className="space-y-1">
                                            {searchResults.people.map((person: any) => (
                                              <button
                                                key={person.user_id}
                                                onClick={() => handleSearchSelect(person.username, 'person')}
                                                className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors flex items-center gap-3"
                                              >
                                                {person.profile_picture ? (
                                                  <img src={person.profile_picture} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                  <User className="w-8 h-8 text-gray-400" />
                                                )}
                                                <div>
                                                  <div className="font-medium">@{person.username}</div>
                                                  {person.bio && (
                                                    <div className="text-xs text-gray-500 truncate">{person.bio}</div>
                                                  )}
                                                </div>
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {(activeTab === 'All' || activeTab === 'Flairs') && searchResults.flairs?.length > 0 && (
                                        <div className="p-3">
                                          <div className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Categories</div>
                                          <div className="flex flex-wrap gap-2">
                                            {searchResults.flairs.map((flair: any, idx: number) => (
                                              <button
                                                key={`${flair.flair_id}-${idx}`}
                                                onClick={() => handleSearchSelect(flair.name, 'flair')}
                                                className="px-3 py-1.5 bg-[#7D9B76] text-white hover:bg-[#6A8565] rounded-full text-sm font-bold transition-colors"
                                              >
                                                {flair.name}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Recent Searches */}
                                      {!searchQuery && recentSearches.length > 0 && (
                                        <div className="p-3">
                                          <div className="flex items-center gap-2 px-2 mb-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recent Searches</span>
                                          </div>
                                          <div className="space-y-1">
                                            {recentSearches.map((search, index) => (
                                              <button
                                                key={index}
                                                onClick={() => {
                                                  setSearchQuery(search);
                                                  handleSearch(search);
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                                              >
                                                {search}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* No Results */}
                                      {searchQuery && !isSearching && 
                                       searchResults.communities?.length === 0 && 
                                       searchResults.people?.length === 0 && 
                                       searchResults.flairs?.length === 0 && (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                          No results found for &quot;{searchQuery}&quot;
                                        </div>
                                      )}
                                    </>
                                  )}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
              {/* === END SEARCH BAR SECTION === */}

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
                      <img className="w-[35px] h-[35px] aspect-[1] object-cover" alt="Down chevron" src="/down.svg" />
                      <div className="w-[35px] h-[35px] bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                          {userProfile?.profile_picture ? (
                            <img 
                              src={userProfile.profile_picture} 
                              alt={currentUsername} 
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
                          className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-50"
                          style={{ border: '2px solid #899A3C' }}
                          onMouseDown={(e) => e.preventDefault()}
                      >
                          {/* User Info Section */}
                          <div className="px-4 py-3 border-b border-gray-300 flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                                  {userProfile?.profile_picture ? (
                                    <img 
                                      src={userProfile.profile_picture} 
                                      alt={currentUsername} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-6 h-6 text-gray-500" />
                                  )}
                              </div>
                              <div>
                                  <h3 className="text-base font-bold text-gray-900">@{currentUsername}</h3>
                                  <p className="text-xs text-gray-600 mt-0.5">{currentEmail}</p>
                              </div>
                          </div>

                          {/* Menu Items */}
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
                                      router.push('/settings');
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
                                          const supabase = createClient();
                                          await supabase.auth.signOut();
                                          router.push('/');
                                      } catch (err) {
                                          console.error('Sign out failed:', err);
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
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden pt-11"> 
        <div className="max-w-7xl mx-auto px-4 h-full flex gap-6">
          
          {/* Left Sidebar - User Profile & Communities */}
          <aside className="w-80 flex-shrink-0 fixed left-5" style={{ top: '80px' }}>
              <div
                  className="p-8 text-white shadow-lg"
                  style={{
                      background: 'linear-gradient(131deg, #2A5528 15.98%, #927D31 125.22%)',
                      borderRadius: '15px',
                  }}
              >
                  <div className="flex items-start gap-4 mb-5">
                      <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                          {userProfile?.profile_picture ? (
                            <img 
                              src={userProfile.profile_picture} 
                              alt={currentUsername} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Failed to load image:', userProfile.profile_picture);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <User className="w-10 h-10 text-white" />
                          )}
                      </div>
                      <div className="flex-1">
                          <p className="text-base font-semibold opacity-90">@{currentUsername}</p>
                          <p className="text-xl font-bold">{userProfile?.name || 'Loading...'}</p> 
                      </div>
                  </div>
                  
                  <div className="space-y-2.5 text-base">
                      <div className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
                          <span className="font-medium">{userProfile?.occupation || 'Wildlife Enthusiast'}</span>
                      </div>
                  <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{userProfile?.location || 'Location not set'}</span>
                  </div>
              </div>
          </div>
          
              {/* Communities */}
              <div className="mt-6 rounded-3xl shadow-lg p-5"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                  <div className="flex items-center gap-2 mb-5 px-2">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                      <h3 className="font-bold text-gray-800 text-lg">Your Communities</h3>
                  </div>

                  <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {communitiesLoading ? (
                          <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                          </div>
                      ) : userCommunities.length > 0 ? (
                          userCommunities.map((comm) => (
                              <button
                                  key={comm.community_id}
                                  onClick={() => router.push(`/community/${comm.community_id}`)}
                                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-green-50 transition" 
                              >
                                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                                      {comm.profile_picture ? (
                                          <img src={comm.profile_picture} alt={comm.community_name} className="w-full h-full object-cover" />
                                      ) : (
                                          <Users className="w-6 h-6 text-green-600" />
                                      )}
                                  </div>
                                  <div className="flex-1 text-left">
                                      <span className="text-base font-medium text-gray-700 block">
                                          {comm.community_name}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                          {comm.member_count} members
                                      </span>
                                  </div>
                              </button>
                          ))
                      ) : (
                          <div className="text-center py-8 text-gray-500 text-sm">
                              No communities yet. Join or create one!
                          </div>
                      )}
                  </div>
                  
                  {/* Create Community Button */}
                  <button
                      ref={createCommunityBtnRef}
                      onClick={openCreateCommunityModal}
                      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-3 px-5 flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"
                  >
                      <Plus className="w-5 h-5" />
                      <span className="text-base font-semibold">Create Community</span>
                  </button>
              </div>

              {/* Active Flair Filter */}
              {selectedFlair && (
                <div className="mt-4 rounded-3xl shadow-lg p-5"
                    style={{ backgroundColor: 'rgba(125, 155, 118, 0.15)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">Filtering by</div>
                      <div className="px-3 py-1.5 bg-[#7D9B76] text-white rounded-full text-sm font-bold inline-block">
                        {selectedFlair}
                      </div>
                    </div>
                    <button
                      onClick={clearFlairFilter}
                      className="p-2 hover:bg-white/50 rounded-full transition-colors"
                      title="Clear filter"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
          </aside>

          {/* Main Feed */}
          <main 
              className="absolute left-[350px] right-90 overflow-y-auto flex justify-center" 
              style={{ 
                  top: '56px',
                  height: 'calc(100vh - 56px)',
                  backgroundColor: isDarkMode ? '#1B1B1B' : '#FAFFF1', 
                  backgroundSize: '750px 600px', 
                  backgroundRepeat: 'repeat', 
                  backgroundPosition: 'top center' 
              }}
          > 
              <div className="w-[767px] px-5 pb-20 pt-0"> 
                  <div className="p-6 mb-4 -ml-5">
                      <h1 className="font-bold mb-2" style={{ 
                          color: isDarkMode ? '#B6FFEA' : 'rgba(11, 87, 66, 0.93)',
                          fontFamily: 'Poppins',
                          fontSize: '40px',
                          fontWeight: '900',
                          lineHeight: 'normal'
                      }}>
                          Welcome, @{currentUsername}!
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

                  {/* Loading State */}
                  {postsLoading && (
                      <div className="text-center py-20 text-gray-600 text-xl flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin mr-3" /> Fetching latest spots...
                      </div>
                  )}

                  {/* Error State */}
                  {postsError && (
                      <div className="text-center py-20 text-red-600 text-xl">
                          Error loading posts: **{postsError}**.
                      </div>
                  )}

                  {/* Post Cards */}
                  {!postsLoading && clientPosts.length > 0 ? clientPosts.map((post) => (
                      <article 
                          key={post.id} 
                          className="rounded-3xl shadow-lg p-6 mb-6" 
                          style={{
                              borderRadius: '25px',
                              border: '1px solid #000',
                              background: isDarkMode ? 'rgba(208, 230, 144, 0.12)' : 'rgba(208, 230, 144, 0.12)'
                          }}
                      >
                          <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
                                      {post.communityProfilePicture ? (
                                          <img 
                                              src={post.communityProfilePicture} 
                                              alt={post.communityName || 'Community'}
                                              className="w-full h-full object-cover"
                                          />
                                      ) : (
                                          <Users className="w-6 h-6 text-gray-400" />
                                      )}
                                  </div>
                                  <div>
                                      <div className="flex items-center gap-2">
                                          {post.communityName ? (
                                              <>
                                                  <button
                                                      onClick={() => router.push(`/community/${post.communityId}`)}
                                                      className="font-bold text-gray-800 hover:underline"
                                                  >
                                                      {post.communityName}
                                                  </button>
                                                  {!userCommunities.some(c => c.community_id === post.communityId) && (
                                                      <button
                                                          onClick={() => handleJoinCommunity(post.communityId!)}
                                                          className="text-blue-600 text-sm font-semibold hover:underline"
                                                      >
                                                          • Join
                                                      </button>
                                                  )}
                                              </>
                                          ) : (
                                              <span className="font-bold text-gray-800">Community</span>
                                          )}
                                      </div>
                                      <p className="text-sm text-gray-500">{post.user} • {post.date}</p>
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
                                                  onClick={() => { setIsPostMenuOpen(false); setShowRepostModal(true); }}
                                              >
                                                  <Share2 className="w-4 h-4 text-gray-700" />
                                                  <span className="text-sm font-medium text-gray-900">Repost to...</span>
                                              </button>
                                              
                                              <button 
                                                  className="w-full px-4 py-2 text-left hover:bg-[#D4DEC3] transition-colors flex items-center gap-2.5"
                                                  onClick={() => {/* Report logic here */}}
                                              >
                                                  <Flag className="w-4 h-4 text-gray-700" />
                                                  <span className="text-sm font-medium text-gray-900">Report Post</span>
                                              </button>
                                              
                                              {/* Show Delete option if user is the author or a moderator */}
                                              {(post.userId === currentUserId || userCommunities.some(c => c.community_id === post.communityId && c.role === 'moderator')) && (
                                                <button 
                                                    className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center gap-2.5"
                                                    onClick={() => { setIsPostMenuOpen(false); handleDeletePost(post.id, post); }}
                                                >
                                                  <X className="w-4 h-4 text-red-600" />
                                                  <span className="text-sm font-medium text-red-600">Delete Post</span>
                                                </button>
                                              )}
                                          </div>

                                          <div className="border-t border-gray-400">
                                              <button 
                                                  className="w-full px-4 py-2 text-left hover:bg-[#3A6064] hover:text-white transition-colors flex items-center gap-2.5 group"
                                                  onClick={() => {/* Hide Post logic here */}}
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
                                              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                                  <h3 className="text-lg font-bold text-gray-900">Repost to Community</h3>
                                                  <button 
                                                      onClick={() => setShowRepostModal(false)}
                                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                                  >
                                                      <X className="w-5 h-5" />
                                                  </button>
                                              </div>
                                              <div className="max-h-80 overflow-y-auto py-2">
                                                  {userCommunities.map((community) => (
                                                      <button
                                                          key={community.community_id}
                                                          className="w-full px-6 py-3 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-3"
                                                          onClick={() => { console.log(`Reposting to ${community.community_name}`); setShowRepostModal(false); }}
                                                      >
                                                          <Users className="w-5 h-5 text-gray-600" />
                                                          <span className="text-sm font-medium text-gray-900">{community.community_name}</span>
                                                      </button>
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>

                          <h2 className="text-xl font-bold text-gray-800 mb-4">{post.heading}</h2>
                          
                          {/* Flair Badges - Clickable */}
                          {post.flairNames && post.flairNames.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.flairNames.map((flair, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleFlairClick(flair)}
                                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#7D9B76] text-white shadow-sm hover:bg-[#6A8565] transition-colors cursor-pointer"
                                  title={`Filter by ${flair}`}
                                >
                                  {flair}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-sm font-medium text-gray-500 mb-4">Identified Species: {post.scientificName}</p>


                          {/* Image Placeholder/Display */}
                          {post.image ? (
                              <div className="rounded-2xl h-64 mb-4 overflow-hidden">
                                  <img 
                                      src={post.image} 
                                      alt={post.heading} 
                                      className="w-full h-full object-cover" 
                                  />
                              </div>
                          ) : (
                              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-64 mb-4 flex items-center justify-center">
                                  <span className="text-gray-400 text-sm">Image content</span>
                              </div>
                          )}

                          <p className="text-gray-700 mb-6">{post.caption}</p>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 mt-auto justify-between">
                              <div className="flex items-center gap-3">
                              {/* Upvote Button with Count */}
                              <div className="flex items-center gap-1.5 rounded-full px-2 py-1 bg-[#E0E0E0]/50 h-10 min-w-max">
                                  <button 
                                      onClick={() => handlePostVote(post.id, 'up')} 
                                      className={`p-1 rounded-full transition-colors flex items-center justify-center ${
                                          post.vote === 'up' ? "bg-white/50" : "hover:bg-black/5"
                                      }`}
                                  >
                                      <ArrowBigUp className={`w-7 h-7 ${
                                          post.vote === 'up' ? "text-[#00C92C] fill-[#00C92C]" : "text-[#00C92C]"
                                      }`} />
                                  </button>

                                  <span className={`font-bold text-lg leading-none pt-0.5 px-1 text-center ${
                                      isDarkMode ? "text-white" : "text-black"
                                  }`}>
                                      {formatVoteCount(post.upvotes)}
                                  </span>
                              </div>

                              {/* Downvote Button with Count */}
                              <div className="flex items-center gap-1.5 rounded-full px-2 py-1 bg-[#E0E0E0]/50 h-10 min-w-max">
                                  <button 
                                      onClick={() => handlePostVote(post.id, 'down')} 
                                      className={`p-1 rounded-full transition-colors flex items-center justify-center ${
                                          post.vote === 'down' ? "bg-white/50" : "hover:bg-black/5"
                                      }`}
                                  >
                                      <ArrowBigDown className={`w-7 h-7 ${
                                          post.vote === 'down' ? "text-[#FF4C4C] fill-[#FF4C4C]" : "text-[#FF4C4C]"
                                      }`} />
                                  </button>

                                  <span className={`font-bold text-lg leading-none pt-0.5 px-1 text-center ${
                                      isDarkMode ? "text-white" : "text-black"
                                  }`}>
                                      {formatVoteCount(post.downvotes)}
                                  </span>
                              </div>

                              {/* Comment Button with Count */}
                              <button 
                                  onClick={() => openCommentModal(post)} 
                                  className="flex items-center gap-2 rounded-full px-3 py-2 shadow-sm bg-[#D9D9D9] hover:bg-blue-200 transition-colors"
                              >
                                  <MessageCircle className="w-6 h-6 text-[#0057FF] -scale-x-100 stroke-[2.5]" />
                                  <span className={`font-bold text-sm ${isDarkMode ? "text-gray-700" : "text-gray-700"}`}>
                                      {post.comments.length}
                                  </span>
                              </button>
                              </div>

                              {/* Location Button */}
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
                                      className="flex items-center gap-2 rounded-full px-3 py-2 shadow-sm bg-[#95AB33] hover:bg-[#7D9B28] transition-colors"
                                  >
                                      <MapPin className="w-5 h-5 text-white stroke-[2.5]" />
                                      <span className="font-bold text-sm text-white">
                                          Location
                                      </span>
                                  </button>
                              )}

                          </div>
                      </article>
                  )) : (
                    !postsLoading && (
                        <div className="text-center py-20 text-gray-500 text-xl">
                            No posts found in this feed. Start a conversation!
                        </div>
                    )
                  )}
              </div>
          </main>

          {/* Right Sidebar - Trending */}
          <aside className="w-80 fixed right-5 flex-shrink-0" style={{ top: '80px' }}>
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

                  <div className="mt-3 space-y-2 max-h-[170px] overflow-y-auto">
                      {popularFlairs.length > 0 ? (
                        popularFlairs.map((flair, index) => (
                          <button 
                            key={flair.name} 
                            className="w-full text-left hover:scale-[1.02] transition-transform"
                            onClick={() => handleFlairClick(flair.name)}
                          >
                              <div
                                  className={`${flair.color} rounded-2xl border-2 border-amber-200 flex items-center gap-2 px-3 hover:border-[#7D9B76] transition-colors`}
                                  style={{ height: "50px" }}
                              >
                                  <div className="text-2xl">{flair.emoji}</div>
                                  <div className="flex-1 flex items-center justify-between">
                                    <span className="font-semibold text-gray-700 truncate">
                                        {flair.name}
                                    </span>
                                    <span className="text-xs font-bold text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                                        {flair.count}
                                    </span>
                                  </div>
                              </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No popular flairs yet
                        </div>
                      )}
                  </div>
              </div>
          </aside>

          {/* SPOT Database Button - Fixed to bottom right */}
          <button 
              className="fixed bottom-0.5 right-0.5 w-[450px] h-auto hover:scale-105 transition-transform duration-300 cursor-pointer group z-50"
              onClick={() => router.push('/ai-chat')}
          >
              <img src="/spotdb.svg" alt="Spot Database Icon" className="w-full h-full object-contain" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  bg-green-800 text-white px-6 py-3 rounded-full text-xl font-bold
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  pointer-events-none whitespace-nowrap shadow-lg">
                  Spot Anything?
              </span>
          </button>
        </div>
      </div>

      {/* ===== COMMENT MODAL ===== */}
      {isCommentModalOpen && selectedPostForComment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[90vh] flex flex-col overflow-hidden"
            style={{ border: '2px solid #899A3C' }}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#0057FF] -scale-x-100 stroke-[2.5]" />
                Comments ({selectedPostForComment.comments.length})
              </h3>
              <button 
                onClick={closeCommentModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Original Post Summary (Read-Only) */}
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm font-semibold text-gray-500">{selectedPostForComment.user} • {selectedPostForComment.date}</p>
                <h4 className="text-lg font-bold text-gray-800 mt-1">{selectedPostForComment.heading}</h4>
                <p className="text-gray-700 mt-2 line-clamp-2">{selectedPostForComment.caption}</p>
                {selectedPostForComment.image && (
                  <img 
                    src={selectedPostForComment.image} 
                    alt="Post media" 
                    className="mt-3 max-h-40 w-full object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {selectedPostForComment.comments.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Be the first to comment!</div>
                ) : (
                  selectedPostForComment.comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className={`flex gap-3 ${comment.isReply ? 'ml-8 border-l border-gray-300 pl-4' : ''}`}
                    >
                      <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center mt-1">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800 text-sm">{comment.user}</span>
                          <span className="text-xs text-gray-500">• {comment.date}</span>
                        </div>
                        <p className="text-gray-700 mt-0.5 whitespace-pre-wrap">{comment.text}</p>
                        
                        {comment.image && (
                          <img 
                            src={comment.image} 
                            alt="Comment media" 
                            className="mt-2 max-h-32 object-contain rounded-lg border border-gray-200"
                          />
                        )}

                        {/* Comment Actions (Reply/Vote) */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                          {/* Vote Action */}
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleCommentVote(selectedPostForComment.id, comment.id, 'up')}
                              className={`hover:text-green-600 transition-colors flex items-center gap-0.5 ${comment.vote === 'up' ? 'text-green-600 font-bold' : ''}`}
                            >
                              <ArrowBigUp className="w-4 h-4" /> {formatVoteCount(comment.upvotes)}
                            </button>
                            <span className="text-gray-400">|</span>
                            <button 
                              onClick={() => handleCommentVote(selectedPostForComment.id, comment.id, 'down')}
                              className={`hover:text-red-600 transition-colors flex items-center gap-0.5 ${comment.vote === 'down' ? 'text-red-600 font-bold' : ''}`}
                            >
                              <ArrowBigDown className="w-4 h-4" /> {formatVoteCount(comment.downvotes)}
                            </button>
                          </div>

                          <span className="text-gray-400">|</span>
                          
                          {/* Reply Action */}
                          <button 
                            onClick={() => handleReplyClick(selectedPostForComment.id, comment.id, comment.user)}
                            className="hover:underline font-medium"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment Input Box (Sticky Footer) */}
            <div className="border-t border-gray-200 p-4 sticky bottom-0 bg-white">
              
              {/* Replying To Indicator */}
              {replyingToId !== null && (
                <div className="flex items-center justify-between mb-2 p-2 bg-gray-100 rounded-lg text-sm">
                  <span className="text-gray-600">Replying to <span className="font-semibold text-blue-600">{replyingToUser}</span></span>
                  <button 
                    onClick={cancelReply}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="flex items-end gap-3">
                <textarea
                  id={`comment-input-${selectedPostForComment.id}`}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => handleCommentKeyDown(e, selectedPostForComment.id)}
                  placeholder={replyingToId !== null ? 'Type your reply...' : 'Add a comment...'}
                  rows={2}
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-sm"
                />
                
                <input 
                  type="file" 
                  ref={commentFileInputRef} 
                  onChange={handleCommentFileSelect} 
                  accept="image/*"
                  hidden 
                />
                
                {/* Attached Image Preview */}
                {attachedCommentImage ? (
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <img src={attachedCommentImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    <button 
                      onClick={() => setAttachedCommentImage(null)} 
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => commentFileInputRef.current?.click()}
                    className="p-2 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors flex-shrink-0"
                    title="Attach Image"
                  >
                    <Users className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={() => handlePostComment(selectedPostForComment.id)}
                  disabled={!newCommentText.trim() && !attachedCommentImage}
                  className={`px-4 py-2 h-10 font-bold text-white rounded-xl transition-opacity flex-shrink-0 ${
                    !newCommentText.trim() && !attachedCommentImage
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#899A3C] hover:bg-[#6e7b2f]'
                  }`}
                >
                  Post
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Create Community Modal */}
      <CreateCommunityModal
        isDarkMode={isDarkMode}
        isOpen={isCreateCommunityOpen}
        isClosing={isClosingCommunityModal}
        onClose={closeCreateCommunityModal}
        onCreate={handleCreateCommunity}
        modalOrigin={modalOrigin}
      />

      {/* Location Modal */}
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
              className={`w-full rounded-[40px] border shadow-2xl p-8 flex flex-col ${
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
                <div id="dashboard-location-modal-map" className="w-full h-full" />
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
    </div>
  );
}