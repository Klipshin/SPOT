import React from "react";

type InfoProps = {
  icon: string;
  title: string;
  data: number;
};

export default function InfoCards({ icon, title, data }: InfoProps) {
  return (
    <div className="relative bg-[#082E0D] w-100 rounded-3xl p-8 cursor-pointer hover:-translate-y-1.5 transition-all duration-300">
      <div className="flex flex-row items-center gap-5 ml-5">
        <img 
          src={icon}
          className="h-full object-contain"
        />

        <div className="flex flex-col flex-1 items-center justify-center text-white font-poppins-bold">
          <div className="text-3xl">{title}</div>
          <div className="text-7xl">{data}</div>
        </div>
      </div>
    </div>
  );
}
