"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function AdminNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md transition-transform duration-300 z-50">
            <div className="max-w-8xl mx-auto px-5">
                <div className="flex justify-between items-center h-16">
                    
                    <div className="flex flex-row items-center space-x-2 sm:space-x-4 lg:space-x-6">

                        <Link href="/admin/dashboard" className="flex items-center space-x-2">
                            <img
                                src="/spot icon.svg"
                                alt="SPOT"
                                width={56}
                                height={56}
                                className="w-[2.5rem] h-[2.5rem] sm:w-[3.5rem] sm:h-[3.5rem]"
                            />

                            <div className="font-poppins-black lg:text-4xl mr-12 sm:mr-0
                                bg-gradient-to-b from-[#95AB33] via-[#23732F] via-70% to-[#082E0D] bg-clip-text text-transparent"
                            >
                                SPOT
                            </div>

                            <div className="px-2 mt-2 font-poppins-black text-2xl text-[#4A5C00]">
                                ADMIN
                            </div>
                        </Link>

                    </div>

                    <div className="p-2 flex justify-center items-center rounded-full hover:bg-[#95AB33]/25 transition-colors duration-200">
                        <button 
                            onClick={() => router.push("/")}
                            className="cursor-pointer">
                            <img 
                                src="/logout.png"
                                className="w-8 h-auto"
                                alt="Logout"
                            />
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}
