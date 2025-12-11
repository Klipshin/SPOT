"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSupabase } from '@/src/components/providers/SupabaseProvider';

type Notification = {
  id: string;
  type: 'comment' | 'reply' | 'vote';
  message: string;
  postId: string;
  commentId?: string;
  userId: string;
  username: string;
  userProfilePicture?: string | null;
  createdAt: string;
  isRead: boolean;
};

export default function NotificationBell({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { supabase, session } = useSupabase();

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!supabase || !session?.user?.id) return;

    setIsLoading(true);
    try {
      const userId = session.user.id;

      // Get user's posts
      const { data: userPosts } = await supabase
        .from('posts')
        .select('post_id')
        .eq('user_id', userId);

      const postIds = userPosts?.map(p => p.post_id) || [];

      // Get user's comments
      const { data: userComments } = await supabase
        .from('comments')
        .select('comment_id')
        .eq('user_id', userId);

      const commentIds = userComments?.map(c => c.comment_id) || [];

      const allNotifications: Notification[] = [];

      // Fetch comments on user's posts
      if (postIds.length > 0) {
        const { data: comments } = await supabase
          .from('comments')
          .select(`
            comment_id,
            user_id,
            post_id,
            parent_comment_id,
            content,
            created_at,
            user_profiles!comments_user_id_fkey (
              username,
              profile_picture
            )
          `)
          .in('post_id', postIds)
          .neq('user_id', userId) // Exclude user's own comments
          .is('parent_comment_id', null) // Only top-level comments
          .order('created_at', { ascending: false })
          .limit(20);

        if (comments) {
          comments.forEach((comment: any) => {
            allNotifications.push({
              id: `comment-${comment.comment_id}`,
              type: 'comment',
              message: `${comment.user_profiles?.username || 'Someone'} commented on your post`,
              postId: comment.post_id,
              commentId: comment.comment_id,
              userId: comment.user_id,
              username: comment.user_profiles?.username || 'Unknown',
              userProfilePicture: comment.user_profiles?.profile_picture || null,
              createdAt: comment.created_at,
              isRead: false, // TODO: Implement read status tracking
            });
          });
        }
      }

      // Fetch replies to user's comments
      if (commentIds.length > 0) {
        const { data: replies } = await supabase
          .from('comments')
          .select(`
            comment_id,
            user_id,
            post_id,
            parent_comment_id,
            content,
            created_at,
            user_profiles!comments_user_id_fkey (
              username,
              profile_picture
            )
          `)
          .in('parent_comment_id', commentIds)
          .neq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);

        if (replies) {
          replies.forEach((reply: any) => {
            allNotifications.push({
              id: `reply-${reply.comment_id}`,
              type: 'reply',
              message: `${reply.user_profiles?.username || 'Someone'} replied to your comment`,
              postId: reply.post_id,
              commentId: reply.comment_id,
              userId: reply.user_id,
              username: reply.user_profiles?.username || 'Unknown',
              userProfilePicture: reply.user_profiles?.profile_picture || null,
              createdAt: reply.created_at,
              isRead: false,
            });
          });
        }
      }

      // Fetch votes on user's posts
      if (postIds.length > 0) {
        const { data: votes } = await supabase
          .from('votes')
          .select(`
            vote_id,
            user_id,
            post_id,
            vote_type,
            created_at,
            user_profiles!votes_user_id_fkey (
              username,
              profile_picture
            )
          `)
          .in('post_id', postIds)
          .neq('user_id', userId)
          .is('comment_id', null) // Only post votes, not comment votes
          .order('created_at', { ascending: false })
          .limit(20);

        if (votes) {
          // Group votes by post_id and user_id to avoid spam
          const voteMap = new Map<string, any>();
          votes.forEach((vote: any) => {
            const key = `${vote.post_id}-${vote.user_id}`;
            if (!voteMap.has(key) || new Date(vote.created_at) > new Date(voteMap.get(key).created_at)) {
              voteMap.set(key, vote);
            }
          });

          voteMap.forEach((vote: any) => {
            allNotifications.push({
              id: `vote-${vote.vote_id}`,
              type: 'vote',
              message: `${vote.user_profiles?.username || 'Someone'} ${vote.vote_type === 'upvote' ? 'upvoted' : 'downvoted'} your post`,
              postId: vote.post_id,
              userId: vote.user_id,
              username: vote.user_profiles?.username || 'Unknown',
              userProfilePicture: vote.user_profiles?.profile_picture || null,
              createdAt: vote.created_at,
              isRead: false,
            });
          });
        }
      }

      // Sort by date (newest first) and limit to 50
      allNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(allNotifications.slice(0, 50));
      setUnreadCount(allNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    if (!supabase || !session?.user?.id) return;

    fetchNotifications();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [supabase, session]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read (TODO: Implement in database)
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Navigate to post
    window.location.href = `/dashboard#post-${notification.postId}`;
    setIsOpen(false);
  };

  if (!session?.user?.id) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            fetchNotifications();
          }
        }}
        className="relative hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        aria-label="Notifications"
      >
        <Image
          src={unreadCount > 0 ? "/notification.png" : "/notification_0.png"}
          alt="Notifications"
          width={35}
          height={35}
          className="w-[35px] h-[35px] object-contain"
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-96 max-h-[500px] overflow-y-auto rounded-xl shadow-xl z-50 ${
            isDarkMode ? 'bg-[#2a2a2a] border-white/10' : 'bg-white border-black/10'
          }`}
          style={{ border: '2px solid #899A3C' }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Notifications
            </h3>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading notifications...
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No notifications yet
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full p-4 text-left hover:bg-[#DBE9AF]/30 transition-colors ${
                    !notification.isRead ? (isDarkMode ? 'bg-[#3a3a3a]' : 'bg-[#DBE9AF]/20') : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      {notification.userProfilePicture ? (
                        <img 
                          src={notification.userProfilePicture} 
                          alt={notification.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {notification.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <span className="font-semibold">@{notification.username}</span>{' '}
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

