"use client";

import React, { useState } from 'react'
import Link from 'next/link';
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoChevronBackCircle } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import ExpertVerification from './ExpertVerificationForm';
import { signup } from '@/src/lib/auth-actions';

type Props = {
    role: 'enthusiast' | 'expert'; 
    onBack: () => void;
}

export default function SignUpForm({role, onBack} : Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email: string): string | null => {
        if (!email.trim()) {
            return 'Email is required';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        
        return null;
    };

    const validatePassword = (password: string): string | null => {
        if (!password) {
            return 'Password is required';
        }
        
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number';
        }
        
        return null;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm-password') as string;

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            setLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        if (!confirmPassword) {
            setError('Please confirm your password');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            if (role === 'enthusiast') {
                await signup(formData);
                router.push("/auth/login")
            } else {
                await signup(formData);
                setShowVerification(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during signup');
            setLoading(false);
        }
    };

    if (showVerification) {
        return <ExpertVerification />;
    }

    return (
        <div className="z-10 w-full h-auto max-w-6xl bg-white rounded-r-4xl flex overflow-hidden">
            <div className="w-2/5 overflow-hidden">
                <img 
                    src="/snake-signup.png"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative flex-1 flex flex-col items-center justify-start p-2">
                <button 
                    onClick={onBack}
                    className="absolute top-0 left-0 m-3 rounded-full px-5 py-1 bg-[#D0E69069] shadow-[0_4px_8px_rgba(0,0,0,0.3)] text-base font-poppins-bold text-[#082E0DB0] flex items-center justify-center gap-2
                        hover:bg-[#95AB33B2] transition-colors dura ease-in-out cursor-pointer"
                >
                    <IoChevronBackCircle className="pointer-events-none"/>
                    back
                </button>
                
                <div className="flex items-center">
                    <img 
                        src="/spot icon.svg"
                        alt="SPOT logo"
                        className="w-11 h-11"
                    />
                    <h5 className="font-poppins-black bg-gradient-to-b from-[#95AB33] via-[#23732F] via-70% to-[#082E0D] bg-clip-text text-transparent">
                        SPOT
                    </h5>
                </div>

                <div className="relative w-fit">
                    <img 
                        src="/brush-stroke.png"
                        className="w-50 h-auto"
                    />
                    <h3 className="absolute inset-0 flex items-center justify-center text-4xl font-poppins-bold text-[#082E0DB0]">
                        Sign Up
                    </h3>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
                    <div className="mt-4">
                        <div className="relative w-fit">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="border border-[#082E0D8F] outline-none focus:border-black p-3 px-5 w-100 rounded-lg cursor-text"
                                autoComplete="off"
                                required
                                disabled={loading}
                            />
                            <div className="absolute left-5 -top-3">
                                <label
                                    htmlFor="email"
                                    className="bg-white text-sm px-2 font-poppins-italic pointer-events-none"
                                >
                                    Email
                                </label>
                            </div>
                        </div>

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
                                    Password
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
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-65 mt-3 rounded-lg font-poppins-bold text-2xl p-2 text-[#082E0D] bg-[#95AB33B2] 
                            shadow-[0_4px_8px_rgba(0,0,0,0.3)] hover:bg-[#082E0D] hover:text-[#95AB33B2] transition-colors ease-in-out duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="absolute bottom-0 mb-5 flex items-center gap-3 ">
                    <p className="text-sm text-gray-400 font-poppins">{"Already have an account?"}</p>
                    <Link 
                        href="/auth/login"
                        className="text-lg font-poppins-bold text-[#082E0D] hover:text-[#95AB33B2] transition-colors ease-in-out duration-300 cursor-pointer">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    )
}