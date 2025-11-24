    "use client";

    import React, { useRef, useState } from "react";
    import DefaultAvatars from "./DefaultAvatars";
    import { useProfiles } from "@/src/lib/hooks/useProfiles";
import { useRouter } from "next/navigation";

    interface SetupProfileProps {
    userId: string;
    username: string;
    }

    export default function SetupProfile({ userId, username }: SetupProfileProps) {
    const { createUserProfile } = useProfiles(userId);
    const router = useRouter();
    const [profileName, setProfileName] = useState("");
    const [location, setLocation] = useState("");
    const [profileAvatar, setProfileAvatar] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
            reader.onload = () => {
            if (typeof reader.result === "string") setProfileAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        };

        const handleCreateProfile = async () => {
            if (!profileName.trim()) {
            alert("Please enter a profile name.");
            return;
            }
            if (!location.trim()) {
            alert("Please enter location.");
            return;
            }
            if (!profileAvatar) {
            alert("Please select an avatar.");
            return;
            }

            await createUserProfile({
                name: profileName,
                username,
                profile_picture: profileAvatar,
                location,
            });

            router.push("/dashboard");
        };

    return (
        <div className="relative z-10 flex flex-col items-left justify-center gap-5 w-full px-50">
        <div className="absolute top-4/5 -right-80 transform -translate-y-1/2 pointer-events-none">
            <img src="/spotmascot.svg" className="w-200 h-auto rotate-12" />
        </div>

        <div className="ml-15 font-poppins-black text-4xl text-[#2E0506ED]">Setup Your Profile</div>

        <div className="flex flex-col w-full items-center justify-center px-20 py-10 rounded-4xl bg-[#F1EEE5] gap-5">
            <div className="flex items-center justify-center w-3/5 gap-3">
            <img src="/binoculars.png" className="w-10 h-auto" />
            <div className="relative w-full flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-3/5 font-poppins-semibold text-[#145D1F] text-2xl">@</div>
                <input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your explorer name"
                className="w-full pl-10 p-2 border border-gray-500 rounded-xl text-xl bg-white"
                />
            </div>
            </div>

            <div className="flex flex-row items-center w-full justify-center gap-5">
            <div className="flex w-full flex-col items-center justify-center">
                <h3 className="text-xl font-poppins-semibold">Choose your explorer look</h3>
                <div className="relative mt-5">
                <img
                    src={profileAvatar || "/empty-profile.png"}
                    className="w-30 h-30 rounded-full"
                />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 cursor-pointer"
                    >
                        <img src="/image-picker.png" className="w-8 h-auto" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="mt-6 w-full flex items-center justify-center gap-2">
                <div className="flex-1 h-[1px] bg-gray-300"></div>
                <div className="whitespace-nowrap text-center px-2 text-xs font-poppins text-gray-300">
                    or choose your character
                </div>
                <div className="flex-1 h-[1px] bg-gray-300"></div>
                </div>

                <div className="mt-3">
                <DefaultAvatars onSelect={setProfileAvatar} />
                </div>
            </div>

            <div className="m-5 w-[1px] h-full bg-black" />

            <div className="flex flex-col w-full items-center justify-center mr-25">
                <img src="/location.png" className="w-10 h-auto" />
                <h3 className="text-xl font-poppins-semibold">Where are you located?</h3>
                <p className="text-sm text-[#082E0DBF] text-center">
                Helps other explorers find people in their area and build communities
                </p>
                <div className="relative w-full flex items-center m-3">
                <img
                    src="/location-input.png"
                    className="absolute left-3 top-1/2 -translate-y-1/2 font-poppins-semibold text-[#145D1F] text-2xl"
                />
                <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                    className="w-full pl-12 p-2 border border-gray-500 rounded-xl text-xl bg-white"
                />
                </div>
                <div className="text-sm font-poppins-italic text-gray-400">You can update this anytime</div>

                <button
                onClick={handleCreateProfile}
                className="m-10 w-full rounded-full px-20 py-2 bg-[#C3DEE1CC] shadow-[0_4px_8px_rgba(0,0,0,0.3)] text-xl font-poppins-bold text-[#034CBCBA] flex items-center justify-center gap-2
                    hover:bg-[#034CBCBA] hover:text-[#C3DEE1CC] transition-colors dura ease-in-out cursor-pointer"
                >
                Start Exploring!
                <img src="/binoculars-two.png" className="text-3xl pointer-events-none scale-x-[-1]" />
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    }
