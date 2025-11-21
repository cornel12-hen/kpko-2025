import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="font-jersey w-full max-w-md p-8 text-center">
      <h1 className="text-7xl max-sm:text-5xl text-[#003566]">
        E-KPKO 2025
      </h1>
      <p className="text-[#000814] mb-8 text-xl/5">
        Young Leaders, Bright Future
      </p>
      
      <Link 
        href="/login"
        className="w-full flex flex-col justify-center items-center py-3 px-6 text-[#000814]"
      >
        <Image
          src="/images/Exe.svg"
          alt="FolderIcon"
          width={48}
          height={48}
          className='transition duration-300 transform hover:scale-105'
        />
        <p className='text-sm mt-1'>E-KPKO 2025.exe</p>
      </Link>
    </div>
  );
}