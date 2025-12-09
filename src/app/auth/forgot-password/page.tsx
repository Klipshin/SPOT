"use client";

import { createClient } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoChevronBackCircle } from "react-icons/io5";

export default function ForgotPasswordPage() {
    const getSupabase = () => createClient();
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get("email") as string;

        const supabase = getSupabase();
        await supabase.auth.resetPasswordForEmail(email);

        setSent(true);
        setLoading(false);
    }
  return (
    <div className="min-h-screen flex items-center justify-center px-50 bg-gradient-to-b from-[#F5FFCC] to-[#A8FFC8]">
        <div className="w-full flex flex-col items-center justify-center bg-white rounded-4xl pb-10">
            <img 
                src="/forgot-pass-email.png"
                className="w-85 h-auto"
            />
            
            <div className="-mt-8 text-4xl font-poppins-bold text-[#4D0202CF]">{"Forgot your password?"}</div>
            
            <div className="mt-1 text-base font-poppins-italic text-[#4D020273]">{"Enter the email associated with your account. "}</div>
            
            <form onSubmit={handleSubmit}>
                <div className="relative w-fit mt-8 flex flex-col items-center">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="border border-[#082E0D8F] outline-none focus:border-black p-3 px-5 w-100 rounded-lg cursor-text"
                        autoComplete="off"
                    />
                    <div className="absolute left-5 -top-3">
                        <label
                            htmlFor="email"
                            className="bg-white text-sm px-2 font-poppins-italic pointer-events-none"
                        >
                            Email
                        </label>
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full m-5 rounded-lg font-poppins-bold text-xl p-2 text-[#FFC6C6] bg-[#792828] 
                            shadow-[0_4px_8px_rgba(0,0,0,0.3)] hover:bg-[#FFC6C6] hover:text-[#792828] transition-colors ease-in-out duration-300 cursor-pointer">
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </div>
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
