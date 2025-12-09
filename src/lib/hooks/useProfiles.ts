"use client";

import { Profile } from "@/src/utils/supabase/models";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import { expertService, profileService } from "../services";
import { useRouter } from "next/navigation";

export function useProfiles(userId: string) {
    const { user } = useUser(); 
    const [userProfile, setUserProfile] = useState<Profile| null>(null);
    const [userProfiles, setUserProfiles] = useState<Profile[]>([])
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (user && userId) {
            loadUser(userId);
        }
    }, [userId, user]);

    async function loadUser(userId: string) {
        if (!user) return;

        try {
            setUserLoading(true);
            setUserError(null);
            const data = await profileService.getUserProfile(userId);
            setUserProfile(data);
        } catch (err) {
            setUserError (err instanceof Error ? err.message : "Failed to load user.");
        } finally {
            setUserLoading(false);
        }
    }

    async function createUserProfile(profileData: {
        name: string;
        username: string;
        profile_picture: string;
        location: string;
    }) {
        if (!userId) throw new Error("User does not exist.");

        try {
            const newProfile = await profileService.createUserProfile(
                {
                    name: profileData.name,
                    username: profileData.username,
                    profile_picture: profileData.profile_picture,
                    location: profileData.location,
                },
                userId
            );
            setUserProfiles((prev) => [newProfile, ...prev]);
            setUserProfile(newProfile);
            return newProfile;
        } catch (err) {
            setUserError(err instanceof Error ? err.message : "Failed to create user.");
            throw err;
        }
    }

    async function checkUserProfile(userId: string) {
        if (!userId) {
            setUserError("No user id available to check profile.");
            return false;
        }

        try {
            setUserLoading(true);
            setUserError(null);
            const profile = await profileService.getUserProfile(userId);
        
            if (profile.username !== null) {
                router.push("/initial-setup");
                return true;
            }

            if (profile.is_expert === true) {

                const expert = await expertService.getExpert(userId);

                if (!expert) {
                    router.push("/auth/expert-verification");
                    return true;
                }

                router.push("/initial-setup");
                return true;
            }
            
            router.push("/dashboard");
            return true;
        } catch (err) {
            setUserError (err instanceof Error ? err.message : "Failed to load user.");
            return false;
        } finally {
            setUserLoading(false);
        }
    }

    return {userProfiles, userProfile, userLoading, userError, createUserProfile, checkUserProfile}
}