'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient();

  if (pathname === '/login' || pathname === '/') return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.replace('/login');
  };

  const tabs = [
    { name: 'Beranda', href: '/dashboard' },
    { name: 'Vote', href: '/dashboard/vote' },
  ];

  return (
    <nav className="w-full sticky top-0 z-50">
        <div className="flex items-end">
            {tabs.map((tab) => {
            const isActive = tab.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(tab.href);
            
            let tabStyle = "px-6 py-1 transition-colors duration-200 ";
            
            if (isActive) {
                if (tab.href === '/dashboard') {
                    tabStyle += "bg-[#003566] rounded-tr-sm text-white shadow-sm z-10"; 
                } else {
                    tabStyle += "bg-[#003566] rounded-t-sm text-white shadow-sm z-10";
                }
            } else {
                tabStyle += "bg-[#f2f2f2] text-[#003566] hover:bg-[#c5c5c5]";
            }

            return (
                <Link 
                key={tab.name} 
                href={tab.href}
                className={tabStyle}
                >
                {tab.name}
                </Link>
            );
            })}
        </div>
    </nav>
  );
}