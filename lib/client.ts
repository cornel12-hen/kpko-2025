// lib/client.ts
import { createBrowserClient as createClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createBrowserClient = () => {
  // Menggunakan @supabase/ssr memastikan sesi disimpan di Cookies
  // sehingga bisa dibaca oleh Middleware dan Server Components.
  return createClient(supabaseUrl, supabaseAnonKey);
};