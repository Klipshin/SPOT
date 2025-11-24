"use client";

import { useState } from "react";

interface DefaultAvatarsProps {
  onSelect?: (avatar: string) => void; // callback to parent
}

export default function DefaultAvatars({ onSelect }: DefaultAvatarsProps) {
  const avatars = [
    "/avatar-capybara.png",
    "/avatar-cat.png",
    "/avatar-duck.png",
    "/avatar-hamster.png",
    "/avatar-rabbit.png",
  ];

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (avatar: string) => {
    setSelected(avatar);
    if (onSelect) onSelect(avatar); // notify parent
  };

  return (
    <div className="flex gap-2">
      {avatars.map((avatar, i) => (
        <button
          key={i}
          onClick={() => handleSelect(avatar)}
          className={`
            relative rounded-full transition-all duration-200 cursor-pointer
            ${selected === avatar ? "ring-2 ring-black" : ""}
          `}
        >
          <div
            className={`
              rounded-full border-4 border-white overflow-hidden
              transition-all duration-200
              hover:ring-2 hover:ring-black
            `}
          >
            <img
              src={avatar}
              alt={`Avatar ${i + 1}`}
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
