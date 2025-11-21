"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminProvider = ({ children } : { children: React.ReactNode }) => {
    const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);
    const pathname = usePathname();

    const hasLayout = 
        pathname.startsWith("/admin");

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="h-screen bg-[url('/landingbg1.png')] bg-cover bg-center overflow-hidden">
            {hasLayout && (
                <>
                    <AdminNavbar />
                </>
            )}
            <div className={`flex ${hasLayout ? "pt-16" : "" }`}>
                {hasLayout && (
                    <AdminSidebar />
                )}
                <main 
                    className={`flex-1 transition-all duration-300 ${
                        hasLayout
                            ? isSidebarOpen
                            ? "lg:ml-70"
                            : "lg:ml-20"
                            : ""
                        }`}
                >
                    <div className="p-6 ">{children}</div>
                </main>
            </div>

        </div>
    );
}
export default AdminProvider;