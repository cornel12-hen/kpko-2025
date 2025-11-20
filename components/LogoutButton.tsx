// components/LogoutButton.tsx
'use client';

import { createBrowserClient } from '@/lib/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    router.replace('/login');
  };

  return (
    <div className='h-6 w-6 hover:outline hover:outline-white active:outline active:outline-white rounded-sm'>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="p-0.5 h-6 bg-red-600 border-2 border-[#000814] rounded-sm text-white text-sm font-bold hover:bg-red-700 transition shadow-md disabled:opacity-70"
      >
        {loading ? <X className='inset-shadow-2xs size-4'/> : <X className='size-4'/>}
      </button>
    </div>
  );
}