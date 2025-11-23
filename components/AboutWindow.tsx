'use client';

import { Jersey_15 } from "next/font/google";

const jersey15 = Jersey_15({
  variable: "--font-jersey",
  subsets: ["latin"],
  weight: ["400"],
});

type AboutWindowProps = {
  isOpen: boolean;
};

export default function AboutWindow({ isOpen }: AboutWindowProps) {
  if (!isOpen) return null;

  return (
    <div 
      className={`
        ${jersey15.variable} font-jersey
        absolute z-50 w-64 p-1
        top-full left-0 mt-2 ml-2
        md:top-auto md:bottom-full md:mb-2 md:ml-2
        bg-[#d9d9d9] border-2 border-[#003566] shadow-[4px_4px_0_0_#000814]
        animate-in fade-in zoom-in-95 duration-200
      `}
    >
      {/* Header Biru */}
      <div className="bg-[#003566] px-2 py-1 flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
        <span className="text-white text-xs tracking-wider">ABOUT.TXT</span>
      </div>

      {/* Konten */}
      <div className="bg-white border-2 border-[#003566] p-4 text-center">
        <p className="text-[#000814] text-lg leading-tight">
          Made with <span className="text-red-500 animate-pulse">♥</span> by <br/>
          <span className="font-bold text-[#003566]">Panitia KPKO 2025</span>
        </p>
        <div className="mt-3 text-xs text-gray-500 border-t border-gray-200 pt-2">
          v1.0.0 (Stable)
        </div>
      </div>
    </div>
  );
}