import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function AdminSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const [clickedItem, setClickedItem] = useState("/admin/dashboard");

  const menuItems = [
    { icon: "/admin-dashboard.svg", label: "Dashboard", href: "/admin/dashboard" },
    { icon: "/admin-users.svg", label: "User Management", href: "/admin/users" },
    { icon: "/admin-reports.svg", label: "Reports", href: "/admin/reports" },
    { icon: "/admin-analytics.svg", label: "Analytics", href: "/admin/analytics" },
  ];

  useEffect(() => {
    setClickedItem(pathname);
  }, [pathname]);

  return (
    <>
      {/* MOBILE NAVBAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black z-50">
        <div className="flex items-center justify-between py-2 px-2">
          {menuItems.slice(0, 2).map((item) => {
            const isHighlighted =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center py-1 px-2 rounded-lg hover:bg-[#29411a] transition-all duration-200 group flex-1"
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`w-6 h-6 mb-1 transition-colors ${
                    isHighlighted ? "brightness-150" : "opacity-60"
                  }`}
                />
                <span
                  className={`text-xs transition-colors ${
                    isHighlighted ? "text-white" : "text-gray-300"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {menuItems.slice(2, 4).map((item) => {
            const isHighlighted =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center py-1 px-2 rounded-lg hover:bg-[#29411a] transition-all duration-200 group flex-1"
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`w-6 h-6 mb-1 transition-colors ${
                    isHighlighted ? "brightness-150" : "opacity-60"
                  }`}
                />
                <span
                  className={`text-xs transition-colors ${
                    isHighlighted ? "text-white" : "text-gray-300"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } hidden lg:flex h-screen bg-[#101220] text-black transition-all duration-300 flex-col overflow-hidden fixed left-0 top-16 z-40`}
      >
        <nav className="flex flex-col mt-6 space-y-3">
          {menuItems.map((item) => {
            const isHighlighted =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative flex items-center transition-all duration-300 w-full py-3
                  ${isOpen ? "gap-6 px-8" : "justify-center px-0"}`}
              >
                <span
                  className={`absolute top-0 left-0 h-full w-2 bg-lime transition-opacity duration-300 ${
                    isHighlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <span
                  className={`absolute transition-all duration-300 ${
                    isOpen
                      ? "inset-0 bg-[#29411a] opacity-0 group-hover:opacity-100"
                      : "left-2 right-2 top-0 bottom-0 bg-lime opacity-0 group-hover:opacity-100 rounded-lg"
                  }`}
                />
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`relative z-10 w-6 h-6 transition ${
                    isHighlighted ? "brightness-150" : "opacity-70 group-hover:brightness-150"
                  }`}
                />
                <span
                  className={`relative z-10 text-lg text-white transition-all duration-300 whitespace-nowrap ${
                    isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
