'use client';
import { useState, useRef, ChangeEvent, KeyboardEvent, useEffect, useCallback } from 'react';
import { Search, MapPin, Edit, MessageCircle, TrendingUp, MoreHorizontal, ChevronDown, User, ArrowBigUp, ArrowBigDown, Briefcase } from 'lucide-react';
import { Settings, HelpCircle, LogOut, Clock, Loader2 } from 'lucide-react';
import { Share2, Flag, EyeOff, X, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/client';
import { useCommunities } from '@/src/lib/hooks/useCommunities';

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
  scientificName: string; // Added this to show where nested data goes
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


// --- START: Supabase Data Fetching Hook ---
function useAllPosts() {
    const { supabase, isLoaded, session } = useSupabase();
    const [posts, setPosts] = useState<PostWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useCallback is used to memoize fetchPosts, ensuring it's not redefined on every render
    const fetchPosts = useCallback(async () => {
        if (!supabase) return; // FIX 1: Supabase null check
        
        setIsLoading(true);
        
        // This query fetches posts along with related user, identification, and species data
        const { data, error: fetchError } = await supabase
            .from('posts')
            .select(`
                post_id,
                title,
                content,
                created_at,
                media_url,
                user_profiles (username, profile_picture),
                identifications (
                    image_url,
                    confidence_score,
                    species (scientific_name, common_name)
                )
            `)
            .order('created_at', { ascending: false })
            .limit(20);

        if (fetchError) {
            console.error("Error fetching posts:", fetchError);
            setError(fetchError.message);
            setPosts([]);
        } else if (data) {
            // FIX 2: Use a two-step assertion (as unknown as T[]) to resolve remaining TS incompatibility warnings.
            setPosts(data as unknown as PostWithDetails[]); 
        }
        setIsLoading(false);
    }, [supabase]);

    useEffect(() => {
        if (!isLoaded || !supabase) return;
        fetchPosts();
    }, [supabase, isLoaded, session, fetchPosts]);

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

  // Fetch user's communities from Supabase
  const { userCommunities, loading: communitiesLoading } = useCommunities();

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

  const commentFileInputRef = useRef<HTMLInputElement>(null);

  // Constants (for now)
  const communities = ['Wildlife watchers', 'Trail explorers', 'Bird spotters', 'Snake finders'];
  const tags = ['venomous snakes', 'rat snake', 'non venomous snakes', 'cobra', 'sea snakes'];
  const recentSearches = ['Philippine cobra habitat', 'Venomous vs non-venomous', 'Snake identification guide', 'Local wildlife communities'];
  
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
  
  // Client-side state for rendering posts (initial dummy data uses UUID string)
  const [clientPosts, setClientPosts] = useState<ClientPost[]>([]);

  // Effect to map Supabase data to your client-side state structure
  useEffect(() => {
      if (fetchedPosts.length > 0) {
          const mappedPosts: ClientPost[] = fetchedPosts.map(p => ({
              id: p.post_id,
              timestamp: new Date(p.created_at).getTime(),
              
              // Safely access the first element of the user_profiles array
              user: `@${p.user_profiles?.[0]?.username || 'unknown'}`, 

              date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              heading: p.title,
              caption: p.content,
              
              // Safely access the first element of the identifications array for image
              image: p.media_url || p.identifications?.[0]?.image_url || null, 
              
              // Safely access the nested species scientific name
              scientificName: p.identifications?.[0]?.species?.[0]?.scientific_name || 'Unidentified Species',
              
              vote: null,
              upvotes: 0, 
              downvotes: 0,
              comments: [], // Comments should be loaded/managed separately
          }));
          setClientPosts(mappedPosts);
      }
  }, [fetchedPosts]);


  // --- Handlers (CRUD Placeholders) ---
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
    setAttachedCommentImage(null);
  };

  // ===== SUPABASE HANDLER FOR COMMENTS =====
  const handlePostComment = async (postId: string) => {
    if (!newCommentText.trim() && !attachedCommentImage) return;
    if (!currentUserId || !supabase) return;
    
    // ----------------------------------------------------
    // TODO: SUPABASE API CALL - INSERT NEW COMMENT
    // (You need to implement image upload to Supabase Storage here)
    // ----------------------------------------------------
    let commentImageUrl = attachedCommentImage; // Placeholder for now

    const { data: insertedComment, error: commentError } = await supabase
        .from('comments')
        .insert({
            post_id: postId,
            user_id: currentUserId,
            content: newCommentText,
            media_url: commentImageUrl,
            parent_comment_id: replyingToId 
        })
        .select()
        .single();

    if (commentError) {
        console.error('Error posting comment:', commentError);
        return;
    }
    // ----------------------------------------------------

    // CLIENT-SIDE STATE UPDATE (after successful DB insert)
    const newComment: Comment = {
      id: insertedComment?.id || Date.now(), 
      user: currentUsername,
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
  };

  const handleCommentKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, postId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePostComment(postId);
    }
  };

  // ===== HELPER FUNCTION =====
  const formatVoteCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return count.toString();
  };

  // ===== SUPABASE HANDLER FOR POST VOTES =====
  const handlePostVote = async (postId: string, type: 'up' | 'down') => {
    if (!currentUserId || !supabase) return;

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

    // ----------------------------------------------------
    // TODO: SUPABASE API CALL - HANDLE VOTE
    // ----------------------------------------------------
    const voteData = {
        post_id: postId,
        user_id: currentUserId,
        vote_type: type === 'up' ? 'upvote' : 'downvote',
    };

    let error = null;

    if (action === 'insert') {
        const { error: insertError } = await supabase.from('votes').insert(voteData);
        error = insertError;
    } else if (action === 'update') {
        const { error: updateError } = await supabase
            .from('votes')
            .update(voteData)
            .eq('post_id', postId)
            .eq('user_id', currentUserId);
        error = updateError;
    } else if (action === 'delete') {
        const { error: deleteError } = await supabase
            .from('votes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', currentUserId);
        error = deleteError;
    }

    if (error) {
        console.error('Error handling vote:', error);
        // Do NOT update client state if DB update failed.
        return; 
    }
    // ----------------------------------------------------

    // CLIENT-SIDE STATE UPDATE (Only if DB operation was successful)
    setClientPosts(prevPosts => prevPosts.map(post => {
        if (post.id !== postId) return post;
        return { ...post, vote: newVote, upvotes: newUpvotes, downvotes: newDownvotes };
    }));
  };

  // ===== SUPABASE HANDLER FOR COMMENT VOTES =====
  const handleCommentVote = async (postId: string, commentId: number, type: 'up' | 'down') => {
    // This is similar to post voting but targets the 'comment_votes' table (if you have one)
    if (!currentUserId || !supabase) return;

    // TODO: You will need to determine the action (insert/update/delete) based on 
    // the current state of the comment's vote by the user, then call Supabase.
    
    // ----------------------------------------------------
    // TODO: SUPABASE API CALL - HANDLE COMMENT VOTE
    // ----------------------------------------------------
    // (Implement comment vote logic here)
    // ----------------------------------------------------

    // CLIENT-SIDE STATE UPDATE (Mirroring the logic above)
    setClientPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      
      const updatedComments = post.comments.map(comment => {
        if (comment.id !== commentId) return comment;
        
        let newVote = comment.vote;
        let newUpvotes = comment.upvotes;
        let newDownvotes = comment.downvotes;
        
        // ... (Vote logic to calculate newVote, newUpvotes, newDownvotes)
        if (comment.vote === type) {
          newVote = null;
          if (type === 'up') newUpvotes--;
          else newDownvotes--;
        } else {
          if (comment.vote === 'up') newUpvotes--;
          if (comment.vote === 'down') newDownvotes--;
          
          newVote = type;
          if (type === 'up') newUpvotes++;
          else newDownvotes++;
        }
        
        return { ...comment, vote: newVote, upvotes: newUpvotes, downvotes: newDownvotes };
      });
      
      return { ...post, comments: updatedComments };
    }));
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

  // --- RENDER LOGIC (Unchanged) ---
  if (!supabaseLoaded || !session) {
      // Show loading or redirect if session is not yet loaded/authenticated
      return (
          <div className="flex items-center justify-center h-screen text-2xl font-semibold">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-green-700" /> Loading User Session...
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
              {/* Flexbox is used here to center the input vertically within the 44px (h-11) header */}
              <div className="flex-1 max-w-xl mx-auto h-full flex items-center justify-center">
                  <div className="relative w-full">
                      {/* Search Icon positioned absolutely and centered vertically */}
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      
                      <input
                          type="text"
                          placeholder="Search anything..."
                          // Added 'text-center' to align placeholder text to the center
                          // Removed fixed positioning and manual top styles
                          className="w-full pl-10 pr-4 h-8 border border-gray-200 rounded-[15px] bg-white/44 focus:outline-none focus:ring-1 focus:ring-[#9A9A9A] text-center"
                          style={{ borderColor: 'rgba(0, 0, 0, 0.43)' }}
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
                                              activeTab === tab ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                                          }`}
                                      >
                                          {tab}
                                      </button>
                                  ))}
                              </div>

                              {/* Content based on active tab */}
                              <div className="max-h-80 overflow-y-auto">
                                  {activeTab === 'All' && (
                                      <div className="p-3">
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
                      <img className="w-[35px] h-[35px] aspect-[1] object-cover rounded-full" alt="User" src="/pfp.svg" />
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
                              <h3 className="text-base font-bold text-gray-900">@{currentUsername}</h3>
                              <p className="text-xs text-gray-600 mt-0.5">{currentEmail}</p>
                          </div>

                          {/* Menu Items */}
                          <div className="py-1">
                              <button 
                                  className="w-full px-4 py-2 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-2.5"
                                  onClick={() => {/* View Profile logic here */}}
                              >
                                  <User className="w-4 h-4 text-gray-700" />
                                  <span className="text-sm font-medium text-gray-900">View Profile</span>
                              </button>
                              
                              <button 
                                  className="w-full px-4 py-2 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-2.5"
                                  onClick={() => {/* Account Settings logic here */}}
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
                      <div className="w-15 h-15 bg-white/30 rounded-full flex items-center justify-center">
                          <User className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                          <p className="text-base font-semibold opacity-90">@{currentUsername}</p>
                          <p className="text-xl font-bold">Full Name Placeholder</p> 
                      </div>
                  </div>
                  
                  <div className="space-y-2.5 text-base">
                      <div className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
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
                  <div className="flex items-center gap-2 mb-5 px-2">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                      <h3 className="font-bold text-gray-800 text-lg">Your Communities</h3>
                  </div>

                  <div className="space-y-2 max-h-[260px] overflow-y-auto">
                      {communitiesLoading ? (
                          <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                          </div>
                      ) : userCommunities.length > 0 ? (
                          userCommunities.map((comm) => (
                              <button
                                  key={comm.community_id}
                                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-green-50 transition" 
                              >
                                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                      <Users className="w-6 h-6 text-green-600" />
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
              </div>
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
              <div className="w-[767px] px-5 pb-20 pt-2"> 
                  <div className="p-8 mb-6 -ml-5">
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
                          className="rounded-3xl shadow-lg p-6 mb-8" 
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
                                                  {communities.map((community) => (
                                                      <button
                                                          key={community}
                                                          className="w-full px-6 py-3 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-3"
                                                          onClick={() => { console.log(`Reposting to ${community}`); setShowRepostModal(false); }}
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

                          <h2 className="text-xl font-bold text-gray-800 mb-4">{post.heading}</h2>
                          <p className="text-sm font-medium text-gray-500 mb-4">Identified Species: {post.scientificName}</p> {/* Displaying the new species data */}


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
                          <div className="flex items-center gap-3 mt-auto">
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

                              {/* Comment Button */}
                              <button 
                                  onClick={() => openCommentModal(post)} 
                                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm ml-2 bg-[#D9D9D9] hover:bg-blue-200 transition-colors"
                              >
                                  <MessageCircle className="w-6 h-6 text-[#0057FF] -scale-x-100 stroke-[2.5]" />
                              </button>

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
                      {trending.map((trend) => (
                          <button key={trend.id} className="w-full text-left">
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
    </div>
  );
}