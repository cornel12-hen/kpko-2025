import LogoutButton from "@/components/LogoutButton";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";
import { Geist, Geist_Mono, Jersey_15 } from "next/font/google";

const jersey15 = Jersey_15({
  variable: "--font-jersey",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${jersey15.variable} font-jersey min-h-screen py-16 bg-gray-50 text-[#000814]`}>
      <div className="flex flex-col max-w-5xl max-h-[calc(100vh-128px)] mx-auto p-3 rounded-sm bg-[#d9d9d9] border-2 border-[#003566] gap-3">
        <div className="w-full h-8 flex justify-between items-center">
          <p className="text-lg pl-2">KPKO 2025.exe</p>
          <LogoutButton />
        </div>
        <div className="w-full mx-auto rounded-sm flex flex-col flex-1 bg-[#f2f2f2] border-2 border-[#003566] overflow-hidden">
          <Navbar />
          <Suspense>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
}