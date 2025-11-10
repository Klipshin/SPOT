"use client";

import { Profile } from "@/src/utils/supabase/models";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import { profileService } from "../services";

export function useProfiles(userId: string) {
    const { user } = useUser(); 
    const [userProfile, setUserProfile] = useState<Profile| null>(null);
    const [userProfiles, setUserProfiles] = useState<Profile[]>([])
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState<string | null>(null);

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
        if (!user) throw new Error("User does not exist.");

        try {
            const newProfile = await profileService.createUserProfile(
                {
                    name: profileData.name,
                    username: profileData.username,
                    profile_picture: profileData.profile_picture,
                    location: profileData.location,
                },
                user.id
            );
            setUserProfiles((prev) => [newProfile, ...prev]);
            setUserProfile(newProfile);
            return newProfile;
        } catch (err) {
            setUserError(err instanceof Error ? err.message : "Failed to create user.");
            throw err;
        }
    }
    return {userProfiles, userProfile, userLoading, userError, createUserProfile}
}