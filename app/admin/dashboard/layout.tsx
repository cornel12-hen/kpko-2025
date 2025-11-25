import LogoutButton from "@/components/LogoutButton"; 
// LogoutButton di header window bisa pakai yang umum atau bikin khusus admin
// Tapi karena di navbar sudah ada, yang di header window bisa kita ganti jadi tombol 'Minimize' dummy atau biarkan kosong.
// Untuk simpelnya, kita ganti jadi tombol "X" yang redirect ke login.

import AdminNavbar from "@/components/AdminNavbar";
import { Jersey_15 } from "next/font/google";
import Link from "next/link";

const jersey15 = Jersey_15({
  variable: "--font-jersey",
  subsets: ["latin"],
  weight: ["400"],
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${jersey15.variable} font-jersey w-full min-h-screen py-8 px-4 text-[#000814] z-20`}>
      
      {/* Container Window */}
      <div className="flex flex-col w-full max-w-6xl max-h-[88vh] mx-auto p-3 rounded-sm bg-[#d9d9d9] border-2 border-[#003566] shadow-solid-md gap-3">
        
        {/* Header Window */}
        <div className="w-full h-8 flex justify-between items-center select-none cursor-default">
          <div className="flex items-center gap-2">
             <p className="text-xl pl-1 tracking-wide text-red-700">ADMINISTRATOR.exe</p>
          </div>
          
        <LogoutButton/>
        </div>

        <div className="w-full mx-auto rounded-sm flex flex-col flex-1 bg-[#f2f2f2] border-2 border-[#003566] overflow-hidden relative">          
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}