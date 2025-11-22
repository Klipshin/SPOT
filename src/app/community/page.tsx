'use client';

import Image from "next/image";
import {
  MapPin,
  Users,
  Crown,
  Plus,
  ChevronDown,
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useTheme } from '../components/ThemeContext';

export default function CommunityPage() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`relative min-h-screen pt-[70px] pb-20 px-4 md:px-12 font-poppins transition-colors duration-300 
      ${isDarkMode ? "text-white" : "text-black"}`}
    >

      {/* ===== BACKGROUND IMAGE ===== */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={isDarkMode ? "/communitybgdrk.svg" : "/communitybg.svg"}
          alt="Community page background"
          fill
          priority
          className="object-cover transition-opacity duration-500"
        />
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isDarkMode ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </div>

      {/* ===== MAIN CARD ===== */}
      <div
        className={`relative z-10 rounded-t-none rounded-b-[40px] shadow-sm max-w-[1200px] mx-auto overflow-hidden pb-10 transition-colors duration-300
        ${isDarkMode ? "bg-[#222222] shadow-lg" : "bg-white shadow-sm"}`}
      >

        {/* ===== HEADER SECTION ===== */}
        <div className="relative mb-2">
          <div className="w-full h-[240px] bg-[#C4C4C4]"></div>
          <div
            className={`absolute top-[100px] left-[40px] w-[230px] h-[230px] rounded-full border-[4px] z-20 shadow-md
            ${isDarkMode ? "bg-[#444] border-[#222222]" : "bg-[#D9D9D9] border-white"}`}
          ></div>
        </div>

        {/* ===== INFO HEADER ===== */}
        <div className="px-10 pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-end">
            
            <div className="flex-1 pl-[270px] mt-4 relative z-10">
              <h1
                className={`text-6xl font-black tracking-tight mb-2 leading-none ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                community name
              </h1>

              <div
                className={`flex flex-wrap items-center gap-6 text-xl font-bold mb-2 italic ${
                  isDarkMode ? "text-gray-300" : "text-black"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#5E5CE6]" />
                  <span># members</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#00C92C] rounded-full shadow-[0_0_8px_#00C92C]"></div>
                  <span># online</span>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 font-bold italic text-xl ${
                  isDarkMode ? "text-gray-300" : "text-black"
                }`}
              >
                <MapPin className="w-6 h-6 text-[#FFD700]" />
                <span>location</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 mb-2 mr-2">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#00A3FF] rounded-full flex items-center justify-center shadow-md">
                  <Crown className="w-8 h-8 text-[#FFD700] fill-current" />
                </div>
                <button className="bg-[#0041C2] hover:bg-blue-800 text-white px-14 py-3 rounded-[15px] font-extrabold text-2xl shadow-sm transition-all">
                  Join
                </button>
              </div>
              <button
                className={`px-8 py-2.5 rounded-full font-bold text-base flex items-center gap-2 transition-all shadow-sm
                ${
                  isDarkMode
                    ? "bg-[#D9D9D9] text-black hover:bg-gray-400"
                    : "bg-[#D9D9D9] text-black hover:bg-gray-300"
                }`}
              >
                <div className="bg-[#0057FF] p-0.5 rounded text-white">
                  <Plus className="w-4 h-4" />
                </div>
                Create Post
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-6 mr-4">
            <button
              className={`flex items-center gap-1 font-bold text-base ${
                isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
              }`}
            >
              Sort by <ChevronDown className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        <hr
          className={`border-t-2 mx-12 mb-10 ${
            isDarkMode ? "border-[#444]" : "border-black/10"
          }`}
        />

        {/* ===== CONTENT CARD ===== */}
        {/* Use items-stretch to ensure both columns are the same height */}
        <div
          className={`mx-12 rounded-[40px] border p-8 flex flex-col lg:flex-row gap-8 min-h-[650px] transition-colors duration-300 items-stretch
          ${isDarkMode ? "bg-[#393A2C] border-black" : "bg-[#F8FDEB] border-black"}`}
        >

          {/* LEFT COLUMN */}
          {/* Added flex flex-col to allow justify-between if needed, but we use mt-auto on buttons */}
          <div className="flex flex-col w-full lg:w-[55%]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#A8A8A8] rounded-full border border-gray-400"></div>
                <span className="font-extrabold text-2xl">@username</span>
              </div>
              <span
                className={`text-sm font-bold italic ${
                  isDarkMode ? "text-gray-400" : "text-black/60"
                }`}
              >
                date posted
              </span>
            </div>

            <h2 className="font-extrabold text-3xl mb-4 leading-tight">Heading</h2>

            <div
              className={`w-full h-[420px] rounded-[30px] mb-6 shadow-inner ${
                isDarkMode ? "bg-[#888]" : "bg-[#C4C4C4]"
              }`}
            ></div>

            <p className="text-lg font-bold mb-8">caption</p>

            {/* mt-auto pushes this to the bottom of the Left Column */}
            <div className="flex items-center gap-5 mt-auto">
              <button className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm bg-[#D9D9D9] hover:bg-green-200 transition-colors">
                <ArrowBigUp className="w-7 h-7 text-[#00C92C]" />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm bg-[#D9D9D9] hover:bg-red-200 transition-colors">
                <ArrowBigDown className="w-7 h-7 text-[#FF4C4C]" />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm ml-2 bg-[#D9D9D9] hover:bg-blue-200 transition-colors">
                <MessageCircle className="w-6 h-6 text-[#0057FF] -scale-x-100 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:block w-[2px] bg-black/10 self-stretch rounded-full"></div>

          {/* RIGHT COLUMN */}
          {/* Added flex-col and justify-between so the top content stays top and input box goes to bottom */}
          <div className="flex-1 flex flex-col justify-between">

            {/* TOP: Header & Comments List */}
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-extrabold text-3xl italic">Comments</h3>
                <div className="w-8 h-8 bg-[#00CED1] rounded-full flex items-center justify-center text-black text-sm font-bold shadow-sm">#</div>
              </div>

              {/* COMMENT LIST */}
              <div className="flex flex-col gap-6">
                {/* PARENT COMMENT */}
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 bg-[#A8A8A8] rounded-full border border-gray-400 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">@username</span>
                      <span className="text-xs font-bold text-gray-400">date posted</span>
                    </div>
                    <p className="text-base font-medium mb-2 leading-snug">comment</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full px-3 py-1 bg-[#E0E0E0]">
                        <ArrowBigUp className="w-4 h-4 text-[#00C92C]" />
                        <ArrowBigDown className="w-4 h-4 text-[#FF4C4C]" />
                      </div>
                      <button className="text-xs px-4 py-1 rounded-[6px] font-bold bg-[#D9D9D9] hover:bg-gray-300 transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                  {/* THREAD LINE */}
                  <div className="absolute left-[23px] top-[48px] h-[calc(100%+24px)] w-[2px] bg-[#A8A8A8]"></div>
                </div>

                {/* CHILD COMMENT */}
                <div className="relative flex gap-4 pl-[48px]">
                  <div className="absolute left-[23px] top-[-20px] h-[45px] w-[25px] border-l-[2px] border-b-[2px] rounded-bl-xl border-[#A8A8A8]"></div>
                  <div className="w-12 h-12 bg-[#A8A8A8] rounded-full border border-gray-400 shrink-0 relative z-10"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">@username</span>
                      <span className="text-xs font-bold text-gray-400">date posted</span>
                    </div>
                    <p className="text-base font-medium mb-2 leading-snug">reply</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full px-3 py-1 bg-[#E0E0E0]">
                        <ArrowBigUp className="w-4 h-4 text-[#00C92C]" />
                        <ArrowBigDown className="w-4 h-4 text-[#FF4C4C]" />
                      </div>
                      <button className="text-xs px-4 py-1 rounded-[6px] font-bold bg-[#D9D9D9] hover:bg-gray-300 transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM: INPUT BOX */}
            {/* This should now stick to the bottom because of justify-between on the parent div */}
            <div className="w-full pt-4">
              <div
                className={`flex items-center gap-3 border-[2px] rounded-[20px] px-4 py-2 shadow-sm min-h-[60px] relative transition-colors
                ${isDarkMode ? "bg-[#595A4A] border-[#95AB33]" : "bg-white border-[#95AB33]"}`}
              >
                <div className="w-10 h-10 bg-[#A8A8A8] rounded-full border border-gray-300 shrink-0"></div>

                <textarea
                  placeholder="Write your thoughts here..."
                  rows={1}
                  className={`flex-1 bg-transparent outline-none text-base font-poppins italic resize-none py-2
                  ${
                    isDarkMode
                      ? "text-white placeholder:text-gray-300"
                      : "text-black placeholder:text-gray-400"
                  }`}
                />

                <div className="bg-blue-100 p-1.5 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors shrink-0">
                   <ImageIcon className="w-5 h-5 text-[#0057FF]" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}