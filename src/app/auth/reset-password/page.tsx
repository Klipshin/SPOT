"use client";

import { createClient } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoChevronBackCircle } from "react-icons/io5";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

export default function ForgotPasswordPage() {
    const getSupabase = () => createClient();
    const router = useRouter();
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirm-password") as string;

        if (password !== confirmPassword) {
        alert("Passwords do not match!");
        setLoading(false);
        return;
        }
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.updateUser({
        password,
        });

        if (error) {
        alert(error.message);
        setLoading(false);
        return;
        }

        router.push("/auth/login");
    }

  return (
    <div className="min-h-screen flex items-center justify-center px-50 bg-gradient-to-b from-[#F5FFCC] to-[#A8FFC8]">
        <div className="w-full flex flex-col items-center justify-center bg-white rounded-4xl pb-10">
            <img 
                src="/reset-pass.png"
                className="w-65 h-auto"
            />
            
            <div className="mt-3 text-4xl font-poppins-bold text-[#4D0202CF]">{"Reset your password"}</div>
            
            <div className="mt-1 text-base font-poppins-italic text-[#4D020273]">{"Please set your new password."}</div>
            
            <form onSubmit={handleSubmit} className="relative w-fit">
                <div className="relative w-fit mt-5">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="border border-[#082E0D8F] outline-none focus:border-black p-3 px-5 w-100 rounded-lg cursor-text transition-colors duration-600 ease-in-out"
                        autoComplete="off"
                        required
                        disabled={loading}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white cursor-pointer"
                        disabled={loading}
                    >
                        {showPassword ? (
                            <PiEyeBold className="text-2xl" />
                        ) : (
                            <PiEyeClosedBold className="text-2xl" />
                        )}
                    </button>
                    <div className="absolute left-5 -top-3">
                        <label
                            htmlFor="password"
                            className="bg-white text-sm px-2 font-poppins-italic pointer-events-none"
                        >
                            New Password
                        </label>
                    </div>
                </div>

                <div className="relative w-fit mt-5">
                    <input
                        id="confirm-password"
                        name="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        className="border border-[#082E0D8F] outline-none focus:border-black p-3 px-5 w-100 rounded-lg cursor-text transition-colors duration-600 ease-in-out"
                        autoComplete="off"
                        required
                        disabled={loading}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white cursor-pointer"
                        disabled={loading}
                    >
                        {showConfirmPassword ? (
                            <PiEyeBold className="text-2xl" />
                        ) : (
                            <PiEyeClosedBold className="text-2xl" />
                        )}
                    </button>
                    <div className="absolute left-5 -top-3">
                        <label
                            htmlFor="confirm-password"
                            className="bg-white text-sm px-2 font-poppins-italic pointer-events-none"
                        >
                            Confirm Password
                        </label>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full my-5 rounded-lg font-poppins-bold text-xl p-2 text-[#FFC6C6] bg-[#792828] 
                        shadow-[0_4px_8px_rgba(0,0,0,0.3)] hover:bg-[#FFC6C6] hover:text-[#792828] transition-colors ease-in-out duration-300 cursor-pointer">
                    {loading ? "Loading..." : "Change password"}
                </button>
            </form>

            <button 
                onClick={() => router.push("/auth/login")}
                className="rounded-lg px-8 py-1 text-base font-poppins-bold text-[#082E0DB0] flex items-center justify-center gap-2
                    hover:bg-[#95AB33B2]/35 transition-colors duration-300 ease-in-out cursor-pointer"
            >
                <IoChevronBackCircle />
                Back to Log in
            </button>

        </div>
    </div>
  )
}
