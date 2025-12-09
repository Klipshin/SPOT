"use client";

import React, { useState } from "react";
import SetupProfile from "./SetupProfile";

export default function UsernameCreation({ currentUser }: { currentUser: string }) {
  const [showNextSetup, setShowNextSetup] = useState(false);
  const [username, setUsername] = useState("");

  const handleNext = () => {
    if (!username.trim()) {
      alert("Please enter a username.");
      return;
    }
    setShowNextSetup(true);
  };

  if (showNextSetup) {
    return <SetupProfile userId={currentUser} username={username} />;
  }

  return (
    <div className="relative z-10 flex flex-col items-left justify-center gap-5 w-8/9 p-50">
      <div className="absolute top-1/2 -right-30 transform -translate-y-1/2 pointer-events-none">
        <img src="/spotmascot.svg" className="w-200 h-auto" />
      </div>

      <div className="ml-10 flex items-center gap-5">
        <h2 className="font-poppins-black text-5xl text-[#2E0506ED]">Welcome to</h2>
        <div className="flex items-center px-6 py-1 border-10 rounded-4xl border-[#23732F5C] bg-[#F1EEE5]">
          <img src="/spot icon.svg" alt="SPOT logo" className="-ml-3 w-20 h-auto" />
          <h2 className="text-5xl font-poppins-extrabold bg-gradient-to-b from-[#95AB33] via-[#23732F] via-70% to-[#082E0D] bg-clip-text text-transparent">
            SPOT
          </h2>
        </div>
      </div>

      <div className="flex w-full items-center justify-start px-20 py-10 rounded-4xl bg-[#F1EEE5]">
        <div className="flex flex-col items-center justify-center gap-7">
          <p className="text-base font-poppins-bold text-[#145D1F]">
            {"Before you start exploring, let’s set up your profile."}
          </p>

          <div className="flex flex-col justify-center items-center">
            <p className="font-poppins text-[#082E0D]">{"What's your explorer name?"}</p>
            <p className="text-xs font-poppins-italic text-gray-600">{"You can change this anytime."}</p>
          </div>

          <div className="flex items-center justify-center w-full gap-3">
            <img src="/binoculars.png" className="w-10 h-auto" />
            <div className="relative w-full flex items-center">
              <div className="absolute left-3 top-1/2 -translate-y-3/5 font-poppins-semibold text-[#145D1F] text-2xl">@</div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mr-10 pl-10 p-2 border border-gray-500 rounded-xl text-xl bg-white"
                placeholder="Your username"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex flex-row items-center justify-center w-100">
          <button
            onClick={handleNext}
            className="group flex items-center justify-start gap-2 w-full px-10 py-2 cursor-pointer rounded-full text-2xl font-poppins-bold text-[#26BA9A] bg-white transition-all duration-300"
          >
            <span className="flex items-center gap-2 transform transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-105">
              next
              <img src="/right-arrow.png" className="w-10 h-auto" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
