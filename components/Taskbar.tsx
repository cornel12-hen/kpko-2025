'use client';

import { useState, useEffect, useRef } from 'react';
import { Jersey_15 } from "next/font/google";
import AboutWindow from './AboutWindow';
import Image from 'next/image';

const jersey15 = Jersey_15({
  variable: "--font-jersey",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Taskbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<string>("");

  const startMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`${jersey15.variable} font-jersey`}>
      <nav className="fixed left-0 right-0 z-40 bg-[#f5f5f5] border-y-2 border-[#003566] h-12 px-2 flex justify-between items-center shadow-lg
        max-md:top-0 max-md:border-t-0 max-md:border-b-2
        md:bottom-0 md:border-t-2 md:border-b-0
      ">
        <div ref={startMenuRef} className="relative h-full flex items-center">
            <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`
              h-8 px-3 flex items-center gap-2 border-2 rounded-sm border-[#003566] transition-all active:scale-95
              ${isOpen ? 'shadow-inner' :  'shadow-solid-b-sm hover:shadow-none hover:translate-y-px hover:bg-white'}
            `}
          >
            <div className="relative w-5 h-5">

               <Image src="/images/logo.png" alt="OSIS" fill className="object-contain border-[1.5px] border-[#003566] rounded-sm" />
            </div>
            
            <span className="text-lg text-[#000814] hidden sm:block">
              OSISTEL
            </span>
          </button>

          <AboutWindow isOpen={isOpen} />

        </div>

        <div className="h-full flex items-center gap-2 pl-2">
            <div className="w-0.5 h-6 bg-[#003566]/20 mx-1 hidden md:block"></div>

            <div className=" px-3 h-8 flex items-center min-w-20 justify-center">
              <span className="text-xl text-[#000814]">
                {time || "--:--"}
              </span>
            </div>

        </div>

      </nav>
      
      <div className="h-12 w-full md:hidden"></div>
    </div>
  );
}