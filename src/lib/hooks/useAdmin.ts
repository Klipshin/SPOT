"use client";

import { Comment, Expert, Post, Profile, Report } from "@/src/utils/supabase/models";
import { useEffect, useState } from "react";
import { adminService } from "../services";
import { profileService } from "../services";

export type ReportWithProfiles = Report & {
  reporterProfile: Pick<Profile, "username" | "name" | "profile_picture"> | null;
  reportedProfile: Pick<Profile, "username" | "name" | "profile_picture"> | null;
  postContent: Post | null;
  commentContent: Comment | null;
};

export default function useAdmin() {
  const [verifiedExperts, setVerifiedExperts] = useState<(Expert & Profile)[]>([]);
  const [pendingExperts, setPendingExperts] = useState<(Expert & Profile)[]>([]);
  const [totalUsers, setTotalUsers] = useState<Profile[]>([]);
  const [activeUsers, setActiveUsers] = useState<Profile[]>([]);
  const [suspendedUsers, setSuspendedUsers] = useState<Profile[]>([]);
  const [totalUndismissedReports, setTotalUndismissedReports] = useState<ReportWithProfiles[]>([]);
  const [totalReports, setTotalReports] = useState<ReportWithProfiles[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTotalUsers();
    loadVerifiedExperts();
    loadPendingExperts();
    loadActiveUsers();
    loadSuspendedUsers();
    loadTotalUndismissedReports();
    loadTotalReports();
  }, []);

  async function loadTotalUndismissedReports() {
    try {
      setLoading(true);
      setError(null);

      const reports: Report[] = await adminService.getUndismissedReports();

      const reportsWithProfiles = await Promise.all(
        reports.map(async (report) => {
          if (!report.reporter_user_id || !report.reported_user_id) {
            return {
              ...report,
              reporterProfile: null,
              reportedProfile: null,
              postContent: null,
              commentContent: null,
            };
          }

          try {
            const [reporterProfile, reportedProfile] = await Promise.all([
              profileService.getUserProfile(report.reporter_user_id),
              profileService.getUserProfile(report.reported_user_id),
            ]);

            let postContent: Post | null = null;
            let commentContent: Comment | null = null;

            if (report.type === "post") {
              const post = await adminService.getPost(report.content_id);
              postContent = post && post.length ? post[0] : null;
            } else if (report.type === "comment") {
              const comment = await adminService.getComment(report.content_id);
              commentContent = comment && comment.length ? comment[0] : null;
            }

            return {
              ...report,
              reporterProfile,
              reportedProfile,
              postContent,
              commentContent,
            };
          } catch (err) {
            return {
              ...report,
              reporterProfile: null,
              reportedProfile: null,
              postContent: null,
              commentContent: null,
            };
          }
        })
      );

      setTotalUndismissedReports(reportsWithProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load total reports.");
    } finally {
      setLoading(false);
    }
  }

  async function loadTotalReports() {
    try {
      setLoading(true);
      setError(null);

      const reports: Report[] = await adminService.getTotalReports();

      const reportsWithProfiles = await Promise.all(
        reports.map(async (report) => {
          if (!report.reporter_user_id || !report.reported_user_id) {
            return {
              ...report,
              reporterProfile: null,
              reportedProfile: null,
              postContent: null,
              commentContent: null,
            };
          }

          try {
            const [reporterProfile, reportedProfile] = await Promise.all([
              profileService.getUserProfile(report.reporter_user_id),
              profileService.getUserProfile(report.reported_user_id),
            ]);

            let postContent: Post | null = null;
            let commentContent: Comment | null = null;

            if (report.type === "post") {
              const post = await adminService.getPost(report.content_id);
              postContent = post && post.length ? post[0] : null;
            } else if (report.type === "comment") {
              const comment = await adminService.getComment(report.content_id);
              commentContent = comment && comment.length ? comment[0] : null;
            }

            return {
              ...report,
              reporterProfile,
              reportedProfile,
              postContent,
              commentContent,
            };
          } catch (err) {
            return {
              ...report,
              reporterProfile: null,
              reportedProfile: null,
              postContent: null,
              commentContent: null,
            };
          }
        })
      );

      setTotalReports(reportsWithProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load total reports.");
    } finally {
      setLoading(false);
    }
  }

  async function loadTotalUsers() {
    try {
      setLoading(true);
      setError(null);
      const users = await adminService.getTotalUsers();
      const usersWithProfiles = users.map((user: Profile) => ({
        ...user,
        profileUrl: user.profile_picture || "/default-avatar.png",
        name: user.name || "Unknown",
        username: user.username || "unknown",
        location: user.location || "Unknown",
      }));
      setTotalUsers(usersWithProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load total users.");
    } finally {
      setLoading(false);
    }
  }

  async function loadVerifiedExperts() {
    try {
      setLoading(true);
      setError(null);
      const experts = await adminService.getVerifiedExperts();
      const expertsWithProfiles = await Promise.all(
        experts.map(async (expert: Expert) => {
          try {
            const profile = await profileService.getUserProfile(expert.user_id);
            return { ...expert, ...profile };
          } catch {
            return {
              ...expert,
              profileUrl: "/default-avatar.png",
              name: "Unknown",
              username: "unknown",
              location: "Unknown",
            };
          }
        })
      );
      setVerifiedExperts(expertsWithProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load verified experts.");
    } finally {
      setLoading(false);
    }
  }

  async function loadPendingExperts() {
    try {
      setLoading(true);
      setError(null);
      const experts = await adminService.getPendingExperts();
      const expertsWithProfiles = await Promise.all(
        experts.map(async (expert: Expert) => {
          try {
            const profile = await profileService.getUserProfile(expert.user_id);
            return { ...expert, ...profile };
          } catch {
            return {
              ...expert,
              profileUrl: "/default-avatar.png",
              name: "Unknown",
              username: "unknown",
              location: "Unknown",
            };
          }
        })
      );
      setPendingExperts(expertsWithProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pending experts.");
    } finally {
      setLoading(false);
    }
  }

  async function loadActiveUsers() {
    try {
      setLoading(true);
      setError(null);
      const users = await adminService.getActiveUsers();
      const usersWithProfiles = users.map((user: Profile) => ({
        ...user,
        profileUrl: user.profile_picture || "/default-avatar.png",
        name: user.name || "Unknown",
        username: user.username || "unknown",
        location: user.location || "Unknown",
      }));
      setActiveUsers(usersWithProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load active users.");
    } finally {
      setLoading(false);
    }
  }

  async function loadSuspendedUsers() {
    try {
      setLoading(true);
      setError(null);
      const users = await adminService.getSuspendedUsers();
      const usersWithProfiles = users.map((user: Profile) => ({
        ...user,
        profileUrl: user.profile_picture || "/default-avatar.png",
        name: user.name || "Unknown",
        username: user.username || "unknown",
        location: user.location || "Unknown",
      }));
      setSuspendedUsers(usersWithProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load suspended users.");
    } finally {
      setLoading(false);
    }
  }

  async function approveExpert(expert_id: string) {
    try {
      setLoading(true);
      await adminService.approveExpert(expert_id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve expert.");
    } finally {
      setLoading(false);
    }
  }

  async function rejectExpert(expert_id: string) {
    try {
      setLoading(true);
      await adminService.rejectExpert(expert_id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject expert.");
    } finally {
      setLoading(false);
    }
  }

  async function activateUser(user_id: string) {
    try {
      setLoading(true);
      await adminService.activateUser(user_id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate user.");
    } finally {
      setLoading(false);
    }
  }

  async function suspendUsers(user_id: string) {
    try {
      setLoading(true);
      await adminService.suspendUser(user_id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suspend user.");
    } finally {
      setLoading(false);
    }
  }

  async function dismissReport(reportId: string) {
    try {
      setLoading(true);
      await adminService.dismissReport(reportId);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to dismiss report.");
    } finally {
      setLoading(false);
    }
  }

  async function reload() {
    await Promise.all([loadVerifiedExperts(), loadPendingExperts()]);
  }

  return {
    totalUsers,
    verifiedExperts,
    pendingExperts,
    activeUsers,
    suspendedUsers,
    loading,
    error,
    approveExpert,
    rejectExpert,
    suspendUsers,
    activateUser,
    dismissReport,
    totalReports,
    totalUndismissedReports,
    reload,
  };
}
