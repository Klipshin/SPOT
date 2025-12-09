import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function AdminSidebar() {
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black z-50">
        <div className="flex items-center justify-between py-2 px-2">
          {menuItems.map((item) => {
            const isActive =
              clickedItem === item.href || clickedItem.startsWith(item.href + "/");

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all duration-200 flex-1
                  ${isActive ? "bg-[#29411a]" : "hover:bg-[#29411a]"}`}
                onClick={() => setClickedItem(item.href)}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`w-6 h-6 ${isActive ? "brightness-150" : "opacity-60"}`}
                />
                <span className={`text-xs ${isActive ? "text-white" : "text-gray-300"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="w-20 hidden lg:flex h-screen bg-[#74863B] flex-col overflow-hidden fixed left-0 top-16 z-40">
        <nav className="flex-1 flex-col justify-between">
          {menuItems.map((item) => {
            const isActive =
              clickedItem === item.href || clickedItem.startsWith(item.href + "/");

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative flex items-center justify-center w-full py-12 px-5 transition-all duration-200
                  ${isActive ? "bg-[#C4DA83]" : "hover:bg-[#C4DA83]"}`}
                onClick={() => setClickedItem(item.href)}
              >
                <img
                  src={item.icon}
                  className={`w-10 h-auto ${isActive ? "" : "opacity-70"}`}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
