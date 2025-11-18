import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * @description Menginisialisasi Supabase Client untuk digunakan di Server Component atau Server Action.
 * Client ini memiliki akses ke kredensial sesi user (JWT) melalui cookies.
 * @returns Supabase Client instance
 */
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();

  // NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY diambil dari .env.local
  // Tanda seru (!) digunakan karena kita yakin variabel ini sudah didefinisikan di .env.local atau Vercel
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Mengambil cookie yang diperlukan Supabase dari Next.js headers
          // Kita memanggil cookieStore.get(name) yang mengembalikan Cookie | undefined
          return cookieStore.get(name)?.value;
        },
        // Fungsi 'set' dan 'remove' tidak perlu didefinisikan di sini 
        // karena Server Component/Action tidak memodifikasi cookies, 
        // mereka hanya membacanya dari Request.
      },
    }
  );
};