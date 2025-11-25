'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/client';

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.replace('/admin/login');
  };

  // Menu khusus Admin
  const tabs = [
    { name: 'Real Count', href: '/admin/dashboard' },
    // Jika nanti mau dipisah halamannya, bisa tambah menu di sini
    // { name: 'Data Pemilih', href: '/admin/pemilih' }, 
  ];

  return (
    <nav className="w-full bg-[#003566] pt-4 px-4 sticky top-0 z-30 border-b-2 border-[#003566]">
      <div className="max-w-5xl mx-auto flex items-end justify-between">
        
        <div className="flex items-end gap-1">
          {tabs.map((tab) => {
            // Logic active state sederhana
            const isActive = pathname === tab.href;
            
            let tabStyle = "px-6 py-2 rounded-t-sm text-lg transition-colors duration-200 border-t-2 border-x-2 ";
            
            if (isActive) {
              // Tab Aktif: Putih nyambung ke konten
              tabStyle += "bg-[#f2f2f2] border-[#003566] text-[#003566] font-bold translate-y-[2px] pb-3"; 
            } else {
              // Tab Tidak Aktif: Gelap
              tabStyle += "bg-[#00284d] border-transparent text-blue-200 hover:bg-[#004080] hover:text-white pb-2";
            }

            return (
              <Link key={tab.name} href={tab.href} className={tabStyle}>
                {tab.name}
              </Link>
            );
          })}
        </div>

        <div className="pb-3">
           <button 
             onClick={handleLogout}
             className="text-sm font-medium text-red-300 hover:text-red-100 hover:underline uppercase tracking-wider"
           >
             Exit System
           </button>
        </div>

      </div>
    </nav>
  );
}

// 'use client';

// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { createBrowserClient } from '@/lib/client';

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const supabase = createBrowserClient();

//   if (pathname === '/login' || pathname === '/') return null;

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.refresh();
//     router.replace('/login');
//   };

//   const tabs = [
//     { name: 'Beranda', href: '/dashboard' },
//     { name: 'Vote', href: '/dashboard/vote' },
//   ];

//   return (
//     <nav className="w-full sticky top-0 z-50">
//         <div className="flex items-end">
//             {tabs.map((tab) => {
//             const isActive = tab.href === '/dashboard'
//             ? pathname === '/dashboard'
//             : pathname.startsWith(tab.href);
            
//             let tabStyle = "px-6 py-1 transition-colors duration-200 ";
            
//             if (isActive) {
//                 if (tab.href === '/dashboard') {
//                     tabStyle += "bg-[#003566] rounded-tr-sm text-white shadow-sm z-10"; 
//                 } else {
//                     tabStyle += "bg-[#003566] rounded-t-sm text-white shadow-sm z-10";
//                 }
//             } else {
//                 tabStyle += "bg-[#f2f2f2] text-[#003566] hover:bg-[#c5c5c5]";
//             }

//             return (
//                 <Link 
//                 key={tab.name} 
//                 href={tab.href}
//                 className={tabStyle}
//                 >
//                 {tab.name}
//                 </Link>
//             );
//             })}
//         </div>
//     </nav>
//   );
// }