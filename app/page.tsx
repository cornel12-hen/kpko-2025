'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(false);

  const handleSingleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  const handleDoubleClick = () => {
    router.push('/login');
  };

  const handleOutsideClick = () => {
    setIsSelected(false);
  };

  return (
    <div 
      className="font-jersey w-full h-full min-h-screen flex flex-col items-center justify-center p-8 text-center"
      onClick={handleOutsideClick}
    >
      <h1 className="text-7xl max-sm:text-5xl text-[#003566]">
        E-KPKO 2025
      </h1>
      <p className="text-[#000814] mb-8 text-xl/5">
        Young Leaders, Bright Future
      </p>
      
      <div 
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
        className={`
          w-auto flex flex-col justify-center items-center py-3 px-4 text-[#000814]
          cursor-pointer rounded-sm
          transition duration-200
          ${isSelected 
            ? 'bg-[#003566]/10 border-none'
            : 'hover:bg-[#003566]/5'
          }
        `}
      >
        <div className={`transition duration-300 transform ${isSelected ? '' : 'hover:scale-105'}`}>
          <Image
            src="/images/Exe.svg"
            alt="FolderIcon"
            width={48}
            height={48}
            className="pointer-events-none select-none" 
          />
        </div>
        
        <p className={`text-sm mt-1 px-1}`}>
          E-KPKO 2025.exe
        </p>
      </div>
      <div className='mt-2 text-sm flex flex-col items-center'>
        <ArrowUp className='stroke-[#a5a5a5] animate-float'/>
        <p className='mt-1 text-sm text-[#a5a5a5] animate-pulse-scale'>Klik 2 kali ya!</p>
      </div>
    </div>
  );
}