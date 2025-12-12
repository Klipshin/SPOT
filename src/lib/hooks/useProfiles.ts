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
    const [uploadingImage, setUploadingImage] = useState(false);
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
        profile_picture?: File | string;
        location: string;
    }) {
        if (!userId) throw new Error("User does not exist.");

        try {
            let profilePicturePath = "";

            // Handle file upload (user uploaded an image)
            if (profileData.profile_picture && profileData.profile_picture instanceof File) {
                setUploadingImage(true);
                profilePicturePath = await profileService.uploadProfilePicture(
                    profileData.profile_picture,
                    userId
                );
                setUploadingImage(false);
            } 
            // Handle default avatar path (string path like "/avatar-capybara.png")
            // Convert it to a file and upload to bucket
            else if (profileData.profile_picture && typeof profileData.profile_picture === 'string' && profileData.profile_picture.startsWith('/')) {
                setUploadingImage(true);
                profilePicturePath = await profileService.uploadDefaultAvatar(
                    profileData.profile_picture,
                    userId
                );
                setUploadingImage(false);
            }

            const newProfile = await profileService.createUserProfile(
                {
                    name: profileData.name,
                    username: profileData.username,
                    profile_picture: profilePicturePath, 
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
        } finally {
            setUploadingImage(false);
        }
    }

    async function updateProfilePicture(file: File) {
        if (!userId) throw new Error("User does not exist.");

        try {
            setUploadingImage(true);
            
            // Delete old profile picture if exists
            if (userProfile?.profile_picture) {
                try {
                    await profileService.deleteProfilePicture(userProfile.profile_picture);
                } catch (err) {
                    console.warn("Failed to delete old profile picture:", err);
                }
            }

            // Upload new picture
            const filePath = await profileService.uploadProfilePicture(file, userId);

            // Update database with the new path
            const updatedProfile = await profileService.createUserProfile(
                {
                    name: userProfile?.name || "",
                    username: userProfile?.username || "",
                    profile_picture: filePath, // String path
                    location: userProfile?.location || "",
                },
                userId
            );

            setUserProfile(updatedProfile);
            return updatedProfile;
        } catch (err) {
            setUserError(err instanceof Error ? err.message : "Failed to update profile picture.");
            throw err;
        } finally {
            setUploadingImage(false);
        }
    }

    function getProfilePictureUrl(profile: Profile | null): string | null {
        if (!profile?.profile_picture) return null;
        return profileService.getProfilePictureUrl(profile.profile_picture);
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
        
            if (profile.username === null) {
                router.push("/initial-setup");
                return true;
            }

            if (profile.username === null && profile.is_expert === true) {
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

    return {
        userProfiles, 
        userProfile, 
        userLoading, 
        userError, 
        uploadingImage,
        createUserProfile, 
        checkUserProfile,
        updateProfilePicture,
        getProfilePictureUrl
    }
}