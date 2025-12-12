"use client";

import { useEffect, useState, useMemo } from "react";
import { adminService } from "../services";

export type AnalyticsData = {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalExperts: number;
  verifiedExperts: number;
  pendingExperts: number;
  totalPosts: number;
  totalComments: number;
  totalVotes: number;
  upvotes: number;
  downvotes: number;
  totalReports: number;
  dismissedReports: number;
  activeReports: number;
  totalCommunities: number;
  userGrowth: { date: string; count: number }[];
  postGrowth: { date: string; count: number }[];
  reportsByType: { type: string; count: number }[];
  usersByMonth: { month: string; count: number }[];
  postsByMonth: { month: string; count: number }[];
};

export default function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminService.getAnalytics();
      
      // Process user data
      const totalUsers = data.users.length;
      const activeUsers = data.users.filter((u: any) => !u.is_suspended).length;
      const suspendedUsers = data.users.filter((u: any) => u.is_suspended).length;
      
      // Process expert data
      const totalExperts = data.experts.length;
      const verifiedExperts = data.experts.filter((e: any) => e.is_verified).length;
      const pendingExperts = data.experts.filter((e: any) => !e.is_verified).length;
      
      // Process content data
      const totalPosts = data.posts.length;
      const totalComments = data.comments.length;
      const totalVotes = data.votes.length;
      const upvotes = data.votes.filter((v: any) => v.vote_type === 'upvote').length;
      const downvotes = data.votes.filter((v: any) => v.vote_type === 'downvote').length;
      
      // Process reports data
      const totalReports = data.reports.length;
      const dismissedReports = data.reports.filter((r: any) => r.is_dismissed === true).length;
      const activeReports = totalReports - dismissedReports;
      
      // Process communities
      const totalCommunities = data.communities.length;
      
      // Calculate growth data
      const userGrowth = calculateGrowth(data.users, 'created_at');
      const postGrowth = calculateGrowth(data.posts, 'created_at');
      
      // Reports by type
      const reportsByType = [
        { type: 'post', count: data.reports.filter((r: any) => r.type === 'post').length },
        { type: 'comment', count: data.reports.filter((r: any) => r.type === 'comment').length },
      ];
      
      // Monthly data
      const usersByMonth = calculateMonthlyGrowth(data.users, 'created_at');
      const postsByMonth = calculateMonthlyGrowth(data.posts, 'created_at');
      
      setAnalytics({
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalExperts,
        verifiedExperts,
        pendingExperts,
        totalPosts,
        totalComments,
        totalVotes,
        upvotes,
        downvotes,
        totalReports,
        dismissedReports,
        activeReports,
        totalCommunities,
        userGrowth,
        postGrowth,
        reportsByType,
        usersByMonth,
        postsByMonth,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  function calculateGrowth(data: any[], dateField: string) {
    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const counts = last30Days.map(date => {
      const count = data.filter((item: any) => {
        if (!item[dateField]) return false;
        const itemDate = new Date(item[dateField]).toISOString().split('T')[0];
        return itemDate === date;
      }).length;
      return { date, count };
    });

    return counts;
  }

  function calculateMonthlyGrowth(data: any[], dateField: string) {
    const now = new Date();
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    const counts = last12Months.map(month => {
      const count = data.filter((item: any) => {
        if (!item[dateField]) return false;
        const itemDate = new Date(item[dateField]);
        const itemMonth = itemDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return itemMonth === month;
      }).length;
      return { month, count };
    });

    return counts;
  }

  return { analytics, loading, error, reload: loadAnalytics };
}

