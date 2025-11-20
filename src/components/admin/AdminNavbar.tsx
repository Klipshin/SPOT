import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { IoMenu } from 'react-icons/io5';

export default function AdminNavbar({ onMenuClick } : { onMenuClick: () => void }) {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md transition-transform duration-300 z-50">
            <div className="max-w-8xl mx-auto px-3 sm:px-8 lg:px-12">
                <div className="flex justify-between items-center h-16">
                    <div className="flex flex-row items-center space-x-2 sm:space-x-4 lg:space-x-6">
                        <button
                        className="hidden lg:block p-3 sm:p-2 rounded-md hover:cursor-pointer hover:text-[#101220] transition-all duration-200"
                        onClick={onMenuClick} 
                        >
                        <IoMenu className="text-2xl" />
                        </button>

                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <img
                                src="/spot icon.svg"
                                alt="SPOT"
                                width={56}
                                height={56}
                                className="w-[2.5rem] h-[2.5rem] sm:w-[3.5rem] sm:h-[3.5rem]"
                            />
                            <h3 className="font-poppins-black text-xl sm:text-2xl mr-12 sm:mr-0
                                bg-gradient-to-b from-[#95AB33] via-[#23732F] via-70% to-[#082E0D] bg-clip-text text-transparent"
                            >
                                SPOT
                            </h3>
                            <h5 className="font-poppins-bold text-md sm:text-lg mr-12 sm:mr-0 bg-[#4A5C00]">
                                ADMIN
                            </h5>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
