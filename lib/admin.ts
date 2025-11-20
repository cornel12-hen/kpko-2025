import { createClient } from '@supabase/supabase-js';

// --- KUNCI RAHASIA HANYA DIGUNAKAN DI SISI SERVER ---
// Pastikan Anda telah mendefinisikan SUPABASE_SERVICE_ROLE_KEY di .env Anda!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * @description Menginisialisasi Supabase Client dengan Service Role Key (Kunci Superuser).
 * Client ini MEMILIKI HAK AKSES PENUH dan MELEWATI SEMUA aturan Row Level Security (RLS).
 * HANYA boleh diimpor dan digunakan di Server Component atau Server Action.
 * @returns Supabase Client instance (Admin/Service Role)
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    // Matikan refresh token dan persistensi sesi karena ini adalah sesi Service Role
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});